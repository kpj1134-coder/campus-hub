package com.campus.hub.controller;

import com.campus.hub.model.Notification;
import com.campus.hub.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /** GET /api/notifications — alias for /my */
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getMyNotifications());
    }

    /** GET /api/notifications/my */
    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotificationsMy() {
        return ResponseEntity.ok(notificationService.getMyNotifications());
    }

    /** GET /api/notifications/unread-count */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount()));
    }

    /** PUT /api/notifications/mark-read — mark all read */
    @PutMapping("/mark-read")
    public ResponseEntity<Map<String, String>> markAllRead() {
        notificationService.markAllRead();
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /** PUT /api/notifications/read-all — alias */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> readAll() {
        notificationService.markAllRead();
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /** PUT /api/notifications/{id}/read — mark one read */
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markOneRead(@PathVariable String id) {
        notificationService.markOneRead(id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    /** DELETE /api/notifications/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }
}
