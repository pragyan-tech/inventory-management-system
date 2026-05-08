import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, BarChart3, ScanLine, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const features = [
  { icon: Bell, label: "Live alerts" },
  { icon: BarChart3, label: "Real-time analytics" },
  { icon: ScanLine, label: "Barcode scanning" },
  { icon: ClipboardList, label: "Audit logs" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setAuthError("Invalid email or password");
      } else if (err.code === "auth/too-many-requests") {
        setAuthError("Too many failed attempts. Try again later.");
      } else {
        setAuthError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side — Brand showcase */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo */}
          <Logo size={36} />

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
              Inventory
              <br />
              <span className="font-hand text-emerald-400 text-6xl italic font-bold">tracked beautifully</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Real-time stock alerts, audit trails, and barcode scanning — built for modern teams.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
              >
                <Icon size={14} className="text-emerald-400" />
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Subtle decorative element — mimics Odoo's "spark" marks */}
          <div className="flex items-center gap-3 text-slate-500 text-sm pt-4">
            <div className="h-px w-12 bg-slate-700"></div>
            <span>Free, forever, unlimited users</span>
          </div>
        </motion.div>

        {/* Right side — Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile-only logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Logo size={32} />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                  {authError}
                </div>
              )}

              <Button type="submit" loading={isSubmitting}>
                Sign in
              </Button>
            </form>

            <p className="text-slate-400 text-sm text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}