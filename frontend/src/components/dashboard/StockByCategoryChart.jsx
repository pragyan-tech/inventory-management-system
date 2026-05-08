import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";
import { fetchStockByCategory } from "../../api/analytics";
import Skeleton from "../Skeleton";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-white font-medium">{data.categoryName}</p>
      <p className="text-slate-400 text-sm mt-1">
        {data.totalUnits} units · {data.productCount} products
      </p>
    </div>
  );
}

export default function StockByCategoryChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", "stockByCategory"],
    queryFn: fetchStockByCategory,
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Stock by Category</h3>
        <p className="text-slate-400 text-sm">Total units distributed across categories</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-48 h-48 rounded-full" />
          </div>
        )}

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
            <PieChart>
              <Pie
                data={data}
                dataKey="totalUnits"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}