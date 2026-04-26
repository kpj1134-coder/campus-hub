package com.campus.hub.service;

import com.campus.hub.model.ExternalEvent;
import com.campus.hub.repository.ExternalEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExternalEventService {

    private final ExternalEventRepository externalEventRepository;

    public List<ExternalEvent> getAllExternalEvents() {
        return externalEventRepository.findAll();
    }

    public ExternalEvent createExternalEvent(ExternalEvent event) {
        if (event.getSourceName() == null || event.getSourceName().isBlank()) {
            event.setSourceName("Knowafest");
        }
        return externalEventRepository.save(event);
    }

    public void deleteExternalEvent(String id) {
        if (!externalEventRepository.existsById(id)) {
            throw new RuntimeException("External event not found");
        }
        externalEventRepository.deleteById(id);
    }

    public long countAll() {
        return externalEventRepository.count();
    }
}
