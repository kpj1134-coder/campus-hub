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
@Document(collection = "registrations")
public class Registration {

    @Id
    private String id;

    private String userId;
    private String userName;
    private String userEmail;

    private String eventId;
    private String eventTitle;
    private String eventDate;
    private String eventTime;
    private String eventLocation;

    /**
     * PENDING → Admin reviews
     * APPROVED → Student gets QR pass
     * REJECTED → Student notified
     * CANCELLED → Student cancelled
     */
    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private LocalDateTime registeredAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}
