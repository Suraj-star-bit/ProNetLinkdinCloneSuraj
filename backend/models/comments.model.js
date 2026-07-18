import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    },
    body: {
        type: String,
        required: true,
    },
});

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;