package com.campus.hub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;

    /** Short title like "Contact Request Sent" */
    private String title;

    /** Full message text */
    private String message;

    /** INFO | SUCCESS | WARNING | ERROR */
    private String type;

    @Builder.Default
    private boolean read = false;

    /**
     * IMPORTANT: Always use LocalDateTime.now() — never hardcode.
     * This ensures every notification has a unique, real timestamp.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
