import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Checkout() {
    const navigate = useNavigate();

const {
    cart,
    totalPrice,
    clearCart,
} = useCart();
    const { isLoggedIn, user } = useAuth();

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (cart.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!address.trim()) {
            setMessage("Alamat wajib diisi.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Untuk sementara kita tes tampilan checkout dahulu.
           const token = localStorage.getItem("token");

const response = await api.post(
    "/orders",
    {
        address,
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);

clearCart();

alert(
    `Pesanan #${response.data.order.id} berhasil dibuat!`
);

navigate("/");

        } catch (error) {
            console.error(error);

            setMessage("Checkout gagal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold">
                Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                <div className="lg:col-span-2">

                    <div className="bg-white border rounded-xl p-6">
                        <h2 className="text-xl font-bold">
                            Informasi Pengiriman
                        </h2>

                        <div className="mt-5">
                            <label className="block text-sm font-medium mb-2">
                                Nama
                            </label>

                            <input
                                type="text"
                                value={user.name}
                                disabled
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                            />
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                            />
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-medium mb-2">
                                Alamat Pengiriman
                            </label>

                            <textarea
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                                placeholder="Masukkan alamat lengkap..."
                                rows="5"
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        {message && (
                            <div className="mt-4 bg-red-50 text-red-600 rounded-lg p-3">
                                {message}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading
                                ? "Memproses..."
                                : "Buat Pesanan"}
                        </button>
                    </div>

                </div>

                <div className="bg-white border rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-bold">
                        Ringkasan Pesanan
                    </h2>

                    <div className="mt-6 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {item.quantity} × Rp{" "}
                                        {Number(
                                            item.price
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <p className="font-medium">
                                    Rp{" "}
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toLocaleString("id-ID")}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-6 pt-6 flex justify-between">
                        <span className="font-medium">
                            Total
                        </span>

                        <span className="font-bold text-xl">
                            Rp{" "}
                            {totalPrice.toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default Checkout;