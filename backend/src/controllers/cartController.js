const db = require("../config/database");

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Cari cart user
        let [carts] = await db.query(
            "SELECT id FROM carts WHERE user_id = ?",
            [userId]
        );

        // Kalau belum punya cart, buat otomatis
        if (carts.length === 0) {
            const [result] = await db.query(
                "INSERT INTO carts (user_id) VALUES (?)",
                [userId]
            );

            carts = [
                {
                    id: result.insertId,
                },
            ];
        }

        const cartId = carts[0].id;

        const [items] = await db.query(
            `
            SELECT
                 cart_items.product_id AS id,
                cart_items.product_id,
                cart_items.quantity,
                cart_items.price,
                products.name,
                products.image,
                categories.name AS category_name
            FROM cart_items
            JOIN products
                ON cart_items.product_id = products.id
            JOIN categories
                ON products.category_id = categories.id
            WHERE cart_items.cart_id = ?
            ORDER BY cart_items.id DESC
            `,
            [cartId]
        );

        res.json({
            cart_id: cartId,
            items,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal mengambil keranjang",
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        if (!product_id) {
            return res.status(400).json({
                message: "Produk wajib dipilih",
            });
        }

        const qty = Number(quantity) || 1;

        // Ambil produk dari database
        const [products] = await db.query(
            `
            SELECT id, name, price, stock
            FROM products
            WHERE id = ?
            `,
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan",
            });
        }

        const product = products[0];

        if (product.stock < qty) {
            return res.status(400).json({
                message: "Stok produk tidak mencukupi",
            });
        }

        // Cari cart user
        let [carts] = await db.query(
            "SELECT id FROM carts WHERE user_id = ?",
            [userId]
        );

        if (carts.length === 0) {
            const [result] = await db.query(
                "INSERT INTO carts (user_id) VALUES (?)",
                [userId]
            );

            carts = [
                {
                    id: result.insertId,
                },
            ];
        }

        const cartId = carts[0].id;

        // Cek apakah produk sudah ada
        const [existingItems] = await db.query(
            `
            SELECT id, quantity
            FROM cart_items
            WHERE cart_id = ?
            AND product_id = ?
            `,
            [cartId, product_id]
        );

        if (existingItems.length > 0) {
            const newQuantity =
                existingItems[0].quantity + qty;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Jumlah melebihi stok produk",
                });
            }

            await db.query(
                `
                UPDATE cart_items
                SET quantity = ?, price = ?
                WHERE id = ?
                `,
                [
                    newQuantity,
                    product.price,
                    existingItems[0].id,
                ]
            );
        } else {
            await db.query(
                `
                INSERT INTO cart_items
                (cart_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
                `,
                [
                    cartId,
                    product_id,
                    qty,
                    product.price,
                ]
            );
        }

        res.status(201).json({
            message: "Produk berhasil masuk keranjang",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal menambahkan ke keranjang",
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        const newQuantity = Number(quantity);

        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            return res.status(400).json({
                message: "Quantity tidak valid",
            });
        }

        const [items] = await db.query(
            `
            SELECT
                cart_items.id,
                products.stock
            FROM cart_items
            JOIN carts
                ON cart_items.cart_id = carts.id
            JOIN products
                ON cart_items.product_id = products.id
            WHERE carts.user_id = ?
            AND cart_items.product_id = ?
            `,
            [userId, productId]
        );

        if (items.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ada di keranjang",
            });
        }

        const item = items[0];

        if (newQuantity > item.stock) {
            return res.status(400).json({
                message: "Quantity melebihi stok produk",
            });
        }

        await db.query(
            `
            UPDATE cart_items
            JOIN carts
                ON cart_items.cart_id = carts.id
            SET cart_items.quantity = ?
            WHERE carts.user_id = ?
            AND cart_items.product_id = ?
            `,
            [
                newQuantity,
                userId,
                productId,
            ]
        );

        res.json({
            message: "Quantity berhasil diperbarui",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal memperbarui quantity",
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const [result] = await db.query(
            `
            DELETE cart_items
            FROM cart_items
            JOIN carts
                ON cart_items.cart_id = carts.id
            WHERE carts.user_id = ?
            AND cart_items.product_id = ?
            `,
            [
                userId,
                productId,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Produk tidak ada di keranjang",
            });
        }

        res.json({
            message: "Produk berhasil dihapus dari keranjang",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal menghapus produk",
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};