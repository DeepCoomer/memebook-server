import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

router.post('/newcomment', async (req, res) => {
    try {
        const comment = await new Comment({
            name: req.body.name,
            postId: req.body.postId,
            comment: req.body.comment
        });
        await comment.save();
        res.status(200).json("Comment Saved Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/comment/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.delete('/delete/comment/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        await comment.delete();
        res.status(200).json("Comment Deleted Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router