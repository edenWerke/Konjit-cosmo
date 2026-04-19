import { useCart } from "../context/CartContext";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const firstLetter = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const navClass = ({ isActive }) =>
    `transition ${isActive ? "text-pink-700" : "text-rose-500 hover:text-pink-700"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/85 shadow-[0_6px_24px_rgba(236,72,153,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-300 shadow-lg">
            <span className="font-bold text-white">K</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-rose-300">Beauty Lab</p>
            <h1 className="text-xl font-bold text-rose-900">
              Konjit <span className="text-pink-500">Cosmo</span>
            </h1>
          </div>
        </Link>

        <nav className="flex items-center gap-5 rounded-full border border-pink-100 bg-pink-50/70 px-4 py-2 text-sm font-semibold sm:text-base">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" className={navClass}>
                Orders
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${isActive ? "text-pink-700" : "text-rose-500 hover:text-pink-700"} relative transition`
                }
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white shadow">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-4 py-2 text-sm font-semibold text-white shadow transition hover:from-pink-600 hover:to-rose-500"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div
                title={user?.name || "User"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-sm font-bold text-white shadow"
              >
                {firstLetter}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-pink-200 bg-white px-3 py-2 text-sm text-rose-700 transition hover:border-pink-300"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}