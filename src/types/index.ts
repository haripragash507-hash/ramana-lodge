export type Role = 'admin' | 'user' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Room {
  id: string;
  type: 'Deluxe' | 'Super Deluxe' | 'Suite';
  price: number;
}