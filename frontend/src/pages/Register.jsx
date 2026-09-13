import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);

            navigate("/login");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Registrasi gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-10">

            <div className="w-full max-w-md bg-white border rounded-2xl p-8">

                <h1 className="text-3xl font-bold">
                    Buat Akun
                </h1>

                <p className="text-gray-500 mt-2">
                    Daftar untuk mulai berbelanja.
                </p>

                {message && (
                    <div className="mt-5 bg-red-50 text-red-600 rounded-lg p-3">
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Nama
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nama lengkap"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="nama@email.com"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg py-3 font-medium disabled:opacity-50"
                    >
                        {loading
                            ? "Mendaftarkan..."
                            : "Daftar"}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Sudah punya akun?{" "}

                    <Link
                        to="/login"
                        className="text-black font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </main>
    );
}

export default Register;