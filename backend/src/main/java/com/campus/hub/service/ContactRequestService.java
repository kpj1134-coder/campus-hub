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

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public ContactRequest createContactRequest(String productId, String message) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Prevent duplicate requests from same buyer for same product
        if (contactRequestRepository.existsByBuyerIdAndProductId(buyer.getId(), productId)) {
            throw new RuntimeException("You have already sent a contact request for this product");
        }

        ContactRequest request = ContactRequest.builder()
                .productId(productId)
                .productTitle(product.getTitle())
                .buyerId(buyer.getId())
                .buyerName(buyer.getName())
                .buyerEmail(buyer.getEmail())
                .sellerId(product.getSellerId())
                .sellerName(product.getSellerName())
                .sellerContact(product.getContact())
                .message(message)
                .build();

        ContactRequest saved = contactRequestRepository.save(request);

        // ── Notify the seller (in-app)
        notificationService.createNotification(
                product.getSellerId(),
                "New Buyer Interest",
                "📬 " + buyer.getName() + " is interested in your product: \"" + product.getTitle() + "\"",
                "INFO"
        );

        // ── Notify the buyer (in-app)
        notificationService.createNotification(
                buyer.getId(),
                "Contact Request Sent",
                "✅ Your contact request for \"" + product.getTitle() + "\" was sent to " + product.getSellerName(),
                "SUCCESS"
        );

        // ── Email the seller
        emailService.sendContactSellerEmail(
                product.getContact(),  // seller's email/contact
                product.getSellerName(),
                buyer.getName(),
                buyer.getEmail(),
                product.getTitle(),
                message
        );

        return saved;
    }

    public List<ContactRequest> getMyContactRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return contactRequestRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId());
    }

    public List<ContactRequest> getSellerContactRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return contactRequestRepository.findBySellerIdOrderByCreatedAtDesc(seller.getId());
    }

    public ContactRequest updateStatus(String requestId, String status) {
        ContactRequest request = contactRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Contact request not found"));
        request.setStatus(status);
        return contactRequestRepository.save(request);
    }
}
