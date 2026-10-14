"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { ArrowLeft, UserPlus, ShieldAlert, Sparkles } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const { addProject, organization } = useAuth();

  const [candidateName, setCandidateName] = useState("");
  const [visaRoute, setVisaRoute] = useState<"Exceptional Talent" | "Exceptional Promise">("Exceptional Promise");
  const [targetField, setTargetField] = useState<"Digital Technology" | "Arts and Culture" | "Research and Academia">("Digital Technology");
  const [applicantType, setApplicantType] = useState<"Technical" | "Business" | "Both">("Technical");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;

    setSubmitting(true);
    addProject({
      candidateName,
      visaRoute,
      targetField,
      applicantType,
    });

    // Navigate to evidence upload screen for this new candidate
    router.push("/upload");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <Link
          href="/projects"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            Create Candidate Application Portfolio
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Initialize a new forensic audit workspace under <strong>{organization.name}</strong>.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-xl space-y-6"
      >
        {/* Candidate Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Candidate Full Name (as per Passport) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Dr. Amina Bello"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Visa Route Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Target Endorsement Route <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVisaRoute("Exceptional Promise")}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                visaRoute === "Exceptional Promise"
                  ? "bg-blue-600/15 border-blue-500/50 text-blue-200"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-xs">Exceptional Promise</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Early career (&lt; 5 years experience). Emerging leader with high growth potential.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVisaRoute("Exceptional Talent")}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                visaRoute === "Exceptional Talent"
                  ? "bg-blue-600/15 border-blue-500/50 text-blue-200"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-xs">Exceptional Talent</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Established industry leader with proven international recognition and track record.
              </div>
            </button>
          </div>
        </div>

        {/* Applicant Type Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Tech Nation Applicant Profile <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Technical", "Business", "Both"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setApplicantType(type)}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  applicantType === type
                    ? "bg-blue-600/20 border-blue-500 text-blue-300 font-bold"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Technical: Engineers, Architects, Data Scientists. Business: Founders, Product Managers, Growth Leads.
          </p>
        </div>

        {/* Target Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Endorsing Field & Body
          </label>
          <select
            value={targetField}
            onChange={(e) => setTargetField(e.target.value as any)}
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-foreground focus:outline-none focus:border-blue-500"
          >
            <option value="Digital Technology">Digital Technology (Tech Nation)</option>
            <option value="Arts and Culture">Arts and Culture (Arts Council England)</option>
            <option value="Research and Academia">Research and Academia (British Academy / Royal Society)</option>
          </select>
        </div>

        {/* Submission Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-white transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting || !candidateName.trim()}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Portfolio & Proceed to Upload</span>
          </button>
        </div>
      </form>
    </div>
  );
}

