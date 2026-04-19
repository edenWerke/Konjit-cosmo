import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setStatus("");
    try {
      await addToCart(product);
      setStatus("Added to cart");
    } catch (error) {
      setStatus(error.response?.data?.message || "Could not add item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-[0_10px_30px_rgba(236,72,153,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(236,72,153,0.17)]">
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="text-2xl font-semibold text-rose-900">{product.name}</h3>
        <p className="min-h-10 text-sm leading-relaxed text-rose-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-pink-600">${product.price}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={submitting}
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-2 text-sm font-semibold text-white shadow transition hover:from-pink-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Adding..." : "Add to Cart"}
          </button>
        </div>
        {status && <p className="mt-2 text-xs text-rose-400">{status}</p>}
      </div>
    </article>
  );
}