const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/connect")
connectDB() //connect DB
const productRoutes = require("./router/productRoutes")

app.use("/product", productRoutes);

app.listen(3000, ()=> {
    console.log(`Server running on port: ${process.env.PORT}`)
})
