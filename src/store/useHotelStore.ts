import { create } from "zustand";
import { toast } from "react-toastify";
import { Hotel } from "../types/types";


interface HotelStore {
    hotels: Hotel[];
    addHotel: (hotel: Hotel) => void;
    updateHotel: (id: number, data: Partial<Hotel>) => void;
    toggleHotelStatus: (id: number) => void;
    toggleRoomStatus: (hotelId: number, roomId: number) => void;
}

export const useHotelStore = create<HotelStore>((set, get) => ({
    hotels: [],

    addHotel: (hotel) => set((state) => ({ hotels: [...state.hotels, hotel] })),

    updateHotel: (id, data) =>
        set((state) => ({
            hotels: state.hotels.map((h) => (h.id === id ? { ...h, ...data } : h)),
        })),

    toggleHotelStatus: (id) => {
        set((state) => {
            const updatedHotels = state.hotels.map((h) =>
                h.id === id ? { ...h, active: !h.active } : h
            );
            return { hotels: updatedHotels };
        });

        const hotel = get().hotels.find((h) => h.id === id);
        if (hotel) {
            toast.success(`El hotel ${hotel.name} ha sido ${hotel.active ? "activado" : "deshabilitado"}`);
        }
    },

    toggleRoomStatus: (hotelId, roomId) => {
        set((state) => {
            const updatedHotels = state.hotels.map((hotel) =>
                hotel.id === hotelId
                    ? {
                        ...hotel,
                        rooms: hotel.rooms.map((room) =>
                            room.id === roomId ? { ...room, active: !room.active } : room
                        ),
                    }
                    : hotel
            );
            return { hotels: updatedHotels };
        });

        const hotel = get().hotels.find((h) => h.id === hotelId);
        const room = hotel?.rooms.find((r) => r.id === roomId);

        if (hotel && room) {
            toast.success(`La habitación "${room.type}" en "${hotel.name}" ha sido ${room.active ? "habilitada" : "deshabilitada"}`);
        }
    },
}));
