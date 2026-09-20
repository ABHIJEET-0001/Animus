package com.animus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Represents a highway CCTV camera in the ANIMUS network.
 */
@Entity
@Table(name = "cameras")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cameraCode;       // e.g. "CAM-007"

    @Column(nullable = false)
    private String location;         // e.g. "NH-44 KM 312"

    private String zone;             // e.g. "Jabalpur Corridor"

    @Enumerated(EnumType.STRING)
    private CameraStatus status;     // ONLINE, OFFLINE, MAINTENANCE

    @Enumerated(EnumType.STRING)
    private CameraMode mode;         // NIGHT_VISION, THERMAL, STANDARD

    private Double latitude;
    private Double longitude;

    private Integer fps;             // frames per second
    private String resolution;       // e.g. "4K", "1080p"

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;     // current corridor risk level

    private LocalDateTime lastDetectionAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum CameraStatus { ONLINE, OFFLINE, MAINTENANCE }
    public enum CameraMode { NIGHT_VISION, THERMAL, STANDARD }
}
