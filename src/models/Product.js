import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        images: [
            {
                url: {
                    type: String,
                    required: true,
                },

                public_id: {
                    type: String,
                    default: "",
                },
            },
        ],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        sizes: [
            {
                name: {
                    type: String,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],

        toppings: [
            {
                name: String,
                price: {
                    type: Number,
                    default: 0,
                },
            },
        ],

        isAvailable: {
            type: Boolean,
            default: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;