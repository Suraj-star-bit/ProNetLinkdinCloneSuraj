import mongoose from "mongoose";


const postsSchema = mongoose.Schema({
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,

    },
    body: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,

    },
    updatedAt: {
        type: Date,
        default: Date.now,

    },
    media: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    fileType: {
        type: String,
        default: ' '
    },
});

const Posts = mongoose.model("Posts", postsSchema);

export default Posts; 