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
                cart_items.id,
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

module.exports = {
    getCart,
    addToCart,
};