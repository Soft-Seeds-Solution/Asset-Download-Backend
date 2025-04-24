import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoUrl = process.env.Mongodb_Url;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Error: ", error.message);
        process.exit(1);
    }
}

export default connectDB;