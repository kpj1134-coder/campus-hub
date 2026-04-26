package com.campus.hub.controller;

import com.campus.hub.model.ExternalEvent;
import com.campus.hub.service.ExternalEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/external-events")
@RequiredArgsConstructor
public class ExternalEventController {

    private final ExternalEventService externalEventService;

    /**
     * GET /api/external-events - Public: Students can view all external events
     */
    @GetMapping
    public ResponseEntity<List<ExternalEvent>> getAllExternalEvents() {
        return ResponseEntity.ok(externalEventService.getAllExternalEvents());
    }

    /**
     * POST /api/external-events - Admin only: Add a Knowafest event link
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExternalEvent> createExternalEvent(@RequestBody ExternalEvent event) {
        return ResponseEntity.ok(externalEventService.createExternalEvent(event));
    }

    /**
     * DELETE /api/external-events/{id} - Admin only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteExternalEvent(@PathVariable String id) {
        externalEventService.deleteExternalEvent(id);
        return ResponseEntity.ok(Map.of("message", "External event deleted successfully"));
    }
}
