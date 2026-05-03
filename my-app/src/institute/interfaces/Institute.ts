export interface Institute {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  establishedYear?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
