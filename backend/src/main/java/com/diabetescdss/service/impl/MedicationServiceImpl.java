package com.diabetescdss.service.impl;

import com.diabetescdss.dto.request.MedicationRequest;
import com.diabetescdss.enums.NotificationType;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.mapper.MedicationMapper;
import com.diabetescdss.model.Medication;
import com.diabetescdss.model.Notification;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.MedicationRepository;
import com.diabetescdss.repository.NotificationRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.EmailService;
import com.diabetescdss.service.MedicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicationServiceImpl implements MedicationService {

    private final MedicationRepository medicationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final MedicationMapper medicationMapper;
    private final EmailService emailService;

    @Override
    public List<Medication> getMedications(Long userId) {
        return medicationRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public Medication addMedication(Long userId, MedicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Medication medication = medicationMapper.toEntity(request);
        medication.setUser(user);
        medication.setCreatedAt(LocalDateTime.now());
        if (request.getMorningTime() != null) medication.setMorningTime(request.getMorningTime());
        if (request.getAfternoonTime() != null) medication.setAfternoonTime(request.getAfternoonTime());
        if (request.getNightTime() != null) medication.setNightTime(request.getNightTime());
        medication.setAppNotification(request.isAppNotification());
        medication.setEmailNotification(request.isEmailNotification());

        Medication saved = medicationRepository.save(medication);

        // Send confirmation in-app notification
        try {
            Notification notification = Notification.builder()
                    .user(user)
                    .message("Medication reminder added: " + saved.getMedicineName() + " (" + saved.getDose() + ")")
                    .type(NotificationType.MEDICATION_REMINDER)
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);

            if (saved.isEmailNotification()) {
                emailService.sendMedicationReminderEmail(user, saved, "Scheduled Setup");
            }
        } catch (Exception e) {
            // Non-blocking notification error logging
        }

        return saved;
    }

    @Override
    @Transactional
    public Medication updateMedication(Long userId, Long medicationId, MedicationRequest request) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));
        if (!medication.getUser().getId().equals(userId)) throw new ResourceNotFoundException("Medication not found");

        medication.setMedicineName(request.getMedicineName());
        medication.setDose(request.getDose());
        medication.setMorning(request.isMorning());
        medication.setAfternoon(request.isAfternoon());
        medication.setNight(request.isNight());
        if (request.getMorningTime() != null) medication.setMorningTime(request.getMorningTime());
        if (request.getAfternoonTime() != null) medication.setAfternoonTime(request.getAfternoonTime());
        if (request.getNightTime() != null) medication.setNightTime(request.getNightTime());
        medication.setAppNotification(request.isAppNotification());
        medication.setEmailNotification(request.isEmailNotification());
        medication.setNotes(request.getNotes());

        return medicationRepository.save(medication);
    }

    @Override
    @Transactional
    public void deleteMedication(Long userId, Long medicationId) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));
        if (!medication.getUser().getId().equals(userId)) throw new ResourceNotFoundException("Medication not found");
        medicationRepository.delete(medication);
    }
}