package com.diabetescdss.service;

import com.diabetescdss.model.Medication;
import com.diabetescdss.model.User;

public interface EmailService {
    void sendVerificationEmail(User user, String token);
    void sendPasswordResetEmail(User user, String token);
    void sendPredictionReport(User user, String summary);
    void sendWeeklyHealthReport(User user, String reportContent);
    void sendMedicationReminderEmail(User user, Medication medication, String timeSlot);
}