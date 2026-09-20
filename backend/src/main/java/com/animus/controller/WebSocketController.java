package com.animus.controller;

import com.animus.model.CommMessage;
import com.animus.repository.CommMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final CommMessageRepository messageRepository;

    @MessageMapping("/comms.send")
    @SendTo("/topic/comms")
    public CommMessage handleCommsMessage(CommMessage message) {
        message.setSentAt(LocalDateTime.now());
        message.setType(CommMessage.MessageType.OUTGOING);
        return messageRepository.save(message);
    }
}
