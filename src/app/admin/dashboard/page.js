
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
    ShoppingBag,
    Wallet,
    Users,
    Pizza,
    Clock,
    CheckCircle,
    RefreshCw,
    ArrowUpRight,
    Package,
} from "lucide-react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/admin/dashboard");

            if (data.success) {
                setStats(data.stats);
                setRecentOrders(data.recentOrders);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const cards = [
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: "bg-orange-100 text-orange-600",
        },
        {
            title: "Total Revenue",
            value: `Rs. ${stats.totalRevenue.toLocaleString("en-PK")}`,
            icon: Wallet,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Customers",
            value: stats.totalCustomers,
            icon: Users,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Products",
            value: stats.totalProducts,
            icon: Pizza,
            color: "bg-purple-100 text-purple-600",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            title: "Delivered Orders",
            value: stats.deliveredOrders,
            icon: CheckCircle,
            color: "bg-emerald-100 text-emerald-600",
        },
    ];

    const statusStyle = (status) => {
        const styles = {
            Pending: "bg-orange-100 text-orange-700",
            Confirmed: "bg-yellow-100 text-yellow-700",
            Preparing: "bg-blue-100 text-blue-700",
            "Out for Delivery": "bg-purple-100 text-purple-700",
            Delivered: "bg-green-100 text-green-700",
            Cancelled: "bg-red-100 text-red-700",
        };

        return styles[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <RefreshCw
                    size={35}
                    className="animate-spin text-[#E94B35]"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-[#E94B35]">
                        PIZZA HOUSE ADMIN
                    </p>

                    <h1 className="text-3xl font-bold text-[#171717] mt-1">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Welcome back! Here's what's happening with your business.
                    </p>
                </div>

                <button
                    onClick={fetchDashboard}
                    className="flex items-center justify-center gap-2 bg-[#171717] text-white px-5 py-3 rounded-xl hover:bg-[#E94B35] transition"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {card.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-[#171717] mt-3">
                                        {card.value}
                                    </h2>
                                </div>

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-[#171717]">
                            Recent Orders
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Your latest customer orders.
                        </p>
                    </div>

                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-2 text-[#E94B35] font-semibold text-sm hover:underline"
                    >
                        View All Orders
                        <ArrowUpRight size={17} />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="py-16 text-center">
                        <Package
                            size={45}
                            className="mx-auto text-gray-300 mb-3"
                        />
                        <p className="font-semibold text-gray-700">
                            No orders yet
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Order Number</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-semibold text-[#171717]">
                                            {order.orderNumber}
                                        </td>

                                        <td className="px-6 py-4">
                                            {order.user?.name || "Customer"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString("en-PK")}
                                        </td>

                                        <td className="px-6 py-4 font-semibold whitespace-nowrap">
                                            Rs. {order.totalAmount?.toLocaleString("en-PK")}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
