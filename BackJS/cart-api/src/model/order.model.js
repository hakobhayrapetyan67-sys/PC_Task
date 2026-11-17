class Order {
  constructor(id, items, subtotal, discount, total, promo_code) {
    this.id = id;
    this.items = items;
    this.subtotal = subtotal;
    this.discount = discount;
    this.total = total;
    this.promo_code = promo_code;
    this.status = "pending";
    this.created_at = new Date();
  }
}

module.exports = Order;