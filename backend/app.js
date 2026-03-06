const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/connect")
connectDB() //connect DB
const cors = require("cors");
const cookieParser = require("cookie-parser");


app.use(cors({
    origin: ["http://localhost", "http://127.0.0.1:5500", "https://linko-ng.vercel.app"],
    credentials: true
}));

app.use(express.json());       // ✅ parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ This is required to read cookies


// auth 
const authRoutes = require("./router/authRoutes")

const productRoutes = require("./router/productRoutes")
const vendorRoutes = require("./router/vendorRoutes")
const transactionRoutes = require("./router/transactionRoutes")

app.use("/auth", authRoutes);

app.use("/", vendorRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

app.listen(3000, ()=> {
    console.log(`Server running on port: ${process.env.PORT}`)
})
