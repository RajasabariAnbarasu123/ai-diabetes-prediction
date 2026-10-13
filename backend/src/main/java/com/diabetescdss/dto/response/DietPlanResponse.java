package com.diabetescdss.dto.response;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlanResponse {
    private String generalAdvice;
    private List<String> breakfast;
    private List<String> lunch;
    private List<String> dinner;
    private List<String> snacks;
    private List<String> foodsToEat;
    private List<String> foodsToAvoid;
    private Integer calTarget;
    private Integer carbsPct;
    private Integer proteinPct;
    private Integer fatPct;
    private String weekly;
}