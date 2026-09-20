package com.animus.service;

import com.animus.model.Camera;
import com.animus.model.Detection;
import com.animus.model.RiskLevel;
import com.animus.repository.CameraRepository;
import com.animus.repository.DetectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final CameraRepository cameraRepository;
    private final DetectionRepository detectionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    private final Random random = new Random();
    private final String[] speciesList = {"Indian Deer", "Leopard", "Wild Boar", "Asian Elephant", "Tiger"};

    @Scheduled(fixedRate = 10000) // Run every 10 seconds
    public void simulateLiveDetection() {
        List<Camera> cameras = cameraRepository.findAll();
        if (cameras.isEmpty()) return;

        // Pick a random camera
        Camera cam = cameras.get(random.nextInt(cameras.size()));
        String species = speciesList[random.nextInt(speciesList.length)];
        
        RiskLevel risk = RiskLevel.MODERATE;
        if (species.equals("Leopard") || species.equals("Tiger") || species.equals("Asian Elephant")) {
            risk = RiskLevel.CRITICAL;
        } else if (random.nextBoolean()) {
            risk = RiskLevel.HIGH;
        }

        Detection detection = Detection.builder()
                .camera(cam)
                .species(species)
                .type(Detection.DetectionType.ANIMAL)
                .confidence(85.0 + (random.nextDouble() * 14.5))
                .riskLevel(risk)
                .count(random.nextInt(3) + 1)
                .detectedAt(LocalDateTime.now())
                .build();

        detection = detectionRepository.save(detection);

        // Broadcast to WebSocket clients
        messagingTemplate.convertAndSend("/topic/detections", detection);
    }
}
