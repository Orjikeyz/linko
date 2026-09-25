const exprees = require('express')
const Vendor = require('../../model/Vendors')
const responseData = require('../../middleware/response')


// GET /vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 })
    return responseData(res, 'success', 200, 'Vendors retrieved successfully', vendors, '')

  } catch (error) {
    console.error('Get vendors error:', error)
    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// POST /vendors
// const createVendor = async (req, res) => {
//   try {
//     const { username, brand_name, brand_description, phone_number, instagram, facebook, x, brand_image, plan} = req.body

//     // Basic required field validation
//     if ( typeof username !== 'string' || typeof brand_name !== 'string' || typeof brand_description !== 'string' || typeof phone_number !== 'string') {
//       return responseData(res, 'error', 400, 'Invalid input types', [], '')
//     }

//     const existingVendor = await Vendor.findOne({ username })

//     if (existingVendor) {
//       return responseData(res, 'error', 409, 'Vendor already exists', [], '')
//     }

//     const vendor = await Vendor.create({
//       username: username.trim(),
//       brand_name: brand_name.trim(),
//       brand_description: brand_description.trim(),
//       phone_number: phone_number.trim(),
//       instagram: instagram?.trim(),
//       facebook: facebook?.trim(),
//       x: x?.trim(),
//       brand_image: brand_image?.trim(),
//       plan
//     })

//     return responseData(res, 'success', 201, 'Vendor created successfully', vendor, '')

//   } catch (error) {
//     console.error('Create vendor error:', error)

//     return responseData(res, 'error', 500, 'Internal server error', [], '')
//   }
// }


// GET /vendors/:id
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params

    const vendor = await Vendor.findById(id)

    if (!vendor) {
      return responseData(res, 'error', 404, 'Vendor not found', [], '')
    }

    return responseData(res, 'success', 200, 'Vendor retrieved successfully', vendor, '')

  } catch (error) {
    console.error('Get vendor error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// PUT /vendors/:id
const updateVendorById = async (req, res) => {
  try {
    const { id } = req.params

    const { username, brand_name, brand_description, phone_number, instagram, facebook, x, brand_image, plan} = req.body

    // Only update fields that were actually provided
    const updateFields = {}

    if (username !== undefined) {
      if (typeof username !== 'string') {
        return responseData(res, 'error', 400, 'Invalid username', [], '')
      }

      updateFields.username = username.trim()
    }

    if (brand_name !== undefined) {
      if (typeof brand_name !== 'string') {
        return responseData(res, 'error', 400, 'Invalid brand name', [], '')
      }

      updateFields.brand_name = brand_name.trim()
    }

    if (brand_description !== undefined) {
      if (typeof brand_description !== 'string') {
        return responseData(res, 'error', 400, 'Invalid brand description', [], '')
      }

      updateFields.brand_description = brand_description.trim()
    }

    if (phone_number !== undefined) {
      if (typeof phone_number !== 'string') {
        return responseData(res, 'error', 400, 'Invalid phone number', [], '')
      }

      updateFields.phone_number = phone_number.trim()
    }

    if (instagram !== undefined) {
      updateFields.instagram = typeof instagram === 'string' ? instagram.trim() : instagram
    }

    if (facebook !== undefined) {
      updateFields.facebook = typeof facebook === 'string' ? facebook.trim() : facebook
    }

    if (x !== undefined) {
      updateFields.x = typeof x === 'string' ? x.trim() : x
    }

    if (brand_image !== undefined) {
      updateFields.brand_image = typeof brand_image === 'string' ? brand_image.trim() : brand_image
    }

    if (plan !== undefined) {
      updateFields.plan = plan
    }

    const updatedVendor = await Vendor.findByIdAndUpdate( id, { $set: updateFields }, {   new: true,   runValidators: true }
    )

    if (!updatedVendor) {
      return responseData(res, 'error', 404, 'Vendor not found', [], '')
    }

    return responseData(res, 'success', 200, 'Vendor updated successfully', updatedVendor, '')

  } catch (error) {
    console.error('Update vendor error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// DELETE /vendors/:id
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params

    const deletedVendor = await Vendor.findByIdAndDelete(id)

    if (!deletedVendor) {
      return responseData(res, 'error', 404, 'Vendor not found', [], '')
    }

    return responseData(res, 'success', 200, 'Vendor deleted successfully', deletedVendor, '')

  } catch (error) {
    console.error('Delete vendor error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


module.exports = {
  getVendors,
  // createVendor,
  getVendorById,
  updateVendorById,
  deleteVendor
}
