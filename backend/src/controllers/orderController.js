const db = require("../config/database");

const createOrder = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const userId = req.user.id;
        const { address } = req.body;

        if (!address || !address.trim()) {
            return res.status(400).json({
                message: "Alamat wajib diisi",
            });
        }

        await connection.beginTransaction();

        // Cari cart milik user
        const [carts] = await connection.query(
            "SELECT id FROM carts WHERE user_id = ?",
            [userId]
        );

        if (carts.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                message: "Keranjang belum tersedia",
            });
        }

        const cartId = carts[0].id;

        // Ambil isi cart
        const [cartItems] = await connection.query(
            `
            SELECT
                cart_items.product_id,
                cart_items.quantity,
                cart_items.price,
                products.name AS product_name,
                products.stock
            FROM cart_items
            JOIN products
                ON cart_items.product_id = products.id
            WHERE cart_items.cart_id = ?
            `,
            [cartId]
        );

        if (cartItems.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                message: "Keranjang masih kosong",
            });
        }

        // Cek stok
        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                await connection.rollback();

                return res.status(400).json({
                    message: `Stok ${item.product_name} tidak mencukupi`,
                });
            }
        }

        // Hitung total
        let totalPrice = 0;

        for (const item of cartItems) {
            totalPrice +=
                Number(item.price) * item.quantity;
        }

        // Buat order
        const [orderResult] = await connection.query(
            `
            INSERT INTO orders
            (user_id, total_price, status, address)
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                totalPrice,
                "pending",
                address.trim(),
            ]
        );

        const orderId = orderResult.insertId;

        // Masukkan order items
        for (const item of cartItems) {
            const subtotal =
                Number(item.price) * item.quantity;

            await connection.query(
                `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_name,
                    price,
                    quantity,
                    subtotal
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    orderId,
                    item.product_id,
                    item.product_name,
                    item.price,
                    item.quantity,
                    subtotal,
                ]
            );

            // Kurangi stok
            await connection.query(
                `
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
                `,
                [
                    item.quantity,
                    item.product_id,
                ]
            );
        }

        // Kosongkan cart
        await connection.query(
            "DELETE FROM cart_items WHERE cart_id = ?",
            [cartId]
        );

        await connection.commit();

        res.status(201).json({
            message: "Pesanan berhasil dibuat",
            order: {
                id: orderId,
                total_price: totalPrice,
                status: "pending",
                address: address.trim(),
            },
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Gagal membuat pesanan",
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
};