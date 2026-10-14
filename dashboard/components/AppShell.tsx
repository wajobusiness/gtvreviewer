"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";

const publicRoutes = ["/", "/login", "/register", "/pricing", "/terms", "/privacy"];

export function AppShell({
  children,
  audit,
}: {
  children: React.ReactNode;
  audit: any;
}) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Left Persistent / Mobile Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header
          documentOwner={audit?.metadata?.documentOwner || "Applicant"}
          auditDate={audit?.metadata?.auditDate || "2026-10-13"}
          currentStatus={audit?.kpis?.currentStatus || "CRITICAL REFUSAL RISK"}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

