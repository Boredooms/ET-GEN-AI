"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { ArrowRight, Loader2, AlertCircle, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      // Use Better Auth signIn
      const result = await signIn.email(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: () => {
            // Redirect to dashboard after successful login
            setIsLoading(false);
            router.push("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Invalid email or password");
            setIsLoading(false);
          },
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-editorial text-3xl text-foreground mb-2">CollegeSide</h1>
          </Link>
          <p className="text-muted-foreground">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] text-foreground focus:ring-2 focus:ring-foreground focus:ring-offset-0"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[oklch(1_0_0_/_10%)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[oklch(0.09_0_0)] text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="block w-full text-center rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-3 font-medium text-foreground hover:bg-[oklch(0.12_0_0)] transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help?{" "}
          <Link href="/support" className="underline hover:text-foreground">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
