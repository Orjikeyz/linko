const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/connect")
connectDB() //connect DB
const cors = require("cors");

/* ===== Middleware ===== */
app.use(cors());               // ✅ enable CORS
app.use(express.json());       // ✅ parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const productRoutes = require("./router/productRoutes")
const vendorRoutes = require("./router/vendorRoutes")
const transactionRoutes = require("./router/transactionRoutes")

app.use("/", vendorRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

app.listen(3000, ()=> {
    console.log(`Server running on port: ${process.env.PORT}`)
})
