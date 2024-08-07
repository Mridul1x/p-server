const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const User = require("../models/user.model");
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

router.post("/ssl-request", async (req, res) => {
  const {
    amountTotal,
    mobile,
    address,
    userId,
    products,
    amountShipping,
    paymentMethod,
  } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ error: "User not found" });

  const transactionID = "txn_" + new Date().getTime();
  const postData = {
    total_amount: amountTotal,
    currency: "BDT",
    tran_id: transactionID,
    success_url: `http://localhost:5050/api/payment/success/${transactionID}`,
    fail_url: `http://localhost:5050/api/payment/fail/${transactionID}`,
    cancel_url: `http://localhost:5050/api/payment/cancel/${transactionID}`,
    ipn_url: "http://localhost:5050/api/payment/ipn",
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
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    multi_card_name: "mastercard,visacard,amexcard",
    value_a: JSON.stringify(products),
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(postData).then(async (apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;

      const finalOrder = new Order({
        amountTotal,
        amountShipping,
        status: "pending",
        mobile,
        address,
        userId,
        products,
        transactionID: transactionID, // Include this line
        paymentMethod,
      });
      await finalOrder.save();

      res.status(200).send({ url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/success/:transactionID", async (req, res) => {
  const transactionID = req.params.transactionID;
  console.log("Received transactionID:", transactionID);

  try {
    const result = await Order.updateOne(
      { transactionID: transactionID },
      { $set: { status: "approved" } }
    );

    console.log("Transaction update result:", result);
    if (result.modifiedCount > 0) {
      console.log("Transaction approved, redirecting to success page");
      res.redirect(`http://localhost:5173/success/${transactionID}`);
    } else {
      console.log("Transaction update failed, redirecting to fail page");
      res.redirect(`http://localhost:5173/fail/${transactionID}`);
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.redirect(`http://localhost:5173/fail/${transactionID}`);
  }
});

router.post("/fail/:transactionID", async (req, res) => {
  const transactionID = req.params.transactionID;
  console.log("Payment failed for transactionID:", transactionID);

  try {
    const result = await Order.updateOne(
      { transactionID: transactionID },
      { $set: { status: "failed" } }
    );

    console.log("Transaction update result:", result);
    if (result.modifiedCount > 0) {
      console.log("Transaction failed, redirecting to fail page");
      res.redirect(`http://localhost:5173/fail/${transactionID}`);
    } else {
      console.log("Transaction update failed, redirecting to fail page");
      res.redirect(`http://localhost:5173/fail/${transactionID}`);
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.redirect(`http://localhost:5173/fail/${transactionID}`);
  }
});

router.post("/cancel/:transactionID", async (req, res) => {
  const transactionID = req.params.transactionID;
  console.log("Payment cancelled for transactionID:", transactionID);
  try {
    const result = await Order.updateOne(
      { transactionID: transactionID },
      { $set: { status: "cancelled" } }
    );

    console.log("Transaction update result:", result);
    if (result.modifiedCount > 0) {
      console.log("Transaction cancelled, redirecting to cancel page");
      res.redirect(`http://localhost:5173/cancel/${transactionID}`);
    } else {
      console.log("Transaction update failed, redirecting to cancel page");
      res.redirect(`http://localhost:5173/cancel/${transactionID}`);
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.redirect(`http://localhost:5173/cancel/${transactionID}`);
  }
});

module.exports = router;
