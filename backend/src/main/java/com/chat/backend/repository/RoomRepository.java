package com.chat.backend.repository;

import com.chat.backend.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {
    Room findByRoomId(String roomId);
    List<Room> findByMemberIdsContaining(String userId);
}
