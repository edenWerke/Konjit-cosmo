import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, decreaseQty, increaseQty, total, checkout, loading } = useCart();

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setProcessing(true);
    setSuccess(false);
    setError("");
    try {
      await checkout();
      setSuccess(true);
    } catch (checkoutError) {
      setError(checkoutError.response?.data?.message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-pink-100 bg-gradient-to-r from-pink-100 to-rose-50 p-6 shadow-[0_10px_28px_rgba(244,114,182,0.12)]">
        <h1 className="text-3xl font-bold text-rose-900 sm:text-4xl">Your Shopping Cart</h1>
        <p className="mt-2 text-rose-500">Review your items and complete your order.</p>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          Order placed successfully. You can track it from your orders page.
          <Link to="/orders" className="ml-2 font-semibold underline">
            View orders
          </Link>
        </div>
      )}
      {error && <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>}

      {loading ? (
        <p className="rounded-xl bg-pink-50 p-6 text-rose-500 shadow-sm">Loading cart...</p>
      ) : cart.length === 0 ? (
        <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center shadow-[0_10px_28px_rgba(244,114,182,0.10)]">
          <p className="text-rose-500">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-2 text-sm font-semibold text-white shadow transition hover:from-pink-600 hover:to-rose-500"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-wrap items-center gap-4 rounded-3xl border border-pink-100 bg-white p-4 shadow-[0_8px_24px_rgba(244,114,182,0.09)]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-rose-900">{item.name}</h2>
                  <p className="text-sm text-rose-500">${item.price} each</p>
                  <p className="font-bold text-pink-600">${item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decreaseQty(item._id)}
                    className="h-8 w-8 rounded-lg bg-rose-100 font-bold text-rose-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-rose-700">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increaseQty(item._id)}
                    className="h-8 w-8 rounded-lg bg-pink-100 font-bold text-pink-700"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 text-sm font-semibold text-rose-500 hover:text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_10px_28px_rgba(244,114,182,0.09)]">
            <h3 className="mb-4 text-xl font-semibold text-rose-900">Order Summary</h3>
            <div className="mb-2 flex justify-between text-rose-500">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="mb-4 flex justify-between text-rose-500">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <hr className="mb-4 border-pink-100" />
            <div className="flex justify-between text-lg font-bold text-rose-900">
              <span>Total</span>
              <span className="text-pink-600">${total}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={processing}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 py-3 font-semibold text-white shadow transition hover:from-pink-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}