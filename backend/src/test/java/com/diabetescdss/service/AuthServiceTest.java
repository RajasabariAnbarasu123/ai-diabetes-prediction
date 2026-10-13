package com.diabetescdss.service;

import com.diabetescdss.dto.request.*;
import com.diabetescdss.dto.response.AuthResponse;
import com.diabetescdss.enums.Role;
import com.diabetescdss.exception.BadRequestException;
import com.diabetescdss.exception.UnauthorizedException;
import com.diabetescdss.mapper.UserMapper;
import com.diabetescdss.model.*;
import com.diabetescdss.repository.*;
import com.diabetescdss.security.JwtTokenProvider;
import com.diabetescdss.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private EmailService emailService;
    @Mock private UserMapper userMapper;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private RoleEntity patientRole;

    @BeforeEach
    void setUp() {
        patientRole = RoleEntity.builder().id(1L).name("PATIENT").build();
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("encodedPassword")
                .emailVerified(true)
                .enabled(true)
                .roles(Set.of(patientRole))
                .build();
    }

    @Test
    void login_shouldReturnAuthResponse_whenCredentialsValid() {
        LoginRequest request = new LoginRequest("test@example.com", "password");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(request.getPassword(), testUser.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken(testUser)).thenReturn("refreshToken");
        when(jwtTokenProvider.getRefreshTokenValidityMs()).thenReturn(604800000L);
        when(userMapper.toUserDto(testUser)).thenReturn(AuthResponse.UserDto.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .role("PATIENT")
                .build());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(new RefreshToken());

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("test@example.com", response.getUser().getEmail());
    }

    @Test
    void login_shouldThrow_whenEmailNotVerified() {
        testUser.setEmailVerified(false);
        LoginRequest request = new LoginRequest("test@example.com", "password");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }

    @Test
    void register_shouldSaveUserAndSendEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .name("New User")
                .email("new@example.com")
                .password("password123")
                .dob(java.time.LocalDate.of(1990, 1, 1))
                .gender("MALE")
                .build();
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(roleRepository.findByName(Role.PATIENT.name())).thenReturn(Optional.of(patientRole));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedNewPassword");
        when(userMapper.toEntity(request)).thenReturn(User.builder().name(request.getName()).email(request.getEmail()).build());

        authService.register(request);

        verify(userRepository).save(any(User.class));
        verify(emailVerificationTokenRepository).save(any(EmailVerificationToken.class));
        verify(emailService).sendVerificationEmail(any(User.class), anyString());
    }

    @Test
    void register_shouldThrow_whenEmailExists() {
        RegisterRequest request = RegisterRequest.builder()
                .name("New User")
                .email("existing@example.com")
                .password("password")
                .dob(java.time.LocalDate.of(1990, 1, 1))
                .gender("MALE")
                .build();
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void verifyEmail_shouldActivateUser() {
        String token = "validToken";
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(testUser)
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();
        when(emailVerificationTokenRepository.findByToken(token)).thenReturn(Optional.of(verificationToken));

        authService.verifyEmail(token);

        assertTrue(testUser.isEmailVerified());
        assertTrue(testUser.isEnabled());
        verify(userRepository).save(testUser);
        verify(emailVerificationTokenRepository).delete(verificationToken);
    }
}