import { create } from "zustand";
import { Reservation } from "../types/types";

interface ReservationStore {
    reservations: Reservation[];
    addReservation: (reservation: Reservation) => void;
    setReservations: (reservations: Reservation[]) => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
    reservations: [],

    addReservation: (reservation) => {
        set((state) => ({ reservations: [...state.reservations, reservation] }));
    },

    setReservations: (reservations) => {
        set({ reservations });
    },
}));
