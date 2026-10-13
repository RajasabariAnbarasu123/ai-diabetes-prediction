package com.diabetescdss.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String phone;
    private String address;

    @Min(value = 50, message = "Height must be at least 50 cm")
    @Max(value = 250, message = "Height must be at most 250 cm")
    private Double height;

    @Min(value = 20, message = "Weight must be at least 20 kg")
    @Max(value = 300, message = "Weight must be at most 300 kg")
    private Double weight;

    private String emergencyContact;

    @Past(message = "Date of Birth must be in the past")
    private java.time.LocalDate dob;

    private String gender;
}