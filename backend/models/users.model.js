import mongoose,{Schema} from "mongoose";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    ProfilePicture: {
        type: String,
        default:"default.jpg",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    token: {
        type: String,
        default: '',
    },
});

const Users = mongoose.model("Users", usersSchema);

export default Users; 