
"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Upload,
    Pizza,
    ImagePlus,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const initialForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    sizes: [
        { name: "Small", price: "" },
        { name: "Medium", price: "" },
        { name: "Large", price: "" },
    ],
    toppings: [],
    isFeatured: false,
};

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(initialForm);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [productResponse, categoryResponse] = await Promise.all([
                fetch("/api/admin/products"),
                fetch("/api/admin/categories"),
            ]);

            const productData = await productResponse.json();
            const categoryData = await categoryResponse.json();

            if (!productResponse.ok) {
                throw new Error(productData.message || "Could not load products");
            }

            if (!categoryResponse.ok) {
                throw new Error(categoryData.message || "Could not load categories");
            }

            setProducts(productData.products || []);
            setCategories(categoryData.categories || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddForm = () => {
        setEditingId(null);
        setForm({
            ...initialForm,
            sizes: initialForm.sizes.map((size) => ({ ...size })),
            toppings: [],
            images: [],
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({
            ...initialForm,
            sizes: initialForm.sizes.map((size) => ({ ...size })),
            toppings: [],
            images: [],
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Upload selected images to Cloudinary through our admin API.
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = "";

        if (!files.length) return;

        if (form.images.length + files.length > 5) {
            toast.error("You can upload a maximum of 5 images");
            return;
        }

        try {
            setUploading(true);

            const uploadedImages = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append("image", file);

                const response = await fetch("/api/admin/products/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Image upload failed");
                }

                uploadedImages.push(data.image);
            }

            setForm((previous) => ({
                ...previous,
                images: [...previous.images, ...uploadedImages],
            }));

            toast.success("Images uploaded successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setForm((previous) => ({
            ...previous,
            images: previous.images.filter((_, i) => i !== index),
        }));
    };

    const updateSize = (index, field, value) => {
        setForm((previous) => ({
            ...previous,
            sizes: previous.sizes.map((size, i) =>
                i === index ? { ...size, [field]: value } : size
            ),
        }));
    };

    const addSize = () => {
        setForm((previous) => ({
            ...previous,
            sizes: [...previous.sizes, { name: "", price: "" }],
        }));
    };

    const removeSize = (index) => {
        setForm((previous) => ({
            ...previous,
            sizes: previous.sizes.filter((_, i) => i !== index),
        }));
    };

    const addTopping = () => {
        setForm((previous) => ({
            ...previous,
            toppings: [...previous.toppings, { name: "", price: "0" }],
        }));
    };

    const updateTopping = (index, field, value) => {
        setForm((previous) => ({
            ...previous,
            toppings: previous.toppings.map((topping, i) =>
                i === index ? { ...topping, [field]: value } : topping
            ),
        }));
    };

    const removeTopping = (index) => {
        setForm((previous) => ({
            ...previous,
            toppings: previous.toppings.filter((_, i) => i !== index),
        }));
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setForm({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price ?? ""),
            category: product.category?._id || product.category || "",
            images: product.images || [],
            sizes: product.sizes?.length
                ? product.sizes.map((size) => ({
                    name: size.name,
                    price: String(size.price),
                }))
                : [{ name: "Medium", price: "" }],
            toppings: product.toppings?.map((topping) => ({
                name: topping.name,
                price: String(topping.price ?? 0),
            })) || [],
            isFeatured: Boolean(product.isFeatured),
        });

        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploading) {
            toast.error("Please wait until image uploads finish");
            return;
        }

        if (!form.images.length) {
            toast.error("Please upload at least one product image");
            return;
        }

        if (!form.sizes.length) {
            toast.error("Please add at least one size");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                price: Number(form.price),
                sizes: form.sizes.map((size) => ({
                    name: size.name.trim(),
                    price: Number(size.price),
                })),
                toppings: form.toppings.map((topping) => ({
                    name: topping.name.trim(),
                    price: Number(topping.price),
                })),
            };

            const response = await fetch(
                editingId
                    ? `/api/admin/products/${editingId}`
                    : "/api/admin/products",
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not save product");
            }

            toast.success(data.message);
            closeForm();
            await fetchData();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete product");
            }

            toast.success(data.message);
            await fetchData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleAvailability = async (product) => {
        try {
            const response = await fetch(`/api/admin/products/${product._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isAvailable: !product.isAvailable,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not update availability");
            }

            toast.success("Product availability updated");
            await fetchData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#171717] md:text-3xl">
                        Products
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage your pizza menu and prices.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 rounded-xl bg-[#E94B35] px-5 py-3 font-semibold text-white hover:bg-[#c93625]"
                >
                    <Plus size={19} />
                    Add Product
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#171717]">
                            {editingId ? "Edit Product" : "Add New Product"}
                        </h2>

                        <button
                            type="button"
                            onClick={closeForm}
                            aria-label="Close form"
                            className="rounded-lg p-2 hover:bg-gray-100"
                        >
                            <X size={21} />
                        </button>
                    </div>

                    {/* Basic Information */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Product Name *
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Chicken Tikka Pizza"
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#E94B35]"
                            >
                                <option value="">Select Category</option>
                                {categories.filter((category) => category.isActive).map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your delicious pizza..."
                                rows={4}
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Base Price (PKR) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="1200"
                                min="0"
                                step="1"
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                This is the base price. Size prices are managed below.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-7">
                            <input
                                id="isFeatured"
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                                className="h-4 w-4 accent-[#E94B35]"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium">
                                Show as featured product
                            </label>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="border-t border-gray-100 pt-5">
                        <h3 className="mb-3 font-bold text-[#171717]">
                            Product Images *
                        </h3>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-7 text-center hover:border-[#E94B35]">
                            {uploading ? (
                                <Loader2 className="mb-2 animate-spin text-[#E94B35]" size={30} />
                            ) : (
                                <ImagePlus className="mb-2 text-gray-400" size={30} />
                            )}

                            <span className="font-semibold text-gray-700">
                                {uploading ? "Uploading images..." : "Click to upload images"}
                            </span>
                            <span className="mt-1 text-xs text-gray-400">
                                JPG, PNG or WEBP · Maximum 5 MB each · Up to 5 images
                            </span>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploading || form.images.length >= 5}
                                className="hidden"
                            />
                        </label>

                        {form.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                {form.images.map((image, index) => (
                                    <div
                                        key={image.public_id || index}
                                        className="relative"
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Product ${index + 1}`}
                                            className="h-28 w-full rounded-xl object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            aria-label="Remove image"
                                            className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sizes and Prices */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-bold text-[#171717]">
                                Pizza Sizes & Prices *
                            </h3>
                            <button
                                type="button"
                                onClick={addSize}
                                className="text-sm font-semibold text-[#E94B35]"
                            >
                                + Add Size
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.sizes.map((size, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-3">
                                    <input
                                        value={size.name}
                                        onChange={(e) => updateSize(index, "name", e.target.value)}
                                        placeholder="Size name"
                                        required
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={size.price}
                                        onChange={(e) => updateSize(index, "price", e.target.value)}
                                        placeholder="Price in PKR"
                                        required
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSize(index)}
                                        disabled={form.sizes.length === 1}
                                        className="rounded-lg p-3 text-red-500 hover:bg-red-50 disabled:opacity-30"
                                        aria-label="Remove size"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Toppings */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-bold text-[#171717]">
                                Extra Toppings (Optional)
                            </h3>
                            <button
                                type="button"
                                onClick={addTopping}
                                className="text-sm font-semibold text-[#E94B35]"
                            >
                                + Add Topping
                            </button>
                        </div>

                        {form.toppings.length === 0 && (
                            <p className="text-sm text-gray-400">
                                No extra toppings added.
                            </p>
                        )}

                        <div className="space-y-3">
                            {form.toppings.map((topping, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-3">
                                    <input
                                        value={topping.name}
                                        onChange={(e) => updateTopping(index, "name", e.target.value)}
                                        placeholder="Topping name"
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={topping.price}
                                        onChange={(e) => updateTopping(index, "price", e.target.value)}
                                        placeholder="Extra price"
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E94B35]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTopping(index)}
                                        className="rounded-lg p-3 text-red-500 hover:bg-red-50"
                                        aria-label="Remove topping"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="flex items-center gap-2 rounded-xl bg-[#E94B35] px-7 py-3 font-semibold text-white hover:bg-[#c93625] disabled:opacity-60"
                        >
                            {saving && <Loader2 size={18} className="animate-spin" />}
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Product"
                                    : "Save Product"}
                        </button>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-xl border border-gray-200 px-7 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Products List */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                    <h2 className="font-bold text-[#171717]">
                        All Products ({products.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center">
                        <Pizza className="mx-auto mb-3 text-gray-300" size={42} />
                        <h3 className="font-semibold text-gray-600">
                            No products found
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            Add your first pizza product.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Base Price</th>
                                    <th className="px-5 py-4">Availability</th>
                                    <th className="px-5 py-4">Featured</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="border-t border-gray-100"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0]?.url ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                                        <Pizza size={20} />
                                                    </div>
                                                )}
                                                <span className="font-semibold text-[#171717]">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {product.category?.name || "—"}
                                        </td>

                                        <td className="px-5 py-4 font-semibold">
                                            Rs. {Number(product.price).toLocaleString("en-PK")}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => toggleAvailability(product)}
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isAvailable
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {product.isAvailable ? "Available" : "Unavailable"}
                                            </button>
                                        </td>

                                        <td className="px-5 py-4">
                                            {product.isFeatured ? "Yes" : "No"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    aria-label="Edit product"
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    aria-label="Delete product"
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
