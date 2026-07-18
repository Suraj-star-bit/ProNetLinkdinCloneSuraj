import { createSlice } from "@reduxjs/toolkit"
import { getAllComments, getAllPosts, postComment } from "../../action/postAction"
import { getAllUsers } from "../../action/authAction"



const initialState = {
    posts : [],
    isError : false,
    postFetched : false,
    isLoading : false,
    loggedIn : false,
    message : "",
    comments : [],
    postId : "", 
}

const postSlice = createSlice({
    name : "post",
    initialState,
    reducers : {
        reset: () => initialState,
        resetPostId : (state ) => {
            state.postId = "" 
        },
    },
    extraReducers : (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
            state.message = "fetching the posts... "
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;

            state.posts = action.payload.reverse()
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch posts";
            state.posts = []; // IMPORTANT SAFE RESET
        })
        .addCase(getAllComments.fulfilled , (state , action) => {
            state.postId = action.payload.post_id
            state.comments = Array.isArray(action.payload.comments) ? action.payload.comments : []
        })
        .addCase(postComment.fulfilled, (state, action) => {
            state.message = action.payload?.message || "Comment posted"
        
        })
        
    }
})


export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer