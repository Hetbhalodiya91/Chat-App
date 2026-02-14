window.global = window;

import React, { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { createRoom as createRoomApi, joinRoom } from "../services/RoomService";

const JoinCreateChat = () => {
  const navigate = useNavigate();
  const [detail, setDetail] = useState({
    userName: "",
    roomId: "",
  });

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.userName.trim() === "") {
      toast.error("Please enter your name ❌");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (!detail.userName.trim()) {
      toast.error("Please enter your name ❌");
      return;
    }
    if (!detail.roomId.trim()) {
      toast.error("Please enter Room ID ❌");
      return;
    }
    try {
      await joinRoom(detail.roomId.trim());
      toast.success("Joining room… 🚀");
      navigate("/chat", { state: { roomId: detail.roomId.trim(), userName: detail.userName.trim() } });
    } catch (error) {
      console.error(error);
      toast.error("Room not found or error joining ❌");
    }
  }

  async function createRoom() {
    if (!validateForm()) return;
    try {
      const data = await createRoomApi({
        userName: detail.userName.trim(),
        roomId: detail.roomId.trim() || undefined,
      });
      const finalRoomId = data.roomId || detail.roomId;
      toast.success("Room created 🎉");
      navigate("/chat", { state: { roomId: finalRoomId, userName: detail.userName.trim() } });
    } catch (error) {
      console.error(error);
      toast.error("Error creating room ❌");
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-blue-200 to-indigo-300 
                    dark:from-slate-900 dark:to-slate-800 
                    transition-all duration-500">

      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl 
                      bg-white/80 dark:bg-slate-900/80 
                      backdrop-blur-lg">

        <h2 className="text-2xl font-bold text-center mb-6 
                       text-gray-800 dark:text-white">
          Join Room
        </h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium 
                            text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="userName"
            value={detail.userName}
            onChange={handleFormInputChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg border 
                       border-gray-300 dark:border-slate-600
                       bg-white dark:bg-slate-800
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 
                       focus:ring-blue-500"
          />
        </div>

        {/* Room ID Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium 
                            text-gray-700 dark:text-gray-300 mb-1">
            Room ID
          </label>
          <input
            type="text"
            name="roomId"
            value={detail.roomId}
            onChange={handleFormInputChange}
            placeholder="Enter room ID"
            className="w-full px-4 py-2 rounded-lg border 
                       border-gray-300 dark:border-slate-600
                       bg-white dark:bg-slate-800
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 
                       focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button 
            onClick={joinChat}
            className="w-1/2 py-2 rounded-lg font-semibold 
                       bg-blue-500 hover:bg-blue-600 
                       text-white transition duration-300">
            Join Room
          </button>

          <button 
            onClick={createRoom}
            className="w-1/2 py-2 rounded-lg font-semibold 
                       bg-green-500 hover:bg-green-600 
                       text-white transition duration-300">
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
