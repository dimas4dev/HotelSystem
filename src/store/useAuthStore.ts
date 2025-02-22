import { create } from "zustand";
import { AuthStore } from "../types/types";

export const useAuthStore = create<AuthStore>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),

    login: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    logout: (navigate) => {
        localStorage.removeItem("user");
        set({ user: null });
        navigate("/login");
    },
}));
