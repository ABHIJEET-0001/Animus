package com.animus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Represents an AI detection event — an animal, vehicle, or pedestrian
 * detected by a camera's edge AI processor.
 */
@Entity
@Table(name = "detections")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Detection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camera_id", nullable = false)
    private Camera camera;

    @Column(nullable = false)
    private String species;          // e.g. "Indian Deer", "Leopard", "Wild Boar"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DetectionType type;      // ANIMAL, VEHICLE, PEDESTRIAN

    private Double confidence;       // 0.0 to 100.0

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Integer count;           // number of animals detected (e.g. "Wild Boar x 2")

    private Double speed;            // speed in km/h (for vehicles)
    private Integer lane;            // lane number (for highway vehicles)

    private String boundingBox;      // JSON: {"x": "12%", "y": "20%", "w": "18%", "h": "25%"}

    private Boolean acknowledged;

    @Column(nullable = false)
    private LocalDateTime detectedAt;

    @PrePersist
    protected void onCreate() {
        if (detectedAt == null) detectedAt = LocalDateTime.now();
        if (acknowledged == null) acknowledged = false;
    }

    public enum DetectionType { ANIMAL, VEHICLE, PEDESTRIAN }
}
