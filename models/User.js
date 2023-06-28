import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        max: 50,
        default: "No Info"
    },
    city: {
        type: String,
        max: 50,
        default: "No Info"
    },
    from: {
        type: String,
        max: 50,
        default: "No Info"
    },
    relationship: {
        type: String,
        default: "No Info"
    }
},{timestamps: true})

export const User = new mongoose.model('user',UserSchema);