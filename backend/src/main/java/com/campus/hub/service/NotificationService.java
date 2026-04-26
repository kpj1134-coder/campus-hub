package com.campus.hub.service;

import com.campus.hub.model.Notification;
import com.campus.hub.model.User;
import com.campus.hub.repository.NotificationRepository;
import com.campus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Creates a notification with a real, unique timestamp using LocalDateTime.now().
     * Never hardcode createdAt — always call this method.
     */
    public Notification createNotification(String userId, String title, String message, String type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())   // Real server time, unique per notification
                .build();
        return notificationRepository.save(notification);
    }

    /**
     * Backward-compatible overload for callers that pass only message+type.
     */
    public Notification createNotification(String userId, String message, String type) {
        String title = deriveTitle(type);
        return createNotification(userId, title, message, type);
    }

    private String deriveTitle(String type) {
        return switch (type) {
            case "SUCCESS" -> "Success";
            case "WARNING" -> "Warning";
            case "ERROR"   -> "Error";
            default        -> "Notification";
        };
    }

    public void markAllRead() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Notification> notifications =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void markOneRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public long getUnreadCount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }
}
