import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import Skeleton from "../Skeleton";

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export default function KpiCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accentColor = "emerald",
  loading,
  prefix = "",
  suffix = "",
  decimals = 0,
}) {
  const accents = {
    emerald: {
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-400",
      glow: "from-emerald-500/20",
      border: "hover:border-emerald-500/30",
    },
    violet: {
      iconBg: "bg-violet-500/10",
      iconText: "text-violet-400",
      glow: "from-violet-500/20",
      border: "hover:border-violet-500/30",
    },
    yellow: {
      iconBg: "bg-yellow-500/10",
      iconText: "text-yellow-400",
      glow: "from-yellow-500/20",
      border: "hover:border-yellow-500/30",
    },
    red: {
      iconBg: "bg-red-500/10",
      iconText: "text-red-400",
      glow: "from-red-500/20",
      border: "hover:border-red-500/30",
    },
  };

  const colors = accents[accentColor] || accents.emerald;
  const numericValue = typeof value === "number" ? value : 0;
  const animatedValue = useCountUp(numericValue, 1200, label);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 overflow-hidden ${colors.border}`}
    >
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${colors.glow} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      <div className="flex items-start justify-between mb-3 relative">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            <Icon size={18} className={colors.iconText} />
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-white relative min-h-[36px]">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : typeof value === "number" ? (
          <>
            {prefix}{formatNumber(animatedValue, decimals)}{suffix}
          </>
        ) : (
          value
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2 relative">{subtitle}</p>
      )}
    </motion.div>
  );
}