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

    /**
     * POST /api/contact-requests
     * Body: { "productId": "...", "message": "..." }
     */
    @PostMapping
    public ResponseEntity<ContactRequest> createContactRequest(@RequestBody Map<String, String> body) {
        String productId = body.get("productId");
        String message = body.getOrDefault("message", "Hi, I am interested in this product. Please share more details.");
        if (productId == null || productId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(contactRequestService.createContactRequest(productId, message));
    }

    /**
     * GET /api/contact-requests/my
     * Returns contact requests made by the current logged-in buyer
     */
    @GetMapping("/my")
    public ResponseEntity<List<ContactRequest>> getMyContactRequests() {
        return ResponseEntity.ok(contactRequestService.getMyContactRequests());
    }
}
