import apiClient from '../client/axios.client';
import { API_CONFIG } from '../configs/api.config';
import { Institute } from '../../interfaces/Institute';
import { ApiResponse, PaginatedResponse } from '../interface/api.interface';

export const InstituteService = {
  getAllInstitutes: async (): Promise<PaginatedResponse<Institute>> => {
    const response = await apiClient.get<PaginatedResponse<Institute>>(API_CONFIG.endpoints.institute.getAll);
    return response.data;
  },

  getInstituteById: async (id: string): Promise<ApiResponse<Institute>> => {
    const response = await apiClient.get<ApiResponse<Institute>>(API_CONFIG.endpoints.institute.getById(id));
    return response.data;
  },

  createInstitute: async (data: Partial<Institute>): Promise<ApiResponse<Institute>> => {
    const response = await apiClient.post<ApiResponse<Institute>>(API_CONFIG.endpoints.institute.create, data);
    return response.data;
  },

  updateInstitute: async (id: string, data: Partial<Institute>): Promise<ApiResponse<Institute>> => {
    const response = await apiClient.put<ApiResponse<Institute>>(API_CONFIG.endpoints.institute.update(id), data);
    return response.data;
  },

  deleteInstitute: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(API_CONFIG.endpoints.institute.delete(id));
    return response.data;
  }
};
