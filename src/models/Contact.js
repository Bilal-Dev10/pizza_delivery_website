
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ["New", "Read", "Replied"],
            default: "New",
        },
    },
    { timestamps: true }
);

const Contact =
    mongoose.models.Contact ||
    mongoose.model("Contact", contactSchema);

export default Contact;
