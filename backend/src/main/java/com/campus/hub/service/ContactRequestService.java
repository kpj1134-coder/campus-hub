package com.campus.hub.service;

import com.campus.hub.model.ContactRequest;
import com.campus.hub.model.Product;
import com.campus.hub.model.User;
import com.campus.hub.repository.ContactRequestRepository;
import com.campus.hub.repository.ProductRepository;
import com.campus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    // NOTE: No email or SMS — pure in-app notification workflow

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ContactRequest createContactRequest(String productId, String message) {
        User buyer = getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!"AVAILABLE".equalsIgnoreCase(product.getStatus())) {
            throw new RuntimeException("This product is no longer available for contact");
        }

        if (contactRequestRepository.existsByBuyerIdAndProductId(buyer.getId(), productId)) {
            throw new RuntimeException("You have already sent a request for this product");
        }

        ContactRequest req = ContactRequest.builder()
                .productId(productId)
                .productTitle(product.getTitle())
                .buyerId(buyer.getId())
                .buyerName(buyer.getName())
                .buyerEmail(buyer.getEmail())
                .sellerId(product.getSellerId())
                .sellerName(product.getSellerName())
                .message(message)
                .status("PENDING")
                .build();

        ContactRequest saved = contactRequestRepository.save(req);

        // In-app: notify seller
        notificationService.createNotification(
                product.getSellerId(),
                "New Buyer Interest",
                "📬 " + buyer.getName() + " is interested in your product: \"" + product.getTitle() + "\"",
                "INFO"
        );

        // In-app: notify buyer confirmation
        notificationService.createNotification(
                buyer.getId(),
                "Request Sent",
                "✅ Your interest request for \"" + product.getTitle() + "\" was sent to " + product.getSellerName(),
                "SUCCESS"
        );

        return saved;
    }

    public List<ContactRequest> getBuyerRequests() {
        return contactRequestRepository.findByBuyerIdOrderByCreatedAtDesc(getCurrentUser().getId());
    }

    public List<ContactRequest> getSellerRequests() {
        return contactRequestRepository.findBySellerIdOrderByCreatedAtDesc(getCurrentUser().getId());
    }

    /**
     * Seller updates status: ACCEPTED / REJECTED / RESPONDED
     * Buyer gets in-app notification for each status change.
     */
    public ContactRequest updateStatus(String requestId, String status) {
        ContactRequest req = contactRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(status.toUpperCase());
        req.setUpdatedAt(LocalDateTime.now());
        ContactRequest updated = contactRequestRepository.save(req);

        // Notify buyer
        String title, message, type;
        switch (status.toUpperCase()) {
            case "ACCEPTED" -> {
                title = "Seller Accepted!";
                message = "🎉 Seller \"" + req.getSellerName() + "\" accepted your request for \"" + req.getProductTitle() + "\". They will contact you soon.";
                type = "SUCCESS";
            }
            case "REJECTED" -> {
                title = "Request Not Accepted";
                message = "❌ Seller \"" + req.getSellerName() + "\" declined your request for \"" + req.getProductTitle() + "\".";
                type = "WARNING";
            }
            case "RESPONDED" -> {
                title = "Seller Responded";
                message = "💬 Seller \"" + req.getSellerName() + "\" has responded to your request for \"" + req.getProductTitle() + "\".";
                type = "INFO";
            }
            default -> {
                title = "Request Updated";
                message = "Your request for \"" + req.getProductTitle() + "\" was updated to: " + status;
                type = "INFO";
            }
        }
        notificationService.createNotification(req.getBuyerId(), title, message, type);
        return updated;
    }
}
