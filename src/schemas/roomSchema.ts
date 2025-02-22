import * as yup from "yup";

export const roomSchema = yup.object().shape({
    type: yup.string().oneOf(["Suite", "Normal", "Barata"], "Tipo de habitación inválido").required(),
    baseCost: yup.number().positive("El costo base debe ser un número positivo").required("El costo base es obligatorio"),
    taxes: yup.number().min(0, "Los impuestos no pueden ser negativos").required("Los impuestos son obligatorios"),
    price: yup.number().positive().required(),
    maxGuests: yup.number().positive("Debe ser un número positivo").required("Debe especificar un número de huéspedes"),
});