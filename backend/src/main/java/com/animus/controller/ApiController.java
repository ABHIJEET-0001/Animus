package com.animus.controller;

import com.animus.model.*;
import com.animus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final CameraRepository cameraRepository;
    private final OfficerRepository officerRepository;
    private final DetectionRepository detectionRepository;
    private final MissionRepository missionRepository;
    private final CommMessageRepository messageRepository;

    @GetMapping("/cameras")
    public List<Camera> getCameras() {
        return cameraRepository.findAll();
    }

    @GetMapping("/officers")
    public List<Officer> getOfficers() {
        return officerRepository.findAll();
    }

    @GetMapping("/detections")
    public List<Detection> getDetections() {
        return detectionRepository.findTop50ByOrderByDetectedAtDesc();
    }

    @GetMapping("/missions")
    public List<Mission> getActiveMissions() {
        return missionRepository.findByStatusNot(Mission.MissionStatus.COMPLETED);
    }

    @GetMapping("/comms")
    public List<CommMessage> getMessages() {
        return messageRepository.findTop50ByOrderBySentAtDesc();
    }

    @PostMapping("/comms")
    public CommMessage sendMessage(@RequestBody CommMessage message) {
        message.setType(CommMessage.MessageType.OUTGOING);
        return messageRepository.save(message);
    }

    @PostMapping("/missions/{id}/accept")
    public ResponseEntity<Mission> acceptMission(@PathVariable Long id) {
        return missionRepository.findById(id).map(mission -> {
            mission.setStatus(Mission.MissionStatus.ACCEPTED);
            return ResponseEntity.ok(missionRepository.save(mission));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/missions/{id}/dispatch")
    public ResponseEntity<Mission> dispatchMission(@PathVariable Long id) {
        return missionRepository.findById(id).map(mission -> {
            mission.setStatus(Mission.MissionStatus.DISPATCHED);
            return ResponseEntity.ok(missionRepository.save(mission));
        }).orElse(ResponseEntity.notFound().build());
    }
}
