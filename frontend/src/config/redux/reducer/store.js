import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import postReducer from "./postReducer"

/**
 * 
 * 
 * STEPS FOR state managment
 * Submit action 
 * handle action in its reducer 
 * Register Here-> Reducer
 *  
 */

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer
    }
});