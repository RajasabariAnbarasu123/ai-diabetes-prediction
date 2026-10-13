package com.diabetescdss.service.impl;

import com.diabetescdss.dto.request.ProfileUpdateRequest;
import com.diabetescdss.dto.response.ProfileResponse;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.mapper.UserMapper;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public ProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toProfileResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        user.setEmergencyContact(request.getEmergencyContact());
        if (request.getDob() != null) user.setDob(request.getDob());
        if (request.getGender() != null) user.setGender(request.getGender());

        // Recalculate BMI
        if (user.getHeight() != null && user.getWeight() != null) {
            double heightM = user.getHeight() / 100.0;
            user.setBmi(user.getWeight() / (heightM * heightM));
        }

        user = userRepository.save(user);
        return userMapper.toProfileResponse(user);
    }
}