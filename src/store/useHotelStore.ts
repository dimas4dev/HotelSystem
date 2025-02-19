import { create } from "zustand";

interface Hotel {
    id: number;
    name: string;
    location: string;
    rooms: number;
    price: number;
    active: boolean;
}

interface HotelStore {
    hotels: Hotel[];
    addHotel: (hotel: Hotel) => void;
    updateHotel: (id: number, data: Partial<Hotel>) => void;
}

export const useHotelStore = create<HotelStore>((set) => ({
    hotels: [],
    addHotel: (hotel) => set((state) => ({ hotels: [...state.hotels, hotel] })),
    updateHotel: (id, data) =>
        set((state) => ({
            hotels: state.hotels.map((h) => (h.id === id ? { ...h, ...data } : h)),
        })),
}));
