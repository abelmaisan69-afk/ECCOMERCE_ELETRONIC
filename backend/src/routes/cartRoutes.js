const express = require("express");

const {
    getCart,
    addToCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getCart
);

router.post(
    "/",
    authMiddleware,
    addToCart
);

module.exports = router;