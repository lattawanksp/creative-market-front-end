import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SalesChart = ({ chartData }) => {
  return (
    <article className="rounded-2xl bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sales Overview</h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          Weekly
        </button>
      </div>

      <div className="mt-6 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="salesAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload;
                return point?.fullDate || point?.label || "";
              }}
              formatter={(value) => [
                `THB ${Number(value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                "Sales",
              ]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#salesAreaGradient)"
              activeDot={{
                r: 6,
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

export default SalesChart;
