const {
  products,
  getNextProductId
} = require("../data/store");

function createProduct(req, res) {
  const { name, price, stock } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      error: "Price must be positive"
    });
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      error: "Stock must be a non-negative integer"
    });
  };

  if(typeof price !== "number" || price <= 0) {
    return res.statuse(400).json({
      error: "Price must be positive"
    });
  }

  const product = {
    id: getNextProductId(),
    name,
    price,
    stock
  };

  products.push(product);

  res.status(201).json(product);
}

function getProducts(req, res) {
  res.status(200).json(products);
}

module.exports = {
  createProduct,
  getProducts
};