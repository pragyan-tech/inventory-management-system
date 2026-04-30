import { forwardRef } from "react";

const Input = forwardRef(({ label, error, type = "text", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
          error ? "border-red-500" : "border-slate-700"
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;