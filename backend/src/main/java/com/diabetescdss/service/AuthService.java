package com.diabetescdss.service;

import com.diabetescdss.dto.request.*;
import com.diabetescdss.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    void register(RegisterRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
    void verifyEmail(String token);
    void logout(String refreshToken);
}