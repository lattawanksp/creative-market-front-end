import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const usePaymentActions = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

  // ฟังก์ชันอัปเดตสถานะออเดอร์เป็น "paid"
  const confirmPayment = async (orderId) => {
    setLoading(true);
    try {
      // สำหรับการทดสอบ (Mock) ถ้าไม่มี orderId ให้ผ่านไปหน้า complete เลย
      if (!orderId || orderId === "MOCK_ORDER_12345") {
        console.log("Mock Payment Confirmed");
        setTimeout(() => {
          refreshCart();
          navigate("/complete");
        }, 1000);
        return;
      }

      const res = await fetch(`${serverBaseUrl}/api/orders/status/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        refreshCart(); // ล้างตะกร้าหน้าบ้านหลังจาก Backend แจ้งว่าจ่ายเงินสำเร็จแล้ว
        navigate("/complete");
      } else {
        throw new Error(data.message || "Payment confirmation failed");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmPayment,
    loading,
  };
};

export default usePaymentActions;
