package com.animus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Represents a wildlife report submitted by a citizen via the mobile app.
 */
@Entity
@Table(name = "wildlife_reports")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WildlifeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String animalType;       // e.g. "Elephant", "Leopard", "Snake"

    private Double latitude;
    private Double longitude;
    private String locationDesc;     // e.g. "NH-44 KM 312 · Jabalpur"

    private String reporterName;
    private String reporterPhone;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;     // SUBMITTED, VERIFIED, DISPATCHED, RESOLVED

    @Enumerated(EnumType.STRING)
    private RiskLevel urgency;

    private LocalDateTime reportedAt;

    @PrePersist
    protected void onCreate() {
        reportedAt = LocalDateTime.now();
        if (status == null) status = ReportStatus.SUBMITTED;
    }

    public enum ReportStatus { SUBMITTED, VERIFIED, DISPATCHED, RESOLVED }
}
