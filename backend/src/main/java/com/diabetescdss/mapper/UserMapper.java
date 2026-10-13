package com.diabetescdss.mapper;

import com.diabetescdss.dto.request.RegisterRequest;
import com.diabetescdss.dto.response.AuthResponse;
import com.diabetescdss.dto.response.ProfileResponse;
import com.diabetescdss.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    // From RegisterRequest to User (password will be encoded separately)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "height", ignore = true)
    @Mapping(target = "weight", ignore = true)
    @Mapping(target = "bmi", ignore = true)
    @Mapping(target = "medicalHistory", ignore = true)
    @Mapping(target = "familyHistory", ignore = true)
    @Mapping(target = "emergencyContact", ignore = true)
    User toEntity(RegisterRequest request);

    // User to ProfileResponse
    @Mapping(target = "role", expression = "java(user.getRoles().stream().findFirst().map(r -> r.getName()).orElse(null))")
    @Mapping(target = "enabled", source = "enabled")
    ProfileResponse toProfileResponse(User user);

    // User to AuthResponse.UserDto
    @Mapping(target = "role", expression = "java(user.getRoles().stream().findFirst().map(r -> r.getName()).orElse(null))")
    @Mapping(target = "enabled", source = "enabled")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "height", source = "height")
    @Mapping(target = "weight", source = "weight")
    @Mapping(target = "bmi", source = "bmi")
    @Mapping(target = "emergencyContact", source = "emergencyContact")
    @Mapping(target = "medicalHistory", source = "medicalHistory")
    @Mapping(target = "familyHistory", source = "familyHistory")
    AuthResponse.UserDto toUserDto(User user);
}