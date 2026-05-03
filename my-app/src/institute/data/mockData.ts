import { Institute } from '../interfaces/Institute';

export const mockInstitutes: Institute[] = [
  {
    id: "1",
    name: "Global Tech Institute",
    email: "contact@globaltech.edu",
    phone: "+1-555-0123",
    address: "123 Innovation Drive, Tech City, TC 10010",
    website: "https://globaltech.edu",
    establishedYear: 1995,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Creative Arts Academy",
    email: "admissions@creativearts.edu",
    phone: "+1-555-0456",
    address: "456 Design Blvd, Studio District, SD 20020",
    website: "https://creativearts.edu",
    establishedYear: 2005,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
