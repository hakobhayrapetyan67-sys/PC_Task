class PromoCode {
  constructor(code, type, value, expires_at) {
    this.code = code;
    this.type = type;
    this.value = value;
    this.expires_at = expires_at;
    this.times_used = 0;
  }
}

module.exports = PromoCode;