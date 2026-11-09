
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
    Package,
    CheckCircle,
    Clock,
    ChefHat,
    Bike,
    MapPin,
    Phone,
    ArrowLeft,
    RefreshCw,
    XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const ORDER_STEPS = [
    { status: "Pending", label: "Order Placed", icon: Clock },
    { status: "Confirmed", label: "Order Confirmed", icon: CheckCircle },
    { status: "Preparing", label: "Preparing", icon: ChefHat },
    { status: "Out for Delivery", label: "Out for Delivery", icon: Bike },
    { status: "Delivered", label: "Delivered", icon: Package },
];

export default function OrderDetailsPage() {
    const params = useParams();
    const orderNumber = params.orderNumber;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async (showError = false) => {
        try {
            const { data } = await axios.get(
                `/api/orders/${encodeURIComponent(orderNumber)}`
            );

            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            if (showError) {
                toast.error(
                    error.response?.data?.message || "Failed to load order"
                );
            }
        } finally {
            setLoading(false);
        }
    }, [orderNumber]);

    useEffect(() => {
        if (!orderNumber) return;

        fetchOrder(true);

        const interval = setInterval(() => {
            fetchOrder(false);
        }, 15000);

        return () => clearInterval(interval);
    }, [orderNumber, fetchOrder]);

    const getStepIndex = (status) => {
        return ORDER_STEPS.findIndex(
            (step) => step.status === status
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF8EF]">
                <RefreshCw className="animate-spin text-[#E94B35]" size={35} />
            </div>
        );
    }

    if (!order) {
        return (
            <main className="min-h-screen bg-[#FFF8EF] flex items-center justify-center p-5">
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                    <Package size={50} className="mx-auto text-gray-300 mb-4" />
                    <h1 className="text-2xl font-bold">Order Not Found</h1>
                    <p className="text-gray-500 mt-2">
                        We couldn't find this order.
                    </p>
                    <Link href="/orders" className="inline-block mt-6 bg-[#E94B35] text-white px-6 py-3 rounded-xl">
                        My Orders
                    </Link>
                </div>
            </main>
        );
    }

    const isCancelled = order.status === "Cancelled";
    const currentStep = getStepIndex(order.status);

    return (
        <main className="min-h-screen bg-[#FFF8EF] px-4 py-10">
            <div className="max-w-5xl mx-auto">

                <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E94B35] mb-7"
                >
                    <ArrowLeft size={18} />
                    Back to My Orders
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Order Number
                            </p>
                            <h1 className="text-2xl md:text-3xl font-bold text-[#171717] mt-1">
                                {order.orderNumber}
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">
                                Placed on {new Date(order.createdAt).toLocaleString("en-PK")}
                            </p>
                        </div>

                        <button
                            onClick={() => fetchOrder(true)}
                            className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 rounded-xl hover:bg-gray-50"
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Order Tracking */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-xl font-bold text-[#171717] mb-7">
                        Order Tracking
                    </h2>

                    {isCancelled ? (
                        <div className="flex items-center gap-3 bg-red-50 text-red-700 p-5 rounded-xl">
                            <XCircle size={28} />
                            <div>
                                <p className="font-bold">Order Cancelled</p>
                                <p className="text-sm">
                                    This order has been cancelled.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {ORDER_STEPS.map((step, index) => {
                                const Icon = step.icon;
                                const completed = index <= currentStep;

                                return (
                                    <div key={step.status} className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                                            completed
                                                ? "bg-[#E94B35] text-white"
                                                : "bg-gray-100 text-gray-400"
                                        }`}>
                                            <Icon size={21} />
                                        </div>

                                        <div>
                                            <p className={`font-semibold ${
                                                completed ? "text-[#171717]" : "text-gray-400"
                                            }`}>
                                                {step.label}
                                            </p>

                                            {order.statusHistory?.some(
                                                (history) => history.status === step.status
                                            ) && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(
                                                        order.statusHistory.find(
                                                            (history) => history.status === step.status
                                                        ).updatedAt
                                                    ).toLocaleString("en-PK")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <p className="text-xs text-gray-400 mt-7">
                        Order status refreshes automatically every 15 seconds.
                    </p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-xl font-bold mb-6">
                        Ordered Items
                    </h2>

                    <div className="space-y-5">
                        {order.items?.map((item, index) => (
                            <div key={index} className="flex gap-4 border-b border-gray-100 pb-5 last:border-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <Package className="text-[#E94B35]" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h3 className="font-bold text-[#171717]">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Size: {item.size} · Quantity: {item.quantity}
                                    </p>

                                    {item.toppings?.length > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Toppings: {item.toppings.map(t => t.name).join(", ")}
                                        </p>
                                    )}
                                </div>

                                <p className="font-bold text-[#171717]">
                                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery and Payment */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-lg mb-5">
                            Delivery Information
                        </h2>

                        <div className="flex gap-3 mb-4">
                            <MapPin className="text-[#E94B35] shrink-0" />
                            <p className="text-sm text-gray-600">
                                {order.deliveryAddress}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Phone className="text-[#E94B35] shrink-0" />
                            <p className="text-sm text-gray-600">
                                {order.phone}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="font-bold text-lg mb-5">
                            Payment Summary
                        </h2>

                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-gray-500">Subtotal</span>
                            <span>Rs. {order.subtotal?.toLocaleString("en-PK")}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-gray-500">Delivery Fee</span>
                            <span>Rs. {order.deliveryFee?.toLocaleString("en-PK")}</span>
                        </div>

                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-[#E94B35]">
                                Rs. {order.totalAmount?.toLocaleString("en-PK")}
                            </span>
                        </div>

                        <div className="mt-4 flex justify-between text-sm">
                            <span className="text-gray-500">Payment Method</span>
                            <span>{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">Payment Status</span>
                            <span>{order.paymentStatus}</span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-[#E94B35] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#d83d29] transition"
                >
                    Order More Pizza
                </Link>

            </div>
        </main>
    );
}
