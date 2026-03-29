"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  Shield, 
  Eye, 
  Smartphone, 
  Globe, 
  Lock, 
  LogOut, 
  ChevronRight,
  User,
  Zap,
  Cpu,
  Palette
} from "lucide-react";
import { useState } from "react";

interface NotificationSettings {
  marketAlerts: boolean;
  aiBriefings: boolean;
  portfolioMoves: boolean;
  security: boolean;
}

interface SettingItem {
  label: string;
  desc: string;
  icon?: React.ReactNode;
  badge?: string;
  toggle?: keyof NotificationSettings;
  action?: string;
}

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingItem[];
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    marketAlerts: true,
    aiBriefings: true,
    portfolioMoves: false,
    security: true
  });

  const sections: SettingSection[] = [
    {
      id: "account",
      title: "Account & Security",
      icon: <Shield className="text-blue-400" size={20} />,
      items: [
        { label: "Personal Information", desc: "Update your name, email and details", icon: <User size={18} /> },
        { label: "Password & 2FA", desc: "Manage your login security", icon: <Lock size={18} />, badge: "High" },
        { label: "Linked Accounts", desc: "Zerodha, Upstox, Google", icon: <Globe size={18} /> },
      ]
    },
    {
      id: "notifications",
      title: "Intelligence Alerts",
      icon: <Bell className="text-orange-400" size={20} />,
      items: [
        { label: "Market Volatility", desc: "Real-time alerts on significant moves", toggle: "marketAlerts" },
        { label: "AI Morning Briefings", desc: "Daily personalized stock picks", toggle: "aiBriefings" },
        { label: "Portfolio Rebalancing", desc: "Guidance on your asset allocation", toggle: "portfolioMoves" },
      ]
    },
    {
      id: "interface",
      title: "Interface & AI",
      icon: <Palette className="text-purple-400" size={20} />,
      items: [
        { label: "Display Theme", desc: "GenZet Dark Mode (Default)", action: "Customize" },
        { label: "AI Concierge Tone", desc: "Professional & Analytical", action: "Change" },
        { label: "Data Privacy Mode", desc: "Strict (Local processing first)", icon: <Eye size={18} /> },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-10"
      >
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-editorial text-4xl text-white">Application Settings</h1>
          <p className="text-sm text-muted-foreground/60 uppercase tracking-widest font-bold">Preferences & System Configuration</p>
        </div>

        {/* Dynamic Sections */}
        <div className="grid grid-cols-1 gap-8">
          {sections.map((section, sIdx) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                {section.icon}
                <h2 className="text-lg font-bold text-white tracking-tight">{section.title}</h2>
              </div>
              
              <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                {section.items.map((item, iIdx) => (
                  <div 
                    key={item.label}
                    className={`group flex items-center justify-between p-5 transition-colors hover:bg-white/[0.03] ${
                      iIdx !== section.items.length - 1 ? 'border-bottom border-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon && <div className="text-muted-foreground group-hover:text-white transition-colors">{item.icon}</div>}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight">{item.label}</span>
                        <span className="text-xs text-muted-foreground/60">{item.desc}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.badge && (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-black text-green-400 uppercase tracking-widest">
                          {item.badge}
                        </span>
                      )}
                      {item.toggle ? (
                        <button 
                          onClick={() => setNotifications(prev => ({ ...prev, [item.toggle as string]: !prev[item.toggle as keyof typeof prev] }))}
                          className={`relative h-6 w-11 rounded-full transition-colors duration-200 outline-none ${
                            notifications[item.toggle as keyof typeof notifications] ? 'bg-blue-500' : 'bg-white/10'
                          }`}
                        >
                          <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ${
                            notifications[item.toggle as keyof typeof notifications] ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      ) : item.action ? (
                        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                          {item.action}
                        </button>
                      ) : (
                        <ChevronRight className="text-white/10 group-hover:text-white/40 transition-colors" size={18} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Advanced System Status */}
        <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="text-emerald-400" size={18} />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">System Engine</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_oklch(0.65_0.15_150)]" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Operational</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Market Feed", value: "NSE (15m Delayed)" },
              { label: "AI Latency", value: "420ms" },
              { label: "Data Integrity", value: "SHA-256" },
              { label: "API Version", value: "v2.0.4-ET" }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col rounded-xl border border-white/5 bg-white/5 p-3">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">{stat.label}</span>
                <span className="mt-1 text-xs font-medium text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Logout CTA */}
        <div className="pt-10 flex border-t border-white/5 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Sign out of session</span>
            <span className="text-xs text-muted-foreground">You are currently logged in via Google Auth</span>
          </div>
          <button className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-3 text-xs font-black text-red-400 uppercase tracking-widest transition-colors hover:bg-red-500/20">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
