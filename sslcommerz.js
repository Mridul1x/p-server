// sslcommerz.js
const SSLCommerz = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;
const sslcz = new SSLCommerz(store_id, store_passwd, is_live);

module.exports = sslcz;
