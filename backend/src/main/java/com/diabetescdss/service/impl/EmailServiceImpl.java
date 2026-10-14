package com.diabetescdss.service.impl;

import com.diabetescdss.constant.EmailTemplates;
import com.diabetescdss.model.Medication;
import com.diabetescdss.model.User;
import com.diabetescdss.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name:Diabetes CDSS}")
    private String senderName;

    @Value("${app.frontend.url:https://ai-diabetes-prediction-yir6.onrender.com}")
    private String frontendUrl;

    private final RestClient restClient = buildClient();

    private static RestClient buildClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        return RestClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .requestFactory(factory)
                .build();
    }

    private String getBaseFrontendUrl() {
        if (frontendUrl == null || frontendUrl.isBlank()) {
            return "https://ai-diabetes-prediction-yir6.onrender.com";
        }
        return frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }

    @Override
    public void sendVerificationEmail(User user, String token) {
        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("verificationLink", getBaseFrontendUrl() + "/verify-email?token=" + token);

        String content = templateEngine.process(EmailTemplates.VERIFICATION_EMAIL, context);
        sendMail(user.getEmail(), "Diabetes CDSS - Email Verification", content);
    }

    @Override
    public void sendPasswordResetEmail(User user, String token) {
        Context context = new Context();
        context.setVariable("name", user.getName());
        context.setVariable("resetLink", getBaseFrontendUrl() + "/reset-password?token=" + token);

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
                + (medication.getNotes() != null && !medication.getNotes().isEmpty()
                    ? "<li><strong>Notes:</strong> " + medication.getNotes() + "</li>" : "")
                + "</ul>"
                + "<p>Stay healthy,<br/>Diabetes CDSS Team</p>";
        sendMail(user.getEmail(), subject, html);
    }

    private void sendMail(String to, String subject, String html) {
        try {
            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", senderName, "email", senderEmail),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", html
            );

            restClient.post()
                    .uri("/smtp/email")
                    .header("api-key", brevoApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Email sent to {}", to);
        } catch (RestClientResponseException e) {
            log.warn("Brevo rejected email to {}: {} {}", to, e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
