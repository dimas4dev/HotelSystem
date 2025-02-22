import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLocation } from "wouter";

const Login = () => {
    const { login } = useAuthStore();
    const [, navigate] = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        let user = null;

        if (email === "admin@example.com" && password === "admin123") {
            user = { id: "1", name: "Administrador", email, role: "admin" };
        } else if (email === "client@example.com" && password === "client123") {
            user = { id: "2", name: "Cliente", email, role: "client" };
        }

        if (user) {
            login(user);
            navigate(user.role === "admin" ? "/admin" : "/hotels");
        } else {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl font-bold mb-4">Iniciar Sesión</h1>

            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded-md mb-2"
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded-md mb-2"
            />

            <button onClick={handleLogin} className="w-full p-3 bg-blue-600 text-white rounded-md">
                Iniciar Sesión
            </button>
        </div>
    );
};

export default Login;
