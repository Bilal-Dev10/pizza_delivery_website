
"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Tags } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/admin/categories");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not load categories");
            }

            setCategories(data.categories || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setForm({ name: "", description: "" });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const url = editingId
                ? `/api/admin/categories/${editingId}`
                : "/api/admin/categories";

            const response = await fetch(url, {
                method: editingId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            toast.success(data.message);
            resetForm();
            await fetchCategories();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setForm({
            name: category.name,
            description: category.description || "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete category");
            }

            toast.success(data.message);
            await fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleToggle = async (category) => {
        try {
            const response = await fetch(
                `/api/admin/categories/${category._id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isActive: !category.isActive }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not update category");
            }

            toast.success("Category status updated");
            await fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#171717] md:text-3xl">
                        Categories
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Create and manage your pizza categories.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-[#E94B35] px-5 py-3 font-semibold text-white hover:bg-[#c93625]"
                >
                    <Plus size={19} />
                    Add Category
                </button>
            </div>

            {showForm && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#171717]">
                            {editingId ? "Edit Category" : "Add New Category"}
                        </h2>

                        <button onClick={resetForm} aria-label="Close form">
                            <X size={22} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                placeholder="Example: Pizza"
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Write a short description"
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#E94B35] px-6 py-3 font-semibold text-white hover:bg-[#c93625] disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Category"
                                        : "Save Category"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                    <h2 className="font-bold text-[#171717]">
                        All Categories ({categories.length})
                    </h2>
                </div>

                {loading ? (
                    <p className="p-8 text-center text-gray-500">
                        Loading categories...
                    </p>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center">
                        <Tags className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="font-semibold text-gray-600">
                            No categories found
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            Add your first category to get started.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-5 py-4">Name</th>
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((category) => (
                                    <tr
                                        key={category._id}
                                        className="border-t border-gray-100"
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#171717]">
                                            {category.name}
                                        </td>

                                        <td className="max-w-xs truncate px-5 py-4 text-gray-500">
                                            {category.description || "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => handleToggle(category)}
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${category.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {category.isActive ? "Active" : "Inactive"}
                                            </button>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    aria-label="Edit category"
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    aria-label="Delete category"
                                                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                >
                                                    <Trash2 size={17} />
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
        </div>
    );
}
