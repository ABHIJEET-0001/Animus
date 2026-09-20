package com.animus.service;

import com.animus.model.*;
import com.animus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CameraRepository cameraRepository;
    private final OfficerRepository officerRepository;
    private final DetectionRepository detectionRepository;
    private final MissionRepository missionRepository;
    private final CommMessageRepository messageRepository;

    @Override
    public void run(String... args) {
        if (cameraRepository.count() > 0) {
            return; // Already seeded
        }

        // Seed Cameras
        Camera cam1 = Camera.builder().cameraCode("CAM-007").location("NH-44 KM 312").zone("Jabalpur Corridor").status(Camera.CameraStatus.ONLINE).mode(Camera.CameraMode.STANDARD).fps(30).resolution("4K").riskLevel(RiskLevel.HIGH).build();
        Camera cam2 = Camera.builder().cameraCode("CAM-023").location("NH-8 KM 88").zone("Pench Corridor").status(Camera.CameraStatus.ONLINE).mode(Camera.CameraMode.NIGHT_VISION).fps(60).resolution("1080p").riskLevel(RiskLevel.CRITICAL).build();
        Camera cam3 = Camera.builder().cameraCode("CAM-041").location("NH-27 KM 145").zone("Kanha Corridor").status(Camera.CameraStatus.ONLINE).mode(Camera.CameraMode.STANDARD).fps(30).resolution("1080p").riskLevel(RiskLevel.HIGH).build();
        Camera cam4 = Camera.builder().cameraCode("CAM-015").location("NH-67 KM 12").zone("Corbett Corridor").status(Camera.CameraStatus.ONLINE).mode(Camera.CameraMode.THERMAL).fps(15).resolution("720p").riskLevel(RiskLevel.CRITICAL).build();
        cameraRepository.saveAll(List.of(cam1, cam2, cam3, cam4));

        // Seed Officers
        Officer off1 = Officer.builder().name("Ravi K.").officerCode("F-07").zone("Pench").status(Officer.OfficerStatus.ON_MISSION).batteryPercent(84).build();
        Officer off2 = Officer.builder().name("Priya S.").officerCode("F-12").zone("Jabalpur").status(Officer.OfficerStatus.EN_ROUTE).batteryPercent(42).build();
        Officer off3 = Officer.builder().name("Arun M.").officerCode("F-03").zone("Kanha").status(Officer.OfficerStatus.STANDBY).batteryPercent(65).build();
        Officer off4 = Officer.builder().name("Sunita R.").officerCode("F-09").zone("Jabalpur").status(Officer.OfficerStatus.ON_MISSION).batteryPercent(55).build();
        Officer off5 = Officer.builder().name("Dev P.").officerCode("F-15").zone("Corbett").status(Officer.OfficerStatus.STANDBY).batteryPercent(82).build();
        officerRepository.saveAll(List.of(off1, off2, off3, off4, off5));

        // Seed Initial Detections
        Detection d1 = Detection.builder().camera(cam1).species("Indian Deer").type(Detection.DetectionType.ANIMAL).confidence(97.3).riskLevel(RiskLevel.HIGH).count(2).detectedAt(LocalDateTime.now().minusSeconds(32)).build();
        Detection d2 = Detection.builder().camera(cam2).species("Leopard").type(Detection.DetectionType.ANIMAL).confidence(94.1).riskLevel(RiskLevel.CRITICAL).count(1).detectedAt(LocalDateTime.now().minusMinutes(1).minusSeconds(14)).build();
        detectionRepository.saveAll(List.of(d1, d2));

        // Seed Missions
        Mission m1 = Mission.builder().missionCode("M-2741").type(Mission.MissionType.RESCUE).priority(RiskLevel.CRITICAL).animal("Indian Elephant").location("NH-67 KM 12 · Corbett").distance("2.4 km").eta("8 min").assignedOfficer(off1).status(Mission.MissionStatus.DISPATCHED).build();
        Mission m2 = Mission.builder().missionCode("M-2742").type(Mission.MissionType.MONITOR).priority(RiskLevel.HIGH).animal("Leopard").location("NH-8 KM 88 · Pench").distance("5.1 km").eta("12 min").assignedOfficer(off2).status(Mission.MissionStatus.ACCEPTED).build();
        missionRepository.saveAll(List.of(m1, m2));

        // Seed Messages
        CommMessage msg1 = CommMessage.builder().sender("Ravi K. (F-07)").content("Elephant secured. Moving off road. Requesting additional support.").type(CommMessage.MessageType.INCOMING).riskLevel(RiskLevel.CRITICAL).sentAt(LocalDateTime.now().minusMinutes(10)).build();
        CommMessage msg2 = CommMessage.builder().sender("Command").content("Unit F-12 dispatched to assist. ETA 6 minutes.").type(CommMessage.MessageType.OUTGOING).sentAt(LocalDateTime.now().minusMinutes(9)).build();
        messageRepository.saveAll(List.of(msg1, msg2));
    }
}
