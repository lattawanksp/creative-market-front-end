import { useState } from "react";

const fallbackProductImage =
  "https://res.cloudinary.com/duc5gow6f/image/upload/v1779948614/frieren-01_jbkbxq.png";

const statusClasses = {
  pending: "bg-gray-100 text-gray-600",
  "awaiting-proof": "bg-amber-100 text-amber-700",
  "awaiting-review": "bg-sky-100 text-sky-700",
  confirmed: "bg-emerald-100 text-emerald-600",
  cancelled: "bg-rose-100 text-rose-600",
};

const paymentStatusClasses = {
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

const formatAmount = (value) => `฿${Number(value || 0).toLocaleString("en-US")}`;

const OrderCard = ({ order, onSubmitPaymentProof }) => {
  const [expanded, setExpanded] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [transferDate, setTransferDate] = useState(order.transferDate || "");
  const [transferTime, setTransferTime] = useState(order.transferTime || "");
  const [transferAmount, setTransferAmount] = useState(
    order.transferAmount || order.totalAmount || "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("success");

  const primaryItem = order.primaryItem;
  const canSubmitPayment = order.displayStatus === "awaiting-proof";
  const hasSubmittedProof = order.displayStatus === "awaiting-review";
  const paymentStatusClass =
    paymentStatusClasses[order.paymentProofStatus] || "bg-gray-100 text-gray-500";

  const handleSubmitPayment = async () => {
    try {
      setSubmitting(true);
      setSubmitMessage("");

      await onSubmitPaymentProof(order.orderId, {
        transferDate,
        transferTime,
        transferAmount: Number(transferAmount),
      });

      setSubmitMessage("ส่งข้อมูลการโอนเงินเรียบร้อยแล้ว");
      setSubmitMessageType("success");
      setShowPaymentForm(false);
    } catch (error) {
      setSubmitMessage(error.message || "ไม่สามารถส่งข้อมูลการโอนเงินได้");
      setSubmitMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderOrderItem = (item, isPrimary = false) => (
    <div
      key={item.id}
      className={`flex flex-col gap-5 ${
        isPrimary
          ? "md:flex-row md:items-center md:gap-6"
          : "py-4 md:flex-row md:items-center md:gap-6"
      }`}
    >
      <img
        src={item.images?.[0] || fallbackProductImage}
        alt={item.name}
        className="h-20 w-20 shrink-0 rounded-2xl bg-gray-100 object-cover shadow-sm md:h-24 md:w-24"
      />

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {item.artist !== "-" ? `by ${item.artist}` : `Order #${order.orderId}`}
        </p>
        <p className="mt-3 text-sm text-gray-400">{item.quantity} item(s)</p>

        {isPrimary && order.extraItems.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-3 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            {expanded
              ? "Hide additional items"
              : `View ${order.extraItems.length} more item(s)`}
          </button>
        )}

        {isPrimary && (
          <div className="mt-3 space-y-1 text-sm text-gray-500">
            <p>
              Courier:{" "}
              <span className="font-medium text-gray-800">
                {order.courier || "-"}
              </span>
            </p>
            <p>
              Tracking Number:{" "}
              <span className="font-medium text-gray-800">
                {order.trackingNumber || "-"}
              </span>
            </p>
          </div>
        )}

        {isPrimary && order.paymentProofStatusLabel && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">สถานะการแจ้งโอน:</span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusClass}`}
              >
                {order.paymentProofStatusLabel}
              </span>
            </div>

            {order.paymentProofStatus && order.paymentProofStatus !== "rejected" && (
              <div className="space-y-1 text-sm text-gray-500">
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
            )}
          </div>
        )}

        {isPrimary && canSubmitPayment && (
          <div className="mt-4">
            {!showPaymentForm ? (
              <button
                type="button"
                onClick={() => setShowPaymentForm(true)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                {order.paymentProofStatus === "rejected"
                  ? "ส่งข้อมูลการโอนใหม่"
                  : "แจ้งการโอนเงิน"}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">วันที่โอน</span>
                    <input
                      type="date"
                      value={transferDate}
                      onChange={(event) => setTransferDate(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-violet-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">เวลาโอน</span>
                    <input
                      type="time"
                      value={transferTime}
                      onChange={(event) => setTransferTime(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-violet-300"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">
                      ยอดเงินที่โอน
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={transferAmount}
                      onChange={(event) => setTransferAmount(event.target.value)}
                      placeholder="เช่น 850"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-violet-300"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitPayment}
                    disabled={submitting}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลการโอน"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    disabled={submitting}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isPrimary && hasSubmittedProof && (
          <p className="mt-4 text-sm text-sky-700">
            ส่งข้อมูลการโอนแล้ว กำลังรอ admin ตรวจ
          </p>
        )}

        {isPrimary && submitMessage ? (
          <p
            className={`mt-3 text-sm ${
              submitMessageType === "success" ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {submitMessage}
          </p>
        ) : null}
      </div>

      <div className="grid shrink-0 gap-4 text-sm text-gray-500 md:min-w-105 md:grid-cols-4">
        <div>
          <p
            className={`text-xs uppercase tracking-[0.2em] text-gray-400 ${
              isPrimary ? "" : "invisible"
            }`}
          >
            Date
          </p>
          <p
            className={`mt-1 font-semibold text-gray-900 ${
              isPrimary ? "" : "invisible"
            }`}
          >
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Price</p>
          <p className="mt-1 font-semibold text-gray-900">
            {formatAmount(item.price)}
          </p>
        </div>
        <div>
          <p
            className={`text-xs uppercase tracking-[0.2em] text-gray-400 ${
              isPrimary ? "" : "invisible"
            }`}
          >
            Amount
          </p>
          <p
            className={`mt-1 font-semibold text-gray-900 ${
              isPrimary ? "" : "invisible"
            }`}
          >
            {formatAmount(isPrimary ? order.totalAmount : item.lineTotal)}
          </p>
        </div>
        <div>
          <p
            className={`text-xs uppercase tracking-[0.2em] text-gray-400 ${
              isPrimary ? "" : "invisible"
            }`}
          >
            Status
          </p>
          <span
            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              statusClasses[order.displayStatus]
            } ${isPrimary ? "" : "invisible"}`}
          >
            {order.displayStatusLabel}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <article className="rounded-2xl bg-white p-5 md:p-6">
      {renderOrderItem(primaryItem, true)}

      {order.extraItems.length > 0 && (
        <div
          className={`overflow-hidden border-t border-gray-100 transition-all duration-300 ease-out ${
            expanded
              ? "mt-5 max-h-200 translate-y-0 pt-5 opacity-100"
              : "mt-0 max-h-0 -translate-y-2 pt-0 opacity-0"
          }`}
        >
          <div className="space-y-3">
            {order.extraItems.map((item) => renderOrderItem(item))}
          </div>
        </div>
      )}
    </article>
  );
};

export default OrderCard;
