// const { DB_CONNECTION } = require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
// import routes
const postRoute = require('./routes/posts');
const transactionRoute = require('./routes/transactions');
const userRoute = require('./routes/user');
const scoresRoute = require('./routes/scores');

app.use('/posts', postRoute);
app.use('/transactions', transactionRoute);
app.use('/user', userRoute);
app.use('/scores', scoresRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
})
// connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('connected to db!'))
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

