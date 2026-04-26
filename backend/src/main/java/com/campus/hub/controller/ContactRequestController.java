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

    @PostMapping
    public ResponseEntity<ContactRequest> create(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(contactRequestService.createContactRequest(
                body.get("productId"),
                body.getOrDefault("message", "I am interested in this product. Please share details.")
        ));
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<ContactRequest>> buyerRequests() {
        return ResponseEntity.ok(contactRequestService.getBuyerRequests());
    }

    @GetMapping("/seller")
    public ResponseEntity<List<ContactRequest>> sellerRequests() {
        return ResponseEntity.ok(contactRequestService.getSellerRequests());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ContactRequest> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(contactRequestService.updateStatus(id, body.get("status")));
    }
}
