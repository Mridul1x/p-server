require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
/*Routes*/
const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const checkoutRoutes = require("./routes/checkout.route");
const paymentRoute = require("./routes/payment.route");
/*Express App*/
const app = express();
const SSLCommerzPayment = require("sslcommerz-lts");
/*Middlewares*/
app.use(express.json());
const corsOptions = {
  origin: "https://p-client-prac.vercel.app", // Your frontend URL
  credentials: true, // Allow credentials
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

/*Test Api*/
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Mazzak Agro server!" });
});
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", checkoutRoutes);
app.use("/api/payment", paymentRoute);

/*Variables*/
const port = process.env.PORT || 5050;
const uri = process.env.MONGO_URI;
/*DB connection*/
mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port : ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
