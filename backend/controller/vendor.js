const express = require('express')
const Vendor = require('../model/Vendors')
const { param } = require('../router/productRoutes')
const responseData = require('../middleware/response')

const getVendor = async (req, res) => {
  try {
    const { vendorUsername } = req.params

    const vendor = await Vendor.findOne({ username: vendorUsername })
    
    if (!vendor) {
      return responseData(res, 'error', 400, 'Vendor not found', [], '')
    }


    return responseData(res, 'success', 200, 'Vendor data retrieved successfully', vendor, vendor.plan)

  } catch (error) {
    return responseData(res, 'error', 500, 'Server Error', [], '')
  }
}

module.exports = {
  getVendor
}
