import { useCallback } from "react";
import { toast } from "sonner";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { useStompSubscription } from "../hooks/useStompSubscription";
import { useAlertsStore } from "../lib/alertsStore";

export default function AlertsListener() {
  const addAlert = useAlertsStore((state) => state.addAlert);

  const handleAlert = useCallback(
    (alert) => {
      addAlert(alert);

      const isOutOfStock = alert.severity === "OUT_OF_STOCK";
      const Icon = isOutOfStock ? AlertCircle : AlertTriangle;
      const iconColor = isOutOfStock ? "text-red-500" : "text-yellow-500";

      toast.custom(
        (t) => (
          <div
            onClick={() => toast.dismiss(t)}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl flex items-start gap-3 min-w-[320px] cursor-pointer"
          >
            <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">
                {isOutOfStock ? "Out of Stock" : "Low Stock Alert"}
              </p>
              <p className="text-slate-300 text-sm mt-0.5 truncate">
                {alert.productName}
                <span className="text-slate-500 font-mono ml-1">({alert.productSku})</span>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {alert.currentStock} units · threshold {alert.threshold}
              </p>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
    },
    [addAlert]
  );

  useStompSubscription("/topic/alerts/low-stock", handleAlert);

  return null;
}