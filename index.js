const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const app = express();
const port = 3000;


app.use(cors())
app.use(bodyParser.json());

// import routes
const postRoute = require('./routes/posts');

app.use('/posts', postRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
})
// connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('connected to db!'))
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

