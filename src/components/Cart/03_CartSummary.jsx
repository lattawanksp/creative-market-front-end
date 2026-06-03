import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartSummary({ subtotal }) {
  const navigate = useNavigate();

  return (
    <div className="border border-[#4C1D95] rounded p-5 bg-white/50">
      <h3 className="font-bold mb-4 text-sm text-[#1E1B4B]">สรุปยอดเงินในตะกร้า</h3>
      <div className="space-y-3 text-sm border-b border-[#4C1D95] pb-3 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">ยอดรวม</span>
          <span className="font-bold">฿ {subtotal.toLocaleString()}.-</span>
        </div>
      </div>
      <div className="flex justify-between text-sm font-bold mb-5 text-[#1E1B4B]">
        <span>ยอดรวมทั้งสิ้น</span>
        <span>฿ {subtotal.toLocaleString()}.-</span>
      </div>
      <button 
        onClick={() => navigate('/checkout')} // สั่งเด้งไปหน้า Checkout
        className="w-full bg-[#1E1B4B] text-white py-2.5 rounded font-semibold hover:bg-[#312E81] transition-colors"
      >
        ชำระเงิน
      </button>
    </div>
  );
}