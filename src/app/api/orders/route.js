
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectDB from "@/lib/mongodb";
// import Product from "@/models/Product";
// import Order from "@/models/Order";
// import { authenticateUser } from "@/middlewares/authenticateUser";

// const DELIVERY_FEE = 200;

// export async function POST(request) {
//     try {
//         const user = await authenticateUser();

//         if (!user) {
//             return NextResponse.json(
//                 { success: false, message: "Please login first" },
//                 { status: 401 }
//             );
//         }

//         const body = await request.json();
//         const { items, deliveryAddress, phone } = body;

//         if (!Array.isArray(items) || items.length === 0) {
//             return NextResponse.json(
//                 { success: false, message: "Your cart is empty" },
//                 { status: 400 }
//             );
//         }

//         if (items.length > 30) {
//             return NextResponse.json(
//                 { success: false, message: "Too many items in one order" },
//                 { status: 400 }
//             );
//         }

//         if (
//             typeof deliveryAddress !== "string" ||
//             deliveryAddress.trim().length < 10 ||
//             deliveryAddress.trim().length > 500
//         ) {
//             return NextResponse.json(
//                 { success: false, message: "Please enter a valid delivery address" },
//                 { status: 400 }
//             );
//         }

//         if (
//             typeof phone !== "string" ||
//             !/^[0-9+\-\s()]{10,20}$/.test(phone.trim())
//         ) {
//             return NextResponse.json(
//                 { success: false, message: "Please enter a valid phone number" },
//                 { status: 400 }
//             );
//         }

//         await connectDB();

//         const orderItems = [];
//         let subtotal = 0;

//         for (const item of items) {
//             if (
//                 !mongoose.Types.ObjectId.isValid(item.product) ||
//                 !Number.isInteger(item.quantity) ||
//                 item.quantity < 1 ||
//                 item.quantity > 20
//             ) {
//                 return NextResponse.json(
//                     { success: false, message: "Invalid cart item" },
//                     { status: 400 }
//                 );
//             }

//             const product = await Product.findOne({
//                 _id: item.product,
//                 isAvailable: true,
//             }).populate("category", "name");

//             if (!product || !product.category || !product.category.isActive) {
//                 return NextResponse.json(
//                     { success: false, message: "A selected pizza is unavailable" },
//                     { status: 400 }
//                 );
//             }

//             let unitPrice = product.price;
//             let sizeName = "Regular";

//             if (product.sizes?.length > 0) {
//                 const selectedSize = product.sizes.find(
//                     (size) => size.name === item.size
//                 );

//                 if (!selectedSize) {
//                     return NextResponse.json(
//                         { success: false, message: "Invalid pizza size" },
//                         { status: 400 }
//                     );
//                 }

//                 unitPrice = selectedSize.price;
//                 sizeName = selectedSize.name;
//             }

//             const requestedToppings = item.toppings || [];

//             if (
//                 !Array.isArray(requestedToppings) ||
//                 requestedToppings.length > 20
//             ) {
//                 return NextResponse.json(
//                     { success: false, message: "Invalid toppings" },
//                     { status: 400 }
//                 );
//             }

//             const selectedToppings = [];

//             for (const requested of requestedToppings) {
//                 const topping = product.toppings.find(
//                     (available) => available.name === requested.name
//                 );

//                 if (!topping) {
//                     return NextResponse.json(
//                         { success: false, message: "Invalid topping selected" },
//                         { status: 400 }
//                     );
//                 }

//                 selectedToppings.push({
//                     name: topping.name,
//                     price: topping.price || 0,
//                 });

//                 unitPrice += topping.price || 0;
//             }

//             subtotal += unitPrice * item.quantity;

//             orderItems.push({
//                 product: product._id,
//                 name: product.name,
//                 image: product.images?.[0]?.url || "",
//                 quantity: item.quantity,
//                 size: sizeName,
//                 price: unitPrice,
//                 toppings: selectedToppings,
//             });
//         }

//         const totalAmount = subtotal + DELIVERY_FEE;

//         const order = await Order.create({
//             orderNumber: `PH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//             user: user._id,
//             items: orderItems,
//             subtotal,
//             deliveryFee: DELIVERY_FEE,
//             totalAmount,
//             deliveryAddress: deliveryAddress.trim(),
//             phone: phone.trim(),
//             paymentMethod: "COD",
//             paymentStatus: "Pending",
//             status: "Pending",
//             statusHistory: [
//                 {
//                     status: "Pending",
//                     updatedAt: new Date(),
//                 },
//             ],
//         });

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Your order has been placed successfully!",
//                 order: {
//                     orderNumber: order.orderNumber,
//                     totalAmount: order.totalAmount,
//                     status: order.status,
//                 },
//             },
//             { status: 201 }
//         );

