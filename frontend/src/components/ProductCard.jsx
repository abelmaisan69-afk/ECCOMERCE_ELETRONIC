import { Link } from "react-router";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    return (
        <div className="border rounded-lg p-4 bg-white">

            <Link to={`/products/${product.id}`}>
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">

                    {product.image ? (
                        <img
                            src={`/images/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <span className="text-gray-400">
                            Tidak ada gambar
                        </span>
                    )}

                </div>
            </Link>

            <p className="text-sm text-gray-500">
                {product.category_name}
            </p>

            <Link to={`/products/${product.id}`}>
                <h2 className="font-semibold text-lg mt-1 hover:underline">
                    {product.name}
                </h2>
            </Link>

            <p className="font-bold text-xl mt-2">
                Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            <p className="text-sm text-gray-500 mt-1">
                Stok: {product.stock}
            </p>

            <div className="flex gap-2 mt-4">

               <button
    onClick={() => addToCart(product)}
    className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
>
    Tambah Keranjang
</button>

                <Link
                    to={`/products/${product.id}`}
                    className="flex-1 rounded-lg py-2 bg-black text-white text-center hover:bg-gray-800"
                >
                    Beli
                </Link>

            </div>

        </div>
    );
}

export default ProductCard;