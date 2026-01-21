const express = require("express")
const responseData = require('../middleware/response')
const Product = require("../model/Product")
const mongoose = require('mongoose');

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

//Add Product to Vendor 
const addProduct = async (req, res) => {
    const { vendorUsername } = req.params
    const allowedFields = ['name', 'price', 'description', 'image'];
    const cleanData = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            cleanData[field] = req.body[field];
        }
    });

    const cleanName = cleanData.name
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();

    cleanData.name = cleanName;

    if (!cleanName || cleanName.length < 3) {
        return responseData(res, 'error', 400, 'Product name must be at least 3 characters', [], '');
    }

    if (!cleanData.price || isNaN(cleanData.price) || Number(cleanData.price) <= 0) {
        return responseData(res, 'error', 400, 'Enter a valid product price', [], '');
    }

    if (cleanData.description) {
        if (typeof cleanData.description !== 'string') {
            return responseData(res, 'error', 400, 'Invalid description', [], '');
        }

        const cleanDesc = cleanData.description
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .trim();


        cleanData.description = cleanDesc;
    }

    if (!Array.isArray(cleanData.image)) {
        return responseData(res, 'error', 400, 'Images must be an array', [], '');
    }

    let invalidUrl = false;

    cleanData.image.forEach(url => {
        if (!url.startsWith('https://')) {
            invalidUrl = true;
        }
    });

    if (invalidUrl) {
        return responseData(res, 'error', 400, 'Invalid image url', [], '');
    }

    // INsert into product table
    try {
        const newProduct = await Product.create({
            vendor_id: vendorUsername,
            name: cleanData.name,
            price: Number(cleanData.price),
            description: cleanData.description,
            images: cleanData.image
        });

        return responseData(res, 'success', 201, 'Product added successfully', newProduct, '');
    } catch (err) {
        console.error(err);
        return responseData(res, 'error', 500, 'Server error', [], '');
    }
}

// Delete Product 
const deleteProduct = async (req, res) => {
    const { vendorUsername, productId } = req.params;

    try {

        // validate product id
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return responseData(res, 'error', 400, 'Invalid product ID', [], '');
        }

        // delete product (only if it belongs to vendor)
        const product = await Product.findOneAndDelete({
            _id: productId,
            vendor_id: vendorUsername
        });

        if (!product) {
            return responseData(res, 'error', 404, 'Product not found', [], '');
        }

        return responseData(res, 'success', 200, 'Product deleted successfully', product, ''
        );

    } catch (error) {
        console.error(error);
        return responseData(res, 'error', 500, 'Server error', [], '');
    }
};




module.exports = {
    getProduct,
    getProductById,
    getAllVendorProduct,
    getTotalProduct,
    addProduct,
    deleteProduct
}