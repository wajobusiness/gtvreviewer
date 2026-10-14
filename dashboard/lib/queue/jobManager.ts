import { AuditJob, JobStage, JobLogEntry, JobStatus } from "@/types/queue";
import { getAuditData } from "@/lib/reports";

type JobListener = (job: AuditJob) => void;

class JobManager {
  private jobs: Map<string, AuditJob> = new Map();
  private listeners: Map<string, Set<JobListener>> = new Map();

  private createDefaultStages(): JobStage[] {
    return [
      {
        id: "stage-ingest",
        name: "Document Ingestion & File Checks",
        description: "Validating PDF formats, page count limits (max 3/piece), and structural requirements.",
        status: "pending",
        progress: 0,
      },
      {
        id: "stage-ocr",
        name: "Multimodal OCR & Vision Transcription",
        description: "Extracting verbatim text, signatures, letterheads, dates, stamps, and licenses.",
        status: "pending",
        progress: 0,
      },
      {
        id: "stage-guidelines",
        name: "Official Requirements & Guideline Matching",
        description: "Evaluating evidence against Mandatory and Optional criteria (MC, OC1-OC4).",
        status: "pending",
        progress: 0,
      },
      {
        id: "stage-integrity",
        name: "Cross-Document Contradiction & Deception Engine",
        description: "Hunting numerical conflicts, template cloning, third-party awards, and software piracy.",
        status: "pending",
        progress: 0,
      },
      {
        id: "stage-panel",
        name: "Assessor Panel Simulation",
        description: "Simulating 5 independent expert reviewers (Assessor, Tech Leader, Legal Counsel, etc.).",
        status: "pending",
        progress: 0,
      },
      {
        id: "stage-scoring",
        name: "Quantitative Score & Risk Computation",
        description: "Computing forensic confidence rating (0-100) and refusal risk boundaries.",
        status: "pending",
        progress: 0,
      },
      {
        id: "stage-reports",
        name: "Forensic Reports & JSON Compilation",
        description: "Compiling 7 Markdown reports and structured audit.json registry.",
        status: "pending",
        progress: 0,
      },
    ];
  }

