import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHotelStore } from "../store/useHotelStore";
import { hotelSchemaForm } from "../schemas/hotelSchema";

const HotelForm = () => {
    const { addHotel } = useHotelStore();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(hotelSchemaForm),
    });

    const onSubmit = (data: any) => {
        addHotel({ ...data, id: Date.now(), active: true });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-md rounded-md w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4 text-center">Agregar Hotel</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">Nombre</label>
                    <input {...register("name")} className="border p-2 w-full rounded-md" />
                    <p className="text-red-500 text-sm">{errors.name?.message}</p>
                </div>

                <div>
                    <label className="block text-sm">Ubicación</label>
                    <input {...register("location")} className="border p-2 w-full rounded-md" />
                    <p className="text-red-500 text-sm">{errors.location?.message}</p>
                </div>

                <div>
                    <label className="block text-sm">Precio por noche ($)</label>
                    <input type="number" {...register("price")} className="border p-2 w-full rounded-md" />
                    <p className="text-red-500 text-sm">{errors.price?.message}</p>
                </div>

                <div>
                    <label className="block text-sm">Número de Habitaciones</label>
                    <input type="number" {...register("rooms")} className="border p-2 w-full rounded-md" />
                    <p className="text-red-500 text-sm">{errors.rooms?.message}</p>
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md w-1/2">
                    Guardar Hotel
                </button>
            </div>
        </form>
    );
};

export default HotelForm;
