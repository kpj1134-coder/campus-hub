package com.campus.hub.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${twilio.account.sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number:}")
    private String twilioFromPhone;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ── Smart Dispatcher ──────────────────────────────────────────────────────

    /**
     * Detects whether `contact` is an email address or phone number,
     * then dispatches accordingly.
     *
     * Email pattern  → contains '@'
     * Phone pattern  → digits, optional '+', spaces, dashes
     */
    public void sendContactAlert(String contact, String sellerName,
                                  String buyerName, String buyerEmail,
                                  String productTitle, String message) {
        if (contact == null || contact.isBlank()) {
            log.warn("No contact info for seller '{}', skipping alert", sellerName);
            return;
        }

        if (isEmail(contact)) {
            // Send email to the seller's email address
            sendContactSellerEmail(contact, sellerName, buyerName, buyerEmail, productTitle, message);
        } else if (isPhone(contact)) {
            // Send SMS to the seller's phone number
            sendContactSellerSms(contact, sellerName, buyerName, buyerEmail, productTitle, message);
        } else {
            // Treat as email as fallback
            sendContactSellerEmail(contact, sellerName, buyerName, buyerEmail, productTitle, message);
        }
    }

    // ── Email ─────────────────────────────────────────────────────────────────

    /**
     * Sends a plain-text email. Silently logs if mail is not configured.
     */
    public void sendEmail(String to, String subject, String body) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.info("EMAIL (not configured) → To: {} | Subject: {}", to, subject);
            return;
        }
        if (!isEmail(to)) {
            log.warn("Skipping email — '{}' is not a valid email address", to);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("✅ Email sent to: {}", to);
        } catch (Exception e) {
            log.error("❌ Email send failed to {}: {}", to, e.getMessage());
        }
    }

    public void sendContactSellerEmail(String sellerEmail, String sellerName,
                                        String buyerName, String buyerEmail,
                                        String productTitle, String message) {
        String subject = "📬 New Buyer Interest: " + productTitle;
        String body = String.format(
            "Hello %s,\n\n" +
            "A student is interested in your product on Campus Hub.\n\n" +
            "Product    : %s\n" +
            "Buyer Name : %s\n" +
            "Buyer Email: %s\n" +
            "Message    : %s\n\n" +
            "Reply directly to the buyer at: %s\n\n" +
            "— Campus Hub Team",
            sellerName, productTitle, buyerName, buyerEmail, message, buyerEmail
        );
        sendEmail(sellerEmail, subject, body);
    }

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
            "View all registrations in the Admin Dashboard.\n\n" +
            "— Campus Hub Team",
            adminName, eventTitle, eventDate, eventTime,
            studentName, studentEmail, registeredAt
        );
        sendEmail(adminEmail, subject, body);
    }

    // ── SMS (Twilio) ──────────────────────────────────────────────────────────

    /**
     * Sends an SMS via Twilio to a seller's phone number.
     * Silently logs if Twilio credentials are not configured.
     */
    public void sendSms(String toPhone, String body) {
        if (twilioAccountSid == null || twilioAccountSid.isBlank() ||
            twilioAuthToken == null || twilioAuthToken.isBlank()) {
            log.info("SMS (Twilio not configured) → To: {} | Body: {}", toPhone, body);
            return;
        }
        if (!isPhone(toPhone)) {
            log.warn("Skipping SMS — '{}' is not a valid phone number", toPhone);
            return;
        }
        try {
            Twilio.init(twilioAccountSid, twilioAuthToken);
            String normalizedPhone = normalizePhone(toPhone);
            Message.creator(
                    new PhoneNumber(normalizedPhone),
                    new PhoneNumber(twilioFromPhone),
                    body
            ).create();
            log.info("✅ SMS sent to: {}", normalizedPhone);
        } catch (Exception e) {
            log.error("❌ SMS send failed to {}: {}", toPhone, e.getMessage());
        }
    }

    public void sendContactSellerSms(String sellerPhone, String sellerName,
                                      String buyerName, String buyerEmail,
                                      String productTitle, String message) {
        String smsBody = String.format(
            "Campus Hub Alert!\nNew buyer interest for: %s\nBuyer: %s (%s)\nMsg: %s\nReply to buyer email.",
            productTitle, buyerName, buyerEmail, truncate(message, 80)
        );
        sendSms(sellerPhone, smsBody);
        log.info("📱 SMS alert dispatched to seller phone: {}", sellerPhone);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Returns true if the contact string looks like an email address.
     */
    public static boolean isEmail(String contact) {
        return contact != null && contact.contains("@") && contact.contains(".");
    }

    /**
     * Returns true if the contact string looks like a phone number
     * (digits, spaces, dashes, +, parentheses — at least 7 digits).
     */
    public static boolean isPhone(String contact) {
        if (contact == null) return false;
        String digits = contact.replaceAll("[^0-9]", "");
        return digits.length() >= 7 && digits.length() <= 15 && !isEmail(contact);
    }

    /**
     * Normalizes phone for Twilio: adds +91 for Indian numbers if no country code.
     */
    private static String normalizePhone(String phone) {
        String digits = phone.replaceAll("[^0-9+]", "");
        if (!digits.startsWith("+")) {
            // Default to India country code if no country code prefix
            if (digits.length() == 10) {
                digits = "+91" + digits;
            } else {
                digits = "+" + digits;
            }
        }
        return digits;
    }

    private static String truncate(String s, int max) {
        return s != null && s.length() > max ? s.substring(0, max) + "..." : s;
    }
}
