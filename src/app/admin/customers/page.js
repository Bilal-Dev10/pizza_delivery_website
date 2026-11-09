"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Users,
    UserCheck,
    UserX,
    Search,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
} from "lucide-react";

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/admin/customers");

            if (data.success) {
                setCustomers(data.customers || []);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load customers"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                customer.name?.toLowerCase().includes(searchValue) ||
                customer.email?.toLowerCase().includes(searchValue) ||
                customer.phone?.toLowerCase().includes(searchValue);

            const matchesFilter =
                filter === "All" ||
                (filter === "Active" && customer.isActive) ||
                (filter === "Inactive" && !customer.isActive);

            return matchesSearch && matchesFilter;
        });
    }, [customers, search, filter]);

    const activeCustomers = customers.filter(
        (customer) => customer.isActive
    ).length;

    const inactiveCustomers = customers.length - activeCustomers;

    const stats = [
        {
            title: "Total Customers",
            value: customers.length,
            icon: Users,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Active Customers",
            value: activeCustomers,
            icon: UserCheck,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Inactive Customers",
            value: inactiveCustomers,
            icon: UserX,
            color: "bg-red-100 text-red-600",
        },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#171717]">
                        Customers
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage and view all registered customers.
                    </p>
                </div>

                <button
                    onClick={fetchCustomers}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-[#E94B35] hover:bg-[#d63d29] text-white px-4 py-2.5 rounded-lg font-medium transition disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-[#171717] mt-2">
                                        {loading ? "..." : stat.value}
                                    </h2>
                                </div>

                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <Icon size={23} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search and Filter */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">

                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#E94B35]"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#E94B35] bg-white"
                    >
                        <option value="All">All Customers</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-[#171717]">
                        Customer List
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {filteredCustomers.length} customers found
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading customers...
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="py-16 text-center">
                        <Users
                            size={40}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <p className="font-semibold text-gray-700">
                            No customers found
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Try changing your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">

                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Contact
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Address
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Joined
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer._id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#FFF0EB] text-[#E94B35] flex items-center justify-center font-bold">
                                                    {customer.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {customer.name}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        Customer
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="space-y-1.5 text-sm text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <Mail size={14} />
                                                    {customer.email}
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <Phone size={14} />
                                                    {customer.phone || "Not provided"}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="flex items-start gap-2 text-sm text-gray-600 max-w-[220px]">
                                                <MapPin
                                                    size={15}
                                                    className="mt-0.5 shrink-0"
                                                />
                                                <span>
                                                    {customer.address || "Not provided"}
                                                </span>
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                                                <CalendarDays size={15} />

                                                {customer.createdAt
                                                    ? new Date(
                                                        customer.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {customer.isActive
                                                    ? "Active"
                                                    : "Inactive"}
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