import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    isActive: Boolean,
});

const Admin =
    mongoose.models.User ||
    mongoose.model("User", adminSchema);

async function createAdmin() {
    try {
        const {
            MONGODB_URI,
            ADMIN_NAME,
            ADMIN_EMAIL,
            ADMIN_PASSWORD,
        } = process.env;

        if (
            !MONGODB_URI ||
            !ADMIN_NAME ||
            !ADMIN_EMAIL ||
            !ADMIN_PASSWORD
        ) {
            throw new Error(
                "Please configure admin environment variables"
            );
        }

        if (ADMIN_PASSWORD.length < 8 ||
            ADMIN_PASSWORD.length > 72) {
            throw new Error(
                "Admin password must be between 8 and 72 characters"
            );
        }

        await mongoose.connect(MONGODB_URI);

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const existingAdmin = await Admin.findOne({
            email,
        });

        if (existingAdmin) {
            console.log(
                "An account with this email already exists. No changes made."
            );
            return;
        }

        const hashedPassword = await bcrypt.hash(
            ADMIN_PASSWORD,
            12
        );

        await Admin.create({
            name: ADMIN_NAME.trim(),
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
        });

        console.log("Admin account created successfully!");

    } catch (error) {
        console.error("Admin creation error:", error);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();