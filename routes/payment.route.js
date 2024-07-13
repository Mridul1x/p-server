const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const SslCommerzPayment = require("sslcommerz-lts/api/payment-controller");
const ObjectId = require("mongodb").ObjectId;

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

router.post("/ssl-request", async (req, res) => {
  const product = await Product.findOne({
    _id: new ObjectId(req.body.productId),
  });
  const { amountTotal, amountShipping, mobile, address, userId, products } =
    req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ error: "User not found" });

  const transactionId = "txn_" + new Date().getTime();
  const postData = {
    total_amount: amountTotal,
    currency: "BDT",
    tran_id: transactionId,
    success_url: "http://localhost:8080/api/payment/success",
    fail_url: "http://localhost:8080/api/payment/fail",
    cancel_url: "http://localhost:8080/api/payment/cancel",
    ipn_url: "http://localhost:8080/api/payment/ipn",
    shipping_method: "Courier",
    product_name: "Ecommerce Products",
    product_category: "Ecommerce",
    product_profile: "general",
    cus_name: user?.name,
    cus_email: user?.email,
    cus_add1: address,
    cus_phone: mobile,
    ship_name: user?.name,
    ship_add1: address,
    ship_phone: mobile,
    multi_card_name: "mastercard,visacard,amexcard",
    value_a: JSON.stringify(products),
  };

  try {
    const sslcz = new SslCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Handle success callback
// router.post("/success", async (req, res) => {
//   const { value_a } = req.body;
//   try {
//     const products = JSON.parse(value_a);
//     const newOrder = new Order({
//       amountTotal: req.body.amount,
//       amountShipping: req.body.amount_shipping,
//       status: "approved",
//       mobile: req.body.cus_phone,
//       address: req.body.cus_add1,
//       userId: req.body.cus_name,
//       products: products.map((product) => ({
//         productId: product.productId,
//         quantity: product.quantity,
//       })),
//     });

//     const savedOrder = await newOrder.save();
//     res.redirect(`http://localhost:5173/success?orderId=${savedOrder._id}`);
//   } catch (error) {
//     res.redirect("http://localhost:5173/fail");
//   }
// });

// // Handle fail callback
// router.post("/fail", (req, res) => {
//   res.redirect("http://localhost:5173/fail");
// });

// // Handle cancel callback
// router.post("/cancel", (req, res) => {
//   res.redirect("http://localhost:5173/fail");
// });

module.exports = router;
