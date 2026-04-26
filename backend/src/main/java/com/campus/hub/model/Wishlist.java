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
@Document(collection = "wishlists")
public class Wishlist {

    @Id
    private String id;

    private String userId;
    private String productId;
    private String productTitle;
    private String productCategory;
    private double productPrice;
    private String productStatus;
    private String sellerName;

    @Builder.Default
    private LocalDateTime savedAt = LocalDateTime.now();
}
