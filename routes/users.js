import express from "express";
import bcrypt from "bcryptjs";
import grid from "gridfs-stream";
import mongoose from "mongoose";
import upload from "../utils/upload.js";
import { User } from "../models/User.js";

const router = express.Router();

const url = "http://localhost:8000";

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

// Update User

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been Updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});

// upload image

router.post("/file/upload", async (req, res) => {
  // if (!req.file)
  //     return res.status(404).json("File not found");

  // const imageUrl = `${url}/api/users/file/${req.file.filename}`;

  let public_id = "";
  let url = "";
  const myCloud = await cloudinary.v2.uploader
    .upload(req.body.file, {
      folder: "blogposts",
      width: 150,
      crop: "scale",
    })
    .then((result) => {
      public_id = result.public_id;
      url = result.secure_url;
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json(url);
});

// Get image

router.get("/file/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete User

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.deleteOne({ _id: req.params.id });
      res.status(200).json("Account has been Deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

// Get a User

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Follow a User

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User Followed");
      } else {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User Followed");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// UnFollow a User

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({ success: true });
      } else {
        res.status(403).json({ success: false });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

export default router;
