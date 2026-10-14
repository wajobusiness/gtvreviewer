"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  FileBadge,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchUserRole } = useAuth();
  const [email, setEmail] = useState("sarah.jenkins@techvisalegal.co.uk");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickLogin = (role: "SOLICITOR" | "CANDIDATE" | "ADMIN", demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("••••••••••••");
    switchUserRole(role);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileBadge className="w-5 h-5" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">GTV REVIEWER</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your pre-submission audit dashboard and client portfolios.
          </p>
        </div>

        {/* Demo Quick Logins Card */}
        <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-2 text-xs">
          <div className="flex items-center justify-between text-blue-300 font-semibold text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Demo Instant Access
            </span>
            <span className="text-[10px] font-mono text-blue-400">1-Click Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin("SOLICITOR", "sarah.jenkins@techvisalegal.co.uk")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-[11px] text-slate-200 transition-colors"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-400" /> Solicitor
              </div>
              <div className="text-[10px] text-slate-400 truncate">Tech Visa Legal</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("CANDIDATE", "applicant@talent.tech")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-[11px] text-slate-200 transition-colors"
            >
              <div className="font-semibold text-white flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400" /> Applicant
              </div>
              <div className="text-[10px] text-slate-400 truncate">Alex Taylor (Sample)</div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@lawfirm.co.uk"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <a href="#" className="text-[11px] text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-600"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Sign In to Platform"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Logins */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-2 text-slate-500 text-[10px] uppercase font-mono">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("SOLICITOR", "google.solicitor@legal.co.uk")}
              className="py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-xs font-medium text-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("CANDIDATE", "github.engineer@developer.com")}
              className="py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-xs font-medium text-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300">
            Sign up for a free audit
          </Link>
        </div>
      </div>
    </div>
  );
}

