import apiClient from '../client/axios.client';
import { API_CONFIG } from '../configs/api.config';
import { Room } from '../../interfaces';

export const RoomService = {
  getAllRooms: async (): Promise<Room[]> => {
    return await apiClient.get(API_CONFIG.endpoints.room.getAll);
  },
  createRoom: async (data: Omit<Room, 'id'>): Promise<Room> => {
    return await apiClient.post(API_CONFIG.endpoints.room.create, data);
  },
  updateRoom: async (id: number, data: Partial<Room>): Promise<Room> => {
    return await apiClient.put(API_CONFIG.endpoints.room.update(id), data);
  },
  deleteRoom: async (id: number): Promise<void> => {
    return await apiClient.delete(API_CONFIG.endpoints.room.delete(id));
  }
};
