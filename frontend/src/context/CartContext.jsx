import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user, isLoggedIn } = useAuth();

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");

        return savedCart
            ? JSON.parse(savedCart)
            : [];
    });

    const [loadingCart, setLoadingCart] = useState(false);

    // ==================================================
    // SIMPAN CART LOCAL
    // ==================================================

    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );
        }
    }, [cart, isLoggedIn]);

    // ==================================================
    // AMBIL CART DARI DATABASE
    // ==================================================

    const getCartFromDatabase = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            const response = await api.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCart(response.data.items);
        } catch (error) {
            console.error(
                "Gagal mengambil cart:",
                error
            );
        }
    };

    // ==================================================
    // SINKRONISASI CART LOCAL KE DATABASE
    // ==================================================

    const syncLocalCart = async () => {
        const savedCart = localStorage.getItem("cart");

        if (!savedCart) {
            return;
        }

        const localCart = JSON.parse(savedCart);

        if (localCart.length === 0) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        for (const item of localCart) {
            try {
                await api.post(
                    "/cart",
                    {
                        product_id: item.id,
                        quantity: item.quantity,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (error) {
                console.error(
                    `Gagal memasukkan ${item.name} ke database`,
                    error
                );
            }
        }

        localStorage.removeItem("cart");
    };

    // ==================================================
    // KETIKA USER LOGIN
    // ==================================================

    useEffect(() => {
        if (!isLoggedIn || !user) {
            return;
        }

        const loadCart = async () => {
            setLoadingCart(true);

            try {
                await syncLocalCart();
                await getCartFromDatabase();
            } finally {
                setLoadingCart(false);
            }
        };

        loadCart();
    }, [isLoggedIn, user]);

    // ==================================================
    // TAMBAH KE CART
    // ==================================================

    const addToCart = async (product) => {
        // BELUM LOGIN
        if (!isLoggedIn) {
            setCart((currentCart) => {
                const existingProduct =
                    currentCart.find(
                        (item) =>
                            item.id === product.id
                    );

                if (existingProduct) {
                    return currentCart.map((item) =>
                        item.id === product.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity + 1,
                              }
                            : item
                    );
                }

                return [
                    ...currentCart,
                    {
                        ...product,
                        quantity: 1,
                    },
                ];
            });

            return;
        }

        // SUDAH LOGIN
        try {
            const token =
                localStorage.getItem("token");

            await api.post(
                "/cart",
                {
                    product_id: product.id,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await getCartFromDatabase();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Gagal menambahkan ke keranjang"
            );
        }
    };

    // ==================================================
    // HAPUS DARI CART
    // ==================================================

    const removeFromCart = async (productId) => {
        // BELUM LOGIN
        if (!isLoggedIn) {
            setCart((currentCart) =>
                currentCart.filter(
                    (item) => item.id !== productId
                )
            );

            return;
        }

        // SUDAH LOGIN
        try {
            const token =
                localStorage.getItem("token");

            await api.delete(
                `/cart/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await getCartFromDatabase();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Gagal menghapus produk"
            );
        }
    };

    // ==================================================
    // UPDATE QUANTITY
    // ==================================================

    const updateQuantity = async (
        productId,
        quantity
    ) => {
        // Kalau quantity kurang dari 1
        // maka produk dihapus
        if (quantity < 1) {
            await removeFromCart(productId);
            return;
        }

        // BELUM LOGIN
        if (!isLoggedIn) {
            setCart((currentCart) =>
                currentCart.map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity,
                          }
                        : item
                )
            );

            return;
        }

        // SUDAH LOGIN
        try {
            const token =
                localStorage.getItem("token");

            await api.put(
                `/cart/${productId}`,
                {
                    quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await getCartFromDatabase();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Gagal mengubah quantity"
            );
        }
    };

    // ==================================================
    // KOSONGKAN CART
    // ==================================================

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    // ==================================================
    // TOTAL ITEM
    // ==================================================

    const totalItems = cart.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

    // ==================================================
    // TOTAL HARGA
    // ==================================================

    const totalPrice = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
                Number(item.quantity),
        0
    );

    // ==================================================
    // PROVIDER
    // ==================================================

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                totalItems,
                totalPrice,
                clearCart,
                loadingCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}