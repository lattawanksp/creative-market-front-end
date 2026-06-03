import { Fragment, useState } from "react";

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

const statusClasses = {
  paid: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  cancelled: "bg-rose-50 text-rose-600",
};

const paymentStatusClasses = {
  none: "bg-gray-100 text-gray-500",
  submitted: "bg-sky-100 text-sky-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-600",
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatAmount = (value) =>
  `฿${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const OrderRow = ({ order, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [courier, setCourier] = useState(order.courier || "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [savingShipping, setSavingShipping] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const primaryItem = order.primaryItem;
  const paymentStatusClass =
    paymentStatusClasses[order.paymentProofStatus || "none"] ||
    paymentStatusClasses.none;

  if (!primaryItem) {
    return null;
  }

  const handleSaveShipping = async () => {
    try {
      setSavingShipping(true);
      setMessage("");

      const response = await fetch(
        `${serverBaseUrl}/api/admin-dashboard/orders/${order.orderId}/shipping`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            courier,
            trackingNumber,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ไม่สามารถอัปเดตข้อมูลขนส่งได้");
      }

      setCourier(result.data?.courier || "");
      setTrackingNumber(result.data?.trackingNumber || "");
      setMessage("บันทึกข้อมูลขนส่งแล้ว");
      setMessageType("success");
      await onRefresh?.();
    } catch (error) {
      setMessage(error.message || "ไม่สามารถอัปเดตข้อมูลขนส่งได้");
      setMessageType("error");
    } finally {
      setSavingShipping(false);
    }
  };

  const handleReviewPayment = async (action) => {
    try {
      setReviewing(true);
      setMessage("");

      const response = await fetch(
        `${serverBaseUrl}/api/admin-dashboard/orders/${order.orderId}/payment-proof`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ action }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "ไม่สามารถตรวจสอบข้อมูลการโอนได้");
      }

      setMessage(
        action === "approve"
          ? "อนุมัติข้อมูลการโอนแล้ว"
          : "ตีกลับข้อมูลการโอนแล้ว",
      );
      setMessageType("success");
      await onRefresh?.();
    } catch (error) {
      setMessage(error.message || "ไม่สามารถตรวจสอบข้อมูลการโอนได้");
      setMessageType("error");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <Fragment>
      <tr className="align-top transition-colors hover:bg-gray-50/50">
        <td className="px-4 py-4 md:px-6">
          <div className="flex items-start gap-3">
            {primaryItem.image ? (
              <img
                src={primaryItem.image}
                alt={primaryItem.name}
                className="h-10 w-10 rounded-xl bg-gray-100 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
                {primaryItem.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">{primaryItem.name}</p>
              <p className="mt-1 text-xs text-gray-500">by {primaryItem.artist}</p>
              <p className="mt-2 text-xs text-gray-400">
                {primaryItem.quantity} item(s)
              </p>

              {order.extraItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-2 text-xs font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  {expanded
                    ? "ซ่อนรายการเพิ่มเติม"
                    : `ดูเพิ่มอีก ${order.extraItems.length} รายการ`}
                </button>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-400">
          {formatDate(order.createdAt)}
        </td>
        <td className="px-4 py-4 text-sm font-medium text-gray-700">
          {primaryItem.quantity}
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">{order.customer}</td>
        <td className="px-4 py-4 text-right text-sm font-bold text-gray-900">
          {formatAmount(order.totalAmount)}
        </td>
        <td className="px-4 py-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${statusClasses[order.status]}`}
          >
            {order.statusLabel}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="min-w-[170px] space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Courier
            </p>
            <input
              type="text"
              value={courier}
              onChange={(event) => setCourier(event.target.value)}
              placeholder="เช่น Kerry Express"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-violet-300"
            />
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="min-w-[220px] space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Tracking Number
            </p>
            <input
              type="text"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="กรอกเลขพัสดุ"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-violet-300"
            />
            <button
              type="button"
              onClick={handleSaveShipping}
              disabled={savingShipping}
              className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingShipping ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="min-w-[220px] space-y-2 text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${paymentStatusClass}`}
              >
                {order.paymentProofStatusLabel || "ยังไม่ส่งข้อมูลโอน"}
              </span>
            </div>

            {order.paymentProofStatus && order.paymentProofStatus !== "none" ? (
              <div className="space-y-1">
                <p>
                  วันที่โอน:{" "}
                  <span className="font-medium text-gray-800">
                    {order.transferDate || "-"}
                  </span>
                </p>
                <p>
                  เวลาโอน:{" "}
                  <span className="font-medium text-gray-800">
                    {order.transferTime || "-"}
                  </span>
                </p>
                <p>
                  ยอดเงินที่โอน:{" "}
                  <span className="font-medium text-gray-800">
                    {formatAmount(order.transferAmount)}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">ยังไม่มีข้อมูลการโอนจากผู้ใช้</p>
            )}
          </div>
        </td>
        <td className="px-4 py-4 md:px-6">
          <div className="min-w-[160px] space-y-2">
            {order.paymentProofStatus === "submitted" ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewPayment("approve")}
                  disabled={reviewing}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reviewing ? "กำลังตรวจ..." : "อนุมัติ"}
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewPayment("reject")}
                  disabled={reviewing}
                  className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reviewing ? "กำลังตรวจ..." : "ไม่ผ่าน"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                {order.paymentProofStatus === "approved"
                  ? "ตรวจสอบแล้ว"
                  : order.paymentProofStatus === "rejected"
                    ? "รอผู้ใช้ส่งข้อมูลใหม่"
                    : "ยังไม่มีรายการให้ตรวจ"}
              </p>
            )}

            {message ? (
              <span
                className={`block text-xs ${
                  messageType === "success" ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {message}
              </span>
            ) : null}
          </div>
        </td>
      </tr>

      {order.extraItems.length > 0 && (
        <tr
          className={`transition-all duration-300 ease-out ${
            expanded ? "opacity-100" : "hidden opacity-0"
          }`}
        >
          <td colSpan={10} className="bg-[#fafaff] px-6 py-4">
            <div className="space-y-3">
              {order.extraItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-xl bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="mt-1 text-xs text-gray-500">by {item.artist}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {item.quantity} item(s)
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatAmount(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default OrderRow;
