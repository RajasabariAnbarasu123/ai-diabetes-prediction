package com.diabetescdss.service.impl;

import com.diabetescdss.constant.EmailTemplates;
import com.diabetescdss.model.Medication;
import com.diabetescdss.model.User;
import com.diabetescdss.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Override
    public void sendVerificationEmail(User user, String token) {
        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("verificationLink", "http://localhost:3000/verify-email?token=" + token);

        String content = templateEngine.process(EmailTemplates.VERIFICATION_EMAIL, context);
        sendMail(user.getEmail(), "Diabetes CDSS - Email Verification", content);
    }

    @Override
    public void sendPasswordResetEmail(User user, String token) {
        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("resetLink", "http://localhost:3000/reset-password?token=" + token);

        String content = templateEngine.process(EmailTemplates.PASSWORD_RESET, context);
        sendMail(user.getEmail(), "Diabetes CDSS - Password Reset", content);
    }

    @Override
    public void sendPredictionReport(User user, String summary) {
        // implement if needed
    }

    @Override
    public void sendWeeklyHealthReport(User user, String reportContent) {
        // implement if needed
    }

    @Override
    public void sendMedicationReminderEmail(User user, Medication medication, String timeSlot) {
        String subject = "Diabetes CDSS - Medication Reminder: " + medication.getMedicineName();
        String html = "<h2>Hello " + user.getName() + ",</h2>"
                + "<p>This is a reminder to take your <strong>" + timeSlot + "</strong> medication:</p>"
                + "<ul>"
                + "<li><strong>Medicine:</strong> " + medication.getMedicineName() + "</li>"
                + "<li><strong>Dose:</strong> " + medication.getDose() + "</li>"
                + (medication.getNotes() != null && !medication.getNotes().isEmpty() ? "<li><strong>Notes:</strong> " + medication.getNotes() + "</li>" : "")
                + "</ul>"
                + "<p>Stay healthy,<br/>Diabetes CDSS Team</p>";
        sendMail(user.getEmail(), subject, html);
    }

    private void sendMail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}