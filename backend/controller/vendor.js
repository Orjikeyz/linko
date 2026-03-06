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


const updateVendor = async (req, res) => {
  try {
    const { vendorUsername } = req.params

    let { vendorName, vendorDescription, vendorPhone, vendorInstagram, vendorFacebook, vendorX } = req.body

    // =========================
    //  TYPE CHECKING (CRITICAL)
    // =========================
    if (typeof vendorName !== "string" || typeof vendorDescription !== "string" || typeof vendorPhone !== "string"
    ) {
      return responseData(res, "error", 400, "Invalid input types", null)
    }

    // Optional fields must be string if provided
    if ((vendorInstagram && typeof vendorInstagram !== "string") || (vendorFacebook && typeof vendorFacebook !== "string") || (vendorX && typeof vendorX !== "string")) {
      return responseData(res, "error", 400, "Invalid optional field types", null)
    }

    // =========================
    //  TRIM INPUTS
    // =========================
    vendorName = vendorName.trim()
    vendorDescription = vendorDescription.trim()
    vendorPhone = vendorPhone.trim()
    vendorInstagram = vendorInstagram?.trim()
    vendorFacebook = vendorFacebook?.trim()
    vendorX = vendorX?.trim()

    // =========================
    //  LENGTH VALIDATION
    // =========================
    if (vendorName.length < 2 || vendorName.length > 60) return responseData(res, "error", 400, "Vendor name must be 2-60 characters", [], '')

    if (vendorDescription.length < 5 || vendorDescription.length > 500) return responseData(res, "error", 400, "Description must be 5-500 characters", [], '')

    if (vendorPhone.length < 7 || vendorPhone.length > 20) return responseData(res, "error", 400, "Invalid phone length", [], '')

    // =========================
    //  WHITELIST VALIDATION (STRONGER THAN BLACKLIST)
    // =========================
    const nameRegex = /^[a-zA-Z0-9\s\-_.()']+$/
    const phoneRegex = /^[0-9+\-\s()]+$/
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/i
    const descriptionRegex = /^[a-zA-Z0-9\s.,!?'"()\-_:;@&/+#]{5,500}$/

    if (!nameRegex.test(vendorName)) return responseData(res, "error", 400, "Invalid characters in vendor name", [], '')

    if (!phoneRegex.test(vendorPhone)) return responseData(res, "error", 400, "Invalid phone format", [], '')

    if (vendorInstagram && !urlRegex.test(vendorInstagram)) return responseData(res, "error", 400, "Invalid Instagram URL", [], '')

    if (vendorFacebook && !urlRegex.test(vendorFacebook)) return responseData(res, "error", 400, "Invalid Facebook URL", [], '')

    if (vendorX && !urlRegex.test(vendorX)) return responseData(res, "error", 400, "Invalid X URL", [], '')

    if (!descriptionRegex.test(vendorDescription)) return responseData(res, "error", 400, "Description contains invalid characters or must be 5-500 characters", [], '');

    const updateFields = {
      brand_name: vendorName,
      brand_description: vendorDescription,
      phone_number: vendorPhone,
      instagram: vendorInstagram,
      facebook: vendorFacebook,
      x: vendorX
    };
    const updatedVendor = await Vendor.findOneAndUpdate({username: vendorUsername }, { $set: updateFields }, { new: true, runValidators: true });

    if (!updatedVendor) {
        return responseData(res, "error", 404, "Vendor not found", [], '');
    }


    return responseData(res, "success", 200, "Vendor updated", updatedVendor, "");

  } catch (error) {
    console.error("Server error:", error)
    return responseData(res, "error", 404, "Internal server error", [], '');
  }
}

const updateVendorLogo = async (req, res) => {
  try {
    const { vendorUsername } = req.params;
    const { image } = req.body; // Expecting array of URLs

    // =========================
    //  VALIDATION
    // =========================
    if (!Array.isArray(image) || image.length === 0) {
      return responseData(res, "error", 400, "No image provided", [], "");
    }

    // Only accept first image for logo
    const logoUrl = image[0].trim();

    // Optional: simple URL check
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/i;
    if (!urlRegex.test(logoUrl)) {
      return responseData(res, "error", 400, "Invalid image URL", [], "");
    }

    // =========================
    //  UPDATE VENDOR
    // =========================
    const updatedVendor = await Vendor.findOneAndUpdate({ username: vendorUsername }, {$set: { brand_image: logoUrl } }, {new: true, runValidators: true });

    if (!updatedVendor) {
      return responseData(res, "error", 404, "Vendor not found", [], "");
    }

    return responseData(res, "success", 200, "Vendor logo updated", updatedVendor, "");

  } catch (error) {
    console.error("Server error:", error);
    return responseData(res, "error", 500, "Internal server error", [], "");
  }
};
module.exports = {
  getVendor,
  updateVendor,
  updateVendorLogo
}
