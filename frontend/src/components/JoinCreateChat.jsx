import React from "react";

const JoinCreateChat = () => {
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
          <button className="w-1/2 py-2 rounded-lg font-semibold 
                             bg-blue-500 hover:bg-blue-600 
                             text-white transition duration-300">
            Join Room
          </button>

          <button className="w-1/2 py-2 rounded-lg font-semibold 
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
