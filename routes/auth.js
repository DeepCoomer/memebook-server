import express from 'express';
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import fetchuser from "../middlewares/fetchuser.js";

const router = express.Router()

const JWT_Secret = process.env.JWT_Secret;

// Register

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(404).send("User not Found");
        }
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword){
            return res.status(400).json("Wrong Password");
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_Secret);

        res.status(200).json({success:true, authtoken: authtoken});
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

export default router;