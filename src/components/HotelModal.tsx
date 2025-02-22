import { useEffect } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "../services/api";
import { FaPlus, FaTrash } from "react-icons/fa";
import { hotelSchemaModal } from "../schemas/hotelSchema";
import { HotelModalProps } from "../types/types";

const HotelModal: React.FC<HotelModalProps> = ({ isOpen, onClose, setHotels }) => {
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(hotelSchemaModal),
        defaultValues: {
            name: "",
            location: "",
            rooms: [],
        },
    });

    const { fields: rooms, append, remove } = useFieldArray({
        control,
        name: "rooms",
    });

    useEffect(() => {
        rooms.forEach((_, index) => {
            const baseCost = watch(`rooms.${index}.baseCost`) || 0;
            const taxes = watch(`rooms.${index}.taxes`) || 0;
            const currentPrice = watch(`rooms.${index}.price`);

            const newPrice = baseCost + taxes;
            if (newPrice !== currentPrice) {
                setValue(`rooms.${index}.price`, newPrice);
            }
        });
    }, [rooms, watch, setValue]);

    const createHotel = async (data: any) => {
        try {
            const response = await api.post("/hotels", data);
            setHotels((prev: any) => [...prev, response.data]);
            reset();
            toast.success("Hotel creado exitosamente.");
            onClose();
        } catch (error) {
            toast.error("Hubo un error al crear el hotel.");
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                    <h2 className="text-xl font-bold mb-3">Crear Nuevo Hotel</h2>

                    <form onSubmit={handleSubmit(createHotel)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold">Nombre del Hotel</label>
                                <input type="text" {...register("name")} className="border p-2 rounded-md w-full" />
                                <p className="text-red-500 text-sm">{errors.name?.message}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Ubicación</label>
                                <input type="text" {...register("location")} className="border p-2 rounded-md w-full" />
                                <p className="text-red-500 text-sm">{errors.location?.message}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Habitaciones</h3>
                            <button type="button" onClick={() => append({ id: crypto.randomUUID(), type: "Suite", baseCost: 100, taxes: 20, price: 120, maxGuests: 2 })} className="text-blue-600 hover:text-blue-800 flex items-center">
                                <FaPlus size={14} className="mr-2" /> Agregar
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-64 grid grid-cols-2 gap-4 p-2 border rounded-md">
                            {rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <div key={room.id} className="p-3 bg-gray-50 shadow-md rounded-md">
                                        <label className="block text-sm font-semibold">Tipo</label>
                                        <select {...register(`rooms.${index}.type`)} className="border p-2 w-full">
                                            <option value="Suite">Suite</option>
                                            <option value="Normal">Normal</option>
                                            <option value="Barata">Barata</option>
                                        </select>

                                        <label className="block text-sm font-semibold mt-2">Costo Base</label>
                                        <input type="number" {...register(`rooms.${index}.baseCost`, { valueAsNumber: true })} className="border p-2 rounded-md w-full" />
                                        <p className="text-red-500 text-sm">{(errors.rooms as any)?.[index]?.baseCost?.message}</p>

                                        <label className="block text-sm font-semibold">Impuestos</label>
                                        <input type="number" {...register(`rooms.${index}.taxes`, { valueAsNumber: true })} className="border p-2 rounded-md w-full" />
                                        <p className="text-red-500 text-sm">{(errors.rooms as any)?.[index]?.taxes?.message}</p>

                                        <label className="block text-sm font-semibold">Precio Final</label>
                                        <input type="number" {...register(`rooms.${index}.price`, { valueAsNumber: true })} className="border p-2 rounded-md w-full bg-gray-100" disabled />

                                        <button type="button" onClick={() => remove(index)} className="flex items-center space-x-2 text-red-500 text-sm mt-2">
                                            <FaTrash size={14} />
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center text-gray-500 p-4">
                                    <p>No hay habitaciones agregadas.</p>
                                    <p>Presiona <strong>"Agregar"</strong> para añadir una.</p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="w-full p-3 mt-3 bg-green-600 text-white rounded-md">
                            Crear Hotel
                        </button>
                    </form>

                    <button onClick={onClose} className="w-full p-2 mt-2 bg-gray-500 text-white rounded-md">
                        Cancelar
                    </button>
                </div>
            </div>
        )
    );
};

export default HotelModal;
