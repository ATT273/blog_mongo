const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserLogin = require('../models/UserLogin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    if (typeof username !== 'string') {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username' });
    }

    if (typeof password !== 'string') {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid password' });
    }

    if (password.length < 5) {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Password is too short. Password must be 6 - 12 characters' });
    }

    try {
        const user = await User.create({
            username,
            password: encryptedPassword
        })
        // console.log(`user`, user)
        res.json({ status: 'success', statusCode: 200, message: 'Registered successfull' })
    }
    catch (error) {
        console.log(`error`, error)
        if (error.code === 11000) {
            res.status(406).send({ status: 'error', statusCode: 400, message: 'Username already in use' });
        }
        throw error
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string') {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username' });
    }

    if (typeof password !== 'string') {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid password' });
    }

    const user = await User.findOne({ username }).lean();

    if (!user) {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username/ password' });
    }
    if (await bcrypt.compare(password, user.password)) {
        const userLogin = await UserLogin.findOne({ username }).lean();
        if (userLogin) {
            const deleteLogin = await UserLogin.remove({ username });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET);

        const newLogin = await UserLogin.create({
            username,
            token
        })

        return res.json({ status: 'success', statusCode: 200, message: 'Logged in successfull', token })
    }
    res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username/ password' });
})

router.get('/logout', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string') {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username' });
    }

    if (typeof password !== 'string') {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid password' });
    }

    const user = await User.findOne({ username }).lean();

    if (!user) {
        return res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username/ password' });
    }
    if (await bcrypt.compare(password, user.password)) {
        const userLogin = await UserLogin.findOne({ username }).lean();
        if (userLogin) {
            const deleteLogin = await UserLogin.remove({ username });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET);

        const newLogin = await UserLogin.create({
            username,
            token
        })

        return res.json({ status: 'success', statusCode: 200, message: 'Logged in successfull', token })
    }
    res.status(406).send({ status: 'error', statusCode: 406, message: 'Invalid username/ password' });
})

module.exports = router;
