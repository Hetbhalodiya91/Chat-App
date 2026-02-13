package com.chat.backend.controller;

import com.chat.backend.Playload.MessageRequest;
import com.chat.backend.entity.Message;
import com.chat.backend.entity.Room;
import com.chat.backend.repository.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:3000")
public class ChatController {
    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId
            ,@RequestBody MessageRequest messageRequest){

        Room room = roomRepository.findByRoomId(messageRequest.getRoomId());
        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if(room != null){
            room.getMessages().add(message);
            roomRepository.save(room);
        }else{
            throw new RuntimeException("room not found!");
        }
        return message;
    }
}
