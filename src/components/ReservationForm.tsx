import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reservationSchema } from "../schemas/reservationSchema";
import { ReservationFormProps } from "../types/types";

const ReservationForm: React.FC<ReservationFormProps> = () => {
  const [hotels, setHotels] = useState<{ id: string; name: string; rooms: { id: string; type: string; price: number; maxGuests: number }[] }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; type: string; price: number; maxGuests: number }[]>([]);
  const [disabledRooms, setDisabledRooms] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reservationSchema(rooms)),
    defaultValues: {
      hotelId: "",
      roomId: "",
      guests: 1,
      name: "",
      birthDate: new Date(),
      gender: undefined,
      documentType: undefined,
      documentNumber: "",
      email: "",
      phone: "",
      checkIn: new Date(),
      checkOut: new Date(),
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  const selectedHotelId = watch("hotelId");

  useEffect(() => {
    api
      .get("/hotels")
      .then((response) => setHotels(response.data.hotels))
      .catch((error) => console.error("Error al cargar hoteles:", error));

    const storedDisabledRooms = JSON.parse(
      localStorage.getItem("disabledRooms") || "[]"
    );
    setDisabledRooms(storedDisabledRooms);
  }, []);

  useEffect(() => {
    if (!selectedHotelId) return;

    const hotel = hotels.find((h) => h.id === selectedHotelId);
    if (!hotel) {
      setRooms([]);
      return;
    }

    const availableRooms = hotel.rooms
      ? hotel.rooms.filter((room) => !disabledRooms.includes(room.id))
      : [];
    setRooms(availableRooms);
  }, [selectedHotelId, hotels, disabledRooms]);

  const onSubmit = async (data: any) => {
    try {
      await api.post("/reservations", data);

      const selectedRoom = rooms.find((room) => room.id === data.roomId);
      if (
        selectedRoom &&
        selectedRoom.maxGuests !== undefined &&
        data.guests > selectedRoom.maxGuests
      ) {
        toast.error("Número de huéspedes excede el límite permitido.");
        return;
      }

      const updatedDisabledRooms = [...disabledRooms, data.roomId];
      localStorage.setItem("disabledRooms", JSON.stringify(updatedDisabledRooms));

      await api.patch(`/hotels/${data.hotelId}`, {
        rooms: rooms.map((room) =>
          room.id === data.roomId ? { ...room, active: false } : room
        ),
      });
      toast.success(`Reserva confirmada para ${data.name}.`);
      reset();
    } catch (error) {
      toast.error("Error al procesar la reserva.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl"
    >
      <h2 className="text-lg font-semibold mb-4 text-center">Reservar Habitación</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Nombre Completo</label>
          <input {...register("name")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Fecha de Nacimiento</label>
          <input type="date" {...register("birthDate")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.birthDate?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Género</label>
          <select {...register("gender")} className="border p-2 rounded-md w-full">
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          <p className="text-red-500 text-sm">{errors.gender?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Tipo de Documento</label>
          <select {...register("documentType")} className="border p-2 rounded-md w-full">
            <option value="">Seleccione</option>
            <option value="Cédula de Extranjeria">Cédula de Extranjeria</option>
            <option value="Cédula">Cédula</option>
          </select>
          <p className="text-red-500 text-sm">{errors.documentType?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Número de Documento</label>
          <input {...register("documentNumber")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.documentNumber?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Teléfono de Contacto</label>
          <input {...register("phone")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Hotel</label>
          <select {...register("hotelId")} className="border p-2 rounded-md w-full">
            <option value="">Seleccione un hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.hotelId?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Habitación</label>
          <select {...register("roomId")} className="border p-2 rounded-md w-full">
            <option value="">Seleccione una habitación</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.type} - ${room.price} (Máx. {room.maxGuests} huéspedes)
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.roomId?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Cantidad de Huéspedes</label>
          <input type="number" {...register("guests")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.guests?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Fecha de Entrada</label>
          <input type="date" {...register("checkIn")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.checkIn?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Fecha de Salida</label>
          <input type="date" {...register("checkOut", { valueAsDate: true })} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.checkOut?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" {...register("email")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Nombre del Contacto de Emergencia</label>
          <input {...register("emergencyContactName")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.emergencyContactName?.message}</p>
        </div>
        <div>
          <label className="block text-sm">Teléfono del Contacto de Emergencia</label>
          <input {...register("emergencyContactPhone")} className="border p-2 rounded-md w-full" />
          <p className="text-red-500 text-sm">{errors.emergencyContactPhone?.message}</p>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded-md w-full mt-4"
      >
        Confirmar Reserva
      </button>
    </form>
  );
};

export default ReservationForm;
