import React from "react";
import { useLocation } from "react-router-dom";
import PaymentGateway from "../components/Payment/01_PaymentGateway";
import CheckoutSummary from "../components/Checkout/03_CheckoutSummary"; 
import { useCart } from "../context/CartContext";

export default function Payment() {
  const location = useLocation();
  // ⭐️ รับ orderItemsSnapshot มาจากหน้า Checkout
  const { orderId, amount, orderItemsSnapshot } = location.state || { orderId: null, amount: 0, orderItemsSnapshot: null };

  const { cartItems } = useCart();

  // ⭐️ ถ้ามี Snapshot ให้ใช้ Snapshot ก่อน ถ้าไม่มีค่อยไปดึงตะกร้าสด
  const displayItems = orderItemsSnapshot || cartItems;

  const subtotal = amount || displayItems.reduce(
    (acc, item) => acc + (item.price || item.productId?.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#F3EFFF]">
      <main className="max-w-6xl w-full mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          <div className="lg:col-span-7">
            <PaymentGateway subtotal={subtotal} orderId={orderId} />
          </div>

          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <CheckoutSummary
              cartItems={displayItems}
              subtotal={subtotal}
              isPaymentPage={true} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}


