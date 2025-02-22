import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { FaSave, FaTimes, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { roomSchema } from "../schemas/roomSchema";
import { EditRoomModalProps } from "../types/types";

const EditRoomModal = ({ isOpen, onClose, roomData, hotelId, updateRoomList }: EditRoomModalProps) => {
    const [localRoomData, setLocalRoomData] = useState(roomData);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(roomSchema),
        defaultValues: roomData,
    });

    useEffect(() => {
        const subscription = watch((values) => {
            if (values?.baseCost !== undefined && values?.taxes !== undefined) {
                setValue("price", values.baseCost + values.taxes);
                setLocalRoomData((prev: any) => ({
                    ...prev,
                    price: values.baseCost + values.taxes
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
            console.error("❌ Error al actualizar la habitación:", error);
            toast.error("Hubo un error al actualizar la habitación.");
        }
    };

    const toggleRoomStatus = async () => {
        try {
            const updatedRoom = { ...roomData, active: !roomData.active };
            const response = await api.patch(`/hotels/${hotelId}/rooms/${roomData.id}`, updatedRoom);
            const JsonResponse = JSON.parse(response.config.data);

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

        } catch (error) {
            console.error("❌ Error al cambiar el estado de la habitación:", error);
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
                            value={localRoomData.price}
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

                        <div className="flex justify-between mt-4">
                            <div className="flex flex-col items-center space-y-2">
                                <span className="text-sm font-semibold text-center">Estado de la Habitación</span>
                                <button type="button" onClick={toggleRoomStatus} className="text-gray-600 hover:text-gray-900">
                                    {roomData?.active ? <FaToggleOn size={24} className="text-green-500" /> : <FaToggleOff size={24} className="text-gray-400" />}
                                </button>
                            </div>

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
