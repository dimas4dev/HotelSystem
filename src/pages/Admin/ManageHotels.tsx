import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import HotelModal from "../../components/HotelModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditHotelModal from "../../components/EditHotelModal";
import EditRoomModal from "../../components/EditRoomModal";
import { Hotel } from "../../types/types";

const ManageHotels = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [hotelToEdit, setHotelToEdit] = useState<Hotel | null>(null);
    const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState(null);
    const [selectedHotelId, setSelectedHotelId] = useState<string>("");

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await api.get("/hotels");
            setHotels(response.data.hotels);
        } catch (error) {
            toast.error("Hubo un error al cargar los hoteles.");
        }
    };

    const handleEditHotel = (hotel: Hotel) => {
        setHotelToEdit(hotel);
        setIsEditModalOpen(true);
    };

    const handleEditRoom = (hotelId: any, room: any) => {
        setSelectedHotelId(hotelId);
        setRoomToEdit(room);
        setIsEditRoomModalOpen(true);
    };

    const updateHotelList = (updatedHotel: Hotel) => {
        setHotels((prevHotels) =>
            prevHotels.map((hotel) => (hotel.id === updatedHotel.id ? updatedHotel : hotel))
        );
    };

    const updateRoomList = (updatedRoom:any) => {
        setHotels((prevHotels) =>
            prevHotels.map((hotel) =>
                hotel.id === selectedHotelId
                    ? {
                        ...hotel,
                        rooms: hotel.rooms?.map((room) =>
                            room.id === updatedRoom.id ? updatedRoom : room
                        ),
                    }
                    : hotel
            )
        );
    };

    const deleteHotel = async () => {
        if (!hotelToDelete) return;

        try {
            await api.delete(`/hotels/${hotelToDelete}`);
            setHotels(hotels.filter((hotel) => hotel.id !== hotelToDelete));
            toast.success("Hotel eliminado correctamente.");
        } catch (error) {
            toast.error("Hubo un error al eliminar el hotel.");
        }

        setHotelToDelete(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Gestión de Hoteles</h1>

            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full p-2 bg-blue-600 text-white rounded-md mb-4"
            >
                Agregar Nuevo Hotel
            </button>

            {hotels.length === 0 ? (
                <p className="text-gray-500">No hay hoteles registrados.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className="p-4 bg-gray-50 shadow-md rounded-md relative">
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button onClick={() => handleEditHotel(hotel)} className="p-2 bg-yellow-500 text-white rounded-md">
                                    <FaEdit size={16} />
                                </button>
                                <button onClick={() => setHotelToDelete(hotel.id)} className="p-2 bg-red-500 text-white rounded-md">
                                    <FaTrash size={16} />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold">{hotel.name}</h3>
                            <p className="text-sm text-gray-600">Ubicación: {hotel.location}</p>

                            <h4 className="mt-2 text-sm font-semibold">Habitaciones</h4>
                            {hotel.rooms && Array.isArray(hotel.rooms) ? (
                                <ul className="mt-2 space-y-2">
                                    {hotel.rooms.map((room) => (
                                        <li key={room.id} className="p-2 bg-white shadow rounded-md flex justify-between items-center">
                                            <div>
                                                <p className="text-sm">{room.type} - <strong>${room.price}</strong></p>
                                                <p className="text-xs text-gray-500">Costo Base: ${room.baseCost}, Impuestos: ${room.taxes}</p>
                                                <p className="text-xs text-gray-500">Máx. {room.maxGuests} huéspedes</p>
                                                <p className={`text-xs ${room.active ? "text-green-600" : "text-red-600"}`}>
                                                    {room.active ? "Disponible" : "No disponible"}
                                                </p>
                                            </div>

                                            {/* 🔹 Agregar botón de edición de habitación */}
                                            <button
                                                onClick={() => handleEditRoom(hotel.id, room)}
                                                className="p-2 text-gray-600 hover:text-gray-900"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No hay habitaciones registradas.</p>
                            )}

                        </div>
                    ))}
                </div>

            )}

            <HotelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setHotels={setHotels}
            />

            <ConfirmationModal
                isOpen={hotelToDelete !== null}
                onClose={() => setHotelToDelete(null)}
                onConfirm={deleteHotel}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este hotel? Esta acción no se puede deshacer."
                confirmText="Eliminar"
            />

            <EditHotelModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                hotelData={hotelToEdit}
                updateHotelList={updateHotelList}
            />

            <EditRoomModal
                isOpen={isEditRoomModalOpen}
                onClose={() => setIsEditRoomModalOpen(false)}
                roomData={roomToEdit}
                hotelId={selectedHotelId}
                updateRoomList={updateRoomList}
            />

        </div>
    );
};

export default ManageHotels;
