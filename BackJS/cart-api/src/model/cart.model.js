class Cart {
  constructor(id) {
    this.id = id;
    this.items = [];
    this.promo_code = null;
  }
}

module.exports = Cart;