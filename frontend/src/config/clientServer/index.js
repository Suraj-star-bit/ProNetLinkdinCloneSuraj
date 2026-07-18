import axios from "axios";

export const BASE_URL = "http://localhost:9050/api";
export const UPLOADS_BASE = "http://localhost:9050/uploads";

const clientServer = axios.create({
    baseURL: BASE_URL,
});

export default clientServer;