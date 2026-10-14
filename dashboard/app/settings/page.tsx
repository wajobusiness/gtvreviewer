"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  User,
  Building2,
  Users,
  ShieldCheck,
  Key,
  Bell,
  Check,
  CreditCard,
  Mail,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const { user, organization, switchUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "org" | "team" | "security" | "notifications">("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [orgName, setOrgName] = useState(organization.name);
  const [apiKey, setApiKey] = useState("gtv_live_98ab7c104e892d3f6a");
  const [twoFactor, setTwoFactor] = useState(true);

  // Team members
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Sarah Jenkins", email: "sarah.jenkins@techvisalegal.co.uk", role: "Partner / Solicitor", status: "Active" },
    { id: "2", name: "David Miller", email: "david.miller@techvisalegal.co.uk", role: "Associate Solicitor", status: "Active" },
    { id: "3", name: "Elena Rostova", email: "elena.rostova@techvisalegal.co.uk", role: "Legal Caseworker", status: "Active" },
    { id: "4", name: "Marcus Vance", email: "m.vance@techvisalegal.co.uk", role: "Technical Reviewer", status: "Invited" },
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("SOLICITOR");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    setTeamMembers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newMemberEmail.split("@")[0].replace(".", " "),
        email: newMemberEmail,
        role: newMemberRole === "SOLICITOR" ? "Solicitor" : "Reviewer",
        status: "Invited",
      },
    ]);
    setNewMemberEmail("");
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            Workspace & Account Configuration
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Settings & Team Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your user credentials, law firm members, API keys, and notification preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            Manage Subscription ({organization.tier})
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          Workspace settings saved successfully!
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-1 text-xs">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "profile"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <User className="w-3.5 h-3.5" /> Personal Profile
        </button>

        <button
          onClick={() => setActiveTab("org")}
          className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "org"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Law Firm & Workspace
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "team"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Team Seats ({teamMembers.length} / {organization.seatsMax})
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "security"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Key className="w-3.5 h-3.5" /> API & Security
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "notifications"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> Notification Alerts
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Your Profile Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Active User Role</label>
              <select
                value={user.role}
                onChange={(e) => switchUserRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SOLICITOR">Senior Solicitor / Partner</option>
                <option value="CANDIDATE">Direct Visa Applicant</option>
                <option value="ADMIN">System Administrator</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Switching role toggles UI permissions and solicitor legal sign-off authority.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            Save Profile Changes
          </button>
        </form>
      )}

      {/* Tab 2: Organization */}
      {activeTab === "org" && (
        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Law Firm & Workspace Details</h3>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Organization / Firm Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SRA Registration Ref</label>
                <input
                  type="text"
                  defaultValue="SRA-629104"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jurisdiction</label>
                <input
                  type="text"
                  defaultValue="England & Wales"
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Subscription Tier</div>
                <div className="text-[11px] text-slate-400">Current plan: {organization.tier}</div>
              </div>
              <Link
                href="/billing"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            Update Organization
          </button>
        </form>
      )}

      {/* Tab 3: Team Seats */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Invite Form */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white">Invite Solicitor or Caseworker</h3>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3 text-xs">
              <input
                type="email"
                placeholder="colleague@techvisalegal.co.uk"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SOLICITOR">Solicitor (Full Access)</option>
                <option value="REVIEWER">Reviewer (Read-Only)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shrink-0 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Send Invite
              </button>
            </form>
          </div>

          {/* Members Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Name / Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{member.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">{member.role}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          member.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {member.id !== "1" && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Security & API */}
      {activeTab === "security" && (
        <div className="max-w-2xl space-y-6 text-xs">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white">API Authentication Keys</h3>
            <p className="text-slate-400">
              Integrate GTV Reviewer forensic audits directly into your case management software (Clio, LEAP, Actionstep).
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                Copy Key
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white">Two-Factor Authentication (2FA)</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Require Authenticator App (TOTP)</div>
                <div className="text-slate-400 text-[11px]">Enforce 2FA across all solicitors in your workspace</div>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 relative flex items-center ${
                  twoFactor ? "bg-emerald-600" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    twoFactor ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Notifications */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white">Email Alert Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-800 bg-slate-950" />
              <div>
                <span className="font-semibold block text-white">Critical Refusal Triggers</span>
                <span className="text-slate-400 text-[11px]">Immediate email alert when Part 9 deception risk is flagged.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-800 bg-slate-950" />
              <div>
                <span className="font-semibold block text-white">Audit Queue Completion</span>
                <span className="text-slate-400 text-[11px]">Notify when 7-stage forensic pipeline finishes execution.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-800 bg-slate-950" />
              <div>
                <span className="font-semibold block text-white">Weekly Portfolio Digests</span>
                <span className="text-slate-400 text-[11px]">Summary report of candidate readiness across all client files.</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

