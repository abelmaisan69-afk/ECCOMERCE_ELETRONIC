import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { totalItems } = useCart();
    const { user, isLoggedIn, logout } = useAuth();

    return (
        <nav className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
                
                <Link
                    to="/"
                    className="text-xl font-bold"
                >
                    ELECTRO
                </Link>

                <div className="flex-1 max-w-xl">
                    <input
                        type="text"
                        placeholder="Cari produk elektronik..."
                        className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div className="flex items-center gap-4">
                    
                    <button className="text-sm">
                        Kategori
                    </button>

                    {isLoggedIn ? (
                        <>
                            <span className="text-sm font-medium">
                                Halo, {user.name}
                            </span>

                            <button
                                onClick={logout}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="text-sm"
                            >
                                Daftar
                            </Link>
                        </>
                    )}

                    <Link
                        to="/cart"
                        className="border rounded-lg px-4 py-2 text-sm"
                    >
                        Keranjang ({totalItems})
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;