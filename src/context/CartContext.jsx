/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapCartItems = useCallback((serverCart) => {
    if (!serverCart?.items) {
      return [];
    }
    return serverCart.items
      .filter((item) => item.productId)
      .map((item) => ({
        ...item.productId,
        quantity: item.quantity,
      }));
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(mapCartItems(data));
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, mapCartItems]);

  useEffect(() => {
    queueMicrotask(() => {
      refreshCart();
    });
  }, [refreshCart]);

  const updateServerCart = useCallback(
    async (productId, quantity) => {
      await api.put(`/cart/${productId}`, { quantity });
      await refreshCart();
    },
    [refreshCart]
  );

  const addToCart = async (product) => {
    await api.post("/cart", { productId: product._id, quantity: 1 });
    await refreshCart();
  };

  const decreaseQty = async (id) => {
    const target = cart.find((item) => item._id === id);
    if (!target) return;

    if (target.quantity === 1) {
      setCart((prev) => prev.filter((item) => item._id !== id));
      return;
    }
    await updateServerCart(id, target.quantity - 1);
  };

  const increaseQty = async (id) => {
    const target = cart.find((item) => item._id === id);
    if (!target) return;
    await updateServerCart(id, target.quantity + 1);
  };

  const removeFromCart = async (id) => {
    await api.delete(`/cart/${id}`);
    await refreshCart();
  };

  const checkout = async () => {
    const { data } = await api.post("/orders");
    await refreshCart();
    return data;
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        setCart,
        refreshCart,
        addToCart,
        decreaseQty,
        increaseQty,
        removeFromCart,
        checkout,
        total,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);