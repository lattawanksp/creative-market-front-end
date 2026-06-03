const fallbackProductImage =
  "https://res.cloudinary.com/duc5gow6f/image/upload/v1779948614/frieren-01_jbkbxq.png";

const statusClasses = {
  pending: "bg-gray-100 text-gray-600",
  "awaiting-proof": "bg-amber-100 text-amber-700",
  "awaiting-review": "bg-sky-100 text-sky-700",
  confirmed: "bg-emerald-50 text-emerald-600",
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
          <img
            src={order.images?.[0] || fallbackProductImage}
            alt={order.name}
            className="h-10 w-10 rounded-xl bg-gray-100 object-cover"
          />
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
          className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${statusClasses[order.displayStatus]}`}
        >
          {order.displayStatusLabel}
        </span>
      </td>
    </tr>
  );
};

export default RecentOrderRow;
