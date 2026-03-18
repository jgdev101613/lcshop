import { useNavigate, useParams, Link } from "react-router";
import { useAuth } from "@clerk/react";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  FileTextIcon,
  ImageIcon,
  SparklesIcon,
  TypeIcon,
  XIcon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";

const CATEGORIES = {
  Electronics: ["Phones", "Laptops", "Tablets", "Accessories"],
  Clothing: ["Men", "Women", "Kids", "Shoes"],
  Furniture: ["Living Room", "Bedroom", "Office"],
  Food: ["Fresh", "Packaged", "Beverages"],
  Other: [],
};

const STATUS_OPTIONS = ["Available", "Out Of Stock", "Unavailable"];

const EditPage = () => {
  const { id } = useParams();
  const { isLoaded, userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();

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

  // New image files to upload
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // Existing images from the server (URLs)
  const [existingImages, setExistingImages] = useState([]);

  // Populate form once product data loads
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        stock: product.stock ?? 1,
        category: product.category ?? "",
        subCategory: product.subCategory ?? "",
        location: product.location ?? "Lucena",
        status: product.status ?? "Available",
      });
      // Assume product.images is an array of URL strings
      setExistingImages(product.imageUrls ?? []);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalImageCount = existingImages.length + newFiles.length;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + totalImageCount > 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    setNewFiles((prev) => [...prev, ...selected]);
    setNewPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalImageCount === 0) return alert("Please add at least one image");

    updateProduct.mutate(
      { id, ...formData, files: newFiles, existingImages },
      { onSuccess: () => navigate("/") },
    );
  };

  const subCategories = CATEGORIES[formData.category] ?? [];

  if (!isLoaded || isLoading) return <LoadingSpinner />;

  // Optional: redirect if not the owner
  if (product && userId && product.userId !== userId) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SparklesIcon className="size-5 text-primary" />
            Edit Product
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
                className={`flex items-center gap-2 p-3 rounded-box bg-base-200 border border-base-300 cursor-pointer hover:bg-base-100 transition-colors ${totalImageCount >= 4 ? "opacity-50 pointer-events-none" : ""}`}
              >
                <ImageIcon className="size-4 text-base-content/50" />
                <span className="text-base-content/50 text-sm">
                  {totalImageCount === 0
                    ? "Add images (up to 4)"
                    : `${totalImageCount}/4 images`}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={totalImageCount >= 4}
                />
              </label>

              {(existingImages.length > 0 || newPreviews.length > 0) && (
                <div className="grid grid-cols-2 gap-2">
                  {/* Existing images */}
                  {existingImages.map((src, i) => (
                    <div
                      key={`existing-${i}`}
                      className="relative rounded-box overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`Existing ${i + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="btn btn-circle btn-xs btn-error absolute top-1 right-1"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}

                  {/* New image previews */}
                  {newPreviews.map((src, i) => (
                    <div
                      key={`new-${i}`}
                      className="relative rounded-box overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`New ${i + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-1 left-1 badge badge-primary badge-xs">
                        New
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
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

            {updateProduct.isError && (
              <div role="alert" className="alert alert-error alert-sm">
                <span>Failed to update. Try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={updateProduct.isPending || totalImageCount === 0}
            >
              {updateProduct.isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
