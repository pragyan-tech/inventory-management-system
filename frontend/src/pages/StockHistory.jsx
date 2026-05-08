import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, ArrowUpRight, ArrowDownRight, Plus, Minus, RefreshCw, ArrowLeft, History } from "lucide-react";
import { fetchMovements, fetchProductMovements } from "../api/movements";
import EmptyState from "../components/EmptyState";


const movementConfig = {
  INITIAL: { icon: Plus, color: "text-blue-400", bg: "bg-blue-500/20", label: "Initial Stock" },
  STOCK_IN: { icon: ArrowUpRight, color: "text-green-400", bg: "bg-green-500/20", label: "Stock In" },
  STOCK_OUT: { icon: ArrowDownRight, color: "text-red-400", bg: "bg-red-500/20", label: "Stock Out" },
  ADJUSTMENT: { icon: RefreshCw, color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Adjustment" },
  BULK_IMPORT: { icon: Plus, color: "text-purple-400", bg: "bg-purple-500/20", label: "Bulk Import" },
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StockHistory() {
  const [page, setPage] = useState(0);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movements", { page, productId }],
    queryFn: () =>
      productId
        ? fetchProductMovements(productId, { page, size: 20 })
        : fetchMovements({ page, size: 20 }),
    keepPreviousData: true,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        {productId && (
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to all history
          </Link>
        )}
        <h1 className="text-3xl font-bold text-white">
          {productId && data?.content?.[0]
            ? `History: ${data.content[0].productName}`
            : "Stock History"}
        </h1>
        <p className="text-slate-400 mt-1">
          {productId
            ? "Activity for this product"
            : "Audit log of all inventory changes"}
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-slate-500" size={32} />
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-400 font-medium">Failed to load history</p>
            <p className="text-red-400/70 text-sm mt-1">{error?.message}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {data.content.length === 0 ? (
            <EmptyState
              icon={History}
              title="No stock movements yet"
              description="When products are created or updated, the changes will appear here as an audit trail."
            />
          ) : (
            <div className="space-y-2">
              {data.content.map((movement) => {
                const config = movementConfig[movement.movementType] || movementConfig.ADJUSTMENT;
                const Icon = config.icon;
                const isPositive = movement.quantityChange > 0;

                return (
                  <div
                    key={movement.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-4 hover:bg-slate-800/80 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`${config.bg} rounded-lg p-2.5 flex-shrink-0`}>
                      <Icon className={config.color} size={20} />
                    </div>


                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-white font-medium truncate">
                          {movement.productName || "(deleted product)"}
                        </p>
                        <p className="text-slate-500 text-xs font-mono">
                          {movement.productSku}
                        </p>
                      </div>
                      <p className="text-slate-400 text-sm mt-0.5">
                        <span className={`font-medium ${config.color}`}>{config.label}</span>
                        {movement.reason && <span className="text-slate-500"> · {movement.reason}</span>}
                      </p>
                    </div>

                    {/* Quantity change */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {isPositive ? "+" : ""}{movement.quantityChange}
                      </p>
                      <p className="text-slate-500 text-xs">
                        new total: {movement.stockAfter}
                      </p>
                    </div>


                    <div className="text-right flex-shrink-0 hidden md:block min-w-[160px]">
                      <p className="text-slate-300 text-sm truncate">
                        {movement.performedByEmail}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {formatDate(movement.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Page {data.number + 1} of {data.totalPages} · {data.totalElements} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={data.first}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.last}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}