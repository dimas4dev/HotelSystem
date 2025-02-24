export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
}

export interface EditHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelData: any;
    updateHotelList: (hotel: any) => void;
}


export interface EditRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomData: any;
    hotelId: string;
    updateRoomList: (updatedRoom: any) => void;
}

export interface HotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    setHotels: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface Room {
    id: string;
    type: string;
    baseCost: number;
    taxes: number;
    price: number;
    maxGuests: number;
    active: boolean;
}

export interface Hotel {
    id: string;
    name: string;
    location?: string;
    rooms?: Room[];
    price?: number;
    active?: boolean;
}

export interface Reservation {
    id: string;
    name: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    hotelId: string;
    roomId: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "client";
}

export interface AuthStore {
    user: User | null;
    login: (user: User) => void;
    logout: (navigate: (path: string) => void) => void;
}

export interface ReservationFormProps {
    hotelId: string;
}



