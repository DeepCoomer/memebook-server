import express from 'express';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

const router = express.Router();

// Create a Post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Update a Post

router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The Post has been updated.")
        } else {
            res.status(403).json("You can update only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// Delete a Post

router.delete('/:id/:userId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.params.userId) {
            await Post.deleteOne({ _id: req.params.id });
            res.status(200).json("The Post has been deleted.");
        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// Like/ Dislike a Post

router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Post has been disliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get a Post

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get User Posts 

router.get('/user/:userId', async (req, res) => {
    try {
        let posts = await Post.find({ userId: req.params.userId }).sort({ _id: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Get timeline Posts

router.get("/timeline/:userId", async (req, res) => {
    try {
        let posts;
        let friendPosts = [];
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id }).sort({ _id: -1 });
        const friend = await currentUser.following;
        if (friend.length == 0) {
            return res.status(200).json(userPosts);
        }

        for (let index = 0; index <= friend.length; index++) {
            posts = friend[index];
            friendPosts.push(
                await Post.find({ userId: posts }).sort({ createdAt: -1 })
            )
        }
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;