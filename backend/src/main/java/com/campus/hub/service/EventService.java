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
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        event.setOrganizerId(user.getId());
        event.setOrganizer(user.getName());
        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(id);
        registrationRepository.findByEventId(id).forEach(r ->
                registrationRepository.deleteById(r.getId()));
    }

    public Registration registerForEvent(String eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Prevent duplicate registration
        if (registrationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new RuntimeException("You are already registered for this event");
        }

        String registeredAt = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        Registration registration = Registration.builder()
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .eventId(eventId)
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .eventTime(event.getTime())
                .eventLocation(event.getLocation())
                .status("CONFIRMED")
                .build();

        Registration saved = registrationRepository.save(registration);

        // ── Notify the student
        notificationService.createNotification(
                user.getId(),
                "Event Registration Confirmed",
                "🎟️ You have successfully registered for \"" + event.getTitle() + "\" on " + event.getDate(),
                "SUCCESS"
        );

        // ── Notify the admin/organizer
        String organizerId = event.getOrganizerId();
        if (organizerId != null && !organizerId.isBlank()) {
            notificationService.createNotification(
                    organizerId,
                    "New Event Registration",
                    "🎓 " + user.getName() + " has registered for your event: \"" + event.getTitle() + "\"",
                    "INFO"
            );

            // ── Send email to organizer
            userRepository.findById(organizerId).ifPresent(organizer ->
                    emailService.sendEventRegistrationEmail(
                            organizer.getEmail(),
                            organizer.getName(),
                            event.getTitle(),
                            event.getDate(),
                            event.getTime(),
                            user.getName(),
                            user.getEmail(),
                            registeredAt
                    )
            );
        }

        return saved;
    }

    public List<Registration> getMyRegistrations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.findByUserId(user.getId());
    }

    public List<Registration> getEventRegistrations(String eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    public boolean isRegistered(String eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.existsByUserIdAndEventId(user.getId(), eventId);
    }

    public void cancelRegistration(String registrationId) {
        Registration r = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        r.setStatus("CANCELLED");
        registrationRepository.save(r);
    }
}
