package com.diabetescdss.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Double height;
    private Double weight;
    private Double bmi;
    private String medicalHistory;
    private String familyHistory;
    private String emergencyContact;
    private Integer age;
    private String gender;
    private java.time.LocalDate dob;
    private boolean enabled;
    private String role;
}