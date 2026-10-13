package com.diabetescdss.controller;

import com.diabetescdss.dto.request.ChangePasswordRequest;
import com.diabetescdss.dto.request.ProfileUpdateRequest;
import com.diabetescdss.dto.response.ProfileResponse;
import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.AuthService;
import com.diabetescdss.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(profileService.getProfile(user.getUser().getId()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@AuthenticationPrincipal CustomUserDetails user,
                                                         @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(user.getUser().getId(), request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal CustomUserDetails user,
                                                 @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(user.getUser().getId(), request);
        return ResponseEntity.ok("Password changed successfully");
    }
}