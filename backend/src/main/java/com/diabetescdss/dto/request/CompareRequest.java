package com.diabetescdss.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompareRequest {

    @NotNull(message = "Prediction IDs are required")
    @Size(min = 2, max = 2, message = "Exactly 2 prediction IDs are required")
    private List<Long> ids;
}