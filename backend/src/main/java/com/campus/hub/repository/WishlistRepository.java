package com.campus.hub.repository;

import com.campus.hub.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);
    Optional<Wishlist> findByUserIdAndProductId(String userId, String productId);
    boolean existsByUserIdAndProductId(String userId, String productId);
    void deleteByUserIdAndProductId(String userId, String productId);
    long countByUserId(String userId);
}
