package com.chat.backend.controller;

import com.chat.backend.Playload.CreateRoomRequest;
import com.chat.backend.Playload.CreateRoomResponse;
import com.chat.backend.entity.Message;
import com.chat.backend.entity.Room;
import com.chat.backend.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new RuntimeException("Not authenticated");
        }
        return (String) auth.getPrincipal();
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyRooms() {
        String userId = getCurrentUserId();
        List<Room> rooms = roomRepository.findByMemberIdsContaining(userId);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody(required = false) CreateRoomRequest request) {
        String userId = getCurrentUserId();
        String roomId = (request != null && request.getRoomId() != null && !request.getRoomId().trim().isEmpty())
                ? request.getRoomId().trim()
                : UUID.randomUUID().toString().substring(0, 8);

        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists!");
        }
        Room room = new Room();
        room.setRoomId(roomId);
        room.getMemberIds().add(userId);
        roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateRoomResponse(roomId));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        String userId = getCurrentUserId();
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
        }
        room.getMemberIds().add(userId);
        roomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page" , defaultValue = "0" , required = false)int page,
            @RequestParam(value = "size" , defaultValue = "20" , required = false)int size
    ){

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Message> messages = room.getMessages();
        int start = Math.max(0,messages.size()-(page+1)*size);
        int end = Math.min(messages.size() , start+size);

        List<Message> paginatedMessages = messages.subList(start,end);

        return ResponseEntity.ok(paginatedMessages);
    }
}
