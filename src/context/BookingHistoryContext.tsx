import React, { createContext, useState, useEffect, ReactNode } from 'react';

import { BookingRecord, BookingHistoryContextType } from '../interfaces';


export const BookingHistoryContext = createContext<BookingHistoryContextType | undefined>(undefined);

export const BookingHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('lodge_booking_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('lodge_booking_history', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (newBooking: Omit<BookingRecord, 'id' | 'dateBooked'>) => {
    const bookingFull: BookingRecord = {
      ...newBooking,
      id: `BK-${Math.floor(Math.random() * 1000000)}`,
      dateBooked: new Date().toISOString()
    };
    setBookings(prev => [bookingFull, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
  };

  return (
    <BookingHistoryContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingHistoryContext.Provider>
  );
};
