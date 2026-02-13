import React from "react";
import backImage from "../assets/back.jpg";
import { IoSend } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";
import { useState, useRef } from "react";





const ChatPage = () => {

    const [roomId, setRoomId] = useState("");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);


  return (
    <div className="h-screen bg-gray-100 dark:bg-emerald-50 flex justify-center">
    <div className="h-screen   w-4xl  flex flex-col bg-gray-100 dark:bg-slate-900" 
     style={{ backgroundImage: `url(${backImage})` }}>

      {/* 🔝 Top Navbar */}
      <div className="bg-slate-700 dark:bg-slate-800 pt-3 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-semibold">
            Room: 12345
          </div>

          <div className="font-medium">
            User: Het Bhalodiya
          </div>

          <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg transition">
            Leave Room
          </button>
        </div>
      </div>

      {/* 💬 Chat Messages Section */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="max-w-4xl mx-auto px-4 space-y-4">

          {messages.map((msg) =>
            msg.isMe ? (
              // 👉 My Message (Right Side)
              <div key={msg.id} className="flex justify-end">
                <div className=" dark:bg-gray-500  bg-emerald-400 text-white px-4 py-2 rounded-xl max-w-xs shadow">
                  <p className="text-sm font-semibold">
                    {msg.user}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ) : (
              // 👉 Other User Message (Left Side)
              <div key={msg.id} className="flex items-start gap-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-xl max-w-xs shadow">
                  <p className="text-sm font-semibold">
                    {msg.user}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            )
          )}

        </div>
      </div>

      {/* 📨 Bottom Input Section */}
      <div className="bg-slate-700 dark:bg-slate-800 pb-5 ">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-slate-600 text-white focus:outline-none"
          />
          <button className="p-2 rounded-full bg-fuchsia-500  hover:bg-fuchsia-300">
              <MdAttachFile size={20} />
          </button>

          <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-white transition">
            <IoSend/>
          </button>

        </div>
      </div>

    </div>
    </div>
  );
};

export default ChatPage;