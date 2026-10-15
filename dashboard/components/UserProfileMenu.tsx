"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Shield, ChevronDown, Settings, CreditCard, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserProfileMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs text-foreground transition-all"
        title="User Profile & Role Switching"
      >
        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-[11px]">
          {user.fullName.charAt(0)}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="font-semibold text-xs leading-none">{user.fullName.split(",")[0]}</span>
          <span className="text-[10px] text-muted-foreground font-mono leading-none mt-1">
            {user.role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-72 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-2 z-50 text-xs">
          <div className="p-2 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{user.fullName}</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase",
                user.role === "ADMIN" 
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                  : user.role === "SOLICITOR" 
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              )}>
                {user.role}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{user.email}</div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 space-y-0.5">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Telemetry</span>
              </Link>
            )}
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Workspace Settings</span>
            </Link>
            {user.role !== "CANDIDATE" && (
              <Link
                href="/billing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Subscription & Billing</span>
              </Link>
            )}
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await logout();
                router.push("/login");
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

