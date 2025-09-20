// Create Admin User Script
// Run this once to create the admin user
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const adminEmail = "admin@urbangreen.com";
        const adminPassword = "admin123"; // Change this password!
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("❌ Admin user already exists!");
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create the admin user
        const adminUser = new User({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            provider: "local",
            role: "admin"
        });

        await adminUser.save();
        console.log("✅ Admin user created successfully!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log("⚠️  Please change the password after first login!");

    } catch (error) {
        console.error("❌ Error creating admin user:", error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();