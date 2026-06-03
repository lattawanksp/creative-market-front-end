import React, { useState } from "react";
import FormInput from "../Global/FormInput";
import SuccessModal from "../Global/SuccessModal";

export default function CheckoutForm({ 
  paymentMethod, setPaymentMethod, 
  addresses, onAddAddress, onDeleteAddress,
  loading 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ 
    recipientName: "", phone: "", street: "", district: "", province: "", postcode: "" 
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ดึงข้อมูลมาใส่ฟอร์มเวลาจะ Edit
  const address = addresses.length > 0 ? addresses[0] : null;

  const handleEdit = () => {
    setForm(address);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const errors = {};
    if (!form.recipientName) errors.recipientName = "กรุณาระบุชื่อผู้รับ";
    if (!form.phone) errors.phone = "กรุณาระบุเบอร์โทรศัพท์";
    if (!form.street) errors.street = "กรุณาระบุที่อยู่";
    if (!form.district) errors.district = "กรุณาระบุเขต/อำเภอ";
    if (!form.province) errors.province = "กรุณาระบุจังหวัด";
    if (!form.postcode) errors.postcode = "กรุณาระบุรหัสไปรษณีย์";
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const result = await onAddAddress(form);

    if (result) {
      setIsEditing(false);
      setShowSuccessModal(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("คุณต้องการลบที่อยู่จัดส่งนี้ใช่หรือไม่?")) {
      const success = await onDeleteAddress();
      if (success) {
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="บันทึกที่อยู่สำเร็จ!"
        message="ที่อยู่ของคุณถูกอัปเดตในระบบเรียบร้อยแล้ว"
      />

      <div className="border border-[#4C1D95] rounded-lg p-5 bg-white/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1E1B4B]">ที่อยู่สำหรับจัดส่ง</h3>
          {address && !isEditing && (
            <div className="flex gap-3">
              <button onClick={handleEdit} className="text-[#4C1D95] text-xs font-bold hover:underline cursor-pointer">แก้ไข</button>
              <button onClick={handleDelete} className="text-red-500 text-xs font-bold hover:underline cursor-pointer">ลบ</button>
            </div>
          )}
        </div>

        {/* 1. โหมดแสดงผลที่อยู่ (View Mode) */}
        {address && !isEditing ? (
          <div className="bg-white/80 border border-purple-100 p-4 rounded-lg shadow-sm">
            <div className="flex gap-3">
               <div className="mt-1">
                  <input type="radio" checked={true} readOnly className="accent-[#4C1D95]" />
               </div>
               <div>
                  <h4 className="font-bold text-[#1E1B4B]">{address.recipientName}</h4>
                  <p className="text-sm text-[#4C1D95] font-medium">{address.phone}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {address.street}, {address.district},<br />
                    {address.province} {address.postcode}
                  </p>
               </div>
            </div>
          </div>
        ) : null}

        {/* 2. โหมดว่าง (Empty State) - เพิ่มใหม่ตามแบบหน้า Profile */}
        {!address && !isEditing && (
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-10">
            <p className="text-gray-400 text-sm">ยังไม่มีข้อมูลที่อยู่สำหรับจัดส่ง</p>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-[#4C1D95] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#312E81] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              + เพิ่มที่อยู่ใหม่
            </button>
          </div>
        )}

        {/* 3. โหมดฟอร์ม (Add/Edit Mode) */}
        {isEditing && (
          <div className="bg-purple-50/50 p-6 rounded-lg border border-purple-200 space-y-4">
            <h4 className="text-xs font-bold text-[#4C1D95] uppercase tracking-widest mb-2">
              {address ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="ชื่อผู้รับ"
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                error={fieldErrors.recipientName}
                required
              />
              <FormInput
                label="เบอร์โทรศัพท์"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={fieldErrors.phone}
                required
              />
            </div>

            <FormInput
              label="ที่อยู่ (บ้านเลขที่, ถนน, ซอย)"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              error={fieldErrors.street}
              required
            />

            <div className="grid grid-cols-3 gap-2">
              <FormInput
                label="เขต/อำเภอ"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                error={fieldErrors.district}
                required
              />
              <FormInput
                label="จังหวัด"
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                error={fieldErrors.province}
                required
              />
              <FormInput
                label="รหัสไปรษณีย์"
                value={form.postcode}
                onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                error={fieldErrors.postcode}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="flex-grow bg-[#4C1D95] text-white py-2.5 rounded font-bold hover:bg-[#312E81] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? "กำลังบันทึก..." : "ยืนยันที่อยู่"}
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-4 text-gray-500 text-sm hover:underline cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border border-[#4C1D95] rounded-lg p-5 bg-white/50">
        <h3 className="font-bold mb-4 text-[#1E1B4B]">เลือกวิธีชำระเงิน</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="promptpay"
              checked={paymentMethod === "promptpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-[#4C1D95]"
            />
            <span className="text-sm font-medium">Promptpay (พร้อมเพย์)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
