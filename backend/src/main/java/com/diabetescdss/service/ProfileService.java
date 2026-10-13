package com.diabetescdss.service;

import com.diabetescdss.dto.request.ProfileUpdateRequest;
import com.diabetescdss.dto.response.ProfileResponse;

public interface ProfileService {
    ProfileResponse getProfile(Long userId);
    ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request);
}