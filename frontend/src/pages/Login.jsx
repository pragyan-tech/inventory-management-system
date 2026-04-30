import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-6">Sign in to your account</p>

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
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}