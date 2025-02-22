import * as yup from "yup";

export const reservationSchema = (rooms: any[]) =>
    yup.object().shape({
        hotelId: yup.string().required("Debes seleccionar un hotel"),
        roomId: yup.string().required("Debes seleccionar una habitación"),
        guests: yup
            .number()
            .min(1, "Debe haber al menos un huésped")
            .required()
            .test(
                "maxGuests",
                "Número de huéspedes excede el límite permitido",
                function (value) {
                    const selectedRoom = rooms.find(
                        (room) => room.id === this.parent.roomId
                    );
                    return selectedRoom && selectedRoom.maxGuests
                        ? value <= selectedRoom.maxGuests
                        : true;
                }
            ),
        name: yup.string().required("El nombre es obligatorio"),
        birthDate: yup.date().required("La fecha de nacimiento es obligatoria"),
        gender: yup.string().oneOf(["Masculino", "Femenino", "Otro"]).required("El género es obligatorio"),
        documentType: yup.string().oneOf(["DNI", "Pasaporte", "Cédula"]).required("El tipo de documento es obligatorio"),
        documentNumber: yup.string().required("El número de documento es obligatorio"),
        email: yup
            .string()
            .email("El email no es válido")
            .required("El email es obligatorio"),
        phone: yup.string().required("El teléfono es obligatorio"),
        checkIn: yup.date().required("La fecha de entrada es obligatoria"),
        checkOut: yup.date().required("La fecha de salida es obligatoria"),
        emergencyContactName: yup
            .string()
            .required("El nombre del contacto de emergencia es obligatorio"),
        emergencyContactPhone: yup
            .string()
            .required("El teléfono del contacto de emergencia es obligatorio"),
    });