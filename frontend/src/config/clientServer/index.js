import axios from "axios";

export const BASE_URL = "https://pronetlinkdinclonesuraj-0d8f.onrender.com";
export const UPLOADS_BASE = "https://pronetlinkdinclonesuraj-0d8f.onrender.com/uplodes";

const clientServer = axios.create({
    baseURL: BASE_URL,
});

export default clientServer;