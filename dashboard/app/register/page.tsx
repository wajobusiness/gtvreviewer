"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  FileBadge,
  Building2,
  UserCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState<"SOLICITOR" | "CANDIDATE">("SOLICITOR");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [route, setRoute] = useState<"Exceptional Promise" | "Exceptional Talent">("Exceptional Promise");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      setError("Please complete all required fields.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          orgName: orgName.trim(),
          accountType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      login(data.user, data.organization);
      router.push("/dashboard");
    } catch {
      setError("Failed to connect to registration server. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileBadge className="w-5 h-5" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">GTV REVIEWER</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Create Your Audit Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Start auditing UK Global Talent visa portfolios under 2026 Tech Nation Guidelines.
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setAccountType("SOLICITOR")}
            className={`p-3 rounded-xl text-left transition-all flex items-start gap-3 ${
              accountType === "SOLICITOR"
                ? "bg-slate-800 border border-blue-500/50 shadow-md"
                : "hover:bg-slate-800/40"
            }`}
          >
            <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${accountType === "SOLICITOR" ? "text-blue-400" : "text-slate-500"}`} />
            <div>
              <div className="text-xs font-bold text-white">Law Firm / Counsel</div>
              <div className="text-[10px] text-slate-400">Multi-client candidate portfolios & dossiers</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAccountType("CANDIDATE")}
            className={`p-3 rounded-xl text-left transition-all flex items-start gap-3 ${
              accountType === "CANDIDATE"
                ? "bg-slate-800 border border-emerald-500/50 shadow-md"
                : "hover:bg-slate-800/40"
            }`}
          >
            <UserCheck className={`w-5 h-5 shrink-0 mt-0.5 ${accountType === "CANDIDATE" ? "text-emerald-400" : "text-slate-500"}`} />
            <div>
              <div className="text-xs font-bold text-white">Direct Applicant</div>
              <div className="text-[10px] text-slate-400">Self-represented tech founders & engineers</div>
            </div>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {accountType === "SOLICITOR" ? "Law Firm Name" : "Company / Venture"}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={accountType === "SOLICITOR" ? "Tech Visa Legal Partners" : "CloudScale Labs Ltd"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@legalchambers.co.uk"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Target Visa Route
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Exceptional Promise">Exceptional Promise (&le; 5 yrs)</option>
                  <option value="Exceptional Talent">Exceptional Talent (&gt; 5 yrs)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-800 bg-slate-950 text-blue-600"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and acknowledge the{" "}
                  <Link href="/privacy" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Initializing Workspace..." : "Create Free Workspace & Begin Audit"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
            Sign in to existing workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

