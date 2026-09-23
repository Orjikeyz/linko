const Transaction = require('../model/Transactions')
const responseData = require('../middleware/response')

/*
==================================================
                  TRANSACTIONS
==================================================
*/

// GET /transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 })

    return responseData(res, 'success', 200, 'Transactions retrieved successfully', transactions, '')

  } catch (error) {
    console.error('Get transactions error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// GET /transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params

    const transaction = await Transaction.findById(id)

    if (!transaction) {
      return responseData(res, 'error', 404, 'Transaction not found', [], '')
    }

    return responseData(res, 'success', 200, 'Transaction retrieved successfully', transaction, '')

  } catch (error) {
    console.error('Get transaction error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


// DELETE /transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params

    const deletedTransaction = await Transaction.findByIdAndDelete(id)

    if (!deletedTransaction) {
      return responseData(res, 'error', 404, 'Transaction not found', [], '')
    }

    return responseData(res, 'success', 200, 'Transaction deleted successfully', deletedTransaction, '')

  } catch (error) {
    console.error('Delete transaction error:', error)

    return responseData(res, 'error', 500, 'Internal server error', [], '')
  }
}


module.exports = {
  getTransactions,
  getTransactionById,
  deleteTransaction
}
