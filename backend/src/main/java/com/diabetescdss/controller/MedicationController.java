package com.diabetescdss.controller;

import com.diabetescdss.dto.request.MedicationRequest;
import com.diabetescdss.model.Medication;
import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;

    @GetMapping
    public ResponseEntity<List<Medication>> list(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(medicationService.getMedications(user.getUser().getId()));
    }

    @PostMapping
    public ResponseEntity<Medication> create(@AuthenticationPrincipal CustomUserDetails user,
                                             @Valid @RequestBody MedicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicationService.addMedication(user.getUser().getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> update(@AuthenticationPrincipal CustomUserDetails user,
                                             @PathVariable Long id,
                                             @Valid @RequestBody MedicationRequest request) {
        return ResponseEntity.ok(medicationService.updateMedication(user.getUser().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails user,
                                       @PathVariable Long id) {
        medicationService.deleteMedication(user.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}