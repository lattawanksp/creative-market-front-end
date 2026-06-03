import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePaymentActions from './usePaymentActions';

export default function PaymentGateway({ subtotal, orderId }) {
    const navigate = useNavigate(); 
    const { confirmPayment, loading } = usePaymentActions();

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CreativeMarket_Order_${orderId || 'Mock'}`;

  return (
    <div className="space-y-6">
      <button 
        className="text-blue-500 text-xs flex items-center gap-1 hover:underline cursor-pointer" 
        onClick={() => navigate('/market')}>
        
        <ArrowLeft size={16}/>
        RETURN TO MARKET
      </button>

      <div>
        <h1 className="text-2xl font-bold text-[#1E1B4B]">ชำระเงิน</h1>
        <p className="text-xs text-gray-400 mt-1">สแกนชำระเงินอย่างปลอดภัยผ่านระบบพร้อมเพย์ของเรา</p>
      </div>

      <div className="flex flex-col items-center mt-6">
        <div className="bg-white border border-[#4C1D95] rounded px-4 py-1.5 flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-[#00427a] rounded-full"></div>
          <span className="text-xs font-semibold">ชำระเงินผ่านพร้อมเพย์</span>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-gray-500">ยอดชำระทั้งหมด</p>
          <p className="text-3xl font-bold text-[#4C1D95]">฿ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 border border-[#4C1D95] rounded-xl shadow-lg w-64 h-64 flex flex-col items-center justify-center overflow-hidden">
          <img 
            src={qrUrl} 
            alt="Payment QR Code" 
            className="w-48 h-48 object-contain"
          />
        </div>

        <p className="text-xs text-gray-500 mt-4">Scan to pay with any banking app</p>
        
        {/* ปุ่มยืนยันการชำระเงิน (เพิ่มใหม่ตามแผน) */}
        <button
          onClick={() => confirmPayment(orderId)}
          disabled={loading}
          className="mt-6 w-full max-w-xs bg-[#4C1D95] text-white py-3 rounded-lg font-bold hover:bg-[#312E81] transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
        >
          {loading ? "กำลังตรวจสอบ..." : "I HAVE PAID (ฉันชำระเงินแล้ว)"}
        </button>

        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">⚡ Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">🔒 Secure Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}