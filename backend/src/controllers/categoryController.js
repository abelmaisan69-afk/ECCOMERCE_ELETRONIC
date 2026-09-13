const db = require("../config/database");

const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            "SELECT * FROM categories ORDER BY id DESC"
        );

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal mengambil kategori"
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Nama kategori wajib diisi"
            });
        }

        const [result] = await db.query(
            "INSERT INTO categories (name, description) VALUES (?, ?)",
            [name, description || null]
        );

        res.status(201).json({
            message: "Kategori berhasil ditambahkan",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gagal menambahkan kategori"
        });
    }
};

module.exports = {
    getCategories,
    createCategory
};