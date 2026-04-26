package com.campus.hub.controller;

import com.campus.hub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final ContactRequestRepository contactRequestRepository;

    /**
     * GET /api/admin/analytics
     * Returns all key metrics for the admin dashboard.
     */
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        long totalUsers       = userRepository.count();
        long totalProducts    = productRepository.count();
        long availableProducts = productRepository.countByStatus("AVAILABLE");
        long soldProducts     = productRepository.countByStatus("SOLD");
        long totalEvents      = eventRepository.count();
        long pendingRegs      = registrationRepository.countByStatus("PENDING");
        long approvedRegs     = registrationRepository.countByStatus("APPROVED");
        long rejectedRegs     = registrationRepository.countByStatus("REJECTED");
        long pendingRequests  = contactRequestRepository.countByStatus("PENDING");

        return ResponseEntity.ok(Map.of(
                "totalUsers",        totalUsers,
                "totalProducts",     totalProducts,
                "availableProducts", availableProducts,
                "soldProducts",      soldProducts,
                "totalEvents",       totalEvents,
                "pendingRegistrations",  pendingRegs,
                "approvedRegistrations", approvedRegs,
                "rejectedRegistrations", rejectedRegs,
                "pendingContactRequests", pendingRequests
        ));
    }
}
