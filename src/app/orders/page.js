
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
    Package,
    ShoppingBag,
    Clock,
    ChevronRight,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/orders/my-orders");

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            case "Preparing":
            case "Out for Delivery":
                return "bg-blue-100 text-blue-700";
            case "Confirmed":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-orange-100 text-orange-700";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF8EF]">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto text-[#E94B35]" size={35} />
                    <p className="mt-3 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFF8EF] px-4 py-12">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="text-[#E94B35] font-semibold text-sm mb-2">
                            PIZZA HOUSE
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#171717]">
                            My Orders
                        </h1>

                        <p className="text-gray-500 mt-2">
                            View and track all your pizza orders.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center justify-center gap-2 border border-gray-300 px-5 py-3 rounded-xl hover:bg-white transition"
                    >
                        <RefreshCw size={17} />
                        Refresh Orders
                    </button>
                </div>

                {/* Empty Orders */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                        <ShoppingBag
                            size={55}
                            className="mx-auto text-gray-300 mb-5"
                        />

                        <h2 className="text-2xl font-bold text-[#171717]">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-500 mt-2 mb-7">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-2 bg-[#E94B35] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#d83d29] transition"
                        >
                            <ShoppingBag size={18} />
                            Order Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                                    {/* Order Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#E94B35] shrink-0">
                                            <Package size={25} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg text-[#171717]">
                                                {order.orderNumber}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleString("en-PK", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </p>

                                            <p className="text-sm text-gray-600 mt-2">
                                                {order.items?.length || 0} different item(s)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price and Status */}
                                    <div className="flex flex-wrap items-center gap-5 md:gap-8">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Total Amount
                                            </p>

                                            <p className="text-xl font-bold text-[#171717]">
                                                Rs. {order.totalAmount?.toLocaleString("en-PK")}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Order Status
                                            </p>

                                            <span
                                                className={`px-3 py-2 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/orders/${encodeURIComponent(order.orderNumber)}`}
                                            className="flex items-center gap-1 bg-[#171717] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#E94B35] transition"
                                        >
                                            Details
                                            <ChevronRight size={17} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="border-t border-gray-100 mt-5 pt-4 flex flex-wrap gap-3">
                                    {order.items?.slice(0, 3).map((item, index) => (
                                        <div
                                            key={index}
                                            className="text-sm text-gray-600 bg-[#FFF8EF] px-3 py-2 rounded-lg"
                                        >
                                            {item.name} × {item.quantity}
                                        </div>
                                    ))}

                                    {order.items?.length > 3 && (
                                        <span className="text-sm text-gray-500 px-2 py-2">
                                            +{order.items.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </main>
    );
}
