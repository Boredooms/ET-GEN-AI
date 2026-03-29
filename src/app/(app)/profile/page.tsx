"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Target, 
  Briefcase, 
  Edit3, 
  ArrowRight,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const interests = profile?.interests || [];
  const goals = profile?.goals || [];

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-8"
      >
        {/* Profile Header Card */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl lg:p-12">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />

          <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Avatar Section */}
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-3xl border-2 border-white/10 bg-white/5 p-1 transition-transform group-hover:scale-105 lg:h-40 lg:w-40">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <User className="h-16 w-16 text-white/40 lg:h-20 lg:w-20" />
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 rounded-xl border border-white/10 bg-[oklch(0.1_0_0)] p-2 text-white shadow-xl backdrop-blur-xl hover:bg-white/10">
                <Edit3 size={16} />
              </button>
            </div>

            {/* User Info Section */}
            <div className="flex flex-1 flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                <h1 className="font-editorial text-4xl text-white lg:text-5xl">{profile?.name || "Anonymous User"}</h1>
                <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-black text-green-400 uppercase tracking-widest">
                  <Award size={12} /> Premium Member
                </div>
              </div>
              
              <p className="mt-2 text-lg text-muted-foreground/80">{profile?.userType === 'professional' ? 'Financial Professional' : profile?.userType === 'investor' ? 'Active Investor' : 'Wealth Explorer'}</p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  <Mail className="text-muted-foreground" size={18} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Email</span>
                    <span className="text-sm font-medium text-white">{profile?.email || "No email provided"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  <Calendar className="text-muted-foreground" size={18} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Member Since</span>
                    <span className="text-sm font-medium text-white">{new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  <ShieldCheck className="text-muted-foreground" size={18} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Verification</span>
                    <span className="text-sm font-medium text-green-400">Verified Identity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment DNA & Interests Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Investment DNA Card */}
          <div className="col-span-2 space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <TrendingUp className="text-blue-400" size={20} />
              Investment DNA
            </h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Risk Profile */}
              <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[oklch(0.08_0_0)] p-6">
                <div className={`absolute -right-4 -top-4 h-24 w-24 blur-[40px] opacity-20 ${
                  profile?.riskLevel === 'high' ? 'bg-orange-500' : profile?.riskLevel === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Risk Sensitivity</span>
                  <Zap className={profile?.riskLevel === 'high' ? 'text-orange-400' : 'text-blue-400'} size={18} />
                </div>
                <div className="text-2xl font-black text-white uppercase tracking-tighter">{profile?.riskLevel || "Medium"}</div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {profile?.riskLevel === 'high' ? 'Focused on aggressive capital appreciation with high volatility tolerance.' : 'Balanced approach prioritizing steady growth and capital preservation.'}
                </p>
              </div>

              {/* Primary Goals */}
              <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[oklch(0.08_0_0)] p-6">
                <div className="absolute -right-4 -top-4 h-24 w-24 bg-purple-500/10 blur-[40px]" />
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Core Objective</span>
                  <Target className="text-purple-400" size={18} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {goals.map((goal) => (
                    <span key={goal} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                      {goal.replace('-', ' ')}
                    </span>
                  ))}
                  {goals.length === 0 && <span className="text-2xl font-black text-white uppercase tracking-tighter">Diversified</span>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed italic">
                  "Building long-term wealth through diversified assets."
                </p>
              </div>
            </div>

            {/* Interest Cloud */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8">
              <h3 className="mb-6 flex items-center justify-between text-sm font-bold text-white uppercase tracking-widest">
                Knowledge Focus
                <button className="text-[10px] text-blue-400 hover:underline">Customize</button>
              </h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest, i) => (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <Briefcase size={14} className="text-muted-foreground" />
                    {interest.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Column */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <Clock className="text-green-400" size={20} />
              Activity
            </h2>
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6">
              <div className="space-y-6">
                {[
                  { title: "Market BriefingRead", date: "2 mins ago", sub: "Budget 2026 Analysis" },
                  { title: "Concierge Strategy", date: "1 hour ago", sub: "Equity Rebalancing" },
                  { title: "Portfolio Update", date: "Yesterday", sub: "Allocated ₹2.5L to Tech" },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 border-l border-white/10 pl-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-white">{act.title}</span>
                      <span className="text-[11px] text-muted-foreground/60">{act.sub}</span>
                      <span className="mt-1 text-[10px] text-white/20">{act.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/5 py-3 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-white/10">
                View All Activity <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Experience Retake CTA */}
        <div className="flex items-center justify-between rounded-[2.5rem] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent p-8 border border-white/5">
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-white">Need to refine your goals?</h3>
            <p className="text-sm text-muted-foreground/80 mt-1">Re-run the financial profiling experiment to update your personalized intelligence feed.</p>
          </div>
          <button className="rounded-2xl bg-white px-6 py-3 text-xs font-black text-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">
            Retake Profiling
          </button>
        </div>
      </motion.div>
    </div>
  );
}
