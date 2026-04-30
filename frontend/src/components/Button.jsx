export default function Button({ children, loading, disabled, variant = "primary", ...props }) {
  const baseClasses = "w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}