import { Link } from "wouter";

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between">
                <h1 className="text-lg font-bold">Travel Agency</h1>
                <div className="space-x-4">
                    <Link href="/">Inicio</Link>
                    <Link href="/hotels">Hoteles</Link>
                    <Link href="/reservations">Reservas</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
