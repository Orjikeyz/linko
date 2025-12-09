const express = require("express")
const responseData = require('../middleware/response')
const Product = require("../model/Product")

const getProduct = async (req, res) => {
    try {
        const { vendorUsername } = req.params

        const products = await Product.find({ vendor_id: vendorUsername }).populate("vendor", "plan").select("name price images vendor");
        if (!products) {
            return responseData(res, 'error', 400, 'Products not found', [], '')
        }
        console.log(products[0])

        return responseData(res, 'success', 200, 'Products data retrieved successfully', products, products.plan)
    } catch (error) {
        return responseData(res, 'error', 500, 'Server Error', [], '')

    }
}

const getProductById = async (req, res) => {
    const product_id = req.headers.product_id;
    const vendorUsername = req.headers.vendor_username;

    // Check if headers are provided
    if (!product_id || !vendorUsername) {
        return responseData(res, "error", 400, "Missing required headers", [], "");
    }

    try {
        const product = await Product.find({ _id: product_id, vendor_id: vendorUsername }).populate("vendor", "phone_number brand_name brand_image plan");

        if (!product || product.length === 0) {
            return responseData(res, "error", 400, "No product found", [], "");
        }

        return responseData(res, "success", 200, "Product retrieved successfully", product, product[0].vendor.plan);

    } catch (error) {
        console.error(error); 
        return responseData(res, 'error', 500, 'Server Error', [], '');
    }
};


module.exports = {
    getProduct,
    getProductById
}