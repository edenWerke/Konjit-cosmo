import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { refreshCart } = useCart();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      await refreshCart();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50 p-7 shadow-[0_12px_30px_rgba(244,114,182,0.15)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">Welcome Back</p>
      <h1 className="mt-2 text-3xl font-bold text-rose-900">Login to Konjit</h1>
      <p className="mt-1 text-sm text-rose-500">Manage your cart, orders, and beauty picks.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-rose-900 outline-none transition focus:border-pink-400"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-rose-900 outline-none transition focus:border-pink-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 py-3 font-semibold text-white shadow transition hover:from-pink-600 hover:to-rose-500 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-sm text-rose-500">
        New here?{" "}
        <Link to="/register" className="font-semibold text-pink-600 hover:text-pink-700">
          Create account
        </Link>
      </p>
    </div>
  );
}
