import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      await signup(data.email, data.password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setAuthError("An account with this email already exists");
      } else if (err.code === "auth/weak-password") {
        setAuthError("Password is too weak");
      } else {
        setAuthError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-slate-400 mb-6">Get started with your inventory</p>

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
              placeholder="At least 6 characters"
              {...register("password")}
              error={errors.password?.message}
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                {authError}
              </div>
            )}

            <Button type="submit" loading={isSubmitting}>
              Create account
            </Button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}