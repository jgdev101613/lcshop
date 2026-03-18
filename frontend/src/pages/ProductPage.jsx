// React
import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";

// Clerk
import { useAuth } from "@clerk/react";

// Tansatck
import { useProduct, useDeleteProduct } from "../hooks/useProducts";
import { useLikes } from "../hooks/useLikes";

// Reusable Component
import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import ConfirmModal from "../components/ConfirmModal";

// Icons
import {
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  CalendarIcon,
  UserIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  ExternalLinkIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

// Toast
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Full-Screen Image Modal
───────────────────────────────────────── */
const ImageModal = ({ images, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 btn btn-circle btn-ghost text-white hover:bg-white/10 z-10"
      >
        <XIcon className="size-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 badge badge-neutral text-xs px-3 py-2 z-10">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-3 sm:left-6 btn btn-circle btn-ghost text-white hover:bg-white/10 z-10"
        >
          <ChevronLeftIcon className="size-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-200"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-3 sm:right-6 btn btn-circle btn-ghost text-white hover:bg-white/10 z-10"
        >
          <ChevronRightIcon className="size-6" />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden ring-2 transition-all flex-shrink-0 ${
                i === current
                  ? "ring-white scale-110"
                  : "ring-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   ProductPage
───────────────────────────────────────── */
const ProductPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const { like, unlike } = useLikes();
  const [deleteModalVisibility, setDeleteModalVisiblity] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  // const [liked, setLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct.mutate(id, {
      onSuccess: () => {
        navigate("/");
        toast.success("Successfully deleted!");
      },
      onError: (error) => {
        setDeleteModalVisiblity(false);
        toast.error(`Error: ${error}`);
      },
    });
  };

  const handleLikeToggle = () => {
    if (!liked) {
      like.mutate({
        type: "post",
        id: product.id,
        parentProductId: product.id,
      });
    } else {
      const likeId = product.likes.find((l) => l.userId === userId)?.id;
      if (likeId) {
        unlike.mutate({
          type: "post",
          id: likeId,
          parentProductId: product.id,
        });
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const liked = product.likes.some((like) => like.userId === userId);
  const likeCount = product.likes.length;

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="card bg-base-200 border border-base-300 shadow-xl max-w-sm w-full">
          <div className="card-body items-center text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <div>
              <h2 className="card-title text-xl justify-center">
                Product not found
              </h2>
              <p className="text-base-content/50 text-sm mt-1">
                This product may have been removed.
              </p>
            </div>
            <Link
              to={"/"}
              className="btn btn-primary btn-sm rounded-full px-6 gap-2"
            >
              <ArrowLeftIcon className="size-3.5" /> Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = userId === product.userId;
  const isVerified = product.user.isVerified;
  const images = product.imageUrls || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between">
        <Link
          to={"/"}
          className="btn btn-ghost btn-sm gap-1.5 rounded-full hover:bg-base-200 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          <span className="font-medium">Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost btn-sm btn-square rounded-full tooltip tooltip-bottom"
            data-tip="Share"
            onClick={() => toast.success("Link copied!")}
          >
            <ShareIcon className="size-4" />
          </button>

          <button
            onClick={() => setBookmarked((v) => !v)}
            className={`btn btn-ghost btn-sm btn-square rounded-full transition-all tooltip tooltip-bottom ${bookmarked ? "text-primary" : ""}`}
            data-tip={bookmarked ? "Saved" : "Save"}
          >
            <BookmarkIcon
              className={`size-4 ${bookmarked ? "fill-current" : ""}`}
            />
          </button>

          {isOwner && (
            <>
              <div className="divider divider-horizontal mx-0 h-6 self-center" />
              <Link
                to={`/edit/${product.id}`}
                className="btn btn-ghost btn-sm gap-1.5 rounded-full"
              >
                <EditIcon className="size-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <button
                onClick={() => setDeleteModalVisiblity(true)}
                className="btn btn-error btn-outline btn-sm gap-1.5 rounded-full"
                disabled={deleteProduct.isPending}
              >
                {deleteProduct.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Trash2Icon className="size-3.5" />
                )}
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Image Column */}
        <div className="lg:col-span-3">
          <div className="card bg-base-200 border border-base-300 shadow-lg overflow-hidden group">
            {/* Main Image — click anywhere to open modal */}
            <figure
              className="relative aspect-video overflow-hidden cursor-zoom-in"
              onClick={() => setModalOpen(true)}
            >
              <img
                key={activeImageIndex}
                src={images[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover transition-all group-hover:scale-105 animate-in fade-in duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-base-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* View full button */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="btn btn-xs btn-ghost bg-base-100/80 backdrop-blur-sm rounded-full gap-1.5 shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                >
                  <ExternalLinkIcon className="size-3" />
                  View full
                </button>
              </div>

              {/* Index badge */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 badge badge-neutral badge-sm opacity-70 text-xs">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </figure>

            {/* Thumbnail strip — click to swap main image */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`shrink-0w-14 h-14 rounded-lg overflow-hidden ring-2 transition-all focus:outline-none ${
                      i === activeImageIndex
                        ? "ring-primary scale-105 shadow-md opacity-100"
                        : "ring-transparent opacity-60 hover:opacity-100 hover:ring-base-content/30"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Main Info Card */}
          <div className="card bg-base-200 border border-base-300 shadow-lg flex-1">
            <div className="card-body gap-4 p-5">
              <div className="flex flex-wrap gap-2">
                <div className="badge badge-primary badge-outline text-xs font-medium">
                  Product
                </div>
                <div className="badge badge-ghost text-xs">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                {product.title}
              </h1>

              <p className="text-xl font-bold leading-tight tracking-tight">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(Number(product.price || 0))}
              </p>

              <p className="text-base-content/70 leading-relaxed text-sm">
                {product.description}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleLikeToggle}
                  className={`btn btn-sm gap-2 rounded-full transition-all ${
                    liked
                      ? "btn-error text-white shadow-md"
                      : "btn-ghost border border-base-300"
                  }`}
                >
                  <HeartIcon
                    className={`size-4 transition-transform ${liked ? "fill-current scale-110" : ""}`}
                  />
                  <span>
                    {likeCount > 0 ? likeCount : ""} {liked ? "Liked" : "Like"}
                  </span>
                </button>
              </div>

              <div className="divider my-1" />

              <div className="flex flex-col gap-2 text-sm text-base-content/60">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-3.5 shrink-0" />
                  <span>
                    Posted{" "}
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "long",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="size-3.5 shrink-0" />
                  <span>{product.user?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Author Card */}
          {product.user && (
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-3">
                  Created by
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-base-200 overflow-hidden">
                      <img
                        src={product.user.imageUrl}
                        alt={product.user.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{product.user.name}</p>
                    <p className="text-xs text-base-content/50">
                      Product Owner
                    </p>
                  </div>
                  <div
                    className={`badge ${isVerified ? "badge-success" : "badge-error"}  badge-sm gap-1`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {isVerified === false ? "Unverified" : "Verified"}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">
                    Interested? Message me here
                  </p>

                  <div className="flex items-center gap-3">
                    {product.user.socials?.facebook && (
                      <a
                        href={product.user.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost hover:scale-110 transition"
                      >
                        <FaFacebook className="size-4" />
                      </a>
                    )}

                    {product.user.socials?.instagram && (
                      <a
                        href={product.user.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost hover:scale-110 transition"
                      >
                        <FaInstagram className="size-4" />
                      </a>
                    )}

                    {product.user.socials?.x && (
                      <a
                        href={product.user.socials.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost hover:scale-110 transition"
                      >
                        <FaSquareXTwitter className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="card bg-base-200 border border-base-300 shadow-lg">
        <div className="card-body p-5 sm:p-6">
          <CommentsSection
            productId={product.id}
            comments={product.comments}
            currentUserId={userId}
          />
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {modalOpen && (
        <ImageModal
          images={images}
          initialIndex={activeImageIndex}
          onClose={() => setModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModalVisibility}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => setDeleteModalVisiblity(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProductPage;
