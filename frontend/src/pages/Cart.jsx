import { Link } from "react-router";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        totalPrice,
    } = useCart();

    if (cart.length === 0) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold">
                    Keranjang
                </h1>

                <div className="mt-10 text-center">
                    <p className="text-gray-500">
                        Keranjang masih kosong.
                    </p>

                    <Link
                        to="/"
                        className="inline-block mt-5 bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Belanja Sekarang
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-8">
                Keranjang
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Produk */}
                <div className="lg:col-span-2 space-y-4">

                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border rounded-xl p-5"
                        >

                            <div className="flex gap-5">

                                <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`/images/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            No Image
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1">

                                    <p className="text-sm text-gray-500">
                                        {item.category_name}
                                    </p>

                                    <h2 className="font-bold text-lg">
                                        {item.name}
                                    </h2>

                                    <p className="font-semibold mt-2">
                                        Rp{" "}
                                        {Number(item.price).toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>

                                    <div className="flex items-center gap-3 mt-4">

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="border rounded px-3 py-1"
                                        >
                                            -
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="border rounded px-3 py-1"
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="text-red-500 ml-4"
                                        >
                                            Hapus
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Ringkasan */}
                <div className="bg-white border rounded-xl p-6 h-fit">

                    <h2 className="text-xl font-bold">
                        Ringkasan Pesanan
                    </h2>

                    <div className="flex justify-between mt-6">
                        <span>Total</span>

                        <span className="font-bold">
                            Rp{" "}
                            {totalPrice.toLocaleString("id-ID")}
                        </span>
                    </div>

                <Link
    to="/checkout"
    className="block w-full mt-6 bg-black text-white py-3 rounded-lg text-center"
>
    Checkout
</Link>

                </div>

            </div>

        </main>
    );
}

export default Cart;