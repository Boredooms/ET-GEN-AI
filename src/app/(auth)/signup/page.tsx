"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, authClient } from "@/lib/auth-client";
import { ArrowRight, Loader2, AlertCircle, Mail, Lock, User, GraduationCap, TrendingUp, Briefcase, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const USER_ROLES = [
  { 
    id: "student", 
    label: "Student", 
    icon: GraduationCap,
    desc: "Building financial knowledge and tracking career signals",
    color: "oklch(0.6 0.15 220)" 
  },
  { 
    id: "investor", 
    label: "Investor", 
    icon: TrendingUp,
    desc: "Tracking markets, sectors, and wealth creation opportunities",
    color: "oklch(0.6 0.15 270)" 
  },
  { 
    id: "founder", 
    label: "Founder", 
    icon: Rocket,
    desc: "Following startups, funding rounds, and policy changes",
    color: "oklch(0.65 0.15 85)" 
  },
  { 
    id: "professional", 
    label: "Professional", 
    icon: Briefcase,
    desc: "Staying ahead in leadership and business strategy",
    color: "oklch(0.6 0.15 142)" 
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
  });
  
  const createProfile = useMutation(api.profiles.createProfile);
  const createUser = useMutation(api.users.create);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, role: roleId }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Use Better Auth signUp
      const result = await signUp.email(
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        },
        {
          onSuccess: async (ctx) => {
            // After signup, fetch the session to get the Better Auth user info
            const { data: session } = await authClient.getSession();
            
            if (session?.user?.id) {
              try {
                // Step 1: Create a Convex users entry (this returns a Convex ID)
                const convexUserId = await createUser({
                  email: formData.email,
                  name: formData.name,
                  authProviderId: session.user.id, // Store Better Auth ID as reference
                });
                
                // Step 2: Create profile with the Convex userId
                await createProfile({
                  userId: convexUserId,
                  userType: formData.role,
                  name: formData.name,
                  email: formData.email,
                });
              } catch (err) {
                console.error("User/Profile creation error:", err);
                // Continue even if creation fails - user can complete profile later
              }
            }
            
            // Redirect to dashboard after successful signup
            setIsLoading(false);
            router.push("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Failed to create account");
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
            <h1 className="font-editorial text-3xl text-foreground mb-2">GENZET AI</h1>
          </Link>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {USER_ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = formData.role === role.id;
                  
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative p-4 rounded-lg border-2 text-left transition-all
                        ${isSelected 
                          ? 'border-foreground bg-[oklch(0.15_0_0)]' 
                          : 'border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] hover:border-[oklch(1_0_0_/_20%)]'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="rounded-lg p-2 shrink-0"
                          style={{ backgroundColor: `${role.color}20` }}
                        >
                          <Icon 
                            className="h-5 w-5" 
                            style={{ color: role.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground text-sm mb-1">
                            {role.label}
                          </div>
                          <div className="text-xs text-muted-foreground leading-tight">
                            {role.desc}
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected Indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 h-5 w-5 rounded-full bg-foreground flex items-center justify-center"
                        >
                          <div className="h-2 w-2 rounded-full bg-background" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="block w-full text-center rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-3 font-medium text-foreground hover:bg-[oklch(0.12_0_0)] transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
