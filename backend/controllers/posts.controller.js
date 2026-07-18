import User from "../models/users.model.js"; 
import bcrypt from "bcryptjs";
import Post from "../models/posts.model.js"; 
import Comment from "../models/comments.model.js";

export const activateCheck = async(req , res) => {

    return res.status(200).json({message : "HEY BUDDY ITS WORKING" })

} 

export const createPost = async(req , res) => { 
    const { token } = req.body; 

    try { 
        const user = await User.findOne({token : token});

        if(!user) {
            return res.status(404).json({message : "USER NOT FOUND"});
        }

        const post = await Post.create({
                userId :user._id,
                body : req.body.body,
                media : req.file != undefined ? req.file.filename : null,
                fileType : req.file != undefined ? req.file.mimetype.split("/")[1] : null, 
        })

        await post.save();

        return res.status(201).json({message : "POST CREATED SUCCESSFULLY"});
    
    } catch (error) {
        return res.status(500).json({message : "INTERNAL SERVER ERROR"});
    }
}

export const getAllPosts = async(req , res) => {
    try{
        const posts = await Post.find().populate("userId", "name username email ProfilePicture");

        return res.status(200).json({posts : posts});

    }catch(error) {
    return res.status(500).json({
        message: error.message
    });
}

}

export const deletePost = async(req , res) => {

    const {token , postId} = req.body;
    
    try {
        const user = await User.findOne({token : token})
        .select("_id");
        if(!user) {
            return res.status(404).json({message: "USER NOT FOUND"});
        }
        const post = await Post.findOne({_id : postId});
        if(!post) {
            return res.status(404).json({message: "POST NOT FOUND"});
        } 

        if(post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({message: "UNAUTHORIZED"});
        }

        await Post.deleteOne({ _id : postId});
        
        return res.status(200).json({message: "POST DELETED SUCCESSFULLY"});

    }catch(error) {
        return res.status(500).json({
            message: error.message});
    }
}

export const commentOnPost = async(req , res) => {

    const { token, postId, commentBody, comment } = req.body;
    const bodyText = commentBody ?? comment;

    try { 
        const user = await User.findOne({token : token})
        .select("_id");
        if(!user) {
            return res.status(404).json({message: "USER NOT FOUND"});
        }
        const post = await Post.findOne({_id : postId});
        if(!post) {
            return res.status(404).json({message: "POST NOT FOUND"});
        }

        if (!bodyText || !bodyText.trim()) {
            return res.status(400).json({message: "COMMENT CANNOT BE EMPTY"});
        }
        
        const commentDoc = new Comment({
            userId : user._id,
            postId : postId,
            body : bodyText.trim()
        });

        await commentDoc.save(); 

        return res.status(201).json({message: "COMMENT ADDED SUCCESSFULLY"});   
    }
    catch(error) {
        return res.status(500).json({ message: error.message});
    }
}

export const get_comments_on_post = async (req, res) => {


    const { postId } = req.query;

    try {
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" });
        }

        const comments = await Comment.find({ postId: postId }).populate("userId", "name username email ");


        return res.json(comments.reverse());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async(req , res) => {
    
    const {token , commentId} = req.body;
    try {
        const user = await User.findOne({token : token})
        .select("_id");
        if(!user) {
            return res.status(404).json({message: "USER NOT FOUND"});
        } 

        const comment = await Comment.findOne({_id : commentId});

        if(!comment) {
            return res.status(404).json({message: "COMMENT NOT FOUND"});
        }
        if(comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({message: "UNAUTHORIZED"});
        } 

        await Comment.deleteOne({_id : commentId});

        return res.status(200).json({message: "COMMENT DELETED SUCCESSFULLY"});
    }
    catch(error) {
        return res.status(500).json({ message: error.message});
    }
}  

export const likePost = async (req, res) => {
    const { token, postId } = req.body;

    try {
        const user = await User.findOne({ token }).select("_id");

        const post = await Post.findById(postId);

        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND" });
        }

        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" });
        }

        post.likes += 1;
        await post.save();

        return res.status(200).json({ message: "POST LIKED SUCCESSFULLY" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};