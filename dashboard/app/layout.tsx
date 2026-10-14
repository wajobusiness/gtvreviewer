import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { getAuditData } from "@/lib/reports";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "GTV Reviewer | UK Global Talent Visa AI Pre-Submission Audit Platform",
  description:
    "Hostile-but-fair forensic pre-submission audit and verification platform for UK Global Talent visa endorsement application under Tech Nation (Digital Technology).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const audit = getAuditData();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        <AuthProvider>
          <AppShell audit={audit}>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
