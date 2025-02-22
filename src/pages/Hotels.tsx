import { useEffect, useState } from "react";
import { api } from "../services/api";
import ReservationForm from "../components/ReservationForm";
import { Hotel } from "../types/types";

const Hotels = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

    useEffect(() => {
        api.get("/hotels").then((response) => {
            const activeHotels = response.data.hotels.filter((hotel: Hotel) => hotel.active);
            setHotels(activeHotels);
        });
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Lista de Hoteles</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                    <div
                        key={hotel.id}
                        className="p-6 bg-white shadow-md rounded-md text-center flex flex-col justify-between"
                    >
                        <h2 className="font-semibold text-lg">{hotel.name}</h2>
                        <p className="text-gray-600 text-sm mb-4">{hotel.location}</p>

                        <button
                            onClick={() => setSelectedHotel(hotel.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-auto"
                        >
                            Reservar
                        </button>
                    </div>
                ))}
            </div>

            {selectedHotel && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-center">Reservar en {hotels.find(h => h.id === selectedHotel)?.name}</h2>
                    <ReservationForm hotelId={selectedHotel} />
                </div>
            )}
        </div>
    );
};

export default Hotels;
