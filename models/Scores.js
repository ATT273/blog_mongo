const mongoose = require('mongoose');

const ScoresSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scores: {
        type: Number,
    },
});

module.exports = mongoose.model('Highscores', ScoresSchema)