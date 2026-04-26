package com.campus.hub.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Sends a plain-text email. Silently logs error if mail is not configured.
     */
    public void sendEmail(String to, String subject, String body) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.info("EMAIL (not configured) → To: {} | Subject: {}", to, subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("✅ Email sent to: {} | Subject: {}", to, subject);
        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Contact Seller email — sent to the seller.
     */
    public void sendContactSellerEmail(String sellerEmail, String sellerName,
                                        String buyerName, String buyerEmail,
                                        String productTitle, String message) {
        String subject = "📬 New Buyer Interest: " + productTitle;
        String body = String.format(
            "Hello %s,\n\n" +
            "A student is interested in your product listed on Campus Hub.\n\n" +
            "Product Title : %s\n" +
            "Buyer Name    : %s\n" +
            "Buyer Email   : %s\n" +
            "Message       : %s\n\n" +
            "Please reply to the buyer directly at: %s\n\n" +
            "— Campus Hub Team",
            sellerName, productTitle, buyerName, buyerEmail, message, buyerEmail
        );
        sendEmail(sellerEmail, subject, body);
    }

    /**
     * Event Registration email — sent to admin/event creator.
     */
    public void sendEventRegistrationEmail(String adminEmail, String adminName,
                                            String eventTitle, String eventDate,
                                            String eventTime, String studentName,
                                            String studentEmail, String registeredAt) {
        String subject = "🎟️ New Event Registration: " + eventTitle;
        String body = String.format(
            "Hello %s,\n\n" +
            "A student has registered for your campus event.\n\n" +
            "Event Title   : %s\n" +
            "Event Date    : %s\n" +
            "Event Time    : %s\n" +
            "Student Name  : %s\n" +
            "Student Email : %s\n" +
            "Registered At : %s\n\n" +
            "You can view all registrations in the Admin Dashboard.\n\n" +
            "— Campus Hub Team",
            adminName, eventTitle, eventDate, eventTime,
            studentName, studentEmail, registeredAt
        );
        sendEmail(adminEmail, subject, body);
    }
}
