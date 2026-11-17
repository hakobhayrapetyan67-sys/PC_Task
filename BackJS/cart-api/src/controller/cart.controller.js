const {
  carts,
  promoCodes,
  orders,
  getNextCartId,
  getNextOrderId
} = require("../data/store");

const {
  getProductById,
  getPromoByCode,
  calculateCart,
  validatePromo
} = require("../utils/cart.utils");

const Order = require("../model/order.model");

function createCart(req, res) {
  const cart = {
    id: getNextCartId(),
    items: [],
    promo_code: null
  };

  carts.push(cart);

  res.status(201).json(cart);
}

function setItemQuantity(req, res) {
  const cart = carts.find(
    item => item.id === Number(req.params.id)
  );

  if (!cart) {
    return res.status(404).json({
      error: "Cart not found"
    });
  }

  const productId = Number(req.params.productId);

  const product = getProductById(productId);

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({
      error: "Invalid quantity"
    });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      error: "Not enough stock"
    });
  }

  const existingItem = cart.items.find(
    item => item.product_id === productId
  );

  if (quantity === 0) {
    cart.items = cart.items.filter(
      item => item.product_id !== productId
    );
  } else if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    cart.items.push({
      product_id: productId,
      quantity
    });
  }

  res.status(200).json(calculateCart(cart));
}

function applyPromo(req, res) {
  const cart = carts.find(
    item => item.id === Number(req.params.id)
  );

  if (!cart) {
    return res.status(404).json({
      error: "Cart not found"
    });
  }

  const { code } = req.body;

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      error: "Promo code is required"
    });
  }

  const promo = getPromoByCode(code);

  const error = validatePromo(promo);

  if (error) {
    return res.status(400).json({
      error
    });
  }

  cart.promo_code = promo.code;

  res.status(200).json(calculateCart(cart));
}

function removePromo(req, res) {
  const cart = carts.find(
    item => item.id === Number(req.params.id)
  );

  if (!cart) {
    return res.status(404).json({
      error: "Cart not found"
    });
  }

  cart.promo_code = null;

  res.status(200).json(calculateCart(cart));
}

function getCart(req, res) {
  const cart = carts.find(
    item => item.id === Number(req.params.id)
  );

  if (!cart) {
    return res.status(404).json({
      error: "Cart not found"
    });
  }

  res.status(200).json(calculateCart(cart));
}

function checkout(req, res) {
  const cart = carts.find(
    item => item.id === Number(req.params.id)
  );

  if (!cart) {
    return res.status(404).json({
      error: "Cart not found"
    });
  }

  if (cart.items.length === 0) {
    return res.status(400).json({
      error: "Cart is empty"
    });
  }

  for (const item of cart.items) {
    const product = getProductById(item.product_id);

    if (!product || product.stock < item.quantity) {
      return res.status(409).json({
        error: "Not enough stock",
        product_id: item.product_id
      });
    }
  }

  if (cart.promo_code) {
    const promo = getPromoByCode(cart.promo_code);

    const error = validatePromo(promo);

    if (error) {
      return res.status(400).json({
        error
      });
    }
  }

  const summary = calculateCart(cart);

  for (const item of cart.items) {
    const product = getProductById(item.product_id);

    product.stock -= item.quantity;
  }

  if (cart.promo_code) {
    const promo = getPromoByCode(cart.promo_code);

    promo.times_used++;
  }

  const order = new Order(
    getNextOrderId(),
    summary.items,
    summary.subtotal,
    summary.discount,
    summary.total,
    summary.promo_code
  );

  orders.push(order);

  cart.items = [];
  cart.promo_code = null;

  res.status(201).json({
    message: "Order placed successfully",
    order
  });
}

module.exports = {
  createCart,
  setItemQuantity,
  applyPromo,
  removePromo,
  getCart,
  checkout
};