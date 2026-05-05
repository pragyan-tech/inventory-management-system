import { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, AlertCircle, Trash2 } from "lucide-react";
import { useAlertsStore } from "../lib/alertsStore";

function timeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AlertsBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const alerts = useAlertsStore((state) => state.alerts);
  const unreadCount = useAlertsStore((state) => state.unreadCount);
  const markAllRead = useAlertsStore((state) => state.markAllRead);
  const clearAlerts = useAlertsStore((state) => state.clearAlerts);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleToggle = () => {
    setOpen((o) => {
      if (!o && unreadCount > 0) {
        markAllRead();
      }
      return !o;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="text-white font-semibold">Alerts</h3>
            {alerts.length > 0 && (
              <button
                onClick={() => {
                  clearAlerts();
                  setOpen(false);
                }}
                className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} />
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="text-slate-600 mx-auto mb-2" size={28} />
                <p className="text-slate-500 text-sm">No alerts yet</p>
                <p className="text-slate-600 text-xs mt-1">
                  Stock alerts will appear here in real time
                </p>
              </div>
            ) : (
              alerts.map((alert, i) => {
                const isOutOfStock = alert.severity === "OUT_OF_STOCK";
                const Icon = isOutOfStock ? AlertCircle : AlertTriangle;
                const iconColor = isOutOfStock ? "text-red-400 bg-red-500/10" : "text-yellow-400 bg-yellow-500/10";

                return (
                  <div
                    key={i}
                    className="p-3 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${iconColor} rounded-lg p-2 flex-shrink-0`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {alert.productName}
                        </p>
                        <p className="text-slate-500 text-xs font-mono">
                          {alert.productSku}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${isOutOfStock ? "text-red-400" : "text-yellow-400"}`}>
                            {alert.currentStock} units
                          </p>
                          <p className="text-slate-500 text-xs">
                            {timeAgo(alert.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}