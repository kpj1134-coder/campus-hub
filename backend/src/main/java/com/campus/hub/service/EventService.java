package com.campus.hub.service;

import com.campus.hub.model.Event;
import com.campus.hub.model.Registration;
import com.campus.hub.model.User;
import com.campus.hub.repository.EventRepository;
import com.campus.hub.repository.RegistrationRepository;
import com.campus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        User user = getCurrentUser();
        event.setOrganizerId(user.getId());
        event.setOrganizer(user.getName());
        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        eventRepository.deleteById(id);
    }

    /**
     * Student registers → status = PENDING
     * Admin must approve before student gets QR pass
     */
    public Registration registerForEvent(String eventId) {
        User user = getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (registrationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new RuntimeException("You have already registered for this event");
        }

        Registration reg = Registration.builder()
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .eventId(eventId)
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .eventTime(event.getTime())
                .eventLocation(event.getLocation())
                .status("PENDING")
                .build();

        Registration saved = registrationRepository.save(reg);

        // Notify student — pending
        notificationService.createNotification(
                user.getId(),
                "Registration Submitted",
                "⏳ Your registration for \"" + event.getTitle() + "\" is pending admin approval.",
                "INFO"
        );

        // Notify organizer/admin
        if (event.getOrganizerId() != null && !event.getOrganizerId().isBlank()) {
            notificationService.createNotification(
                    event.getOrganizerId(),
                    "New Event Registration",
                    "🎓 " + user.getName() + " wants to register for \"" + event.getTitle() + "\". Please approve or reject.",
                    "INFO"
            );
        }

        return saved;
    }

    public List<Registration> getMyRegistrations() {
        User user = getCurrentUser();
        return registrationRepository.findByUserId(user.getId());
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public List<Registration> getEventRegistrations(String eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    /**
     * Admin approves or rejects a registration.
     * APPROVED → student gets QR pass notification
     * REJECTED → student gets rejection notification
     */
    public Registration updateRegistrationStatus(String registrationId, String status) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        reg.setStatus(status.toUpperCase());
        reg.setUpdatedAt(LocalDateTime.now());
        Registration updated = registrationRepository.save(reg);

        // Notify the student
        String title, message;
        String type;
        if ("APPROVED".equalsIgnoreCase(status)) {
            title = "Registration Approved! 🎉";
            message = "✅ Your registration for \"" + reg.getEventTitle() + "\" has been APPROVED. Your QR pass is ready!";
            type = "SUCCESS";
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            title = "Registration Rejected";
            message = "❌ Your registration for \"" + reg.getEventTitle() + "\" was not approved. Contact the organizer for details.";
            type = "WARNING";
        } else {
            title = "Registration Updated";
            message = "Your registration for \"" + reg.getEventTitle() + "\" status: " + status;
            type = "INFO";
        }

        notificationService.createNotification(reg.getUserId(), title, message, type);
        return updated;
    }

    public void cancelRegistration(String registrationId) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        reg.setStatus("CANCELLED");
        reg.setUpdatedAt(LocalDateTime.now());
        registrationRepository.save(reg);
    }
}
