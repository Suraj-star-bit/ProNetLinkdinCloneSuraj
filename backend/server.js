import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import usersRoutes from "./routes/users.routes.js";   

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(postsRoutes);
app.use(usersRoutes); 
app.use("/uploads", express.static("uploads"));
app.use("/api", postsRoutes);
app.use("/api", usersRoutes);

const start = async () => {
  try {

    console.log("Connecting DB...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected DB:", mongoose.connection.name);

    app.listen(9050, () => {
      console.log("Server is running on port 9050");
    });

  } catch (error) {
    console.error(error);
  }
};
start();