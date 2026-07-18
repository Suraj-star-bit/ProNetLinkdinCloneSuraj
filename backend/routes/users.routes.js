import {Router} from "express";
import { register } from "../controllers/users.controller.js";
import { login } from "../controllers/users.controller.js";
import { updateProfilePicture } from "../controllers/users.controller.js";
import { updateUserProfile } from "../controllers/users.controller.js";
import { getUserAndProfile } from "../controllers/users.controller.js";
import { updateProfileData } from "../controllers/users.controller.js";
import { getAllUsersProfiles } from "../controllers/users.controller.js";
import { downloadProfile } from "../controllers/users.controller.js";
import { convertToPDF } from "../controllers/users.controller.js";
import { sendConnectionRequest } from "../controllers/users.controller.js";
import { getMyConnectionRequests } from "../controllers/users.controller.js";
import { whatAreMyConnections } from "../controllers/users.controller.js";
import { acceptConnectionRequest } from "../controllers/users.controller.js";
import { getUserProfileAndUsersBasedOnUserName } from "../controllers/users.controller.js";
import multer from "multer";


const router = Router(); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route("/update_profile_picture").post(upload.single('profilePicture'), updateProfilePicture); 

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users_profiles").get(getAllUsersProfiles);
router.route("/download_profile").get(downloadProfile);
router.route("/send_connection_request").post(sendConnectionRequest);
router.route("/get_connection_requests").get(getMyConnectionRequests);
router.route("/my_connections").get(whatAreMyConnections);
router.route("/accept_connection_request").post(acceptConnectionRequest);
router.route("/get_user_profile_and_users_based_on_username").get(getUserProfileAndUsersBasedOnUserName);

export default router;