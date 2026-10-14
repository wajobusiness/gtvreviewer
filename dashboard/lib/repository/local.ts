import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { AuditData, ReportMeta } from "@/types/audit";
import { IAuditRepository, SearchResult } from "@/types/repository";
import { ProjectModel, AuditRunSummary } from "@/types/saas";

export class LocalFileSystemAuditRepository implements IAuditRepository {
  private reportsCache: Map<string, { meta: ReportMeta; content: string }> = new Map();
  private auditJsonCache: AuditData | null = null;
  private lastCacheTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 3000; // 3-second cache to prevent file hammering while allowing hot updates

  private getCandidateDirectories(): string[] {
    const primary = path.join(process.cwd(), "reports");
    const secondary = path.join(process.cwd(), "..", "audit");
    return [primary, secondary];
  }

  private isCacheStale(): boolean {
    return Date.now() - this.lastCacheTimestamp > this.CACHE_TTL_MS;
  }

  public getAuditData(): AuditData {
    if (this.auditJsonCache && !this.isCacheStale()) {
      return this.auditJsonCache;
    }

    const dirs = this.getCandidateDirectories();
    for (const dir of dirs) {
      const jsonPath = path.join(dir, "audit.json");
      if (fs.existsSync(jsonPath)) {
        try {
          const fileContent = fs.readFileSync(jsonPath, "utf-8");
          const parsed: AuditData = JSON.parse(fileContent);
          const scannedReports = this.getAllReports();
          if (scannedReports.length > 0) {
            parsed.reports = scannedReports;
          }
          this.auditJsonCache = parsed;
          this.lastCacheTimestamp = Date.now();
          return parsed;
        } catch (err) {
          console.error("[LocalAuditRepo] Error reading audit.json:", err);
        }
      }
    }

    // Default fallback if audit.json is somehow absent
    const fallback: AuditData = {
      metadata: {
        documentName: "UK Global Talent Visa Pre-Submission Audit",
        documentOwner: "Applicant",
        auditDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString(),
        endorsingBody: "Tech Nation",
        route: "Digital Technology",
        applicantType: "Technical / Business",
        targetField: "Digital Technology",
        version: "1.0.0",
      },
      kpis: {
        overallScore: 32,
        currentStatus: "CRITICAL REFUSAL RISK",
        statusColor: "red",
        recommendation: "DO NOT SUBMIT - Critical Deception Risk",
        estimatedVisaSuccess: 4,
        totalFilesAnalysed: 5,
        totalPages: 15,
        evidenceCount: 5,
        recommendationLetters: 0,
        recommendationLettersRequired: 3,
        newsArticles: 6,
        awards: 3,
        mediaEvidence: 8,
        criticalRisks: 6,
        minorRisks: 4,
        warnings: 7,
        passes: 1,
      },
      radarChart: [
        { category: "Qualification", score: 45, benchmark: 85 },
        { category: "Recommendation Letters", score: 12, benchmark: 90 },
        { category: "Media Evidence", score: 48, benchmark: 80 },
        { category: "Leadership", score: 35, benchmark: 88 },
        { category: "Innovation", score: 28, benchmark: 85 },
        { category: "Recognition", score: 25, benchmark: 82 },
      ],
      complianceBreakdown: [
        { name: "Critical", value: 6, color: "#ef4444" },
        { name: "Missing", value: 3, color: "#f97316" },
        { name: "Needs Improvement", value: 4, color: "#f59e0b" },
        { name: "Passed", value: 1, color: "#10b981" },
      ],
      timeline: [],
      criteriaScorecard: [],
      topRefusalRisks: [],
      panelVotes: [],
      evidenceMatrix: [],
      reports: this.getAllReports(),
    };

    this.auditJsonCache = fallback;
    return fallback;
  }

