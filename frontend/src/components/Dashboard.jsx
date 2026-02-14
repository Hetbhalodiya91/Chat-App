import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getMyRooms, joinRoom, createRoom } from "../services/RoomService";
import { IoAddCircleOutline, IoChatbubblesOutline, IoLogOutOutline } from "react-icons/io5";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [createRoomIdInput, setCreateRoomIdInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadRooms = async () => {
    try {
      const list = await getMyRooms();
      setRooms(Array.isArray(list) ? list : []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    const id = roomIdInput.trim();
    if (!id) {
      toast.error("Enter a room ID");
      return;
    }
    setSubmitting(true);
    try {
      await joinRoom(id);
      toast.success("Joined room!");
      setRoomIdInput("");
      setShowJoinModal(false);
      await loadRooms();
      navigate("/chat", { state: { roomId: id, userName: user?.username } });
    } catch (err) {
      const msg = err.response?.data || "Could not join room";
      toast.error(typeof msg === "string" ? msg : "Could not join room");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createRoom(createRoomIdInput.trim() ? { roomId: createRoomIdInput.trim() } : {});
      const id = data?.roomId;
      toast.success("Room created!");
      setCreateRoomIdInput("");
      setShowCreateModal(false);
      await loadRooms();
      navigate("/chat", { state: { roomId: id, userName: user?.username } });
    } catch (err) {
      const msg = err.response?.data || "Could not create room";
      toast.error(typeof msg === "string" ? msg : "Could not create room");
    } finally {
      setSubmitting(false);
    }
  };

  const openRoom = (room) => {
    navigate("/chat", { state: { roomId: room.roomId, userName: user?.username } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoChatbubblesOutline className="text-2xl text-indigo-400" />
            <span className="font-bold text-lg">Chat</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{user?.username}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
            >
              <IoLogOutOutline /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your rooms</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium text-sm"
            >
              <IoAddCircleOutline /> Join room
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-medium text-sm"
            >
              Create room
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading rooms…</p>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center text-slate-400">
            <p className="mb-4">You haven't joined any rooms yet.</p>
            <p className="text-sm">Join a room with an ID or create a new one.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li
                key={room.id || room.roomId}
                onClick={() => openRoom(room)}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                  <IoChatbubblesOutline className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">#{room.roomId}</p>
                  <p className="text-slate-400 text-sm">
                    {Array.isArray(room.messages) ? room.messages.length : 0} messages
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Join room modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Join a room</h3>
            <p className="text-slate-400 text-sm mb-4">
              Enter the room ID. You'll join as <strong className="text-white">{user?.username}</strong>.
            </p>
            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="Room ID"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowJoinModal(false); setRoomIdInput(""); }}
                  className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitting ? "Joining…" : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create room modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Create a room</h3>
            <p className="text-slate-400 text-sm mb-4">
              Leave empty for a random ID, or set your own.
            </p>
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                value={createRoomIdInput}
                onChange={(e) => setCreateRoomIdInput(e.target.value)}
                placeholder="Room ID (optional)"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setCreateRoomIdInput(""); }}
                  className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitting ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
