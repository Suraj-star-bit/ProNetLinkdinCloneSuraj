import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser , getAllUsers, getConnectionRequest, getMyConnectionRequest} from "../../action/authAction";


const initialState = {
    user:[],
    token : "",
    isError:false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections:[],
    connectionRequest: [],
    all_users : [],
    all_profiles_fetched: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset:() =>initialState,
        handleLoginUser: (state)=> {
            state.message = "hello"
        },
        emptyMessage : (state) => {
            state.message = ""
            state.isError = false
            state.isSuccess = false
        },
        setIsTokenThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false 
        }
        
    },
    extraReducers:(builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true,
            state.message = "Knocking the door..."
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.token = action.payload;
            state.message = action.payload.message        })
        .addCase(loginUser.rejected, (state , action)=>{
            state.isLoading = false,
            state.isError =  true,
            state.isSuccess = false,
            state.message = action.payload
        })
        .addCase(registerUser.pending , (state) => {
            state.isLoading = true,
            state.isError = false,
            state.isSuccess = false,
            state.message = "Creating your account..."
        })
        .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = action.payload
        })
        .addCase(registerUser.rejected, (state,action) =>{
            state.isLoading = false,
            state.isError =  true,
            state.isSuccess = false,
            state.message = action.payload
        })
        .addCase(getAboutUser.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload
        })
        .addCase(getAllUsers.fulfilled, (state,action)=> {
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload
        })
        .addCase(getConnectionRequest.fulfilled, (state,action) =>{
            state.connections = action.payload;
        })
        .addCase(getConnectionRequest.rejected, (state,action) =>{
            state.message = action.payload;
        })
        .addCase(getMyConnectionRequest.fulfilled, (state , action) => {
            state.connectionRequest = action.payload;
        }).addCase(getMyConnectionRequest.rejected, (state,action) =>{
            state.message = action.payload;
        })
    }

})

export const {reset , emptyMessage , setIsTokenThere , setTokenIsNotThere} = authSlice.actions
export default authSlice.reducer
