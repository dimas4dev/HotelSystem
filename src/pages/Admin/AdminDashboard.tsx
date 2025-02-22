import { Link } from "wouter";

const AdminDashboard = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
            <p className="text-gray-600 mb-4">Administra hoteles y habitaciones desde aquí.</p>
            <div className="space-y-4">
                <Link href="/admin/hotels">
                    <button className="w-full p-3 bg-blue-600 text-white rounded-md">
                        Gestionar Hoteles
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
