"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserSession,
  OrganizationSession,
  ProjectSession,
  AuditRunItem,
  UserRole,
} from "@/types/auth";

interface AuthContextType {
  user: UserSession;
  organization: OrganizationSession;
  organizations: OrganizationSession[];
  project: ProjectSession;
  projects: ProjectSession[];
  auditRuns: AuditRunItem[];
  activeRunId: string;
  switchOrganization: (orgId: string) => void;
  switchOrganizationTier: (tier: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE") => void;
  switchProject: (projectId: string) => void;
  switchAuditRun: (runId: string) => void;
  switchUserRole: (role: UserRole) => void;
  addProject: (newProject: {
    candidateName: string;
    visaRoute: "Exceptional Talent" | "Exceptional Promise";
    targetField: "Digital Technology" | "Arts and Culture" | "Research and Academia";
    applicantType: "Technical" | "Business" | "Both";
  }) => ProjectSession;
}

const defaultOrganizations: OrganizationSession[] = [
  {
    id: "org-001",
    name: "Tech Visa Legal Partners LLP",
    slug: "tech-visa-legal",
    tier: "FIRM_ENTERPRISE",
    seatsUsed: 4,
    seatsMax: 10,
  },
  {
    id: "org-002",
    name: "Apex Global Talent Advisors",
    slug: "apex-talent",
    tier: "PROFESSIONAL",
    seatsUsed: 1,
    seatsMax: 3,
  },
];

const defaultProjects: ProjectSession[] = [
  {
    id: "proj-001",
    candidateName: "Oluwafemi Wale Ogunniyi",
    visaRoute: "Exceptional Promise",
    targetField: "Digital Technology",
    applicantType: "Both",
    status: "ready_to_submit",
    currentScore: 84,
    totalRuns: 2,
    activeRunId: "run-002",
  },
  {
    id: "proj-002",
    candidateName: "Dr. Amara Okafor",
    visaRoute: "Exceptional Talent",
    targetField: "Digital Technology",
    applicantType: "Technical",
    status: "ready_to_submit",
    currentScore: 78,
    totalRuns: 3,
    activeRunId: "run-003",
  },
  {
    id: "proj-003",
    candidateName: "Tariq Al-Mansoor",
    visaRoute: "Exceptional Promise",
    targetField: "Digital Technology",
    applicantType: "Business",
    status: "auditing",
    currentScore: 54,
    totalRuns: 2,
    activeRunId: "run-002",
  },
];

const defaultAuditRuns: Record<string, AuditRunItem[]> = {
  "proj-001": [
    {
      id: "run-002",
      versionNumber: 2,
      overallScore: 84,
      currentStatus: "READY TO SUBMIT (Remediated Draft)",
      createdAt: "14 Oct 2026",
      isLatest: true,
    },
    {
      id: "run-001",
      versionNumber: 1,
      overallScore: 32,
      currentStatus: "CRITICAL REFUSAL RISK (Pre-Audit)",
      createdAt: "13 Oct 2026",
      isLatest: false,
    },
  ],
  "proj-002": [
    {
      id: "run-003",
      versionNumber: 3,
      overallScore: 78,
      currentStatus: "READY TO SUBMIT",
      createdAt: "12 Oct 2026",
      isLatest: true,
    },
    {
      id: "run-002",
      versionNumber: 2,
      overallScore: 61,
      currentStatus: "BORDERLINE",
      createdAt: "04 Oct 2026",
      isLatest: false,
    },
    {
      id: "run-001",
      versionNumber: 1,
      overallScore: 42,
      currentStatus: "CRITICAL DEFICITS",
      createdAt: "28 Sep 2026",
      isLatest: false,
    },
  ],
  "proj-003": [
    {
      id: "run-002",
      versionNumber: 2,
      overallScore: 54,
      currentStatus: "BORDERLINE RISK",
      createdAt: "11 Oct 2026",
      isLatest: true,
    },
    {
      id: "run-001",
      versionNumber: 1,
      overallScore: 38,
      currentStatus: "CRITICAL DEFICITS",
      createdAt: "01 Oct 2026",
      isLatest: false,
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<OrganizationSession[]>(defaultOrganizations);
  const [currentOrgId, setCurrentOrgId] = useState<string>("org-001");

  const [projects, setProjects] = useState<ProjectSession[]>(defaultProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string>("proj-001");

  const [activeRunId, setActiveRunId] = useState<string>("run-002");

  const [user, setUser] = useState<UserSession>({
    id: "usr-001",
    email: "sarah.jenkins@techvisalegal.co.uk",
    fullName: "Sarah Jenkins, Solicitor",
    role: "SOLICITOR",
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedOrg = localStorage.getItem("gt_active_org");
      if (savedOrg && organizations.some((o) => o.id === savedOrg)) {
        setCurrentOrgId(savedOrg);
      }
      const savedProj = localStorage.getItem("gt_active_proj");
      if (savedProj && projects.some((p) => p.id === savedProj)) {
        setCurrentProjectId(savedProj);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [organizations, projects]);

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId(orgId);
    try {
      localStorage.setItem("gt_active_org", orgId);
    } catch {}
  };

  const switchOrganizationTier = (tier: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE") => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === currentOrgId ? { ...org, tier } : org))
    );
  };

  const switchProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    const runs = defaultAuditRuns[projectId] || [];
    if (runs.length > 0) {
      setActiveRunId(runs[0].id);
    }
    try {
      localStorage.setItem("gt_active_proj", projectId);
    } catch {}
  };

  const switchAuditRun = (runId: string) => {
    setActiveRunId(runId);
  };

  const switchUserRole = (role: UserRole) => {
    setUser((prev) => ({
      ...prev,
      role,
      fullName:
        role === "SOLICITOR"
          ? "Sarah Jenkins, Solicitor"
          : role === "CANDIDATE"
          ? "Oluwafemi Wale Ogunniyi (Applicant)"
          : "System Administrator",
    }));
  };

  const addProject = (newProjectData: {
    candidateName: string;
    visaRoute: "Exceptional Talent" | "Exceptional Promise";
    targetField: "Digital Technology" | "Arts and Culture" | "Research and Academia";
    applicantType: "Technical" | "Business" | "Both";
  }): ProjectSession => {
    const newId = `proj-${Date.now()}`;
    const newProject: ProjectSession = {
      id: newId,
      ...newProjectData,
      status: "draft",
      currentScore: 0,
      totalRuns: 0,
      activeRunId: "",
    };

    setProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(newId);
    try {
      localStorage.setItem("gt_active_proj", newId);
    } catch {}

    return newProject;
  };

  const currentOrg =
    organizations.find((o) => o.id === currentOrgId) || organizations[0];
  const currentProject =
    projects.find((p) => p.id === currentProjectId) || projects[0];
  const currentAuditRuns = defaultAuditRuns[currentProject.id] || [];

  return (
    <AuthContext.Provider
      value={{
        user,
        organization: currentOrg,
        organizations,
        project: currentProject,
        projects,
        auditRuns: currentAuditRuns,
        activeRunId,
        switchOrganization,
        switchOrganizationTier,
        switchProject,
        switchAuditRun,
        switchUserRole,
        addProject,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

