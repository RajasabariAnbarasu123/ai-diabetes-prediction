package com.diabetescdss.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationRequest {

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotBlank(message = "Dose is required")
    private String dose;

    private boolean morning;
    private boolean afternoon;
    private boolean night;

    @Builder.Default
    private String morningTime = "08:00";

    @Builder.Default
    private String afternoonTime = "13:00";

    @Builder.Default
    private String nightTime = "20:00";

    @Builder.Default
    private boolean appNotification = true;

    @Builder.Default
    private boolean emailNotification = true;

    private String notes;
}