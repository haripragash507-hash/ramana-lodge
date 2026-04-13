import React, { createContext, useState, useEffect, ReactNode } from 'react';

import { Room, RoomContextType } from '../interfaces';

const defaultRooms: Room[] = [
  {
    id: 1,
    badge: 'CABIN',
    name: 'Cozy Cabin Room',
    price: 250,
    capacity: 2,
    imageUrls: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=600&q=80'],
    description: 'Nestled in the pines, this intimate cabin features a stone fireplace, handcrafted log bed, and private porch.',
    isFreeCancellation: true,
  },
  {
    id: 2,
    badge: 'SUITE',
    name: 'The Grand Alpine Suite',
    price: 450,
    capacity: 4,
    imageUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80'],
    description: 'Our premium offering with panoramic mountain views, a private hot tub, and spacious timber-framed living area.',
    isFreeCancellation: false,
  }
];


export const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if there's saved data in localStorage, otherwise use defaults
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('lodge_rooms_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved rooms", e);
      }
    }
    return defaultRooms;
  });

  // Automatically save to localStorage whenever rooms array changes
  useEffect(() => {
    localStorage.setItem('lodge_rooms_data', JSON.stringify(rooms));
  }, [rooms]);

  const updateRoom = (id: number, updatedData: Partial<Room>) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === id ? { ...room, ...updatedData } : room
      )
    );
  };

  const addRoom = (newRoom: Omit<Room, 'id'>) => {
    setRooms(prevRooms => {
      const newId = prevRooms.length > 0 ? Math.max(...prevRooms.map(r => r.id)) + 1 : 1;
      return [...prevRooms, { ...newRoom, id: newId } as Room];
    });
  };

  const deleteRoom = (id: number) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
  };

  return (
    <RoomContext.Provider value={{ rooms, updateRoom, addRoom, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
};
