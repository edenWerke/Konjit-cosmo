import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="rounded-xl bg-pink-50 p-6 text-rose-500 shadow-sm">Loading orders...</p>;
  }

  if (error) {
    return <p className="rounded-xl bg-red-50 p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-pink-100 bg-gradient-to-r from-pink-100 to-rose-50 p-6 shadow-[0_10px_28px_rgba(244,114,182,0.12)]">
        <h1 className="text-3xl font-bold text-rose-900">Your Orders</h1>
        <p className="mt-1 text-rose-500">Track your previous purchases.</p>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-rose-500 shadow-[0_8px_24px_rgba(244,114,182,0.08)]">
          No orders yet.
        </div>
      ) : (
        orders.map((order) => (
          <article
            key={order._id}
            className="rounded-3xl border border-pink-100 bg-white p-5 shadow-[0_8px_24px_rgba(244,114,182,0.09)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-rose-500">Order #{order._id.slice(-8)}</p>
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-rose-600">
                {order.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {order.items.map((item) => (
                <div key={`${order._id}-${item._id}`} className="flex justify-between text-sm text-rose-600">
                  <span>{item.productId?.name || "Product removed"} x {item.quantity}</span>
                  <span>
                    ${(item.productId?.price || 0) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-pink-100 pt-3 text-right font-semibold text-pink-600">
              Total: ${order.totalPrice}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
