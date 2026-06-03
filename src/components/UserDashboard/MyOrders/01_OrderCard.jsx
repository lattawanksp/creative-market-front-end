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

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatAmount = (value) =>
  `฿${Number(value || 0).toLocaleString("en-US")}`;

const MAX_SLIP_FILE_SIZE = 1024 * 1024;

const headingClass = "text-xs uppercase tracking-[0.2em] text-gray-400";

const OrderCard = ({ order, onSubmitPaymentProof }) => {
  const [expanded, setExpanded] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [proofImageBase64, setProofImageBase64] = useState(
    order.proofImageBase64 || "",
  );
  const [selectedFileName, setSelectedFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("success");

  const primaryItem = order.primaryItem;
  const canSubmitPayment = order.displayStatus === "awaiting-proof";
  const hasSubmittedProof = order.displayStatus === "awaiting-review";
  const isRejected = order.paymentProofStatus === "rejected";

  const handleSlipChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      setSubmitMessageType("error");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_SLIP_FILE_SIZE) {
      setSubmitMessage("ไฟล์รูปต้องมีขนาดไม่เกิน 1MB");
      setSubmitMessageType("error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProofImageBase64(String(reader.result || ""));
      setSelectedFileName(file.name);
      setSubmitMessage("");
      setSubmitMessageType("success");
    };
    reader.onerror = () => {
      setSubmitMessage("ไม่สามารถอ่านไฟล์รูปได้");
      setSubmitMessageType("error");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    if (!proofImageBase64) {
      setSubmitMessage("กรุณาอัปโหลดรูปสลิปก่อนส่งข้อมูล");
      setSubmitMessageType("error");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage("");

      await onSubmitPaymentProof(order.orderId, {
        proofImageBase64,
      });

      setSubmitMessage("ส่งรูปสลิปแล้ว กำลังรอตรวจสอบ");
      setSubmitMessageType("success");
      setShowPaymentForm(false);
    } catch (error) {
      setSubmitMessage(error.message || "ไม่สามารถส่งรูปสลิปได้");
      setSubmitMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderSlipSection = (isPrimary) => {
    if (!isPrimary) {
      return <div className="min-h-[24px]" />;
    }

    return (
      <div className="space-y-3">
        <div>
          <p className={headingClass}>Slip Verification</p>
        </div>

        {canSubmitPayment ? (
          <div className="space-y-4">
            {!showPaymentForm ? (
              <button
                type="button"
                onClick={() => setShowPaymentForm(true)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                {isRejected ? "ส่งสลิปใหม่" : "อัปโหลดสลิปการโอนเงิน"}
              </button>
            ) : (
              <div className="space-y-4">
                <label className="block space-y-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    รูปสลิปการโอนเงิน
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleSlipChange}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-violet-700"
                  />
                </label>

                <p className="text-xs text-gray-400">
                  รองรับไฟล์รูปไม่เกิน 1MB
                  {selectedFileName ? ` • ${selectedFileName}` : ""}
                </p>

                {proofImageBase64 ? (
                  <button
                    type="button"
                    onClick={() => setShowSlipModal(true)}
                    className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                  >
                    ดูสลิปการโอนเงิน
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitPayment}
                    disabled={submitting}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "กำลังส่งข้อมูล..." : "ส่งรูปสลิป"}
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
        ) : (
          <div />
        )}

        {hasSubmittedProof ? (
          <p className="text-sm text-gray-900">
            ส่งรูปสลิปแล้ว กำลังรอตรวจสอบ
          </p>
        ) : (
          <div />
        )}

        {order.proofImageBase64 && order.paymentProofStatus !== "rejected" ? (
          <button
            type="button"
            onClick={() => setShowSlipModal(true)}
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            ดูสลิปการโอนเงิน
          </button>
        ) : (
          <div />
        )}

        {submitMessage ? (
          <p
            className={`text-sm ${
              submitMessageType === "success"
                ? "text-gray-900"
                : "text-rose-500"
            }`}
          >
            {submitMessage}
          </p>
        ) : (
          <div />
        )}
      </div>
    );
  };

  const renderOrderItem = (item, isPrimary = false) => (
    <div
      key={item.id}
      className={`grid gap-5 ${isPrimary ? "" : "py-4"} md:grid-cols-[96px_minmax(0,1fr)_256px_420px] md:items-start md:gap-6`}
    >
      <div className={isPrimary ? "" : "md:min-h-[96px]"}>
        <img
          src={item.images?.[0] || fallbackProductImage}
          alt={item.name}
          className="h-20 w-20 rounded-2xl bg-gray-100 object-cover shadow-sm md:h-24 md:w-24"
        />
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {item.artist !== "-" ? `by ${item.artist}` : `Order #${order.orderId}`}
        </p>
        <p className="mt-3 text-sm text-gray-400">{item.quantity} item(s)</p>

        {isPrimary && order.extraItems.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-3 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            {expanded
              ? "Hide additional items"
              : `View ${order.extraItems.length} more item(s)`}
          </button>
        ) : (
          <div />
        )}

        {isPrimary ? (
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
        ) : (
          <div />
        )}
      </div>

      <div className="min-h-[24px]">{renderSlipSection(isPrimary)}</div>

      <div className="grid gap-4 text-sm text-gray-500 md:grid-cols-4">
        <div>
          <p
            className={`${headingClass} ${
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
          <p className={headingClass}>Price</p>
          <p className="mt-1 font-semibold text-gray-900">
            {formatAmount(item.price)}
          </p>
        </div>
        <div>
          <p
            className={`${headingClass} ${
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
            className={`${headingClass} ${
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
    <>
      <article className="rounded-2xl bg-white p-5 md:p-6">
        {renderOrderItem(primaryItem, true)}

        {order.extraItems.length > 0 ? (
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
        ) : null}
      </article>

      {showSlipModal && proofImageBase64 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSlipModal(false)}
              className="absolute right-4 top-4 text-sm font-semibold text-gray-500 transition hover:text-gray-700"
            >
              ปิด
            </button>
            <img
              src={proofImageBase64}
              alt="Payment slip"
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OrderCard;
