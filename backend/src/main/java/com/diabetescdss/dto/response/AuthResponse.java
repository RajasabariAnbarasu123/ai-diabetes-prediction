package com.diabetescdss.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private UserDto user;
    private String accessToken;
    private String refreshToken;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role; // e.g., "PATIENT" or "ADMIN"
        private Integer age;
        private String gender;
        private java.time.LocalDate dob;
        private String phone;
        private String address;
        private Double height;
        private Double weight;
        private Double bmi;
        private boolean enabled;
        private String emergencyContact;
        private String medicalHistory;
        private String familyHistory;
    }
}