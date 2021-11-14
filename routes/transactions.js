const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken');

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
router.get('/', verify, async (req, res) => {
    const { query } = req
    try {
        const transactions = await Transaction.find({ date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) }, userId: query.userId }).sort({ date: 'asc' });
        res.json(transactions);
    }
    catch (error) {
        res.json({ message: error })
    }
});

router.get('/report', verify, async (req, res) => {
    const { query } = req

    try {
        const transactions = await Transaction.find({ date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) }, userId: query.userId }).sort({ date: 'asc' });
        const report = await Transaction.aggregate([
            { $match: { date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) }, userId: query.userId } },
            {
                $group: {
                    _id: "$categoryId",
                    total: { $sum: "$amount" }
                }
            }
        ], (err, result) => {
            if (err) {
                res.send(err);
                return err;
            } else {
                return result;
            }
        });
        await res.json({ report, transactions });
    }
    catch (error) {
        res.json({ message: error });
    }
})

router.get('/overview', verify, async (req, res) => {
    const { query } = req

    try {
        // const transactions = await Transaction.find({ date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) } }).sort({ date: 'asc' });
        const report = await Transaction.aggregate([
            { $match: { userId: query.userId } },
            {

                $group: {
                    _id: "$categoryId",
                    total: { $sum: "$amount" }
                }
            }
        ], (err, result) => {
            if (err) {
                console.log(`err`, err)
                res.send(err);
                return err;
            } else {
                return result;
            }
        });
        console.log(`report`, report)
        await res.json({ report });
    }
    catch (error) {
        console.log(`error`, error)
        res.json({ message: error });
    }
})

// get transaction detail
router.get('/:transactionId', verify, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        res.json(transaction);
    } catch (error) {
        res.json({ message: error });
    }

})

// save transaction
router.post('/add', verify, async (req, res) => {
    const token = req.header('auth-token');
    const verified = jwt.verify(token, process.env.JWT_SECRET);
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
router.delete('/:transactionId', verify, async (req, res) => {
    try {
        const deletedTransaction = await Transaction.remove({ _id: req.params.transactionId });
        res.json({ data: deletedTransaction, message: 'Delete transaction successfully' });
    } catch (error) {
        res.json({ message: error });
    }

})

// update transaction
router.patch('/:transactionId', verify, async (req, res) => {
    try {
        const updatedTransaction = await Transaction.updateOne(
            { _id: req.params.transactionId },
            { $set: { ...req.body } }
        );
        res.json({ data: updatedTransaction, message: 'Update transaction successfully' });
    } catch (error) {
        res.json({ message: error });
    }
})

router.put('/:transactionId', verify, async (req, res) => {
    try {
        const updatedTransaction = await Transaction.updateOne(
            { _id: req.params.transactionId },
            { $set: { ...req.body } }
        );
        res.json({ data: updatedTransaction, message: 'Update transaction successfully' });
    } catch (error) {
        res.json({ message: error });
    }
})

module.exports = router;