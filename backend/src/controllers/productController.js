const db = require("../config/database");

const getProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT 
                products.*,
                categories.name AS category_name
            FROM products
            JOIN categories
                ON products.category_id = categories.id
            ORDER BY products.id DESC
        `);

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal mengambil produk"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await db.query(`
            SELECT 
                products.*,
                categories.name AS category_name
            FROM products
            JOIN categories
                ON products.category_id = categories.id
            WHERE products.id = ?
        `, [id]);

        if (products.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        res.json(products[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal mengambil produk"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            stock,
            image
        } = req.body;

        if (!category_id || !name || price === undefined) {
            return res.status(400).json({
                message: "Kategori, nama produk, dan harga wajib diisi"
            });
        }

        const [result] = await db.query(
            `INSERT INTO products
            (category_id, name, description, price, stock, image)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                category_id,
                name,
                description || null,
                price,
                stock || 0,
                image || null
            ]
        );

        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal menambahkan produk"
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct
};