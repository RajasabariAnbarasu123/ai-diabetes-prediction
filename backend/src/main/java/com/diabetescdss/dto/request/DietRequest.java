package com.diabetescdss.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietRequest {
    // Any filters like vegetarian, region etc.
    private String dietType; // Vegetarian, Non-Vegetarian, etc.
    private String region;   // South Indian, etc.
}