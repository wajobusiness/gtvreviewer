export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type StageStatus = "pending" | "running" | "completed" | "failed";

export interface JobStage {
  id: string;
  name: string;
  description: string;
  status: StageStatus;
  progress: number; // 0 - 100
  startedAt?: string;
  completedAt?: string;
  details?: string;
}

export interface JobLogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  stageId?: string;
  message: string;
}

export interface AuditJob {
  id: string;
  projectId: string;
  candidateName: string;
  visaRoute: string;
  status: JobStatus;
  overallProgress: number; // 0 - 100
  currentStageId: string;
  stages: JobStage[];
  logs: JobLogEntry[];
  resultRunId?: string;
  finalScore?: number;
  finalStatus?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

