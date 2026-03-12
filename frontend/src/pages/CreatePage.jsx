import { Link, useNavigate } from "react-router";
import { useCreateProduct } from "../hooks/useProducts";
import { useState } from "react";
import {
  ArrowLeftIcon,
  FileTextIcon,
  ImageIcon,
  SparklesIcon,
  TypeIcon,
  XIcon,
  MapPinIcon,
  TagIcon,
  PackageIcon,
  DollarSignIcon,
} from "lucide-react";

const CATEGORIES = {
  Electronics: ["Phones", "Laptops", "Tablets", "Accessories"],
  Clothing: ["Men", "Women", "Kids", "Shoes"],
  Furniture: ["Living Room", "Bedroom", "Office"],
  Food: ["Fresh", "Packaged", "Beverages"],
  Other: [],
};

const STATUS_OPTIONS = ["Available", "Out Of Stock", "Unavailable"];

function CreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: 1,
    category: "",
    subCategory: "",
    location: "Lucena",
    status: "Available",
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please add at least one image");

    createProduct.mutate(
      { ...formData, files },
      { onSuccess: () => navigate("/") },
    );
  };

  const subCategories = CATEGORIES[formData.category] ?? [];

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SparklesIcon className="size-5 text-primary" />
            New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* TITLE */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                name="title"
                placeholder="Product title"
                className="grow"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            {/* PRICE & STOCK */}
            <div className="flex gap-2">
              <label className="input input-bordered flex items-center gap-2 bg-base-200 flex-1">
                {/* <DollarSignIcon className="size-4 text-base-content/50" /> */}
                <p className="text-gray-400 font-bold">₱</p>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="grow"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 bg-base-200 flex-1">
                <PackageIcon className="size-4 text-base-content/50" />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  className="grow"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* CATEGORY & SUBCATEGORY */}
            <div className="flex gap-2">
              <select
                name="category"
                className="select select-bordered bg-base-200 flex-1"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    subCategory: "",
                  })
                }
                required
              >
                <option value="" disabled>
                  Category
                </option>
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                name="subCategory"
                className="select select-bordered bg-base-200 flex-1"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={subCategories.length === 0}
              >
                <option value="">Sub-category</option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION & STATUS */}
            <div className="flex gap-2">
              <label className="input input-bordered flex items-center gap-2 bg-base-200 flex-1">
                <MapPinIcon className="size-4 text-base-content/50" />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="grow"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </label>

              <select
                disabled
                name="status"
                className="select select-bordered bg-base-200 flex-1"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 p-3 rounded-box bg-base-200 border border-base-300 cursor-pointer hover:bg-base-100 transition-colors ${files.length >= 4 ? "opacity-50 pointer-events-none" : ""}`}
              >
                <ImageIcon className="size-4 text-base-content/50" />
                <span className="text-base-content/50 text-sm">
                  {files.length === 0
                    ? "Add images (up to 4)"
                    : `${files.length}/4 images added`}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={files.length >= 4}
                />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative rounded-box overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="btn btn-circle btn-xs btn-error absolute top-1 right-1"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex items-start gap-2 p-3 rounded-box bg-base-200 border border-base-300">
              <FileTextIcon className="size-4 text-base-content/50 mt-1" />
              <textarea
                name="description"
                placeholder="Description"
                className="grow bg-transparent resize-none focus:outline-none min-h-24"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {createProduct.isError && (
              <div role="alert" className="alert alert-error alert-sm">
                <span>Failed to create. Try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={createProduct.isPending || files.length === 0}
            >
              {createProduct.isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Create Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
