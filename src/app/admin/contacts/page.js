
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Mail,
    MailOpen,
    MessageSquare,
    Search,
    Trash2,
    Eye,
    X,
    RefreshCw,
} from "lucide-react";

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedContact, setSelectedContact] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/admin/contacts");

            if (data.success) {
                setContacts(data.contacts);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load messages"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const filteredContacts = useMemo(() => {
        return contacts.filter((contact) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                contact.name.toLowerCase().includes(searchText) ||
                contact.email.toLowerCase().includes(searchText) ||
                contact.subject.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                contact.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [contacts, search, statusFilter]);

    const counts = {
        total: contacts.length,
        new: contacts.filter((item) => item.status === "New").length,
        read: contacts.filter((item) => item.status === "Read").length,
        replied: contacts.filter((item) => item.status === "Replied").length,
    };

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);

            const { data } = await axios.patch(
                `/api/admin/contacts/${id}`,
                { status }
            );

            if (data.success) {
                setContacts((previous) =>
                    previous.map((contact) =>
                        contact._id === id
                            ? data.contact
                            : contact
                    )
                );

                if (selectedContact?._id === id) {
                    setSelectedContact(data.contact);
                }

                toast.success("Message status updated");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteContact = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmed) return;

        try {
            const { data } = await axios.delete(
                `/api/admin/contacts/${id}`
            );

            if (data.success) {
                setContacts((previous) =>
                    previous.filter((contact) => contact._id !== id)
                );

                if (selectedContact?._id === id) {
                    setSelectedContact(null);
                }

                toast.success("Message deleted successfully");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete message"
            );
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const statusStyle = (status) => {
        if (status === "New") {
            return "bg-red-100 text-red-700";
        }

        if (status === "Read") {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-green-100 text-green-700";
    };

    return (
        <div className="space-y-7">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                        Contact Messages
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage messages received from your customers.
                    </p>
                </div>

                <button
                    onClick={fetchContacts}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-[#171717] text-white px-5 py-3 rounded-xl hover:bg-[#E94B35] transition disabled:opacity-50"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-medium">
                            Total Messages
                        </p>
                        <MessageSquare className="text-[#E94B35]" size={24} />
                    </div>

                    <h2 className="text-3xl font-extrabold mt-4 text-[#171717]">
                        {counts.total}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-medium">
                            New Messages
                        </p>
                        <Mail className="text-red-500" size={24} />
                    </div>

                    <h2 className="text-3xl font-extrabold mt-4 text-[#171717]">
                        {counts.new}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-medium">
                            Read Messages
                        </p>
                        <MailOpen className="text-blue-500" size={24} />
                    </div>

                    <h2 className="text-3xl font-extrabold mt-4 text-[#171717]">
                        {counts.read}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-medium">
                            Replied Messages
                        </p>
                        <MessageSquare className="text-green-500" size={24} />
                    </div>

                    <h2 className="text-3xl font-extrabold mt-4 text-[#171717]">
                        {counts.replied}
                    </h2>
                </div>

            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                <div className="p-5 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">

                        <div className="relative flex-1">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, email or subject..."
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#E94B35]"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35]"
                        >
                            <option value="All">All Messages</option>
                            <option value="New">New</option>
                            <option value="Read">Read</option>
                            <option value="Replied">Replied</option>
                        </select>

                    </div>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading messages...
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="py-16 text-center">
                        <Mail size={45} className="mx-auto text-gray-300 mb-4" />

                        <h3 className="font-bold text-lg text-[#171717]">
                            No messages found
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Customer messages will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredContacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-gray-50">

                                        <td className="px-6 py-5">
                                            <p className="font-bold text-[#171717]">
                                                {contact.name}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {contact.email}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-medium text-gray-700">
                                                {contact.subject}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(contact.createdAt)}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusStyle(contact.status)}`}>
                                                {contact.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">

                                                <button
                                                    onClick={() => setSelectedContact(contact)}
                                                    title="View message"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Eye size={19} />
                                                </button>

                                                <button
                                                    onClick={() => deleteContact(contact._id)}
                                                    title="Delete message"
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={19} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Message Details Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-extrabold text-[#171717]">
                                Message Details
                            </h2>

                            <button
                                onClick={() => setSelectedContact(null)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">

                            <div>
                                <p className="text-sm text-gray-500">Customer Name</p>
                                <p className="font-bold text-[#171717] mt-1">
                                    {selectedContact.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <a
                                    href={`mailto:${selectedContact.email}`}
                                    className="font-semibold text-[#E94B35] mt-1 inline-block"
                                >
                                    {selectedContact.email}
                                </a>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="font-bold text-[#171717] mt-1">
                                    {selectedContact.subject}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Message</p>
                                <p className="bg-gray-50 rounded-xl p-5 mt-2 text-gray-700 leading-7 whitespace-pre-wrap break-words">
                                    {selectedContact.message}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Received On</p>
                                <p className="font-medium text-[#171717] mt-1">
                                    {formatDate(selectedContact.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">
                                    Message Status
                                </p>

                                <select
                                    value={selectedContact.status}
                                    disabled={updatingId === selectedContact._id}
                                    onChange={(e) =>
                                        updateStatus(
                                            selectedContact._id,
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#E94B35] disabled:opacity-50"
                                >
                                    <option value="New">New</option>
                                    <option value="Read">Read</option>
                                    <option value="Replied">Replied</option>
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-3">

                                <a
                                    href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(`Re: ${selectedContact.subject}`)}`}
                                    className="flex-1 text-center bg-[#E94B35] text-white py-3 rounded-xl font-bold hover:bg-[#171717] transition"
                                >
                                    Reply by Email
                                </a>

                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                                >
                                    Close
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
