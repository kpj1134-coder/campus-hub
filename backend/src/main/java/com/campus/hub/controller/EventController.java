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
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Registration> registerForEvent(@PathVariable String id) {
        return ResponseEntity.ok(eventService.registerForEvent(id));
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<List<Registration>> getMyRegistrations() {
        return ResponseEntity.ok(eventService.getMyRegistrations());
    }

    @GetMapping("/{id}/registrations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Registration>> getEventRegistrations(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventRegistrations(id));
    }

    @GetMapping("/{id}/is-registered")
    public ResponseEntity<Map<String, Boolean>> isRegistered(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("registered", eventService.isRegistered(id)));
    }

    @DeleteMapping("/registrations/{registrationId}")
    public ResponseEntity<Map<String, String>> cancelRegistration(@PathVariable String registrationId) {
        eventService.cancelRegistration(registrationId);
        return ResponseEntity.ok(Map.of("message", "Registration cancelled"));
    }
}
