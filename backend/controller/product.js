const express = require("express")
const Product = require("../model/Product")

const getProduct = async (req, res) => {
    const allDocs = await Product.find();
    allDocs.forEach(element => {
        element.images.forEach(elements => {
            console.log(elements[0])
        });
    });
    res.send("ehh lwol")
}

module.exports = {
    getProduct
}