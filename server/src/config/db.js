import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
    try {
        if (process.env.MONGO_URI && process.env.MONGO_URI.includes("+srv://")) {
            try {
                dns.setServers(["8.8.8.8", "1.1.1.1"]);
            } catch (dnsErr) {
                // Ignore if custom DNS set fails
            }
        }
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mini_store";
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;