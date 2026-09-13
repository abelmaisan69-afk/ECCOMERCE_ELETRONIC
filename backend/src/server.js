const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "E-Commerce API berjalan!"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [result] = await db.query("SELECT 1 + 1 AS result");

        res.json({
            message: "Database berhasil terhubung!",
            result: result[0].result
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database gagal terhubung!",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});