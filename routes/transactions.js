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
    const { query } = req
    try {
        const transactions = await Transaction.find({ date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) } }).sort({ date: 'asc' });
        res.json(transactions);
    }
    catch (error) {
        res.json({ message: error })
    }
});

router.get('/report', async (req, res) => {
    Transaction.aggregate([
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
            return;
        } else {
            res.json({ data: result });
        }
    })
    // try {
    //     const groupTotal = Transaction.aggregate([
    //         {
    //             $group: {
    //                 _id: "$categoryId",
    //                 total: { $sum: "$amount" }
    //             }
    //         }
    //     ])
    //     console.log(`groupTotal`, groupTotal)
    //     res.json(groupTotal);
    // }
    // catch (error) {
    //     res.json({ message: error });
    // }
})

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
        const deletedTransaction = await Transaction.remove({ _id: req.params.transactionId });
        res.json({ data: deletedTransaction, message: 'Delete transaction successfully' });
    } catch (error) {
        res.json({ message: error });
    }

})

// update transaction
router.patch('/:transactionId', async (req, res) => {
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

router.put('/:transactionId', async (req, res) => {
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