  public getAllReports(): ReportMeta[] {
    const dirs = this.getCandidateDirectories();
    const reportsMap = new Map<string, ReportMeta>();

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (!file.endsWith(".md") || file.startsWith(".")) continue;

        const slug = file.toLowerCase().replace(".md", "");
        if (reportsMap.has(slug)) continue; // Deduplication: primary directory takes precedence

        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const rawContent = fs.readFileSync(fullPath, "utf-8");
        const { data, content: body } = matter(rawContent);

        let title = data.title;
        if (!title) {
          const h1Match = body.match(/^#\s+(.+)$/m);
          title = h1Match ? h1Match[1].trim() : file.replace(".md", "").replace(/[-_]/g, " ");
        }

        const sizeFormatted = `${(stats.size / 1024).toFixed(1)} KB`;

        let status: "Critical" | "Warning" | "Passed" | "Informational" = "Informational";
        let icon = "FileText";
        let category = "Audit Report";

        if (slug.includes("final") || slug.includes("executive")) {
          status = "Critical";
          icon = "ShieldAlert";
          category = "Executive";
        } else if (slug.includes("matrix") || slug.includes("evidence")) {
          status = "Critical";
          icon = "Table";
          category = "Evidence";
        } else if (slug.includes("forensic") || slug.includes("letter")) {
          status = "Warning";
          icon = "FileCheck";
          category = "Forensics";
        } else if (slug.includes("consistency")) {
          status = "Critical";
          icon = "GitCompare";
          category = "Integrity";
        } else if (slug.includes("simulation") || slug.includes("panel")) {
          status = "Critical";
          icon = "Users";
          category = "Simulation";
        } else if (slug.includes("requirement")) {
          status = "Passed";
          icon = "BookOpen";
          category = "Requirements";
        }

        const reportMeta: ReportMeta = {
          slug,
          title,
          filename: file,
          description:
            data.description ||
            `Full report on ${title} with detailed forensic analysis and findings.`,
          status,
          score: data.score || (status === "Critical" ? 32 : status === "Warning" ? 45 : 90),
          category,
          icon,
          date: stats.mtime.toISOString().split("T")[0],
          size: sizeFormatted,
        };

        reportsMap.set(slug, reportMeta);
      }
    }

    return Array.from(reportsMap.values());
  }

  public getReportBySlug(slug: string): { meta: ReportMeta; content: string } | null {
    const normalizedSlug = slug.toLowerCase();
    const dirs = this.getCandidateDirectories();

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fileSlug = file.toLowerCase().replace(".md", "");
        if (fileSlug === normalizedSlug && file.endsWith(".md")) {
          const fullPath = path.join(dir, file);
          const stats = fs.statSync(fullPath);
          const raw = fs.readFileSync(fullPath, "utf-8");
          const { data, content } = matter(raw);

          let title = data.title;
          if (!title) {
            const h1Match = content.match(/^#\s+(.+)$/m);
            title = h1Match ? h1Match[1].trim() : file.replace(".md", "").replace(/[-_]/g, " ");
          }

          return {
            meta: {
              slug: normalizedSlug,
              title,
              filename: file,
              description: data.description || "Detailed forensic report.",
              status: "Critical",
              category: "Analysis",
              icon: "FileText",
              date: stats.mtime.toISOString().split("T")[0],
              size: `${(stats.size / 1024).toFixed(1)} KB`,
            },
            content,
          };
        }
      }
    }

    return null;
  }

  public searchAllReports(query: string): SearchResult[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase();
    const dirs = this.getCandidateDirectories();
    const results: SearchResult[] = [];
    const visitedSlugs = new Set<string>();

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir);

      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const slug = file.toLowerCase().replace(".md", "");
        if (visitedSlugs.has(slug)) continue;
        visitedSlugs.add(slug);

        const fullPath = path.join(dir, file);
        const raw = fs.readFileSync(fullPath, "utf-8");
        const lines = raw.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.toLowerCase().includes(q)) {
            results.push({
              slug,
              title: file.replace(".md", "").replace(/[-_]/g, " "),
              filename: file,
              matchSnippet: line.trim(),
              matchLine: i + 1,
            });
            if (results.length > 25) break;
          }
        }
      }
    }

    return results;
  }

  public listAuditRuns(): AuditRunSummary[] {
    const data = this.getAuditData();
    return [
      {
        id: "run-002",
        projectId: "proj-001",
        versionNumber: 2,
        overallScore: 84,
        currentStatus: "READY TO SUBMIT (Remediated Draft)",
        recommendation: "STRONG SUBMISSION - All Critical Defects Remediated",
        estimatedVisaSuccess: 87,
        criticalRisksCount: 0,
        passesCount: 9,
        createdAt: "2026-10-14",
      },
      {
        id: "run-001",
        projectId: "proj-001",
        versionNumber: 1,
        overallScore: data.kpis.overallScore,
        currentStatus: data.kpis.currentStatus,
        recommendation: data.kpis.recommendation,
        estimatedVisaSuccess: data.kpis.estimatedVisaSuccess,
        criticalRisksCount: data.kpis.criticalRisks,
        passesCount: data.kpis.passes,
        createdAt: data.metadata.auditDate,
      },
    ];
  }

  public getProject(): ProjectModel | null {
    const data = this.getAuditData();
    return {
      id: "proj-001",
      organizationId: "org-001",
      candidateName: data.metadata.documentOwner,
      visaRoute: data.metadata.route.includes("Promise")
        ? "Exceptional Promise"
        : "Exceptional Talent",
      targetField: "Digital Technology",
      applicantType: "Both",
      status: "action_required",
      currentScore: data.kpis.overallScore,
      latestRunId: "run-001",
      totalRuns: 1,
      createdAt: data.metadata.auditDate,
      updatedAt: data.metadata.lastUpdated,
    };
  }
}

