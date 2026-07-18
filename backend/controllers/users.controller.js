import Profile from "../models/profile.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";


export const convertToPDF = async (data) => {
    const doc = new PDFDocument();
    const outPutPath = crypto.randomBytes(16).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outPutPath);
    doc.pipe(stream);

    
    doc.image(`uploads/${data.userId.ProfilePicture}`, {
        fit: [150, 150],
        align: 'center',
        valign: 'center'
    });
    doc.fontSize(20).text(`Name: ${data.userId.name}`,);
    doc.fontSize(20).text(`Email: ${data.userId.email}`);
    doc.fontSize(20).text(`Username: ${data.userId.username}`);
    doc.fontSize(20).text(`Bio: ${data.bio || "N/A"}`);
    doc.fontSize(20).text(`Location: ${data.location || "N/A"}`);
    doc.fontSize(20).text(`Current Position: ${data.currentPosition || "N/A"}`);
    doc.fontSize(20).text(`Past Work: ${data.pastWork.forEach((work , index) => {
        doc.fontSize(16).text(`Company: ${work.company}`);
        doc.fontSize(16).text(`Position: ${work.position}`);
        doc.fontSize(16).text(`Years: ${work.years}`);
    }) || "N/A"}`);

    doc.end();
    return outPutPath;
}



export const register = async(req , res) => {
    try { 

        const {name , email , password, username} = req.body;

        if(!name || !email || !password || !username){
            return res.status(400).json({message : "ALL FIELDS ARE REQUIRED"})
        }
        const user = await User.findOne({email : email})
        if(user){
            return res.status(400).json({message : "USER ALREADY EXISTS"})
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            username
        })
        await newUser.save();
        const profile = new Profile({
    userId: newUser._id
});

await profile.save();
        return res.status(201).json({message : "USER REGISTERED SUCCESSFULLY" , user : newUser})  

    } catch (error) {        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }   
}

export const login = async(req , res) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "ALL FIELDS ARE REQUIRED"})
        }
        const user = await User.findOne({email : email})
        if(!user){
            return res.status(400).json({message : "USER NOT FOUND"})
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message : "INVALID CREDENTIALS"})
        }

        const token = crypto.randomBytes(16).toString("hex");
        await User.updateOne({_id : user._id} , {token : token}); 
        return res.json({token: token})
}
    catch (error) {
        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}


export const updateProfilePicture = async (req, res) => {
    const {token} = req.body;
    try {
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(400).json({message: "USER NOT FOUND"});
        }
        if (!req.file) {
            return res.status(400).json({message: "NO FILE UPLOADED"});
        }
        const filename = req.file.filename;
        user.ProfilePicture = filename;
        await user.save();
        return res.json({message: "PROFILE PICTURE UPDATED SUCCESSFULLY", profilePicture: filename});
    } catch (error) {
        return res.status(500).json({message: "SOMETHING WENT WRONG", error: error.message});
    }
}

