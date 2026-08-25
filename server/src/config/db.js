import mongoose from "mongoose";
import dns from "dns";
import { initSupabaseDB, isSupabaseConfigured } from "./supabase.js";

const connectDB = async () => {
    // 1. Initialize Supabase / Cloud PostgreSQL
    if (isSupabaseConfigured) {
        await initSupabaseDB();
        return;
    }

    // 2. Fallback to MongoDB if Supabase keys not provided
    try {
        if (process.env.MONGO_URI && process.env.MONGO_URI.includes("+srv://")) {
            try {
                dns.setServers(["8.8.8.8", "1.1.1.1"]);
            } catch (dnsErr) {}
        }
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mini_store";
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected (fallback mode)");
    } catch (error) {
        console.warn("MongoDB connection warning:", error.message);
    }
};

export default connectDB;