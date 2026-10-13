package com.diabetescdss.scheduler;

import com.diabetescdss.enums.NotificationType;
import com.diabetescdss.model.Medication;
import com.diabetescdss.model.Notification;
import com.diabetescdss.repository.MedicationRepository;
import com.diabetescdss.repository.NotificationRepository;
import com.diabetescdss.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MedicationScheduler {

    private final MedicationRepository medicationRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    // Run every minute to check if any user medication matches current time
    @Scheduled(cron = "0 * * * * *")
    public void checkMedicationReminders() {
        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
        List<Medication> medications = medicationRepository.findAll();

        for (Medication med : medications) {
            if (med.getUser() == null) continue;

            boolean isMorningMatch = med.isMorning() && currentTime.equals(med.getMorningTime());
            boolean isAfternoonMatch = med.isAfternoon() && currentTime.equals(med.getAfternoonTime());
            boolean isNightMatch = med.isNight() && currentTime.equals(med.getNightTime());

            if (isMorningMatch || isAfternoonMatch || isNightMatch) {
                String slot = isMorningMatch ? "Morning" : (isAfternoonMatch ? "Afternoon" : "Night");
                String msg = "Reminder: It's time for your " + slot + " medication: " + med.getMedicineName() + " (" + med.getDose() + ")";

                if (med.isAppNotification()) {
                    Notification notification = Notification.builder()
                            .user(med.getUser())
                            .message(msg)
                            .type(NotificationType.MEDICATION_REMINDER)
                            .read(false)
                            .createdAt(LocalDateTime.now())
                            .build();
                    notificationRepository.save(notification);
                }

                if (med.isEmailNotification()) {
                    try {
                        emailService.sendMedicationReminderEmail(med.getUser(), med, slot);
                    } catch (Exception e) {
                        log.warn("Failed to send scheduled medication email to {}", med.getUser().getEmail());
                    }
                }
            }
        }
    }
}
