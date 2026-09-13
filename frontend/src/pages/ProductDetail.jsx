import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);

                setProduct(response.data);
            } catch (error) {
                console.error(error);

                setError("Produk tidak ditemukan");
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [id]);

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-10">
                <p className="text-gray-500">
                    Memuat produk...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-10">
                <p className="text-red-500">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Gambar */}
                <div className="h-[500px] bg-white border rounded-2xl flex items-center justify-center">
                    {product.image ? (
                        <img
                            src={`/images/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain p-8"
                        />
                    ) : (
                        <span className="text-gray-400">
                            Tidak ada gambar
                        </span>
                    )}
                </div>

                {/* Informasi */}
                <div>

                    <p className="text-sm text-gray-500 mb-2">
                        {product.category_name}
                    </p>

                    <h1 className="text-4xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-3xl font-bold mt-6">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>

                    <div className="mt-6">
                        <p className="font-semibold">
                            Stok
                        </p>

                        <p className="text-gray-500">
                            {product.stock} tersedia
                        </p>
                    </div>

                    <div className="mt-8">
                        <p className="font-semibold mb-2">
                            Deskripsi
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            {product.description ||
                                "Tidak ada deskripsi produk."}
                        </p>
                    </div>

                    <div className="flex gap-4 mt-10">

                     <button
    onClick={() => addToCart(product)}
    className="flex-1 border border-black rounded-lg py-3 font-medium hover:bg-gray-100"
>
    Tambah Keranjang
</button>

                        <button className="flex-1 bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800">
                            Beli Sekarang
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default ProductDetail;