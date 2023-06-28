import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import Connection from "./database/db.js";
import authroutes from "./routes/auth.js";
import userroutes from "./routes/users.js";
import postroutes from "./routes/posts.js";
import commentroutes from "./routes/comments.js";

dotenv.config();

const app = express();

// middlewares

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

const PORT = process.env.PORT;

Connection();

// routes

app.use("/api/auth", authroutes);
app.use("/api/users", userroutes);
app.use("/api/posts", postroutes);
app.use("/api/comments", commentroutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/', (req, res) => {
    res.send("Hey this is my API running 🥳");
})

app.listen(PORT, () => {
  console.log(`Server is running at http://loclahost:${PORT}`);
});
