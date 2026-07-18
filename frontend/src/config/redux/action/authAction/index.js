import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@/config/clientServer";



export const loginUser = createAsyncThunk(
    "user/login",
    async (user , thunkAPI) => {
        try{
            const response = await clientServer.post(`/login` , {
            email: user.email,
            password: user.password
        });

            if(response.data.token){
                localStorage.setItem("token", response.data.token)
            }else {
                return thunkAPI.rejectWithValue({
                    message: "token not provided"
                })
            }

            return thunkAPI.fulfillWithValue(response.data.token)

        }catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: error.message,
                }
            )
        }
    }
)
export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
        const response = await clientServer.post("/register", {
            username: user.username,
            name: user.name,
            email: user.email,
            password: user.password,
        });

        return response.data;
        } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data || {
            message: error.message,
            }
        );
        }
    }
);

export const getAboutUser = createAsyncThunk(
    "/user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch(error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "/getAllUsers",
    async (_, thunkAPI) => {
        try{
            const response = await clientServer.get("/get_all_users_profiles")

            return thunkAPI.fulfillWithValue(response.data)
        }catch(error){
            return thunkAPI.rejectWithValue(error.response?.data || {
                message: error.message,
            });
        }
    }
)


export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest" , async (user, thunkAPI) => {

        try{
            const response = await clientServer.post("/send_connection_request", {
                token: user.token,
                connectionId: user.connectionId,
            });

            // Fetch updated connections after sending request
            thunkAPI.dispatch(getConnectionRequest({token: user.token}))

            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            // If request already exists or any error, still try to fetch updated connections
            thunkAPI.dispatch(getConnectionRequest({token: user.token}))
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequest",
    async (user , thunkAPI) => {

    
        try{
            const response = await clientServer.get("/my_connections", {
                headers: {
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const getMyConnectionRequest = createAsyncThunk(
    "user/getMyConnectionRequest",
    async (user, thunkAPI) => {
        try{

            const response = await clientServer.get("/get_connection_requests", {
                headers: {
                    token: user.token
                }
            });
            console.log(response.data);
            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "user/AcceptConnection" ,
    async (user , thunkAPI) => {
    
        try{
            const response = await clientServer.post("/accept_connection_request" , {
                token:user.token,
                requestId:user.connectionId,
                action_type: user.action
            })

            thunkAPI.dispatch(getConnectionRequest({token: user.token}))
            thunkAPI.dispatch(getMyConnectionRequest({token: user.token}))
            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message);
        }


    }
)