export const updateUserProfile = async (req, res) => {

    try {
        const {token , ...newUserData} = req.body;
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(400).json({message: "USER NOT FOUND"});
        }
        const {username , email} = newUserData; 
        const existingUser = await User.findOne({$or: [{email: email}, {username: username}]}); 
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({message: "EMAIL OR USERNAME ALREADY IN USE"});
        }
        Object.assign(user, newUserData);
        await user.save();
        return res.json({message: "USER PROFILE UPDATED SUCCESSFULLY", user: user});

    } catch (error) {
        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(401).json({ message: "TOKEN REQUIRED" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(400).json({ message: "USER NOT FOUND" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
    .populate("userId", "name email username ProfilePicture");

        return res.json(userProfile);

    } catch (error) {
        return res.status(500).json({
            message: "SOMETHING WENT WRONG",
            error: error.message
        });
    }
}

export const updateProfileData = async (req, res) => {
    try {
        const {token , ...newUserData} = req.body;
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(400).json({message: "USER NOT FOUND"});
        }
        const Profile_to_update = await Profile.findOne({userId : user._id});
        Object.assign(Profile_to_update, newUserData);
        await Profile_to_update.save();
        return res.json({message: "USER PROFILE UPDATED SUCCESSFULLY", profile: Profile_to_update});

        
    }catch (error) {
        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}   

export const getAllUsersProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate("userId", "name email username ProfilePicture");

        const validProfiles = profiles.filter(profile => profile.userId);

        return res.json(validProfiles);

    } catch (error) {
        return res.status(500).json({
            message: "SOMETHING WENT WRONG",
            error: error.message
        });
    }
};

export const downloadProfile = async (req, res) => {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({
        userId: user_id
    }).populate("userId", "name email username ProfilePicture");

    if (!userProfile) {
    return res.status(404).json({
        message: "Profile not found"
    });
}

    let outPutPath = await convertToPDF(userProfile);

    return res.json({pdf: outPutPath });
} 


export  const sendConnectionRequest = async (req, res) => {
    
        const { token , connectionId} = req.body;

        try {
            const user = await User.findOne({ token: token });
            if(!user){
                return res.status(400).json({message:"USER NOT FOUND"});
            }

            const connectionUser = await User.findById(connectionId);
            if(!connectionUser){
                return res.status(400).json({message:"CONNECTION USER NOT FOUND"});
            }

            const existingRequest = await ConnectionRequest.findOne({
                userId: user._id,
                connectionId: connectionId
            });

            if(existingRequest){
                return res.status(400).json({message:"CONNECTION REQUEST ALREADY SENT"});
            }

            const newConnectionRequest = new ConnectionRequest({
                userId: user._id,
                connectionId: connectionId,
                status_accepted: null
            });

            await newConnectionRequest.save();
            
            return res.json({message:"CONNECTION REQUEST SENT SUCCESSFULLY"});

        } catch (error) {
            return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
        }
}


export const getMyConnectionRequests = async (req, res) => {
    const { token } = req.headers;

    try {
        const user = await User.findOne({ token: token });
        if(!user){
            return res.status(400).json({message:"USER NOT FOUND"});
        }

        const connectionRequests = await ConnectionRequest.find({
            userId: user._id,
            status_accepted: null
        }).populate("connectionId", "name email username ProfilePicture");

        return res.json(connectionRequests);
        
    } catch (error) {
        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}

export const whatAreMyConnections = async (req, res) => {
    const { token } = req.headers;

    try {
        const user = await User.findOne({ token: token });
        if(!user){
            return res.status(400).json({message:"USER NOT FOUND"});
        }   
        
        // Get connections in BOTH directions
        // 1. Requests others sent TO me
        const receivedRequests = await ConnectionRequest.find({ connectionId: user._id})
            .populate("userId", "name email username ProfilePicture");
            
        // 2. Requests I sent to others
        const sentRequests = await ConnectionRequest.find({ userId: user._id})
            .populate("connectionId", "name email username ProfilePicture");
        
        // Combine both arrays
        const allConnections = [...receivedRequests, ...sentRequests];

        return res.json(allConnections);
        
    } catch (error) {
        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}

export const acceptConnectionRequest = async (req, res) => {
    const { token , requestId , action_type} = req.body;

    try {
        const user = await User.findOne({ token: token });

        if(!user){
            return res.status(400).json({message:"USER NOT FOUND"});
        }

        const connection  = await ConnectionRequest.findById(requestId);

        if(!connection){
            return res.status(400).json({message:"CONNECTION REQUEST NOT FOUND"});
        }

        if(action_type === "accept"){
            connection.status_accepted = true;
        } else {
            connection.status_accepted = false;
        }
        
        await connection.save();

        return res.json({message:"CONNECTION REQUEST UPDATED SUCCESSFULLY"});

    } catch (error) {
        return res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}

export const getUserProfileAndUsersBasedOnUserName = async (req ,res) => {
    const { username } = req.query;
    try{
        const user = await User.findOne({username : username});
        if(!user){
            return res.status(400).json({message :"USER NOT FOUND"})
        }
        const profile = await Profile.findOne({userId : user._id}).populate("userId", "name email username ProfilePicture");

        return res.json(profile);


    }catch(error){
        res.status(500).json({message : "SOMETHING WENT WRONG" , error : error.message})
    }
}