import apiClient from '../client/axios.client';
import { API_CONFIG } from '../configs/api.config';
import { Offer } from '../../interfaces';

export const OfferService = {
  getAllOffers: async (): Promise<Offer[]> => {
    return await apiClient.get(API_CONFIG.endpoints.offer.getAll);
  },
  createOffer: async (data: Omit<Offer, 'id'>): Promise<Offer> => {
    return await apiClient.post(API_CONFIG.endpoints.offer.create, data);
  },
  deleteOffer: async (id: number): Promise<void> => {
    return await apiClient.delete(API_CONFIG.endpoints.offer.delete(id));
  }
};
