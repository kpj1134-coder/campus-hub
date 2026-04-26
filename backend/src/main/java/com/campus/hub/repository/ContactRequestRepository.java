package com.campus.hub.repository;

import com.campus.hub.model.ContactRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ContactRequestRepository extends MongoRepository<ContactRequest, String> {
    List<ContactRequest> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
    List<ContactRequest> findBySellerIdOrderByCreatedAtDesc(String sellerId);
    boolean existsByBuyerIdAndProductId(String buyerId, String productId);
}
