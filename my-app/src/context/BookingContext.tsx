import React, { createContext, useState, ReactNode } from 'react';

import { Booking, BookingContextType } from '../interfaces';


export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize with some mock data so the dashboard isn't completely empty
    const [bookings, setBookings] = useState<Booking[]>([
        { id: 101, guestName: 'Alice Johnson', phone: '+1 234-567-8901', date: '2023-12-01', roomName: 'Cozy Cabin Room' },
        { id: 102, guestName: 'Bob Smith', phone: '+1 987-654-3210', date: '2023-12-05', roomName: 'The Grand Alpine Suite' },
        { id: 103, guestName: 'Charlie Davis', phone: '+1 555-123-4567', date: '2023-12-10', roomName: 'Mountain View Lodge' },
    ]);

    const addBooking = (booking: Omit<Booking, 'id'>) => {
        const newBooking = {
            ...booking,
            id: Date.now(), // Generate a unique ID for the booking
        };
        setBookings((prevBookings) => [...prevBookings, newBooking]);
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking }}>
            {children}
        </BookingContext.Provider>
    );
};