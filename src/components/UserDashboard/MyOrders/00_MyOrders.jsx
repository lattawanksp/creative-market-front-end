import { useState } from "react";
import OrderCard from "./01_OrderCard";

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

const tabs = [
  { label: "All", value: "All" },
  { label: "รอดำเนินการ", value: "pending" },
  { label: "สำเร็จแล้ว", value: "paid" },
  { label: "ยกเลิก", value: "cancelled" },
];

const ordersPerPage = 5;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const groupOrdersByOrderId = (orders) =>
  Object.values(
    orders.reduce((acc, item) => {
      if (!acc[item.orderId]) {
        acc[item.orderId] = {
          id: item.orderId,
          orderId: item.orderId,
          status: item.status,
          statusLabel: item.statusLabel,
          createdAt: item.createdAt,
          courier: item.courier || "",
          trackingNumber: item.trackingNumber || "",
          paymentProofStatus: item.paymentProofStatus || "",
          paymentProofStatusLabel: item.paymentProofStatusLabel || "",
          transferDate: item.transferDate || "",
          transferTime: item.transferTime || "",
          transferAmount: item.transferAmount || 0,
          items: [],
          totalAmount: 0,
          totalQuantity: 0,
        };
      }

      acc[item.orderId].items.push(item);
      acc[item.orderId].totalAmount += item.lineTotal || item.price * item.quantity;
      acc[item.orderId].totalQuantity += item.quantity || 0;

      return acc;
    }, {}),
  ).map((group) => ({
    ...group,
    primaryItem: group.items[0],
    extraItems: group.items.slice(1),
  }));

const MyOrders = ({ orders, summary, loading, error, onRefresh }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSubmitPaymentProof = async (orderId, payload) => {
    const response = await fetch(
      `${serverBaseUrl}/api/user-dashboard/orders/${orderId}/payment-proof`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "ไม่สามารถส่งข้อมูลการโอนเงินได้");
    }

    await onRefresh?.();
    return result.data;
  };

  const groupedOrders = groupOrdersByOrderId(orders);

  const filteredOrders =
    activeTab === "All"
      ? groupedOrders
      : groupedOrders.filter((order) => order.status === activeTab);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const orderStats = [
    { label: "Total orders", value: String(summary.totalOrders) },
    { label: "Total spend", value: `฿${formatCurrency(summary.totalSpend)}` },
    { label: "Completed", value: String(summary.completedOrders) },
  ];

  if (loading) {
    return <section className="text-sm text-gray-500">Loading orders...</section>;
  }

  if (error) {
    return <section className="text-sm text-red-500">{error}</section>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Order items from your account
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {orderStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-5 md:px-6 md:py-5"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition md:px-5 md:py-2.5 ${
                isActive
                  ? "bg-[#1e1b4b] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSubmitPaymentProof={handleSubmitPaymentProof}
            />
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-sm text-gray-400">
            No orders found for this filter.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#8df0a9] text-gray-900"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
};

export default MyOrders;
