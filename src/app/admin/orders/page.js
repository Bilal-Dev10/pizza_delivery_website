
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Package,
    Search,
    RefreshCw,
    Eye,
    X,
    MapPin,
    Phone,
    User,
    Calendar,
} from "lucide-react";

const STATUSES = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
];

const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/admin/orders");

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
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateOrder = async (orderId, updates) => {
        try {
            setUpdatingId(orderId);

            const { data } = await axios.patch(
                `/api/admin/orders/${orderId}`,
                updates
            );

            if (data.success) {
                toast.success(data.message);

                setOrders((previous) =>
                    previous.map((order) =>
                        order._id === orderId
                            ? { ...order, ...data.order }
                            : order
                    )
                );

                setSelectedOrder((previous) =>
                    previous?._id === orderId
                        ? { ...previous, ...data.order }
                        : previous
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update order"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filter === "All" || order.status === filter;

        return matchesSearch && matchesStatus;
    });

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

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#171717]">
                        Orders Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage and track all customer orders.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#171717] text-white rounded-xl hover:bg-[#E94B35] transition disabled:opacity-50"
                >
                    <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Orders", value: orders.length },
                    {
                        label: "Pending",
                        value: orders.filter(o => o.status === "Pending").length,
                    },
                    {
                        label: "Preparing",
                        value: orders.filter(o => o.status === "Preparing").length,
                    },
                    {
                        label: "Delivered",
                        value: orders.filter(o => o.status === "Delivered").length,
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold mt-2 text-[#171717]">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search order number, customer name or email..."
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#E94B35]"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35]"
                >
                    <option value="All">All Statuses</option>
                    {STATUSES.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center text-gray-500">
                        <RefreshCw className="animate-spin mx-auto mb-3" size={30} />
                        Loading orders...
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                        <Package size={45} className="mx-auto text-gray-300 mb-3" />
                        <h3 className="font-bold text-lg">No Orders Found</h3>
                        <p className="text-gray-500 mt-1">
                            Try changing your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-5 py-4">Order</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Total</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Payment</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-semibold">
                                            {order.orderNumber}
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {order.user?.name || "Customer"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.user?.email || ""}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString("en-PK")}
                                        </td>

                                        <td className="px-5 py-4 font-semibold whitespace-nowrap">
                                            Rs. {order.totalAmount?.toLocaleString("en-PK")}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.paymentStatus}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex items-center gap-2 text-[#E94B35] font-semibold hover:underline"
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Order Details
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedOrder.orderNumber}
                                </p>
                            </div>

                            <button onClick={() => setSelectedOrder(null)}>
                                <X size={23} />
                            </button>
                        </div>

                        {/* Customer */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex gap-2 items-center font-semibold mb-2">
                                    <User size={17} />
                                    Customer
                                </div>
                                <p>{selectedOrder.user?.name || "Customer"}</p>
                                <p className="text-sm text-gray-500">
                                    {selectedOrder.user?.email}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex gap-2 items-center font-semibold mb-2">
                                    <Calendar size={17} />
                                    Order Date
                                </div>
                                <p>
                                    {new Date(selectedOrder.createdAt).toLocaleString("en-PK")}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex gap-2 items-center font-semibold mb-2">
                                    <MapPin size={17} />
                                    Delivery Address
                                </div>
                                <p className="text-sm text-gray-600">
                                    {selectedOrder.deliveryAddress}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex gap-2 items-center font-semibold mb-2">
                                    <Phone size={17} />
                                    Phone
                                </div>
                                <p>{selectedOrder.phone}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <h3 className="font-bold mb-3">Ordered Items</h3>

                        <div className="space-y-3 mb-6">
                            {selectedOrder.items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between gap-4 border-b pb-3"
                                >
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.size} × {item.quantity}
                                        </p>
                                        {item.toppings?.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                {item.toppings.map(t => t.name).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                    <p className="font-semibold whitespace-nowrap">
                                        Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>Rs. {selectedOrder.subtotal?.toLocaleString("en-PK")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Delivery Fee</span>
                                <span>Rs. {selectedOrder.deliveryFee?.toLocaleString("en-PK")}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-3">
                                <span>Total</span>
                                <span>Rs. {selectedOrder.totalAmount?.toLocaleString("en-PK")}</span>
                            </div>
                        </div>

                        {/* Update Status */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Order Status
                                </label>
                                <select
                                    value={selectedOrder.status}
                                    disabled={updatingId === selectedOrder._id}
                                    onChange={(e) =>
                                        updateOrder(selectedOrder._id, {
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-xl p-3 outline-none focus:border-[#E94B35]"
                                >
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Payment Status
                                </label>
                                <select
                                    value={selectedOrder.paymentStatus}
                                    disabled={updatingId === selectedOrder._id}
                                    onChange={(e) =>
                                        updateOrder(selectedOrder._id, {
                                            paymentStatus: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-xl p-3 outline-none focus:border-[#E94B35]"
                                >
                                    {PAYMENT_STATUSES.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {updatingId === selectedOrder._id && (
                            <p className="text-sm text-gray-500 mt-4">
                                Updating order...
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
