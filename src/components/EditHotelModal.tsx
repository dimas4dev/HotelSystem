import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { FaSave, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import { hotelSchema } from "../schemas/hotelSchema";
import { EditHotelModalProps } from "../types/types";

const EditHotelModal: React.FC<EditHotelModalProps> = ({ isOpen, onClose, hotelData, updateHotelList }) => {

    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(hotelSchema),
        defaultValues: hotelData,
    });

    const { fields: rooms, append, remove } = useFieldArray({
        control,
        name: "rooms",
    });

    useEffect(() => {
        if (hotelData) {
            reset(hotelData);
        }
    }, [hotelData, reset]);

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

    const updateHotel = async (data: any) => {
        try {
            const response = await api.patch(`/hotels/${hotelData.id}`, data);
            updateHotelList(response.data.hotel);
            toast.success("Hotel actualizado correctamente.");
            onClose();
        } catch (error) {
            toast.error("Hubo un error al actualizar el hotel.");
        }
    };

    const addRoom = () => {
        append({
            id: crypto.randomUUID(),
            type: "Suite",
            baseCost: 100,
            taxes: 20,
            price: 120,
            maxGuests: 2,
            active: true,
        });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-white/50 backdrop-blur-md">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Editar Hotel</h2>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(updateHotel)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold">Nombre del Hotel</label>
                                <input type="text" {...register("name")} className="border p-2 rounded-md w-full" />
                                <p className="text-red-500 text-sm">{errors.name?.message?.toString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Ubicación</label>
                                <input type="text" {...register("location")} className="border p-2 rounded-md w-full" />
                                <p className="text-red-500 text-sm">{errors.location?.message?.toString()}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Habitaciones</h3>
                            <button type="button" onClick={addRoom} className="text-blue-600 hover:text-blue-800 flex items-center">
                                <FaPlus size={14} className="mr-2" /> Agregar
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-64 grid grid-cols-2 gap-4 p-2 border rounded-md">
                            {rooms.map((room, index) => (
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
                            ))}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button type="button" onClick={onClose} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                                <FaTimes size={16} />
                                <span>Cancelar</span>
                            </button>

                            <button type="submit" className="flex items-center space-x-2 text-green-600 hover:text-green-800">
                                <FaSave size={16} />
                                <span>Guardar Cambios</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default EditHotelModal;