//     } catch (error) {
//         console.error("Create order error:", error);

//         return NextResponse.json(
//             { success: false, message: "Failed to place your order" },
//             { status: 500 }
//         );
//     }
// }



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { authenticateUser } from "@/middlewares/authenticateUser";

const DELIVERY_FEE = 200;

export async function POST(request) {
    try {
        // 1. Authenticate customer
        const user = await authenticateUser();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Please login first" },
                { status: 401 }
            );
        }

        // 2. Get request data
        const body = await request.json();

        const { items, deliveryAddress, phone } = body;

        // 3. Validate cart
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "Your cart is empty" },
                { status: 400 }
            );
        }

        if (items.length > 30) {
            return NextResponse.json(
                { success: false, message: "Too many items in one order" },
                { status: 400 }
            );
        }

        // 4. Validate delivery address
        if (
            typeof deliveryAddress !== "string" ||
            deliveryAddress.trim().length < 10 ||
            deliveryAddress.trim().length > 500
        ) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid delivery address" },
                { status: 400 }
            );
        }

        // 5. Validate phone number
        if (
            typeof phone !== "string" ||
            !/^[0-9+\-\s()]{10,20}$/.test(phone.trim())
        ) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid phone number" },
                { status: 400 }
            );
        }

        await connectDB();

        const orderItems = [];
        let subtotal = 0;

        // 6. Validate every cart item
        for (const item of items) {
            if (
                !item ||
                !mongoose.Types.ObjectId.isValid(item.product) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 20
            ) {
                return NextResponse.json(
                    { success: false, message: "Invalid cart item" },
                    { status: 400 }
                );
            }

            // 7. Find available product and active category
            const product = await Product.findOne({
                _id: item.product,
                isAvailable: true,
            }).populate({
                path: "category",
                match: { isActive: true },
                select: "name isActive",
            });

            if (!product || !product.category) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "A selected pizza is unavailable. Please refresh your cart.",
                    },
                    { status: 400 }
                );
            }

            // 8. Calculate size price from database
            let unitPrice = product.price;
            let sizeName = "Regular";

            if (product.sizes?.length > 0) {
                const selectedSize = product.sizes.find(
                    (size) => size.name === item.size
                );

                if (!selectedSize) {
                    return NextResponse.json(
                        { success: false, message: "Invalid pizza size" },
                        { status: 400 }
                    );
                }

                unitPrice = selectedSize.price;
                sizeName = selectedSize.name;
            }

            // 9. Validate toppings
            const requestedToppings = item.toppings || [];

            if (
                !Array.isArray(requestedToppings) ||
                requestedToppings.length > 20
            ) {
                return NextResponse.json(
                    { success: false, message: "Invalid toppings" },
                    { status: 400 }
                );
            }

            const selectedToppings = [];

            for (const requested of requestedToppings) {
                if (
                    !requested ||
                    typeof requested.name !== "string"
                ) {
                    return NextResponse.json(
                        { success: false, message: "Invalid topping selected" },
                        { status: 400 }
                    );
                }

                const topping = product.toppings?.find(
                    (available) => available.name === requested.name
                );

                if (!topping) {
                    return NextResponse.json(
                        { success: false, message: "Invalid topping selected" },
                        { status: 400 }
                    );
                }

                const toppingPrice = topping.price || 0;

                selectedToppings.push({
                    name: topping.name,
                    price: toppingPrice,
                });

                unitPrice += toppingPrice;
            }

            // 10. Calculate subtotal
            subtotal += unitPrice * item.quantity;

            // 11. Prepare order item
            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images?.[0]?.url || "",
                quantity: item.quantity,
                size: sizeName,
                price: unitPrice,
                toppings: selectedToppings,
            });
        }

        // 12. Calculate final amount
        const totalAmount = subtotal + DELIVERY_FEE;

        // 13. Create order
        const order = await Order.create({
            orderNumber: `PH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            user: user._id,
            items: orderItems,
            subtotal,
            deliveryFee: DELIVERY_FEE,
            totalAmount,
            deliveryAddress: deliveryAddress.trim(),
            phone: phone.trim(),
            paymentMethod: "COD",
            paymentStatus: "Pending",
            status: "Pending",
            statusHistory: [
                {
                    status: "Pending",
                    updatedAt: new Date(),
                },
            ],
        });

        // 14. Send success response
        return NextResponse.json(
            {
                success: true,
                message: "Your order has been placed successfully!",
                order: {
                    orderNumber: order.orderNumber,
                    totalAmount: order.totalAmount,
                    status: order.status,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create order error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to place your order",
            },
            { status: 500 }
        );
    }
}
