import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@/config/clientServer";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
        const response = await clientServer.get("/getAllPosts");

        return thunkAPI.fulfillWithValue(response.data.posts);
        } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error");
        }
    }
);

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;

        try {
        const formData = new FormData();

        formData.append("token", localStorage.getItem("token"));
        formData.append("body", body);
        formData.append("media", file);

        const response = await clientServer.post("/post", formData);

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data || error.message
        );
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id , thunkAPI) => {
        try{
            const response = await clientServer.post("/deletePost", {
                token: localStorage.getItem("token"),
                postId: post_id.post_id
            });

            return thunkAPI.fulfillWithValue(response.data)
            
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const incrementPostLike = createAsyncThunk(
    "post/incrementLike",
    async (post, thunkAPI) => {
        try {
            const response = await clientServer.post("/likePost", {
                token: post.token,
                postId: post.post_id,
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const getAllComments = createAsyncThunk(
    "post/getAllComments" , 
    async (postData ,thunkAPI) => {


        try{
            const response = await clientServer.get("/get_comments" , { 
                params: {
                    postId: postData.post_id
                }
            } );

            return thunkAPI.fulfillWithValue({
                comments:response.data,
                post_id: postData.post_id
            })

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try {
            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"),
                postId: commentData.post_id,
                commentBody: commentData.comment
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error");
        }
    }
);