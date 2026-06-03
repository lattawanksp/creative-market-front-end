import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import OrderRow from "./01_OrderRow";

const ORDERS_PER_PAGE = 10;

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
          customer: item.customer,
          courier: item.courier || "",
          trackingNumber: item.trackingNumber || "",
          paymentProofStatus: item.paymentProofStatus || "none",
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
      acc[item.orderId].totalAmount += item.amount || item.price * item.quantity;
      acc[item.orderId].totalQuantity += item.quantity || 0;

      return acc;
    }, {}),
  ).map((group) => ({
    ...group,
    primaryItem: group.items[0],
    extraItems: group.items.slice(1),
  }))
    .filter((group) => group.primaryItem);

const Orders = ({ summary, orders, loading, error, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const groupedOrders = groupOrdersByOrderId(orders);

  const totalPages = Math.ceil(groupedOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = groupedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const stats = [
    { label: "ALL ORDERS", value: String(summary.allOrders) },
    { label: "PENDING", value: String(summary.pendingCount) },
    { label: "PAID", value: String(summary.paidCount) },
    { label: "CANCELLED", value: String(summary.cancelledCount) },
  ];

  if (loading) {
    return <section className="text-sm text-gray-500">Loading orders...</section>;
  }

  if (error) {
    return <section className="text-sm text-red-500">{error}</section>;
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Orders
          </h1>
          <p className="text-sm text-gray-500">
            Track every order from payment to delivery
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              {stat.label}
            </p>
            <p className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                <th className="px-4 py-4 font-semibold md:px-6">Product</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Qty</th>
                <th className="px-4 py-4 font-semibold">Customer</th>
                <th className="px-4 py-4 text-right font-semibold">Amount</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Courier</th>
                <th className="px-4 py-4 font-semibold">Tracking Number</th>
                <th className="px-4 py-4 font-semibold">Transfer Info</th>
                <th className="px-4 py-4 font-semibold md:px-6">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map((order) => (
                <OrderRow key={order.id} order={order} onRefresh={onRefresh} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${
                currentPage === page
                  ? "bg-[#8df0a9] text-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default Orders;
