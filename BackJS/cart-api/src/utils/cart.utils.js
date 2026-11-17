const {
  products,
  promoCodes
} = require("../data/store");

function getProductById(id) {
  return products.find(
    product => product.id === Number(id)
  );
}

function getPromoByCode(code) {
  return promoCodes.find(
    promo => promo.code.toLowerCase() === String(code).trim().toLowerCase()
  );
};

function calculateCart(cart) {
  const items = cart.items.map(item => {
    const product = getProductById(item.product_id);

    return {
      product_id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity: item.quantity,
      line_total: product.price * item.quantity
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.line_total, 0
  );

  let discount = 0;

  if (cart.promo_code) {
    const promo = getPromoByCode(cart.promo_code);

    if (promo) {
      if (promo.type === "percentage") {
        discount = subtotal * promo.value / 100;
      } else {
        discount = promo.value;
      }
    }
  }
  
  discount = Math.min(subtotal, discount);
     return {
    id: cart.id,
    items,
    promo_code: cart.promo_code,
    subtotal,
    discount,
    total: subtotal - discount
  };
}


function validatePromo(promo) {
  if (!promo) {
    return "Promo code does not exist";
  }

  if (new Date(promo.expires_at) < new Date()) {
    return "Promo code has expired";
  }

  if (!["percentage", "fixed"].includes(promo.type)) {
    return "Invalid promo type";
  }

  if (promo.value <= 0) {
    return "Invalid promo value";
  }

  return null;
}



module.exports= {
  getProductById,
  getPromoByCode,
  calculateCart,
  validatePromo
};