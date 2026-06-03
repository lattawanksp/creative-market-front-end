import React, { useState, useEffect } from "react";
import CheckoutHeader from "../components/Checkout/01_CheckoutHeader";
import CheckoutForm from "../components/Checkout/02_CheckoutForm";
import CheckoutSummary from "../components/Checkout/03_CheckoutSummary";
import { useCart } from "../context/CartContext";
import useCheckoutActions from "../components/Checkout/useCheckoutActions";

export default function Checkout() {
  const { cartItems, loadingCart } = useCart();
  const { 
    addresses, 
    fetchAddresses, 
    addAddress, 
    deleteAddress, 
    createOrder,
    loading: loadingActions 
  } = useCheckoutActions();
  
  const [paymentMethod, setPaymentMethod] = useState("Promptpay");

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || item.productId?.price || 0) * item.quantity,
    0,
  );

  if (loadingCart) {
    return <div className="pt-20 text-center min-h-screen bg-[#F3EFFF]">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F3EFFF]">
      <main className="max-w-5xl w-full mx-auto p-6">
        <button 
          className="text-blue-500 text-xs flex items-center gap-1 hover:underline cursor-pointer mb-6" 
          onClick={() => navigate('/cart')}>
          <ArrowLeft size={16}/>
          RETURN TO CART
        </button>
        <CheckoutHeader />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-20">
          <div className="lg:col-span-7">
            <CheckoutForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              addresses={addresses} 
              onAddAddress={addAddress}
              onDeleteAddress={deleteAddress}
              loading={loadingActions}
            />
          </div>
          <div className="lg:col-span-5">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              hasAddress={addresses.length > 0}
              paymentMethod={paymentMethod}
              onCreateOrder={createOrder}
              loading={loadingActions}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

