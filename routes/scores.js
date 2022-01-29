const express = require('express');
const router = express.Router();
const Scores = require('../models/Scores');
const verify = require('./verifyToken');

router.post('/', async (req, res) => {
    const scores = new Scores({
        ...req.body
    })
    try {
        const allHighScores = await Scores.find().sort({ scores: 'desc' });
        // console.log('allHighScores', allHighScores);

        if (allHighScores.length < 10) {
            const savedScores = await scores.save();
            return res.json({ data: savedScores, message: "You made it! Checkout the high scores board <3" });
        }
        if (allHighScores.length === 10 && allHighScores[9].scores < scores.scores) {
            const deletedSCores = await Scores.remove({ _id: allHighScores[9]._id });
            const savedScores = await scores.save();
            return res.json({ data: savedScores, message: "You made it! Checkout the high scores board <3" });
        }

        return res.json({ data: {}, message: "You almost got it! Try again to get a high score" });
    }
    catch (error) {
        res.json({ message: error })
    }
})

router.get('/', async (req, res) => {
    try {
        const allHighScores = await Scores.find().sort({ scores: 'desc' });
        res.json(allHighScores);
    }
    catch (error) {
        res.json({ message: error })
    }
});

module.exports = router;