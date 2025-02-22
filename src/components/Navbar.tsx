import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const [, navigate] = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout(navigate);
        setIsModalOpen(false);
    };

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between">
                <h1 className="text-lg font-bold">Sistema de Hoteles</h1>
                <div className="space-x-4">
                    {user ? (
                        <>
                            {user.role === "admin" && <Link href="/admin">Panel Admin</Link>}
                            <Link href="/hotels">Hoteles</Link>
                            <Link href="/reservations">Reservas</Link>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="ml-4 bg-red-500 px-3 py-1 rounded-md"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link href="/login">Iniciar Sesión</Link>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleLogout}
                title="Cerrar Sesión"
                message="¿Estás seguro de que quieres cerrar sesión?"
                confirmText="Cerrar Sesión"
            />
        </nav>
    );
};

export default Navbar;
