package com.animus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Represents a field officer deployed for wildlife rescue and patrol.
 */
@Entity
@Table(name = "officers")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String officerCode;      // e.g. "F-07"

    private String zone;             // e.g. "Pench", "Kanha", "Corbett"

    @Enumerated(EnumType.STRING)
    private OfficerStatus status;    // ON_MISSION, EN_ROUTE, STANDBY, OFFLINE

    private Integer batteryPercent;  // device battery

    private Double latitude;
    private Double longitude;

    private String phone;

    private LocalDateTime lastSeenAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastSeenAt == null) lastSeenAt = LocalDateTime.now();
    }

    public enum OfficerStatus { ON_MISSION, EN_ROUTE, STANDBY, OFFLINE }
}
