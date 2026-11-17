const express = require("express");

const {
  createCart,
  setItemQuantity,
  applyPromo,
  removePromo,
  getCart,
  checkout
} = require("../controller/cart.controller");

const router = express.Router();

router.post("/", createCart);

router.put("/:id/items/:productId", setItemQuantity);

router.post("/:id/promo", applyPromo);

router.delete("/:id/promo", removePromo);

router.get("/:id", getCart);

router.post("/:id/checkout", checkout);

module.exports = router;