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

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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
        // Also remove all registrations for this event
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

        // Notify the student
        notificationService.createNotification(
                user.getId(),
                "🎟️ You have successfully registered for: \"" + event.getTitle() + "\" on " + event.getDate(),
                "SUCCESS"
        );

        return saved;
    }

    public List<Registration> getMyRegistrations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.findByUserId(user.getId());
    }

    public boolean isRegistered(String eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.existsByUserIdAndEventId(user.getId(), eventId);
    }
}
