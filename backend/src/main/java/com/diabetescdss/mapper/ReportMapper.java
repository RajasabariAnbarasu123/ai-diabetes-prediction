package com.diabetescdss.mapper;

import com.diabetescdss.dto.response.ReportUploadResponse;
import com.diabetescdss.model.ExtractedReportData;
import com.diabetescdss.model.MedicalReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    ReportMapper INSTANCE = Mappers.getMapper(ReportMapper.class);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "fileName", target = "fileName")
    @Mapping(source = "uploadDate", target = "uploadDate")
    ReportUploadResponse.ReportDto toReportDto(MedicalReport report);

    @Mapping(source = "extractedText", target = "extractedText")
    @Mapping(source = "hba1c", target = "hba1c")
    @Mapping(source = "fastingBloodSugar", target = "fastingBloodSugar")
    @Mapping(source = "randomBloodSugar", target = "randomBloodSugar")
    @Mapping(source = "bloodSugar", target = "bloodSugar")
    @Mapping(source = "bloodPressure", target = "bloodPressure")
    @Mapping(source = "bloodPressureSystolic", target = "bloodPressureSystolic")
    @Mapping(source = "bloodPressureDiastolic", target = "bloodPressureDiastolic")
    @Mapping(source = "cholesterol", target = "cholesterol")
    @Mapping(source = "hdl", target = "hdl")
    @Mapping(source = "ldl", target = "ldl")
    @Mapping(source = "triglycerides", target = "triglycerides")
    @Mapping(source = "bmi", target = "bmi")
    @Mapping(source = "weight", target = "weight")
    @Mapping(source = "age", target = "age")
    @Mapping(source = "medications", target = "medications")
    @Mapping(source = "labValues", target = "labValues")
    ReportUploadResponse.ExtractedDataDto toExtractedDataDto(ExtractedReportData data);
}