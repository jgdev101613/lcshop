import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import { formatDate } from "../lib/utils";

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ProductCard = ({ product }) => {
  const isNew = new Date(product.createdAt) > oneWeekAgo;

  const formatted = formatDate(product.updatedAt);
  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-300 hover:bg-base-200 transition-colors"
    >
      <figure className="px-4 pt-4">
        <img
          src={product.imageUrls[0]}
          alt="Main Picture"
          className="rounded-xl h-40 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">
          {product.title}
          {isNew && <span className="badge badge-secondary badge-sm">NEW</span>}
        </h2>
        <p className="text-sm text-base-content/70 line-clamp-2">
          {product.description}
        </p>
        <div className="text-sm flex justify-between">
          <p className="text-base-content/90 font-bold">
            ₱{Number(product.price).toLocaleString()}
          </p>
          <p className="text-right text-base-content/90">
            Stock: {product.stock}
          </p>
        </div>

        <div className="divider my-1" />

        <div className="flex items-center justify-between">
          {product.user && (
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-6 rounded-full ring-1 ring-primary">
                  <img src={product.user.imageUrl} alt={product.user.name} />
                </div>
              </div>
              <div className="">
                <p className="text-primary">{product.user.name}</p>
                <p className="text-base-content/50 text-xs">{formatted}</p>
              </div>
            </div>
          )}
          {product.comments && (
            <div className="flex items-center gap-1 text-base-content/50">
              <MessageCircleIcon className="size-3" />
              <span className="text-xs">{product.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
