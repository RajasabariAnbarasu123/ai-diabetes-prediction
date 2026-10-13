package com.diabetescdss.mapper;

import com.diabetescdss.dto.request.PredictionRequest;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.model.Prediction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PredictionMapper {

    PredictionMapper INSTANCE = Mappers.getMapper(PredictionMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "diabetesRisk", ignore = true)
    @Mapping(target = "diabetesStage", ignore = true)
    @Mapping(target = "confidenceScore", ignore = true)
    @Mapping(target = "explanation", ignore = true)
    @Mapping(target = "riskFactors", ignore = true)
    @Mapping(target = "clinicalSummary", ignore = true)
    @Mapping(target = "personalizedDiet", ignore = true)
    @Mapping(target = "exercisePlan", ignore = true)
    @Mapping(target = "lifestyleChanges", ignore = true)
    @Mapping(target = "foodsToEat", ignore = true)
    @Mapping(target = "foodsToAvoid", ignore = true)
    @Mapping(target = "medicationReminders", ignore = true)
    @Mapping(target = "warningSigns", ignore = true)
    @Mapping(target = "whenToConsultDoctor", ignore = true)
    Prediction toEntity(PredictionRequest request);

    @Mapping(target = "dietType", expression = "java(prediction.getDietType() != null ? prediction.getDietType().name() : null)")
    PredictionResponse toResponse(Prediction prediction);
}