package com.campus.hub.repository;

import com.campus.hub.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
    List<Registration> findByUserId(String userId);
    List<Registration> findByEventId(String eventId);
    List<Registration> findByStatus(String status);
    Optional<Registration> findByUserIdAndEventId(String userId, String eventId);
    boolean existsByUserIdAndEventId(String userId, String eventId);
    long countByStatus(String status);
    long countByUserId(String userId);
}
