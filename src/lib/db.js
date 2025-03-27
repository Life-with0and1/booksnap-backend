import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const DB_URI = process.env.DB_URI;
        if (!DB_URI) {
            console.log("DB_URI not found");
            return;
        }
        await mongoose.connect(DB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error while connecting to database: ", error);
    }
}