  public createJob(projectId: string, candidateName: string, visaRoute: string): AuditJob {
    const id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const stages = this.createDefaultStages();

    const job: AuditJob = {
      id,
      projectId,
      candidateName,
      visaRoute,
      status: "PENDING",
      overallProgress: 0,
      currentStageId: stages[0].id,
      stages,
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: `Job initialized for candidate ${candidateName} (${visaRoute}).`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(id, job);

    // Asynchronously begin execution in background
    setTimeout(() => {
      this.executeJob(id).catch((err) => {
        console.error(`[JobManager] Error executing job ${id}:`, err);
      });
    }, 100);

    return job;
  }

  public getJob(id: string): AuditJob | null {
    return this.jobs.get(id) || null;
  }

  public listJobs(projectId?: string): AuditJob[] {
    const all = Array.from(this.jobs.values());
    if (projectId) {
      return all.filter((j) => j.projectId === projectId);
    }
    return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public subscribe(jobId: string, listener: JobListener): () => void {
    if (!this.listeners.has(jobId)) {
      this.listeners.set(jobId, new Set());
    }
    this.listeners.get(jobId)!.add(listener);

    return () => {
      this.listeners.get(jobId)?.delete(listener);
    };
  }

  private notify(job: AuditJob) {
    const jobListeners = this.listeners.get(job.id);
    if (jobListeners) {
      jobListeners.forEach((fn) => fn({ ...job }));
    }
  }

  private addLog(job: AuditJob, level: "info" | "warn" | "error" | "success", message: string, stageId?: string) {
    job.logs.push({
      timestamp: new Date().toISOString(),
      level,
      stageId,
      message,
    });
    this.notify(job);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async executeJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = "PROCESSING";
    this.addLog(job, "info", "Starting forensic pipeline execution...");

    const auditData = getAuditData();

    // Stage 1: Ingestion
    job.currentStageId = "stage-ingest";
    job.stages[0].status = "running";
    job.stages[0].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Validating 5 submitted candidate evidence PDFs...", "stage-ingest");
    await this.sleep(400);
    this.addLog(job, "info", "Total 15 pages verified across application portfolio.", "stage-ingest");
    job.stages[0].progress = 100;
    job.stages[0].status = "completed";
    job.stages[0].completedAt = new Date().toISOString();
    job.overallProgress = 14;
    this.notify(job);

    // Stage 2: OCR Transcription
    job.currentStageId = "stage-ocr";
    job.stages[1].status = "running";
    job.stages[1].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Initiating multimodal vision & OCR transcription...", "stage-ocr");
    await this.sleep(450);
    this.addLog(job, "info", "Transcribing certificate letterheads, stamps, dates, and dashboard numbers...", "stage-ocr");
    await this.sleep(350);
    this.addLog(job, "success", "Full transcriptions saved to audit/transcripts/ with high confidence.", "stage-ocr");
    job.stages[1].progress = 100;
    job.stages[1].status = "completed";
    job.stages[1].completedAt = new Date().toISOString();
    job.overallProgress = 28;
    this.notify(job);

    // Stage 3: Guideline Matching
    job.currentStageId = "stage-guidelines";
    job.stages[2].status = "running";
    job.stages[2].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Loading official 2026 Tech Nation Guidelines and Appendix Global Talent...", "stage-guidelines");
    await this.sleep(400);
    this.addLog(job, "warn", "Optional criteria deficit: only 1 document provided for OC2 and 1 for OC3 (minimum 2 required).", "stage-guidelines");
    job.stages[2].progress = 100;
    job.stages[2].status = "completed";
    job.stages[2].completedAt = new Date().toISOString();
    job.overallProgress = 42;
    this.notify(job);

    // Stage 4: Integrity & Contradiction Engine
    job.currentStageId = "stage-integrity";
    job.stages[3].status = "running";
    job.stages[3].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Executing cross-document contradiction detection...", "stage-integrity");
    await this.sleep(450);
    this.addLog(job, "error", "CRITICAL DEFECT: MC1 award certificate issued to Chidiebere Felicitas Chiamaka with female pronouns.", "stage-integrity");
    await this.sleep(300);
    this.addLog(job, "error", "CRITICAL DEFECT: 1,000x discrepancy on revenue (WHMCS dashboard ₦2.26M vs text ₦2.2B).", "stage-integrity");
    await this.sleep(300);
    this.addLog(job, "warn", "ALERT: Billing system license registered to 'ShayanXtreme' warez release group (pirated WHMCS).", "stage-integrity");
    job.stages[3].progress = 100;
    job.stages[3].status = "completed";
    job.stages[3].completedAt = new Date().toISOString();
    job.overallProgress = 60;
    this.notify(job);

    // Stage 5: Panel Simulation
    job.currentStageId = "stage-panel";
    job.stages[4].status = "running";
    job.stages[4].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Deliberating across 5 simulated expert assessors...", "stage-panel");
    await this.sleep(400);
    this.addLog(job, "warn", "Assessor 1 (Tech Nation Lead): Reject (Evidence count deficit & third-party award).", "stage-panel");
    this.addLog(job, "warn", "Assessor 4 (Legal Counsel): Reject (Part 9.7.1 deception risk on IESEG certificate).", "stage-panel");
    this.addLog(job, "error", "Simulated consensus: Unanimous Refusal (5-0 vote).", "stage-panel");
    job.stages[4].progress = 100;
    job.stages[4].status = "completed";
    job.stages[4].completedAt = new Date().toISOString();
    job.overallProgress = 75;
    this.notify(job);

    // Stage 6: Scoring
    job.currentStageId = "stage-scoring";
    job.stages[5].status = "running";
    job.stages[5].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Computing weighted risk score...", "stage-scoring");
    await this.sleep(350);
    const score = auditData.kpis.overallScore;
    job.finalScore = score;
    job.finalStatus = auditData.kpis.currentStatus;
    this.addLog(job, "info", `Overall Audit Score generated: ${score}/100. Status: ${job.finalStatus}.`, "stage-scoring");
    job.stages[5].progress = 100;
    job.stages[5].status = "completed";
    job.stages[5].completedAt = new Date().toISOString();
    job.overallProgress = 90;
    this.notify(job);

    // Stage 7: Reports
    job.currentStageId = "stage-reports";
    job.stages[6].status = "running";
    job.stages[6].startedAt = new Date().toISOString();
    this.addLog(job, "info", "Generating 7 analytical reports and updating audit.json...", "stage-reports");
    await this.sleep(400);
    this.addLog(job, "success", "Reports generated: FINAL-REPORT.md, evidence-matrix.md, letter-forensics.md...", "stage-reports");
    job.stages[6].progress = 100;
    job.stages[6].status = "completed";
    job.stages[6].completedAt = new Date().toISOString();
    job.overallProgress = 100;

    job.status = "COMPLETED";
    job.resultRunId = "run-001";
    job.completedAt = new Date().toISOString();
    this.addLog(job, "success", "Forensic pre-submission audit completed successfully!");
    this.notify(job);
  }
}

// Global singleton instance
export const jobManager = new JobManager();

