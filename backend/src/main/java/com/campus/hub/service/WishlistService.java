package com.campus.hub.service;

import com.campus.hub.model.Product;
import com.campus.hub.model.User;
import com.campus.hub.model.Wishlist;
import com.campus.hub.repository.ProductRepository;
import com.campus.hub.repository.UserRepository;
import com.campus.hub.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /** Toggle save: if already saved → remove, else → add */
    public Map<String, Object> toggleWishlist(String productId) {
        User user = getCurrentUser();
        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
            return Map.of("saved", false, "message", "Removed from saved products");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist item = Wishlist.builder()
                .userId(user.getId())
                .productId(productId)
                .productTitle(product.getTitle())
                .productCategory(product.getCategory())
                .productPrice(product.getPrice())
                .productStatus(product.getStatus())
                .sellerName(product.getSellerName())
                .build();
        wishlistRepository.save(item);
        return Map.of("saved", true, "message", "Added to saved products");
    }

    public List<Wishlist> getMyWishlist() {
        return wishlistRepository.findByUserId(getCurrentUser().getId());
    }

    public boolean isWishlisted(String productId) {
        return wishlistRepository.existsByUserIdAndProductId(getCurrentUser().getId(), productId);
    }
}
