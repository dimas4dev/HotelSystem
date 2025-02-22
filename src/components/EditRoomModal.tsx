import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { FaSave, FaTimes } from "react-icons/fa";
import { roomSchema } from "../schemas/roomSchema";
import { EditRoomModalProps } from "../types/types";

const EditRoomModal = ({ isOpen, onClose, roomData, hotelId, updateRoomList }: EditRoomModalProps) => {
    const [localRoomData, setLocalRoomData] = useState(roomData || {});

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(roomSchema),
        defaultValues: roomData,
    });

    useEffect(() => {
        if (roomData) {
            setLocalRoomData(roomData);
        }
    }, [roomData]);

    useEffect(() => {
        const subscription = watch((values) => {
            if (values?.baseCost !== undefined && values?.taxes !== undefined) {
                const newPrice = values.baseCost + values.taxes;
                setValue("price", newPrice);
                setLocalRoomData((prev: any) => ({
                    ...prev,
                    price: newPrice
                }));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const updateRoom = async (data: any) => {
        try {
            const response = await api.patch(`/hotels/${hotelId}/rooms/${roomData.id}`, {
                ...roomData,
                ...data,
            });
            updateRoomList(response.data);
            toast.success("Habitación actualizada correctamente.");
            onClose();
        } catch (error) {
            toast.error("Hubo un error al actualizar la habitación.");
        }
    };

    const toggleRoomStatus = async () => {
        try {
            const updatedRoom = { ...roomData, active: !roomData.active };
            const response = await api.patch(`/hotels/${hotelId}/rooms/${roomData.id}`, updatedRoom);
            const JsonResponse = JSON.parse(response.data._bodyText);
            if (!JsonResponse.id) {
                throw new Error("La API no devolvió la habitación actualizada correctamente.");
            }

            const disabledRooms = JSON.parse(localStorage.getItem("disabledRooms") || "[]");
            if (!updatedRoom.active) {
                localStorage.setItem("disabledRooms", JSON.stringify([...disabledRooms, updatedRoom.id]));
            } else {
                localStorage.setItem("disabledRooms", JSON.stringify(disabledRooms.filter((id: any) => id !== updatedRoom.id)));
            }

            updateRoomList(JsonResponse);
            toast.success(`La habitación ha sido ${updatedRoom.active ? "habilitada" : "deshabilitada"}.`);
            setLocalRoomData(updatedRoom);
        } catch (error) {
            toast.error("No se pudo cambiar el estado de la habitación.");
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-white/50 backdrop-blur-md">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Editar Habitación</h2>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(updateRoom)} className="space-y-4">
                        <label className="block text-sm font-semibold">Tipo de Habitación</label>
                        <select {...register("type")} className="border p-2 rounded-md w-full">
                            <option value="Suite">Suite</option>
                            <option value="Normal">Normal</option>
                            <option value="Barata">Barata</option>
                        </select>
                        <p className="text-red-500 text-sm">{errors.type?.message?.toString()}</p>

                        <label className="block text-sm font-semibold">Costo Base</label>
                        <input
                            type="number"
                            {...register("baseCost", { valueAsNumber: true })}
                            className="border p-2 rounded-md w-full"
                        />
                        <p className="text-red-500 text-sm">{errors.baseCost?.message?.toString()}</p>

                        <label className="block text-sm font-semibold">Impuestos</label>
                        <input
                            type="number"
                            {...register("taxes", { valueAsNumber: true })}
                            className="border p-2 rounded-md w-full"
                        />
                        <p className="text-red-500 text-sm">{errors.taxes?.message?.toString()}</p>

                        <label className="block text-sm font-semibold">Precio Final</label>
                        <input
                            type="number"
                            {...register("price")}
                            value={localRoomData?.price || 0}
                            disabled
                            className="border p-2 rounded-md w-full bg-gray-100"
                        />
                        <p className="text-red-500 text-sm">{errors.price?.message?.toString()}</p>

                        <label className="block text-sm font-semibold">Máximo de Huéspedes</label>
                        <input
                            type="number"
                            {...register("maxGuests")}
                            className="border p-2 rounded-md w-full"
                        />
                        <p className="text-red-500 text-sm">{errors.maxGuests?.message?.toString()}</p>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm font-semibold">Estado de la Habitación</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={localRoomData?.active}
                                    onChange={toggleRoomStatus}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div>
                            </label>
                        </div>

                        <div className="flex justify-end mt-4">
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

export default EditRoomModal;
