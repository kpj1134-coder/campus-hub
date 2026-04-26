package com.campus.hub.repository;

import com.campus.hub.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findBySellerId(String sellerId);
    List<Product> findByStatus(String status);
    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    long countByStatus(String status);
}
