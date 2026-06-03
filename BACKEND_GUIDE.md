# 🛠️ Backend Recommendation: Alignment for Cart, Checkout & Payment

เพื่อให้ระบบหน้าบ้าน (Frontend) ของ Cart, Checkout และ Payment ทำงานได้อย่างสมบูรณ์และซิงค์กับโมดูลอื่นๆ ของทีม แนะนำให้ปรับ Backend ในส่วนของ Controller และ Model ดังนี้:

---

## 🛍️ 1. Cart Module
- **Issue**: ข้อมูลรูปภาพไม่แสดง
- **Recommendation**: ใน `GET /api/cart` ให้ทำการ **Populate** ฟิลด์ `productId` เสมอ เพื่อให้ Frontend ได้รับข้อมูล `image`, `name`, และ `price` ที่เป็นปัจจุบันที่สุด
```javascript
// Example Controller
const cart = await Cart.findOne({ userId }).populate('items.productId');
```

---

## 📍 2. Address & Profile Sync (การอัปเกรดเป็นระบบ "หลายที่อยู่")
**🚨 ปัจจุบัน (Single Address)**: ระบบผูกที่อยู่ 1 อันไว้กับ User (`/api/user-dashboard/my-address`) ซึ่งเมื่อเพิ่มที่อยู่ใหม่ มันจะไป "ทับ" ของเดิม
**✅ เป้าหมาย (Multi-Address)**: หน้า Checkout ปัจจุบันถูกออกแบบมารองรับการเลือก **"หลายที่อยู่"** แล้ว หากทีมต้องการให้ User มีหลายที่อยู่ (เช่น บ้าน, ที่ทำงาน) จำเป็นต้องปรับ Backend ดังนี้:

### **Option 1: สร้าง Address Model แยก (แนะนำ)**
วิธีนี้จะจัดการง่ายที่สุด เหมาะกับระบบ E-commerce
```javascript
// 1. สร้าง Model แยก
const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
  postcode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

export const Address = mongoose.model("Address", addressSchema);
```
**Endpoints ที่ต้องใช้**:
- `GET /api/addresses` : ดึง **Array** ของที่อยู่ทั้งหมดของ User คนนั้น
- `POST /api/addresses` : สร้างที่อยู่ใหม่ (ไม่ต้องทับของเดิม)
- `DELETE /api/addresses/:id` : ลบเฉพาะที่อยู่ที่ระบุ

### **Option 2: เก็บเป็น Array ใน User Model (ทางเลือก)**
ถ้าไม่อยากสร้าง Model ใหม่ ให้เปลี่ยนฟิลด์ใน User Model จาก Object เป็น Array
```javascript
// ใน User Schema
addresses: [{
  recipientName: String,
  phone: String,
  street: String,
  district: String,
  province: String,
  postcode: String,
  isDefault: Boolean
}]
```
*หมายเหตุ: หากมีการปรับ Backend เป็นระบบหลายที่อยู่ (Array) รบกวนแจ้งทีม Frontend เพื่อนำมาปรับ Endpoint ใน `useCheckoutActions.js` ให้ตรงกัน (ปัจจุบัน Frontend จำเป็นต้องเรียก `/api/user-dashboard/my-address` และครอบ Array ไว้ให้ชั่วคราวเพื่อไม่ให้ระบบพัง)*

---

## 📦 3. Checkout & Order Snapshot
- **Crucial Requirement**: เมื่อมีการสร้าง Order ระบบ Backend ต้องทำการ **"Snapshot" (สำเนา)** ที่อยู่และข้อมูลสินค้าลงไปใน Order Model ทันที
- **Why?**: ป้องกันปัญหาถ้า User ไปลบที่อยู่ทิ้ง หรือลบสินค้าออกจากระบบ ออเดอร์ในประวัติการสั่งซื้อต้องยังแสดงข้อมูลที่ถูกต้อง ณ วันที่ซื้อได้
- **Recommended Logic in `POST /api/orders/checkout`**:
  1. ดึงข้อมูลจาก `Address ID` ที่ส่งมา
  2. ก๊อปปี้ข้อมูล (`recipientName`, `phone`, `street`, ฯลฯ) ลงในฟิลด์ `shippingAddress` ของ Order
  3. ก๊อปปี้ `name` และ `price` ของสินค้าลงใน `items` ของ Order
  4. **Clear Cart**: ล้างตะกร้าของ User ทันทีหลังจากบันทึก Order สำเร็จ

---

## 💳 4. Payment Mocking
- **Recommendation**: ปรับ Endpoint `PATCH /api/orders/status/:orderId` ให้รองรับการอัปเดตเป็น `status: "paid"` เพื่อเปลี่ยนสถานะการชำระเงินในระบบหลังบ้าน

---
**หมายเหตุ**: ผมได้ปรับ Frontend ให้รองรับโครงสร้างด้านบนทั้งหมดแล้ว หาก Backend ปรับตามนี้ ระบบจะเชื่อมต่อกันได้อย่างไร้รอยต่อครับ
