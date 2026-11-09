
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

const DELIVERY_FEE = 200;

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedCart = JSON.parse(
                localStorage.getItem("pizza-cart") || "[]"
            );

            setCart(Array.isArray(savedCart) ? savedCart : []);
        } catch (error) {
            console.error("Cart loading error:", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    }, []);

    function saveCart(updatedCart) {
        setCart(updatedCart);
        localStorage.setItem("pizza-cart", JSON.stringify(updatedCart));
    }

    function updateQuantity(index, change) {
        const updatedCart = [...cart];
        const newQuantity = updatedCart[index].quantity + change;

        if (newQuantity < 1) return;

        updatedCart[index].quantity = Math.min(newQuantity, 20);
        saveCart(updatedCart);
    }

    function removeItem(index) {
        const updatedCart = cart.filter((_, i) => i !== index);
        saveCart(updatedCart);
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF]">
                Loading your cart...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFF8EF] px-5 py-12">
            <div className="mx-auto max-w-6xl">

                <Link
                    href="/menu"
                    className="mb-7 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-[#E94B35]"
                >
                    <ArrowLeft size={19} />
                    Continue Shopping
                </Link>

                <h1 className="mb-2 text-3xl font-extrabold text-[#171717] md:text-4xl">
                    Your Shopping Cart
                </h1>

                <p className="mb-9 text-gray-500">
                    Review your delicious choices before checkout.
                </p>

                {cart.length === 0 ? (
                    <div className="rounded-2xl bg-white px-5 py-16 text-center shadow-sm">
                        <ShoppingBag
                            size={60}
                            className="mx-auto text-[#E94B35]"
                        />

                        <h2 className="mt-5 text-2xl font-bold text-[#171717]">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Add some delicious pizzas to get started.
                        </p>

                        <Link
                            href="/menu"
                            className="mt-7 inline-flex rounded-xl bg-[#E94B35] px-7 py-3 font-bold text-white hover:bg-[#171717]"
                        >
                            Explore Menu
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">

                        {/* Cart Items */}
                        <div className="space-y-5 lg:col-span-2">
                            {cart.map((item, index) => (
                                <div
                                    key={`${item.product}-${index}`}
                                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-36">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="144px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-xl font-bold text-[#171717]">
                                                    {item.name}
                                                </h3>

                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="text-gray-400 transition hover:text-red-500"
                                                    aria-label={`Remove ${item.name}`}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-500">
                                                Size: {item.size}
                                            </p>

                                            {item.toppings?.length > 0 && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Toppings:{" "}
                                                    {item.toppings
                                                        .map((topping) => topping.name)
                                                        .join(", ")}
                                                </p>
                                            )}

                                            <p className="mt-2 font-bold text-[#E94B35]">
                                                Rs. {Number(item.price).toLocaleString("en-PK")} each
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4 rounded-lg border border-gray-200 px-3 py-2">
                                                <button
                                                    onClick={() => updateQuantity(index, -1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span className="font-bold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => updateQuantity(index, 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <p className="font-extrabold text-[#171717]">
                                                Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-extrabold text-[#171717]">
                                Order Summary
                            </h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>
                                    <span className="font-semibold">
                                        Rs. {subtotal.toLocaleString("en-PK")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Delivery Fee
                                    </span>
                                    <span className="font-semibold">
                                        Rs. {deliveryFee.toLocaleString("en-PK")}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-[#171717]">
                                            Total
                                        </span>
                                        <span className="text-xl font-extrabold text-[#E94B35]">
                                            Rs. {total.toLocaleString("en-PK")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#E94B35] py-4 font-bold text-white transition hover:bg-[#171717]"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="mt-4 text-center text-xs text-gray-400">
                                Payment method: Cash on Delivery
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
