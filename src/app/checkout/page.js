
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
    const router = useRouter();

    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        deliveryAddress: "",
    });

    useEffect(() => {
        async function loadCheckout() {
            try {
                const savedCart = JSON.parse(
                    localStorage.getItem("pizza-cart") || "[]"
                );

                if (!Array.isArray(savedCart) || savedCart.length === 0) {
                    toast.error("Your cart is empty");
                    router.replace("/menu");
                    return;
                }

                setCart(savedCart);

                const response = await fetch("/api/auth/me");
                const data = await response.json();

                if (!response.ok || !data.user) {
                    toast.error("Please login before checkout");
                    router.replace("/login?redirect=/checkout");
                    return;
                }

                setUser(data.user);

                setForm({
                    name: data.user.name || "",
                    phone: data.user.phone || "",
                    deliveryAddress: data.user.address || "",
                });
            } catch (error) {
                console.error("Checkout loading error:", error);
                toast.error("Unable to load checkout");
            } finally {
                setLoading(false);
            }
        }

        loadCheckout();
    }, [router]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const subtotal = cart.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    const deliveryFee = cart.length > 0 ? 200 : 0;
    const total = subtotal + deliveryFee;

    async function handlePlaceOrder(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!/^[0-9+\-\s()]{10,20}$/.test(form.phone.trim())) {
            toast.error("Please enter a valid phone number");
            return;
        }

        if (form.deliveryAddress.trim().length < 10) {
            toast.error("Please enter your complete delivery address");
            return;
        }

        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setPlacingOrder(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        product: item.product,
                        size: item.size,
                        toppings: item.toppings,
                        quantity: item.quantity,
                    })),
                    deliveryAddress: form.deliveryAddress,
                    phone: form.phone,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Unable to place order");
                return;
            }

            localStorage.removeItem("pizza-cart");

            toast.success("Your order has been placed!");

            router.push(
                `/order-success?orderNumber=${encodeURIComponent(
                    data.order.orderNumber
                )}`
            );
        } catch (error) {
            console.error("Place order error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF8EF]">
                Loading checkout...
            </div>
        );
    }

    if (!user || cart.length === 0) return null;

    return (
        <main className="min-h-screen bg-[#FFF8EF] px-5 py-12">
            <div className="mx-auto max-w-6xl">

                <Link
                    href="/cart"
                    className="mb-7 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-[#E94B35]"
                >
                    <ArrowLeft size={19} />
                    Back to Cart
                </Link>

                <h1 className="text-3xl font-extrabold text-[#171717] md:text-4xl">
                    Checkout
                </h1>

                <p className="mt-2 text-gray-500">
                    Complete your delivery information to place your order.
                </p>

                <form
                    onSubmit={handlePlaceOrder}
                    className="mt-9 grid gap-8 lg:grid-cols-3"
                >
                    {/* Customer Details */}
                    <div className="space-y-6 lg:col-span-2">

                        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                            <h2 className="mb-6 text-xl font-extrabold text-[#171717]">
                                Delivery Information
                            </h2>

                            <div className="space-y-5">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Full Name
                                    </label>

                                    <div className="relative">
                                        <User
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-[#E94B35]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Phone Number
                                    </label>

                                    <div className="relative">
                                        <Phone
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="03XXXXXXXXX"
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-[#E94B35]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Complete Delivery Address
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={19}
                                            className="absolute left-4 top-4 text-gray-400"
                                        />

                                        <textarea
                                            name="deliveryAddress"
                                            value={form.deliveryAddress}
                                            onChange={handleChange}
                                            placeholder="House number, street, area, city..."
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-[#E94B35]"
                                            required
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                            <h2 className="text-xl font-extrabold text-[#171717]">
                                Payment Method
                            </h2>

                            <div className="mt-5 flex items-center gap-4 rounded-xl border-2 border-[#E94B35] bg-[#FFF8EF] p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E94B35] text-white">
                                    <ShoppingBag size={22} />
                                </div>

                                <div>
                                    <p className="font-bold text-[#171717]">
                                        Cash on Delivery
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Pay when your pizza arrives.
                                    </p>
                                </div>

                                <span className="ml-auto text-[#E94B35]">
                                    ✓
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-extrabold text-[#171717]">
                            Your Order
                        </h2>

                        <div className="max-h-64 space-y-4 overflow-y-auto">
                            {cart.map((item, index) => (
                                <div
                                    key={`${item.product}-${index}`}
                                    className="flex justify-between gap-3"
                                >
                                    <div>
                                        <p className="font-semibold text-[#171717]">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.size} × {item.quantity}
                                        </p>
                                    </div>

                                    <p className="shrink-0 font-semibold">
                                        Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="my-5 border-t border-gray-100" />

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-semibold">
                                    Rs. {subtotal.toLocaleString("en-PK")}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="font-semibold">
                                    Rs. {deliveryFee.toLocaleString("en-PK")}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-gray-100 pt-4">
                                <span className="font-bold">Total</span>
                                <span className="text-xl font-extrabold text-[#E94B35]">
                                    Rs. {total.toLocaleString("en-PK")}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={placingOrder}
                            className="mt-7 w-full rounded-xl bg-[#E94B35] py-4 font-bold text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {placingOrder ? "Placing Order..." : "Place Order"}
                        </button>

                        <p className="mt-4 text-center text-xs text-gray-400">
                            Your order will be confirmed by our team.
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}
