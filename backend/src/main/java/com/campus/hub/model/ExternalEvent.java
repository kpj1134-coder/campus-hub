package com.campus.hub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "external_events")
public class ExternalEvent {

    @Id
    private String id;

    private String title;
    private String eventType;   // Hackathon, Workshop, Fest, Seminar, etc.
    private String collegeName;
    private String city;
    private String state;
    private String startDate;
    private String endDate;

    @Builder.Default
    private String sourceName = "Knowafest";

    private String sourceUrl;
}
