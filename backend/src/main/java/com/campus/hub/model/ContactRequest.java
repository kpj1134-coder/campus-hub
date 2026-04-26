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
@Document(collection = "contact_requests")
public class ContactRequest {

    @Id
    private String id;

    private String productId;
    private String productTitle;

    private String buyerId;
    private String buyerName;
    private String buyerEmail;

    private String sellerId;
    private String sellerName;

    private String message;

    /**
     * PENDING   → Seller hasn't acted
     * ACCEPTED  → Seller accepted interest
     * REJECTED  → Seller declined
     * RESPONDED → Seller replied/resolved
     */
    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}
