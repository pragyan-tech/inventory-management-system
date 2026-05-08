import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Plus, RefreshCw, Loader2, ArrowRight, Clock } from "lucide-react";
import { fetchMovements } from "../../api/movements";
import Skeleton from "../Skeleton";
import EmptyState from "../EmptyState";

const movementConfig = {
  INITIAL: { icon: Plus, color: "text-blue-400", bg: "bg-blue-500/10" },
  STOCK_IN: { icon: ArrowUpRight, color: "text-green-400", bg: "bg-green-500/10" },
  STOCK_OUT: { icon: ArrowDownRight, color: "text-red-400", bg: "bg-red-500/10" },
  ADJUSTMENT: { icon: RefreshCw, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  BULK_IMPORT: { icon: Plus, color: "text-purple-400", bg: "bg-purple-500/10" },
};

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ["movements", { page: 0, recent: true }],
    queryFn: () => fetchMovements({ page: 0, size: 5 }),
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Recent Activity</h3>
          <p className="text-slate-400 text-sm">Latest stock movements</p>
        </div>
        <Link
          to="/history"
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-48" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      )}

      {data && data.content.length === 0 && (
        <EmptyState
          icon={Clock}
          title="No activity yet"
          description="Stock changes will appear here as they happen."
        />
      )}

      {data && data.content.length > 0 && (
        <div className="space-y-2">
          {data.content.map((movement) => {
            const config = movementConfig[movement.movementType] || movementConfig.ADJUSTMENT;
            const Icon = config.icon;
            const isPositive = movement.quantityChange > 0;

            return (
              <div
                key={movement.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className={`${config.bg} rounded-lg p-2 flex-shrink-0`}>
                  <Icon className={config.color} size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {movement.productName || "(deleted product)"}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {movement.performedByEmail} · {timeAgo(movement.createdAt)}
                  </p>
                </div>

                <div className={`text-sm font-semibold flex-shrink-0 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {isPositive ? "+" : ""}{movement.quantityChange}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}