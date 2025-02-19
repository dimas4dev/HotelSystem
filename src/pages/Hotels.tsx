import { useHotelStore } from "../store/useHotelStore";

const Hotels = () => {
    const { hotels } = useHotelStore();

    return (
        <div>
            <h1 className="text-xl font-bold">Hoteles</h1>
            <ul className="mt-4 space-y-2">
                {hotels.map((hotel) => (
                    <li key={hotel.id} className="p-4 bg-white shadow-md rounded-md">
                        <h2 className="font-semibold">{hotel.name}</h2>
                        <p>Ubicación: {hotel.location}</p>
                        <p>Habitaciones: {hotel.rooms}</p>
                        <p>Precio: ${hotel.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Hotels;
