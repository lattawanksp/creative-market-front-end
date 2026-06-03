import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CartHeader from "../components/Cart/01_CartHeader";
import CartTable from "../components/Cart/02_CartTable";
import CartSummary from "../components/Cart/03_CartSummary";
import { useCart } from "../context/CartContext";
import { useCartActions } from "../components/Cart/useCartActions";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, loadingCart } = useCart();
  const { updateQuantity, removeItem } = useCartActions();

  const handleUpdateQuantity = async (id, amount) => {
    const item = cartItems.find((item) => item.productId === id || item._id === id || item.id === id);
    if (!item) return;
    
    // API_PLAN: PATCH /api/cart/update ใช้ productId และ quantity ใหม่
    // คำนวณ quantity ใหม่
    const currentQty = item.quantity;
    const newQty = Math.max(1, currentQty + amount);
    
    // ใช้ productId จาก object (ถ้า populate มาจะเป็น productId._id หรือ productId ตาม schema)
    const pId = item.productId?._id || item.productId || item.id;
    await updateQuantity(pId, newQty);
  };

  const handleRemoveItem = async (id) => {
    const item = cartItems.find((item) => item.productId === id || item._id === id || item.id === id);
    if (!item) return;
    
    const pId = item.productId?._id || item.productId || item.id;
    await removeItem(pId);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || item.productId?.price || 0) * item.quantity,
    0,
  );

  if (loadingCart) {
    return (
      <div className="pt-20 text-center min-h-screen bg-[#F3EFFF]">
        <p className="text-[#4C1D95] font-bold">กำลังโหลดตะกร้าสินค้า...</p>
      </div>
    );
  }

  return (
    <div className="pt-5 min-h-screen flex flex-col bg-[#F3EFFF]">
      <main className=" flex-grow max-w-5xl w-full  mx-auto p-6">
        <CartHeader />

        <div className="mt-15">
          {cartItems.length > 0 ? (
            <CartTable
              cartItems={cartItems}
              updateQuantity={handleUpdateQuantity}
              removeItem={handleRemoveItem}
            />
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-xl border border-dashed border-purple-300">
              <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="flex justify-end mt-10">
            <div className="w-full md:w-1/2">
              <CartSummary subtotal={subtotal} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

 <CartSummary subtotal={subtotal} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

