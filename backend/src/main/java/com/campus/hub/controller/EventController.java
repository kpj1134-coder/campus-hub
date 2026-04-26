package com.campus.hub.controller;

import com.campus.hub.model.Event;
import com.campus.hub.model.Registration;
import com.campus.hub.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // ─── PUBLIC ─────────────────────────────────────────────────────────────

    @GetMapping("/api/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // ─── ADMIN ──────────────────────────────────────────────────────────────

    @PostMapping("/api/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @DeleteMapping("/api/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }

    @GetMapping("/api/admin/event-registrations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(eventService.getAllRegistrations());
    }

    @PutMapping("/api/admin/event-registrations/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Registration> updateRegistrationStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(eventService.updateRegistrationStatus(id, body.get("status")));
    }

    @GetMapping("/api/events/{id}/registrations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Registration>> getEventRegistrations(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventRegistrations(id));
    }

    // ─── STUDENT ────────────────────────────────────────────────────────────

    @PostMapping("/api/events/{id}/register")
    public ResponseEntity<Registration> register(@PathVariable String id) {
        return ResponseEntity.ok(eventService.registerForEvent(id));
    }

    @GetMapping("/api/events/my-registrations")
    public ResponseEntity<List<Registration>> myRegistrations() {
        return ResponseEntity.ok(eventService.getMyRegistrations());
    }

    @DeleteMapping("/api/events/registrations/{id}")
    public ResponseEntity<Map<String, String>> cancel(@PathVariable String id) {
        eventService.cancelRegistration(id);
        return ResponseEntity.ok(Map.of("message", "Registration cancelled"));
    }
}
