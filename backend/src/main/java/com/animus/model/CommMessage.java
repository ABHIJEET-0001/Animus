package com.animus.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Represents a broadcast message in the Field Officer Comms system.
 */
@Entity
@Table(name = "messages")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CommMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sender;           // e.g. "Command", "Ravi K. (F-07)", "AI System"

    @Enumerated(EnumType.STRING)
    private MessageType type;        // INCOMING, OUTGOING, SYSTEM

    @Column(nullable = false, length = 1000)
    private String content;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;     // attached risk tag (nullable)

    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
        if (sentAt == null) sentAt = LocalDateTime.now();
    }

    public enum MessageType { INCOMING, OUTGOING, SYSTEM }
}
