const express = require('express')
const responseData = (res, status, statusCode, message, result, plan) => {
    res.status(statusCode).json({
        status: status,
        message: message,
        result: result,
        plan: plan
      })
}
module.exports = responseData
