const express = require("express")
const responseData = require('../middleware/response')
const Product = require("../model/Product")

const getProduct = async (req, res) => {
    try {
        const { vendorUsername } = req.params

        const products = await Product.find({ vendor_id: vendorUsername }).populate("vendor", "plan")
        if (!products) {
            return responseData(res, 'error', 400, 'Products not found', [], '')
        }

        return responseData(res, 'success', 200, 'Products data retrieved successfully', products, products[0].vendor.plan)
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

// Vendor Backend Product API Call
// =========================================

// Get all Vendor Product
const getAllVendorProduct = async (req, res) => {
    try {
        const { vendorUsername } = req.params

        const products = await Product.find({ vendor_id: vendorUsername }).populate("vendor", "plan")
        if (!products) {
            return responseData(res, 'error', 400, 'Products not found', [], '')
        }

        return responseData(res, 'success', 200, 'Products data retrieved successfully', products, products[0].vendor.plan)
    } catch (error) {
        return responseData(res, 'error', 500, 'Server Error', [], '')

    }
}

//Add Product to Vendor 
const addProduct = async (req, res) => {
    const {vendorUsername} = req.params
    console.log(req.body)

}

// Get total Product Count
const getTotalProduct = async (req, res) => {
    try {
        const { vendorUsername } = req.params;

        // Optional: validate input
        if (!vendorUsername || typeof vendorUsername !== 'string') {
            return responseData(res, 'error', 400, 'Invalid vendor username', [], '');
        }

        const totalProducts = await Product.countDocuments({ vendor_id: vendorUsername });

        // Always return success, even if totalProducts = 0
        return responseData(res, 'success', 200, 'Data retrieved successfully', { totalProducts });

    } catch (error) {
        console.error('Error in getTotalProduct:', error);
        return responseData(res, 'error', 500, 'Server Error', [], '');
    }
};


module.exports = {
    getProduct,
    getProductById,
    getAllVendorProduct,
    getTotalProduct,
    addProduct
}