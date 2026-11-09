import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },

                name: {
                    type: String,
                    required: true,
                },

                image: {
                    type: String,
                    default: "",
                },

                quantity: {
                    type: Number,
                    required: true,
                },

                size: String,

                price: {
                    type: Number,
                    required: true,
                },

                toppings: [
                    {
                        name: String,
                        price: Number,
                    },
                ],
            },
        ],

        subtotal: {
            type: Number,
            required: true,
        },

        deliveryFee: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        deliveryAddress: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Preparing",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },

        statusHistory: [
            {
                status: String,
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

export default Order;