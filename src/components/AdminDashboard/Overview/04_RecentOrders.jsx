import RecentOrderRow from "./05_RecentOrderRow";

const RecentOrders = ({ orders, onOpenOrders }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        <p className="mt-1 text-sm text-gray-400">
          Monitor your latest customer transactions
        </p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-4 py-4 text-center">
          <button
            type="button"
            onClick={onOpenOrders}
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            View Full Order Status →
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentOrders;
