const express = require("express")
const responseData = require('../middleware/response')
const Product = require("../model/Product")

const getProduct = async (req, res) => {
    try {
        const { vendorUsername } = req.params
        console.log(vendorUsername)

        const products = await Product.find({ vendor_id: vendorUsername });
        console.log(products)
        if (!products) {
            return responseData(res, 'error', 400, 'Products not found', [], 'free')
        }

        return responseData(res, 'success', 200, 'Products data retrieved successfully', products, 'free')
    } catch (error) {
        return responseData(res, 'error', 500, 'Server Error', [], 'free')

    }
}

module.exports = {
    getProduct
}