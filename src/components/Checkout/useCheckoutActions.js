import { useState, useCallback } from "react";
import { useCart } from "../../context/CartContext";

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

const useCheckoutActions = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { refreshCart } = useCart();

  // 1. ดึงรายการที่อยู่ (ปรับให้ใช้เส้นเดียวกับหน้า Profile เพื่อน)
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/user-dashboard/my-address`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // เพื่อนส่งมาเป็น Object เดียว { recipientName, ... }
        // ถ้ามีข้อมูล เราจะเก็บใส่ Array 1 ตัวเพื่อให้ Loop ง่าย หรือถ้าไม่มีก็เป็น Array ว่าง
        setAddresses(data.data ? [data.data] : []);
      } else {
        // กรณีไม่มีข้อมูล (404 หรือ success: false จาก backend บางตัว) ให้เป็นว่าง
        setAddresses([]);
      }
    } catch (err) {
      setAddresses([]);
      console.error("Fetch address error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. บันทึกที่อยู่ใหม่/อัปเดต (ใช้ PUT ตามแบบของเพื่อน)
  const addAddress = async (addressData) => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/user-dashboard/my-address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAddresses(); 
        return data.data;
      } else {
        throw new Error(data.message || "Failed to save address");
      }
    } catch (err) {
      alert(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 3. ลบที่อยู่ (ลบทั้ง Object ทิ้ง)
  const deleteAddress = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/user-dashboard/my-address`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchAddresses();
        return true;
      } else {
        throw new Error(data.message || "Failed to delete address");
      }
    } catch (err) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 4. ยืนยันการสั่งซื้อ (Checkout)
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const res = await fetch(`${serverBaseUrl}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        refreshCart(); // ล้างตะกร้าในระบบหลังจากสั่งซื้อสำเร็จ
        return data.data; // ส่งข้อมูล Order กลับไปเพื่อนำทางไปหน้า Payment
      } else {
        throw new Error(data.message || "Checkout failed");
      }
    } catch (err) {
      alert(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    deleteAddress,
    createOrder,
  };
};

export default useCheckoutActions;
