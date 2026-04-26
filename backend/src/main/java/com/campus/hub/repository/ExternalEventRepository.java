package com.campus.hub.repository;

import com.campus.hub.model.ExternalEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExternalEventRepository extends MongoRepository<ExternalEvent, String> {
    List<ExternalEvent> findByCityIgnoreCase(String city);
    List<ExternalEvent> findByEventTypeIgnoreCase(String eventType);
    List<ExternalEvent> findByStateIgnoreCase(String state);
}
