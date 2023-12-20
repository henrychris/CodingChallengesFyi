import mongoose from "mongoose";

const DATABASE_URL = "mongodb://127.0.0.1:27017/url-shortener";

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

export default connectDB;
