const statusClasses = {
  paid: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  cancelled: "bg-rose-50 text-rose-600",
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

const RecentOrderRow = ({ order }) => {
  return (
    <tr className="align-top transition-colors hover:bg-gray-50/50">
      <td className="px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          {order.image ? (
            <img
              src={order.image}
              alt={order.name}
              className="h-10 w-10 rounded-xl bg-gray-100 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
              {order.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-800">{order.name}</p>
            <p className="mt-1 text-xs text-gray-500">by {order.artist}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-400">{formatDate(order.date)}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-700">
        {order.quantity}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">{order.customer}</td>
      <td className="px-4 py-4 text-right text-sm font-bold text-gray-900">
        {formatAmount(order.amount)}
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${statusClasses[order.status]}`}
        >
          {order.statusLabel}
        </span>
      </td>
    </tr>
  );
};

export default RecentOrderRow;
