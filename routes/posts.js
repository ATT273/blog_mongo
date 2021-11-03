const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verify = require('./verifyToken');

// get all posts
router.get('/', verify, async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    }
    catch (error) {
        res.json({ message: error })
    }
});
// get post detail
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post)
    } catch (error) {
        res.json({ message: error })
    }

})
// save post
router.post('/', async (req, res) => {
    const post = new Post({
        ...req.body
    })

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    }
    catch (error) {
        res.json({ message: error })
    }
})

// delete post
router.delete('/:postId', async (req, res) => {
    try {
        const deletedPost = await Post.remove({ _id: req.params.postId });
        res.json(deletedPost);
    } catch (error) {
        res.json({ message: error });
    }

})

// update post
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: { title: req.body.title } }
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
})
module.exports = router;