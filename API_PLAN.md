# E-Commerce Architecture & API Best Practices: Cart, Checkout, and Payment

เอกสารฉบับนี้รวบรวมเทคนิค "The Best Practice" สำหรับการสร้างระบบซื้อขายออนไลน์ที่ยืดหยุ่น ปลอดภัย และมี UX ที่ดีเยี่ยม โดยเน้นที่ Flow ตั้งแต่ตะกร้าสินค้าไปจนถึงการชำระเงินสำเร็จ

---

## 1. Cart Management (การจัดการตะกร้า)
ตะกร้าสินค้าควรทำหน้าที่เป็น **"Draft"** เสมอ จนกว่าจะเกิดการจ่ายเงินจริง

### ✅ The Best Practices:
- **Server-Side Validation:** ทุกครั้งที่มีการแก้ไขจำนวนหรือกดเข้าหน้าตะกร้า ต้องเช็คสต็อกจริงจาก Database เสมอ (ห้ามเชื่อเลขจำนวนที่หน้าบ้านส่งมาอย่างเดียว)
- **Pricing Snapshot:** เมื่อสินค้าอยู่ในตะกร้า ให้แสดงราคาปัจจุบัน แต่เมื่อเกิดการ Checkout แล้ว ต้องทำ **Snapshot** ราคา ณ ขณะนั้นไว้ใน Order Model
- **Cart Persistence:** ตะกร้าควรผูกกับ User ID ในฐานข้อมูล เพื่อให้ลูกค้าเข้าจากอุปกรณ์ไหนก็ได้แล้วข้อมูลยังอยู่ครบ

### ⚠️ สิ่งที่ต้องระวัง:
- **Inventory Leak:** อย่าเพิ่งหักสต็อกตอนที่สินค้าอยู่ในตะกร้า (ยกเว้นระบบ Flash Sale ที่จำกัดเวลา) ให้หักตอนกด Checkout เท่านั้น

---

## 2. Checkout & Order Creation (การจองสินค้า)
จังหวะที่ลูกค้ากด "ยืนยันการสั่งซื้อ" คือการเปลี่ยนสถานะจาก "อยากได้" เป็น "จองแล้ว"

### ✅ The Best Practices:
- **Atomic Stock Reservation:** ใช้ `session` หรือ `transactions` ในฐานข้อมูล เพื่อให้มั่นใจว่า "การสร้าง Order" และ "การหักสต็อก" เกิดขึ้นพร้อมกันและสำเร็จทั้งคู่ (All or Nothing)
- **Pending Cleanup (The "Clean-Up before Buy" Logic):**
  - หาก User มีออเดอร์สถานะ `pending` ค้างอยู่ก่อนหน้า ให้ระบบทำการ **ยกเลิกและคืนสต็อก** ของออเดอร์เก่าก่อนจะสร้างออเดอร์ใหม่
  - วิธีนี้ป้องกันการ "จองของกั๊กไว้" และช่วยให้ลูกค้ามีออเดอร์เดียวที่ต้องจัดการ
- **Address Snapshot:** ห้ามเก็บแค่ Address ID ไว้ใน Order เพราะถ้า User แก้ที่อยู่ภายหลัง ข้อมูลออเดอร์เก่าจะเพี้ยน ต้อง Copy ข้อมูลที่อยู่ทั้งหมดลงไปใน Order เลย

### ⚠️ สิ่งที่ต้องระวัง:
- **Race Condition:** กรณีสินค้าชิ้นสุดท้าย มีคนกดพร้อมกัน 2 คน ต้องใช้ Logic `{ $gte: quantity }` ในการ `findOneAndUpdate` เพื่อป้องกันสต็อกติดลบ

---

## 3. Payment & Completion (การชำระเงิน)
จังหวะเปลี่ยนจาก "จอง" เป็น "ขายได้แล้ว"

### ✅ The Best Practices:
- **Delayed Cart Clearing:** ลบสินค้าออกจากตะกร้า **เมื่อสถานะเป็น Paid เท่านั้น** เพื่อให้ลูกค้ากด Back กลับมาแก้ไขตะกร้าได้หากจ่ายเงินไม่สำเร็จในครั้งแรก
- **Idempotency:** ระบบต้องรองรับการกด "ยืนยันการชำระเงิน" ซ้ำ (Double Click) โดยไม่เกิดปัญหา (เช่น การเช็คสถานะก่อนอัปเดต ถ้าเป็น paid อยู่แล้วไม่ต้องทำอะไร)
- **Automatic Cancellation (Cron Job):** ควรมีระบบหลังบ้านคอยตรวจสอบออเดอร์ที่ค้าง `pending` นานเกินไป (เช่น 30 นาที) เพื่อทำการ Cancel และคืนสต็อกให้คนอื่นซื้อต่อ

---

## 4. API Design Template (ยืดหยุ่นสำหรับทุกโปรเจกต์)

### [POST] `/api/orders/checkout`
**Logic Flow:**
1. Start DB Transaction
2. Check for existing `pending` orders -> If exists, **Cancel & Return Stock**
3. Validate Stock for all items in current cart
4. Create Order with **Snapshots** (Name, Price, Detailed Address)
5. Reserve Stock (`$inc: -quantity`)
6. Commit Transaction
7. Return `orderId` to Frontend

### [PATCH] `/api/orders/status/:id`
**Logic Flow:**
1. Find Order by ID
2. If `status` is "paid":
   - Update `paidAt`
   - **Clear User Cart** (ล้างตะกร้าสินค้า)
3. If `status` is "cancelled":
   - **Return Stock** to Products (`$inc: +quantity`)
4. Return Success Response

---

## 5. สรุปสิ่งที่ต้องมี (The Checklist)
- [ ] **Transactions:** ทุกการย้ายเงินหรือย้ายสต็อกต้องใช้ Transaction
- [ ] **Snapshots:** เก็บข้อมูลสำคัญ (ราคา, ที่อยู่) ลงใน Order โดยตรง ไม่ใช้การ Reference
- [ ] **Stock Return Logic:** ต้องมีทางคืนของเข้าระบบเสมอเมื่อออเดอร์ถูกยกเลิก
- [ ] **UX Recovery:** ถ้าจ่ายเงินไม่ผ่าน ต้องให้ลูกค้ากลับไปที่ตะกร้าที่ยังมีของครบได้

---
*Architected by: Gemini CLI Assistant*
