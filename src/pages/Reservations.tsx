import { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { FaTrash, FaTimes } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // 📌 Para formatear en español
import { Hotel, Reservation } from "../types/types";

const Reservations = () => {
    const { reservations, setReservations } = useReservationStore();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [filterHotel, setFilterHotel] = useState<string>("");
    const [filterDate, setFilterDate] = useState<string>("");

    useEffect(() => {
        if (reservations.length === 0) {
            api.get("/reservations").then((response) => {
                if (Array.isArray(response.data.reservations)) {
                    setReservations(response.data.reservations);
                } else {
                    console.error("❌ La API no devolvió un array de reservas.");
                    setReservations([]);
                }
            }).catch((error) => {
                console.error("❌ Error al obtener las reservas:", error);
                setReservations([]);
            });
        }

        api.get("/hotels").then((response) => {
            setHotels(response.data.hotels);
        });
    }, []);

    const getHotelName = (hotelId: string) => {
        const hotel = hotels.find((h) => h.id === hotelId);
        return hotel ? hotel.name : "Hotel Desconocido";
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
    };

    const deleteReservation = async (reservationId: string, roomId: string) => {
        try {
            await api.delete(`/reservations/${reservationId}`);

            setReservations(reservations.filter((res: Reservation) => res.id !== reservationId));
            const storedDisabledRooms = JSON.parse(localStorage.getItem("disabledRooms") || "[]");
            const updatedDisabledRooms = storedDisabledRooms.filter((id: string) => id !== roomId);
            localStorage.setItem("disabledRooms", JSON.stringify(updatedDisabledRooms));

            toast.success("✅ Reserva eliminada correctamente.");
            setSelectedReservation(null);
        } catch (error) {
            console.error("❌ Error al eliminar la reserva:", error);
            toast.error("No se pudo eliminar la reserva.");
        }
    };



    const filteredReservations = reservations.filter((res) => {
        return (
            (filterHotel ? res.hotelId === filterHotel : true) &&
            (filterDate ? res.checkIn <= filterDate && res.checkOut >= filterDate : true)
        );
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Reservas Realizadas</h1>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <select
                    value={filterHotel}
                    onChange={(e) => setFilterHotel(e.target.value)}
                    className="border p-2 rounded-md w-full md:w-1/3"
                >
                    <option value="">Todos los hoteles</option>
                    {hotels.map((hotel) => (
                        <option key={hotel.id} value={hotel.id}>
                            {hotel.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded-md w-full md:w-1/3"
                />
            </div>

            {selectedReservation ? (
                <div className="p-6 bg-gray-100 rounded-lg shadow-lg animate-fadeIn">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Detalles de la Reserva</h2>
                        <button
                            onClick={() => setSelectedReservation(null)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <p><strong>Nombre:</strong> {selectedReservation.name}</p>
                    <p><strong>Hotel:</strong> {getHotelName(selectedReservation.hotelId)}</p>
                    <p><strong>Entrada:</strong> {formatDate(selectedReservation.checkIn)}</p>
                    <p><strong>Salida:</strong> {formatDate(selectedReservation.checkOut)}</p>
                    <p><strong>Huéspedes:</strong> {selectedReservation.guests}</p>

                    <button
                        onClick={() => deleteReservation(selectedReservation.id, selectedReservation.roomId)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md flex items-center space-x-2"
                    >
                        <FaTrash size={16} />
                        <span>Eliminar Reserva</span>
                    </button>
                </div>
            ) : (
                <>
                    {filteredReservations.length === 0 ? (
                        <p className="text-gray-600 text-center">No hay reservas registradas.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                            {filteredReservations.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => setSelectedReservation(res)}
                                    className="p-6 bg-white shadow-md rounded-md cursor-pointer hover:bg-gray-100 flex flex-col justify-between transition-transform transform hover:scale-105"
                                >
                                    <h2 className="font-semibold text-lg">{res.name}</h2>
                                    <p className="text-sm text-gray-600">{getHotelName(res.hotelId)}</p>

                                    <div className="mt-4">
                                        <p className="text-sm"><strong>Entrada:</strong> {formatDate(res.checkIn)}</p>
                                        <p className="text-sm"><strong>Salida:</strong> {formatDate(res.checkOut)}</p>
                                    </div>

                                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                                        Ver Detalles
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Reservations;
