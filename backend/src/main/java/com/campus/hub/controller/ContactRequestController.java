package com.campus.hub.controller;

import com.campus.hub.model.ContactRequest;
import com.campus.hub.service.ContactRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact-requests")
@RequiredArgsConstructor
public class ContactRequestController {

    private final ContactRequestService contactRequestService;

    /** POST /api/contact-requests — buyer sends contact request */
    @PostMapping
    public ResponseEntity<ContactRequest> createContactRequest(@RequestBody Map<String, String> body) {
        String productId = body.get("productId");
        String message = body.getOrDefault("message", "Hi, I am interested in this product. Please share more details.");
        if (productId == null || productId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(contactRequestService.createContactRequest(productId, message));
    }

    /** GET /api/contact-requests/my — buyer's sent requests */
    @GetMapping("/my")
    public ResponseEntity<List<ContactRequest>> getMyContactRequests() {
        return ResponseEntity.ok(contactRequestService.getMyContactRequests());
    }

    /** GET /api/contact-requests/seller — requests received as a seller */
    @GetMapping("/seller")
    public ResponseEntity<List<ContactRequest>> getSellerContactRequests() {
        return ResponseEntity.ok(contactRequestService.getSellerContactRequests());
    }

    /** PUT /api/contact-requests/{id}/status — update request status */
    @PutMapping("/{id}/status")
    public ResponseEntity<ContactRequest> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "VIEWED");
        return ResponseEntity.ok(contactRequestService.updateStatus(id, status));
    }
}
