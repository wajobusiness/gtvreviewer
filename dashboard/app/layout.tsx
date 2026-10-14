import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { getAuditData } from "@/lib/reports";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "UK Global Talent Visa | AI Pre-Submission Audit Dashboard",
  description:
    "Hostile-but-fair forensic pre-submission audit dashboard for UK Global Talent visa endorsement application under Tech Nation (Digital Technology).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const audit = getAuditData();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Left Persistent / Mobile Responsive Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
              <Header
                documentOwner={audit.metadata?.documentOwner || "Applicant"}
                auditDate={audit.metadata?.auditDate || "2026-10-13"}
                currentStatus={audit.kpis?.currentStatus || "CRITICAL REFUSAL RISK"}
              />

              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
