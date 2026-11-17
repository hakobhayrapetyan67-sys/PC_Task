const Product = require("../model/product.model");
const PromoCode = require("../model/promoCode.model");

const products = [
  new Product(1, "Keyboard", 50, 10),
  new Product(2, "Mouse", 25, 20),
];

const carts = [];

const promoCodes = [
  new PromoCode(
    "SAVE10",
    "percentage",
    10,
    "2027-12-31"
  ),

  new PromoCode(
    "LESS5",
    "fixed",
    5,
    "2027-12-31"
  )
];

const orders = [];

let productId = 3;
let cartId = 1;
let orderId = 1;

const getNextProductId = () => productId++;
const getNextCartId = () => cartId++;
const getNextOrderId = () => orderId++;

module.exports = {
  products,
  carts,
  promoCodes,
  orders,

  getNextProductId,
  getNextCartId,
  getNextOrderId
};