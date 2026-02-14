import { httpClient } from "../config/AxiosHelper";

export const getMyRooms = async () => {
  const response = await httpClient.get("/api/v1/rooms/my");
  return response.data;
};

export const createRoom = async (roomDetail = {}) => {
  const response = await httpClient.post("/api/v1/rooms", roomDetail);
  return response.data;
};

export const getRoom = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export const joinRoom = async (roomId) => {
  const response = await httpClient.post(`/api/v1/rooms/${roomId}/join`);
  return response.data;
};

export const getRoomMessages = async (roomId, page = 0, size = 50) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages`, {
    params: { page, size },
  });
  return response.data;
};