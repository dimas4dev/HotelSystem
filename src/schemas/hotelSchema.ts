import * as yup from "yup";

export const hotelSchema = yup.object().shape({
    name: yup.string().required("El nombre del hotel es obligatorio"),
    location: yup.string().required("La ubicación es obligatoria"),
    rooms: yup.array().of(
        yup.object().shape({
            type: yup.string().oneOf(["Suite", "Normal", "Barata"], "Tipo de habitación inválido").required(),
            baseCost: yup.number().positive("Debe ser un número positivo").required("El costo base es obligatorio"),
            taxes: yup.number().min(0, "Los impuestos no pueden ser negativos").required("Los impuestos son obligatorios"),
            price: yup.number().positive().required(),
            maxGuests: yup.number().positive().required("Debe especificar un número de huéspedes"),
        })
    ).min(1, "Debe agregar al menos una habitación"),
});

export const hotelSchemaForm = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    location: yup.string().required("La ubicación es obligatoria"),
    rooms: yup.number().min(1, "Debe tener al menos 1 habitación").required(),
    price: yup.number().min(10, "El precio mínimo es $10").required(),
});

export const hotelSchemaModal = yup.object().shape({
    name: yup.string().required("El nombre del hotel es obligatorio"),
    location: yup.string().required("La ubicación es obligatoria"),
    rooms: yup.array().of(
        yup.object().shape({
            id: yup.string().required(),
            type: yup.string().oneOf(["Suite", "Normal", "Barata"], "Tipo de habitación inválido").required(),
            baseCost: yup.number().positive("Debe ser un número positivo").required("El costo base es obligatorio"),
            taxes: yup.number().min(0, "Los impuestos no pueden ser negativos").required("Los impuestos son obligatorios"),
            price: yup.number().positive().required(),
            maxGuests: yup.number().positive("Debe ser un número positivo").required("Debe especificar un número de huéspedes"),
        })
    ).min(1, "Debe agregar al menos una habitación"),
});