package com.campus.hub.controller;

import com.campus.hub.model.Wishlist;
import com.campus.hub.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /** POST /api/wishlist/{productId} — toggle save/unsave */
    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> toggle(@PathVariable String productId) {
        return ResponseEntity.ok(wishlistService.toggleWishlist(productId));
    }

    /** GET /api/wishlist/my — my saved products */
    @GetMapping("/my")
    public ResponseEntity<List<Wishlist>> getMyWishlist() {
        return ResponseEntity.ok(wishlistService.getMyWishlist());
    }

    /** GET /api/wishlist/check/{productId} — is this product wishlisted? */
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> check(@PathVariable String productId) {
        return ResponseEntity.ok(Map.of("saved", wishlistService.isWishlisted(productId)));
    }
}
