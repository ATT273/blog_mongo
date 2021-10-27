const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// get all transactions
router.get('/get-all', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    }
    catch (error) {
        res.json({ message: error })
    }
});
// search
router.get('/', async (req, res) => {
    console.log(`req`, req.query)
    const { query } = req
    try {
        const transactions = await Transaction.find({ date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) } }).sort({ date: 'asc' });
        res.json(transactions);
    }
    catch (error) {
        res.json({ message: error })
    }
});
// get transaction detail
router.get('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        res.json(transaction);
    } catch (error) {
        res.json({ message: error });
    }

})
// save transaction
router.post('/add', async (req, res) => {
    const transaction = new Transaction({
        ...req.body
    })

    try {
        const savedTransaction = await transaction.save();
        res.json({ data: savedTransaction, message: 'Insert new transaction successfully' });
    }
    catch (error) {
        res.json({ message: error });
    }
})

// delete post
router.delete('/:transactionId', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.remove({ _id: req.params.postId });
        res.json({ data: deletedTransaction, message: 'Delete transaction successfully' });
    } catch (error) {
        res.json({ message: error });
    }

})

// update transaction
router.patch('/:postId', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.updateOne(
            { _id: req.params.transactionId },
            { $set: { title: req.body.title } }
        );
        res.json({ data: updatedTransaction, message: 'Update transaction successfully' });
    } catch (error) {
        res.json({ message: error });
    }
})
module.exports = router;