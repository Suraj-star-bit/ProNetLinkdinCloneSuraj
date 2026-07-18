import { Router } from "express";
import { activateCheck } from "../controllers/posts.controller.js";
import multer from "multer";
import { createPost } from "../controllers/posts.controller.js";
import { getAllPosts } from "../controllers/posts.controller.js";
import { deletePost } from "../controllers/posts.controller.js";
import { commentOnPost } from "../controllers/posts.controller.js";
import {get_comments_on_post} from "../controllers/posts.controller.js";
import { deleteComment } from "../controllers/posts.controller.js";
import {likePost} from "../controllers/posts.controller.js";

const router = Router();

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "uploads/posts");
    },
    filename : (req , file , cb) => {
        cb(null , Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage : storage}); 


router.route('/').get(activateCheck);
router.route("/post").post(upload.single("media") , createPost);
router.route("/getAllPosts").get(getAllPosts); 
router.route("/deletePost").post(deletePost); 
router.route("/comment").post(commentOnPost);
router.get("/get_comments", get_comments_on_post);
router.route("/deleteComment").post(deleteComment);
router.route("/likePost").post(likePost);

export default router;