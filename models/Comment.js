import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    userId: {
        type: String
    },
    postId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true })

let Comment = new mongoose.model('comment', CommentSchema);

export default Comment