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
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private double price;
    private String sellerId;
    private String sellerName;
    private String contact;
    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
