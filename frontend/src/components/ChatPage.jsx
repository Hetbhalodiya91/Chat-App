// window.global = window;

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { IoSend, IoChatbubblesOutline, IoArrowBackOutline } from "react-icons/io5";
import { getRoomMessages } from "../services/RoomService";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId: stateRoomId, userName: stateUserName } = location.state || {};

  const [roomId] = useState(() => stateRoomId || "");
  const [username] = useState(() => stateUserName || "");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const chatBoxRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (!roomId || !username) {
      navigate("/", { replace: true });
    }
  }, [roomId, username, navigate]);

  // 📥 Load old messages
  useEffect(() => {
    if (!roomId) return;

    getRoomMessages(roomId)
      .then((list) => setMessages(Array.isArray(list) ? list : []))
      .catch(() => setMessages([]));
  }, [roomId]);

  // 🔌 WebSocket Connection
  useEffect(() => {
    if (!roomId) return;

    const socket = new SockJS("http://localhost:8080/chat");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: () => setIsConnected(false),
    });

    client.activate();
    setStompClient(client);

    return () => {
      setIsConnected(false);
      client.deactivate();
    };
  }, [roomId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const anchor = scrollAnchorRef.current;
    if (!anchor) return;
    const timer = requestAnimationFrame(() => {
      anchor.scrollIntoView({ behavior: "smooth"});
    });
    return () => cancelAnimationFrame(timer);
  }, [messages]);

  // 🕒 Time Ago Function
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 5) return "Just now";
    if (seconds < 60)
      return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24)
      return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30)
      return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12)
      return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  // 📨 Send Message (only when STOMP is connected)
  const handleSend = () => {
    if (!input.trim()) return;
    if (!stompClient || !isConnected) return;

    const message = {
      content: input,
      sender: username,
      roomId: roomId,
    };

    stompClient.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify(message),
    });

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleLeaveRoom = () => {
    if (stompClient) {
      stompClient.deactivate();
    }
    setMessages([]);
    navigate("/"); // Back to dashboard (Discord-style)
  };

  if (!roomId || !username) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col overflow-hidden">
      {/* Fixed header navbar */}
      <header className="flex-shrink-0 fixed top-0 left-0 right-0 z-20 border-b border-slate-700 bg-slate-800/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <IoChatbubblesOutline className="text-xl" />
            </div>
            <div>
              <span className="font-semibold">#{roomId}</span>
              <span className="text-slate-400 text-sm ml-2">as {username}</span>
            </div>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-medium"
          >
            <IoArrowBackOutline /> Back to rooms
          </button>
        </div>
      </header>

      {/* Scrollable message area – fills space between header and footer, shows recent at bottom */}
      <main
        ref={chatBoxRef}
        className="flex-1 min-h-0 overflow-y-auto pt-14 pb-24 px-4"
      >
        <div className="max-w-4xl mx-auto py-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur p-4 space-y-4 min-h-full">
            {messages.length === 0 && (
              <p className="text-slate-500 text-center text-sm py-8">No messages yet. Say hello!</p>
            )}
            {messages.map((msg, index) => {
              const isMe = msg.sender === username;
              return isMe ? (
                <div key={index} className="flex justify-end">
                  <div className="rounded-xl px-4 py-2.5 max-w-[85%] bg-indigo-600/80 border border-indigo-500/30">
                    <p className="text-xs font-semibold text-indigo-200">{msg.sender}</p>
                    <p className="text-white break-words">{msg.content}</p>
                    <p className="text-[10px] text-indigo-200/80 text-right mt-1">
                      {timeAgo(msg.timeStamp)}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-slate-400 text-xs font-medium flex-shrink-0">
                    {(msg.sender || "?")[0].toUpperCase()}
                  </div>
                  <div className="rounded-xl px-4 py-2.5 max-w-[85%] bg-slate-700/80 border border-slate-600">
                    <p className="text-xs font-semibold text-slate-300">{msg.sender}</p>
                    <p className="text-white break-words">{msg.content}</p>
                    <p className="text-[10px] text-slate-400 text-right mt-1">
                      {timeAgo(msg.timeStamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={scrollAnchorRef} aria-hidden="true" className="h-px shrink-0" />
          </div>
        </div>
      </main>

      {/* Fixed footer – text input bar */}
      <footer className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-20 border-t border-slate-700 bg-slate-800/95 backdrop-blur px-4 py-3">
        <div className="max-w-4xl mx-auto">
          {!isConnected && (
            <p className="text-slate-500 text-xs mb-2">Connecting…</p>
          )}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !stompClient || !isConnected}
              title={!isConnected ? "Connecting…" : "Send"}
              className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoSend className="text-xl" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
