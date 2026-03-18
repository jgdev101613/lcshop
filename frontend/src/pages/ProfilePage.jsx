import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useMyProducts, useDeleteProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  PlusIcon,
  PackageIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  InfoIcon,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { useUpdateUser, useUser } from "../hooks/useUser";

const ProfilePage = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: products, isLoading: productsLoading } = useMyProducts();

  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();
  const updateUser = useUpdateUser();

  const [deleteModalVisibility, setDeleteModalVisiblity] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [location, setLocation] = useState("");
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    x: "",
  });

  useEffect(() => {
    if (user) {
      setLocation(user.location || "");
      setSocials({
        facebook: user.socials?.facebook || "",
        instagram: user.socials?.instagram || "",
        x: user.socials?.x || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = () => {
    if (!user) return;

    const payload = {};
    const currentSocials = user.socials || {};

    if (location !== user.location) payload.location = location;
    if (JSON.stringify(socials) !== JSON.stringify(currentSocials)) {
      payload.socials = socials;
    }

    if (Object.keys(payload).length === 0) {
      toast("No changes made");
      return;
    }

    updateUser.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated!");
        setEditModalOpen(false);
      },
      onError: () => toast.error("Update failed"),
    });
  };

  const handleDelete = (id) => {
    if (!id) return;

    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success("Deleted!");
      },
      onError: () => toast.error("Delete failed"),
    });
  };

  if (userLoading || productsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* PROFILE HEADER */}
      <div className="card bg-base-300 overflow-hidden">
        <div className="h-32 bg-base-200 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="avatar">
              <div className="w-20 rounded-full ring ring-base-100 ring-offset-base-300 ring-offset-2">
                <img src={user?.imageUrl} />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body pt-12">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
              <p className="text-sm opacity-70">{location}</p>

              <div className="flex gap-3 mt-2 text-sm">
                {socials.facebook && (
                  <a href={socials.facebook} className="link">
                    Facebook
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} className="link">
                    Instagram
                  </a>
                )}
                {socials.x && (
                  <a href={socials.x} className="link">
                    X
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="btn btn-sm btn-outline"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link to="/create" className="btn btn-primary btn-sm gap-1">
          <PlusIcon className="size-4" /> New
        </Link>
      </div>

      {/* PRODUCTS GRID */}
      {products?.length === 0 ? (
        <div className="card bg-base-300">
          <div className="card-body items-center text-center py-16">
            <PackageIcon className="size-16 opacity-30" />
            <h3 className="text-lg font-semibold opacity-60">
              No products yet
            </h3>
            <Link to="/create" className="btn btn-primary btn-sm mt-4">
              Create Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="card bg-base-300 hover:shadow-xl transition-all duration-200 group"
            >
              <figure className="h-48 overflow-hidden">
                <img
                  src={product.imageUrls[0]}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </figure>

              <div className="card-body p-4">
                <h2 className="font-semibold line-clamp-1">{product.title}</h2>

                <p className="text-sm opacity-60 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="btn btn-ghost btn-xs"
                  >
                    <EyeIcon className="size-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${product.id}`)}
                    className="btn btn-ghost btn-xs"
                  >
                    <EditIcon className="size-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setDeleteModalVisiblity(true);
                    }}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>

            <input
              type="text"
              className="input input-bordered w-full mb-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />

            <div className="alert alert-info shadow-sm mb-3">
              <InfoIcon className="size-5" />
              <span>
                Make sure your social accounts are <strong>public</strong> so
                people can reach out to you.
              </span>
            </div>

            <input
              type="text"
              className="input input-bordered w-full mb-2"
              placeholder="Facebook"
              value={socials.facebook}
              onChange={(e) =>
                setSocials({ ...socials, facebook: e.target.value })
              }
            />

            <input
              type="text"
              className="input input-bordered w-full mb-2"
              placeholder="Instagram"
              value={socials.instagram}
              onChange={(e) =>
                setSocials({ ...socials, instagram: e.target.value })
              }
            />

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="X"
              value={socials.x}
              onChange={(e) => setSocials({ ...socials, x: e.target.value })}
            />

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleUpdateProfile}
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => setEditModalOpen(false)}
          />
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalVisibility}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        onCancel={() => setDeleteModalVisiblity(false)}
        onConfirm={() => handleDelete(selectedProductId)}
      />
    </div>
  );
};

export default ProfilePage;
