const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
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

router.put(
    "/:productId",
    authMiddleware,
    updateCartItem
);

router.delete(
    "/:productId",
    authMiddleware,
    removeFromCart
);

module.exports = router;