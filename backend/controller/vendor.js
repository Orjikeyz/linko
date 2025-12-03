const express = require('express')
const Vendor = require('../model/Vendors')
const { param } = require('../router/productRoutes')
const responseData = require('../middleware/response')

const getVendor = async (req, res) => {
  try {
    const { vendorUsername } = req.params

    const vendor = await Vendor.findOne({ username: vendorUsername })
    if (!vendor) {
      return responseData(res, 'error', 400, 'Vendor not found', [], 'free')
    }

    res.send(vendor)
  } catch (error) {
    return responseData(res, 'error', 500, 'Vendor not found', [], 'free')
  }
}

module.exports = {
  getVendor
}
