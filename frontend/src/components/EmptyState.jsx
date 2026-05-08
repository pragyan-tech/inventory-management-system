import { motion } from "framer-motion";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Icon with gradient backdrop */}
      {Icon && (
        <div className="relative mb-5">
          {/* Gradient glow behind the icon */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 blur-2xl rounded-full" />

          {/* Icon container */}
          <div className="relative w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
            <Icon className="text-slate-400" size={28} />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-400 max-w-sm mb-5">{description}</p>
      )}

      {/* Optional action button */}
      {action}
    </motion.div>
  );
}