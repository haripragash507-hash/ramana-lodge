import { ReactNode } from 'react';

export type Role = 'admin' | 'user' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Room {
  id: number;
  badge?: string;
  name: string;
  price: number;
  capacity: number;
  imageUrls: string[];
  description: string;
  isFreeCancellation?: boolean;
}

export interface RoomContextType {
  rooms: Room[];
  updateRoom: (id: number, updatedItem: Partial<Room>) => void;
  addRoom: (newRoom: Omit<Room, 'id'>) => void;
  deleteRoom: (id: number) => void;
}

export interface BookingRecord {
  id: string;
  roomId: number;
  roomName: string;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled';
  dateBooked: string;
}

export interface BookingHistoryContextType {
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'id' | 'dateBooked'>) => void;
  cancelBooking: (id: string) => void;
}

export interface Offer {
  id: number;
  badge: string; // e.g. "20% OFF"
  title: string; // e.g. "Weekend Getaway"
}

export interface OfferContextType {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  deleteOffer: (id: number) => void;
}

export interface Booking {
  id: number;
  guestName: string;
  phone: string;
  date: string;
  roomName: string;
}

export interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface AutoSliderProps {
  images: string[];
}

export interface PaymentState {
  roomName: string;
  roomId: number;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

export interface EditFormData {
  name: string;
  price: number;
  capacity: number;
  imageUrls: string[];
  description: string;
  isFreeCancellation: boolean;
}
