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
  isAuthenticated: boolean;
  isLoading: boolean;
  organization: OrganizationSession;
  organizations: OrganizationSession[];
  project: ProjectSession | null;
  projects: ProjectSession[];
  auditRuns: AuditRunItem[];
  activeRunId: string;
  login: (
    userOrEmail: UserSession | string,
    orgOrFullName?: OrganizationSession | string,
    role?: UserRole
  ) => void;
  logout: () => Promise<void>;
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
  deleteProject: (projectId: string) => void;
  updateProjectScore: (
    projectId: string,
    score: number,
    status?: ProjectSession["status"],
    runId?: string
  ) => void;
}

const defaultOrganization: OrganizationSession = {
  id: "org-primary",
  name: "Immigration Practice Workspace",
  slug: "practice-workspace",
  tier: "PROFESSIONAL",
  seatsUsed: 1,
  seatsMax: 5,
};

const guestUser: UserSession = {
  id: "usr-guest",
  email: "",
  fullName: "Guest User",
  role: "SOLICITOR",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<OrganizationSession[]>([defaultOrganization]);
  const [currentOrgId, setCurrentOrgId] = useState<string>("org-primary");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Production clean state: Projects start empty unless loaded from user storage
  const [projects, setProjects] = useState<ProjectSession[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>("");

  const [auditRunsByProject, setAuditRunsByProject] = useState<Record<string, AuditRunItem[]>>({});
  const [activeRunId, setActiveRunId] = useState<string>("");

  const [user, setUser] = useState<UserSession>(guestUser);

  // Load session from /api/auth/me (database cookie) and projects from storage on mount
  useEffect(() => {
    async function initSession() {
      try {
        // 1. Try server-side HTTP-only session verification
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            if (data.organization) {
              setOrganizations([data.organization]);
              setCurrentOrgId(data.organization.id);
            }
            try {
              localStorage.setItem("gt_user_session", JSON.stringify(data.user));
            } catch {}

            // Load persistent projects from Neon PostgreSQL
            try {
              const projRes = await fetch("/api/projects");
              if (projRes.ok) {
                const projData = await projRes.json();
                if (Array.isArray(projData.projects) && projData.projects.length > 0) {
                  setProjects(projData.projects);
                  const savedActiveProj = localStorage.getItem("gt_active_proj");
                  const target =
                    projData.projects.find((p: any) => p.id === savedActiveProj) ||
                    projData.projects[0];
                  setCurrentProjectId(target.id);
                  localStorage.setItem("gt_user_projects", JSON.stringify(projData.projects));
                }
              }
            } catch (pErr) {
              console.warn("[AuthContext] Projects fetch notice:", pErr);
            }

            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to client storage if server is temporarily unreachable
      }

      // 2. Fallback to client localStorage if offline or network unavailable
      try {
        const savedUser = localStorage.getItem("gt_user_session");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.email && parsed.id) {
            setUser(parsed);
          }
        }
      } catch {}

      setIsLoading(false);
    }

    initSession();

    // Hydrate projects and audit runs
    try {
      const savedProjects = localStorage.getItem("gt_user_projects");
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects) as ProjectSession[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          const savedActiveProj = localStorage.getItem("gt_active_proj");
          const target = parsed.find((p) => p.id === savedActiveProj) || parsed[0];
          setCurrentProjectId(target.id);
        }
      }

      const savedRuns = localStorage.getItem("gt_user_runs");
      if (savedRuns) {
        setAuditRunsByProject(JSON.parse(savedRuns));
      }
    } catch {}
  }, []);

  const login = (
    userOrEmail: UserSession | string,
    orgOrFullName?: OrganizationSession | string,
    role: UserRole = "SOLICITOR"
  ) => {
    let updatedUser: UserSession;

    if (typeof userOrEmail === "object") {
      updatedUser = userOrEmail;
      if (orgOrFullName && typeof orgOrFullName === "object") {
        setOrganizations([orgOrFullName]);
        setCurrentOrgId(orgOrFullName.id);
      }
    } else {
      updatedUser = {
        id: `usr-${Date.now()}`,
        email: userOrEmail,
        fullName: typeof orgOrFullName === "string" ? orgOrFullName : userOrEmail.split("@")[0],
        role,
      };
    }

    setUser(updatedUser);
    try {
      localStorage.setItem("gt_user_session", JSON.stringify(updatedUser));
    } catch {}
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    setUser(guestUser);
    try {
      localStorage.removeItem("gt_user_session");
    } catch {}
  };

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId(orgId);
  };

  const switchOrganizationTier = (tier: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE") => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === currentOrgId ? { ...org, tier } : org))
    );
  };

  const switchProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    const runs = auditRunsByProject[projectId] || [];
    if (runs.length > 0) {
      setActiveRunId(runs[0].id);
    } else {
      setActiveRunId("");
    }
    try {
      localStorage.setItem("gt_active_proj", projectId);
    } catch {}
  };

  const switchAuditRun = (runId: string) => {
    setActiveRunId(runId);
  };

  const switchUserRole = (role: UserRole) => {
    setUser((prev) => {
      const updated = { ...prev, role };
      try {
        localStorage.setItem("gt_user_session", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addProject = (newProjectData: {
    candidateName: string;
    visaRoute: "Exceptional Talent" | "Exceptional Promise";
    targetField: "Digital Technology" | "Arts and Culture" | "Research and Academia";
    applicantType: "Technical" | "Business" | "Both";
  }): ProjectSession => {
    const tempId = `proj-${Date.now()}`;
    const newProject: ProjectSession = {
      id: tempId,
      ...newProjectData,
      status: "draft",
      currentScore: 0,
      totalRuns: 0,
      activeRunId: "",
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev];
      try {
        localStorage.setItem("gt_user_projects", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setCurrentProjectId(tempId);
    try {
      localStorage.setItem("gt_active_proj", tempId);
    } catch {}

    // Persist to Neon PostgreSQL
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjectData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.project?.id) {
          const persistedId = data.project.id;
          setProjects((prev) => {
            const updated = prev.map((p) =>
              p.id === tempId ? { ...p, id: persistedId } : p
            );
            try {
              localStorage.setItem("gt_user_projects", JSON.stringify(updated));
            } catch {}
            return updated;
          });
          setCurrentProjectId(persistedId);
          try {
            localStorage.setItem("gt_active_proj", persistedId);
          } catch {}
        }
      })
      .catch((err) => console.warn("[Projects] Error syncing to DB:", err));

    return newProject;
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      try {
        localStorage.setItem("gt_user_projects", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (currentProjectId === projectId) {
      const remaining = projects.filter((p) => p.id !== projectId);
      if (remaining.length > 0) {
        setCurrentProjectId(remaining[0].id);
        try {
          localStorage.setItem("gt_active_proj", remaining[0].id);
        } catch {}
      } else {
        setCurrentProjectId("");
        try {
          localStorage.removeItem("gt_active_proj");
        } catch {}
      }
    }

    // Delete from Neon PostgreSQL
    fetch(`/api/projects?id=${encodeURIComponent(projectId)}`, {
      method: "DELETE",
    }).catch((err) => console.warn("[Projects] Error deleting from DB:", err));
  };

  const updateProjectScore = (
    projectId: string,
    score: number,
    status: ProjectSession["status"] = "ready_to_submit",
    runId?: string
  ) => {
    const effectiveRunId = runId || `run-${Date.now()}`;

    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            currentScore: score,
            status,
            totalRuns: (p.totalRuns || 0) + 1,
            activeRunId: effectiveRunId,
          };
        }
        return p;
      });
      try {
        localStorage.setItem("gt_user_projects", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Record new audit run in runs history
    setAuditRunsByProject((prev) => {
      const existing = prev[projectId] || [];
      const newRun: AuditRunItem = {
        id: effectiveRunId,
        versionNumber: existing.length + 1,
        overallScore: score,
        currentStatus: score >= 70 ? "READY TO SUBMIT" : score >= 50 ? "BORDERLINE" : "CRITICAL REFUSAL RISK",
        createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        isLatest: true,
      };

      const updatedRuns = [
        newRun,
        ...existing.map((r) => ({ ...r, isLatest: false })),
      ];

      const updatedMap = { ...prev, [projectId]: updatedRuns };
      try {
        localStorage.setItem("gt_user_runs", JSON.stringify(updatedMap));
      } catch {}
      return updatedMap;
    });

    setActiveRunId(effectiveRunId);
  };

  const isAuthenticated = Boolean(user && user.email && user.id && user.id !== "usr-guest");
  const currentOrg =
    organizations.find((o) => o.id === currentOrgId) || organizations[0];
  const currentProject =
    projects.find((p) => p.id === currentProjectId) || (projects.length > 0 ? projects[0] : null);
  const currentAuditRuns = currentProject ? auditRunsByProject[currentProject.id] || [] : [];

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        organization: currentOrg,
        organizations,
        project: currentProject,
        projects,
        auditRuns: currentAuditRuns,
        activeRunId,
        login,
        logout,
        switchOrganization,
        switchOrganizationTier,
        switchProject,
        switchAuditRun,
        switchUserRole,
        addProject,
        deleteProject,
        updateProjectScore,
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
