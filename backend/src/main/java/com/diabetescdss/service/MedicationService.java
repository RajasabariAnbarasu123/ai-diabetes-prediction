package com.diabetescdss.service;

import com.diabetescdss.dto.request.MedicationRequest;
import com.diabetescdss.model.Medication;

import java.util.List;

public interface MedicationService {
    List<Medication> getMedications(Long userId);
    Medication addMedication(Long userId, MedicationRequest request);
    Medication updateMedication(Long userId, Long medicationId, MedicationRequest request);
    void deleteMedication(Long userId, Long medicationId);
}