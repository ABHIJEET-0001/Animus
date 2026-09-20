package com.animus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Represents a rescue/monitor mission dispatched to a field officer.
 */
@Entity
@Table(name = "missions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String missionCode;      // e.g. "M-2741"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionType type;        // RESCUE, MONITOR, PATROL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel priority;

    private String animal;           // e.g. "Indian Elephant"
    private String location;         // e.g. "NH-44 KM 312 · Jabalpur"

    private String distance;         // e.g. "2.4 km"
    private String eta;              // e.g. "8 min"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    private Officer assignedOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detection_id")
    private Detection triggerDetection;

    @Enumerated(EnumType.STRING)
    private MissionStatus status;    // PENDING, ACCEPTED, DISPATCHED, COMPLETED, CANCELLED

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = MissionStatus.PENDING;
    }

    public enum MissionType { RESCUE, MONITOR, PATROL }
    public enum MissionStatus { PENDING, ACCEPTED, DISPATCHED, COMPLETED, CANCELLED }
}
