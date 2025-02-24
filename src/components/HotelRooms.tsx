import { useState } from "react";
import { useHotelStore } from "../store/useHotelStore";
import ConfirmationModal from "./ConfirmationModal";

const HotelRooms = ({ hotelId }: { hotelId: number }) => {
    const { hotels, toggleRoomStatus } = useHotelStore();
    const hotel = hotels.find((h) => h.id === hotelId.toString());
    const [roomToToggle, setRoomToToggle] = useState<number | null>(null);

    if (!hotel) return <p>Hotel no encontrado</p>;

    const handleConfirmToggle = () => {
        if (roomToToggle !== null) {
            toggleRoomStatus(hotelId, roomToToggle);
            setRoomToToggle(null);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-md shadow-md mt-4">
            <h2 className="text-lg font-semibold">Habitaciones en {hotel.name}</h2>
            <ul className="mt-2 space-y-2">
                {hotel.rooms?.map((room) => (
                    <li key={room.id} className="p-3 bg-white shadow rounded-md flex justify-between">
                        <div>
                            <p>Tipo: {room.type}</p>
                            <p>Precio: ${room.price}</p>
                            <p className={`text-sm ${room.active ? "text-green-600" : "text-red-600"}`}>
                                {room.active ? "Disponible" : "No disponible"}
                            </p>
                        </div>
                        <button
                            onClick={() => setRoomToToggle(Number(room.id))}
                            className={`px-3 py-1 rounded-md ${room.active ? "bg-red-600" : "bg-green-600"
                                } text-white`}
                        >
                            {room.active ? "Deshabilitar" : "Habilitar"}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Modal de Confirmación */}
            <ConfirmationModal
                isOpen={roomToToggle !== null}
                onClose={() => setRoomToToggle(null)}
                onConfirm={handleConfirmToggle}
                title="Confirmar Acción"
                message="¿Estás seguro de que quieres cambiar el estado de esta habitación?"
            />
        </div>
    );
};

export default HotelRooms;
