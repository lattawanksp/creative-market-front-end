import { useState, useCallback } from "react";
import { useCart } from "../../context/CartContext";

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

export const useCartActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refreshCart } = useCart();

  // 1. อัปเดตจำนวนสินค้า (PATCH /api/cart/update)
  // ถ้า quantity เป็น 0 ทาง backend จะลบสินค้าออกให้ตาม logic ใน API_PLAN
  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/cart/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        refreshCart(); // แจ้ง Context ให้ดึงข้อมูลใหม่
        return true;
      } else {
        throw new Error(data.message || "Failed to update quantity");
      }
    } catch (err) {
      setError(err.message);
      console.error("Update quantity error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. ลบสินค้าออกจากตะกร้า (DELETE /api/cart/remove/:productId)
  const removeItem = async (productId) => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        refreshCart();
        return true;
      } else {
        throw new Error(data.message || "Failed to remove item");
      }
    } catch (err) {
      setError(err.message);
      console.error("Remove item error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. ล้างตะกร้า (DELETE /api/cart/clear)
  const clearCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        refreshCart();
        return true;
      } else {
        throw new Error(data.message || "Failed to clear cart");
      }
    } catch (err) {
      setError(err.message);
      console.error("Clear cart error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateQuantity,
    removeItem,
    clearCart,
    loading,
    error,
  };
};
