import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";
import { fetchTopProducts } from "../../api/analytics";

function formatCurrency(value) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-white font-medium">{data.name}</p>
      <p className="text-slate-400 text-xs font-mono">{data.sku}</p>
      <p className="text-indigo-400 text-sm mt-2">
        Value: ${Number(data.inventoryValue).toLocaleString()}
      </p>
      <p className="text-slate-400 text-xs mt-1">
        {data.unitsInStock} × ${data.unitPrice}
      </p>
    </div>
  );
}

export default function TopProductsChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "topProducts"],
    queryFn: fetchTopProducts,
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Top Products by Value</h3>
        <p className="text-slate-400 text-sm">Where your inventory capital is concentrated</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isLoading && <Loader2 className="animate-spin text-slate-500" size={32} />}

        {isError && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} /> Failed to load chart data
          </div>
        )}

        {data && data.length === 0 && (
          <p className="text-slate-500 text-sm">No data to display</p>
        )}

        {data && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis
                type="number"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                width={120}
                tickFormatter={(name) => name.length > 16 ? name.substring(0, 14) + "…" : name}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1e293b" }} />
              <Bar dataKey="inventoryValue" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}