import axios from "axios";

const API_URL = "https://api.example.com"; // Cambiar cuando tengamos el backend

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
