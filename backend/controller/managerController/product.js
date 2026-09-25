const express = require("express")
const Product = require('../../model/Product')
const responseData = require('../../middleware/response')

// GET /products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })

        return responseData(res, 'success', 200, 'Products retrieved successfully', products, '')

    } catch (error) {
        console.error('Get products error:', error)

        return responseData(res, 'error', 500, 'Internal server error', [], '')
    }
}


// POST /products
const createProduct = async (req, res) => {
    try {
        const productData = req.body

        if (!productData || typeof productData !== 'object') {
            return responseData(res, 'error', 400, 'Invalid product data', [], '')
        }

        const product = await Product.create(productData)

        return responseData(res, 'success', 201, 'Product created successfully', product, '')

    } catch (error) {
        console.error('Create product error:', error)

        return responseData(res, 'error', 500, 'Internal server error', [], '')
    }
}


// GET /products/:id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return responseData(res, 'error', 404, 'Product not found', [], '')
        }

        return responseData(res, 'success', 200, 'Product retrieved successfully', product, '')

    } catch (error) {
        console.error('Get product error:', error)

        return responseData(res, 'error', 500, 'Internal server error', [], '')
    }
}


// PUT /products/:id
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params

        const updatedProduct = await Product.findByIdAndUpdate( id, { $set: req.body }, {new: true, runValidators: true })

        if (!updatedProduct) {
            return responseData(res, 'error', 404, 'Product not found', [], '')
        }

        return responseData(res, 'success', 200, 'Product updated successfully', updatedProduct, '')

    } catch (error) {
        console.error('Update product error:', error)

        return responseData(res, 'error', 500, 'Internal server error', [], '')
    }
}


// DELETE /products/:id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deletedProduct = await Product.findByIdAndDelete(id)

        if (!deletedProduct) {
            return responseData(res, 'error', 404, 'Product not found', [], '')
        }

        return responseData(res, 'success', 200, 'Product deleted successfully', deletedProduct, '')

    } catch (error) {
        console.error('Delete product error:', error)

        return responseData(res, 'error', 500, 'Internal server error', [], '')
    }
}


module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}
