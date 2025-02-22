import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ Error en la API:", error.response?.data || error.message);
        toast.error("Hubo un error con la solicitud. Inténtalo nuevamente.");
        return Promise.reject(error);
    }
);
