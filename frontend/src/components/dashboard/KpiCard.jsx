import { Loader2 } from "lucide-react";

export default function KpiCard({ icon: Icon, label, value, subtitle, accentColor = "indigo", loading }) {
  const accentClasses = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    green: "text-green-400 bg-green-500/10",
    yellow: "text-yellow-400 bg-yellow-500/10",
    red: "text-red-400 bg-red-500/10",
    purple: "text-purple-400 bg-purple-500/10",
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${accentClasses[accentColor]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white">
        {loading ? (
          <Loader2 className="animate-spin text-slate-500" size={24} />
        ) : (
          value
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
}