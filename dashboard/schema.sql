-- ==============================================================================
-- UK GLOBAL TALENT VISA AUDIT PLATFORM — PRODUCTION POSTGRESQL SCHEMA (PHASE 1)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Tenants / Law Firms / Individual Consultancies)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'STARTER' CHECK (tier IN ('STARTER', 'PROFESSIONAL', 'FIRM_ENTERPRISE')),
    stripe_customer_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Solicitors, Candidates, Case Workers, Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'SOLICITOR' CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER', 'SOLICITOR', 'VIEWER', 'CANDIDATE', 'REVIEWER')),
    password_hash VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);

-- 3. Projects (Candidate Applications)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    candidate_name VARCHAR(255) NOT NULL,
    visa_route VARCHAR(100) NOT NULL, -- 'Exceptional Talent' | 'Exceptional Promise'
    target_field VARCHAR(100) DEFAULT 'Digital Technology',
    applicant_type VARCHAR(50) DEFAULT 'Both', -- 'Technical' | 'Business' | 'Both'
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'auditing', 'action_required', 'ready_to_submit')),
    current_score INTEGER,
    latest_run_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);

-- 4. Audit Runs (Immutable Versioned Snapshot of Audit)
CREATE TABLE IF NOT EXISTS audit_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    overall_score INTEGER NOT NULL,
    current_status VARCHAR(100) NOT NULL,
    recommendation TEXT NOT NULL,
    estimated_visa_success INTEGER NOT NULL,
    duration_ms INTEGER,
    status VARCHAR(50) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    raw_audit_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_project_version UNIQUE (project_id, version_number)
);
CREATE INDEX IF NOT EXISTS idx_audit_runs_project ON audit_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_runs_created_at ON audit_runs(created_at DESC);

-- 5. Evidence Items (Individual Document Analysis)
CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_run_id UUID NOT NULL REFERENCES audit_runs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_key TEXT,
    category VARCHAR(100) NOT NULL,
    requirement VARCHAR(255) NOT NULL,
    strength VARCHAR(100) NOT NULL,
    confidence VARCHAR(20) NOT NULL CHECK (confidence IN ('High', 'Medium', 'Low')),
    source VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Critical', 'Needs Improvement', 'Passed', 'Missing')),
    attributable BOOLEAN DEFAULT TRUE,
    inside_window BOOLEAN DEFAULT TRUE,
    metrics TEXT,
    risk TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_evidence_items_run ON evidence_items(audit_run_id);

-- 6. Report Documents (Generated Markdown Reports)
CREATE TABLE IF NOT EXISTS report_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_run_id UUID NOT NULL REFERENCES audit_runs(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Informational' CHECK (status IN ('Critical', 'Warning', 'Passed', 'Informational')),
    score INTEGER,
    content TEXT NOT NULL,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || content)) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_run_slug UNIQUE (audit_run_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_report_documents_run ON report_documents(audit_run_id);
CREATE INDEX IF NOT EXISTS idx_report_documents_search ON report_documents USING GIN(search_vector);

-- 7. Refusal Risks (Direct Quote & CAS Finding Tracker)
CREATE TABLE IF NOT EXISTS refusal_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_run_id UUID NOT NULL REFERENCES audit_runs(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    title VARCHAR(255) NOT NULL,
    file VARCHAR(255) NOT NULL,
    page VARCHAR(50) NOT NULL,
    rule VARCHAR(255) NOT NULL,
    impact TEXT NOT NULL,
    quote TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_refusal_risks_run ON refusal_risks(audit_run_id);

-- 8. Audit Jobs (Persistent Background Processing Queue)
CREATE TABLE IF NOT EXISTS audit_jobs (
    id VARCHAR(100) PRIMARY KEY,
    project_id VARCHAR(100) NOT NULL,
    candidate_name VARCHAR(255) NOT NULL,
    visa_route VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    overall_progress INTEGER DEFAULT 0,
    current_stage_id VARCHAR(50) DEFAULT 'stage-ingest',
    stages JSONB NOT NULL,
    logs JSONB NOT NULL,
    source_type VARCHAR(50) DEFAULT 'LOCAL_UPLOAD',
    google_drive_url TEXT,
    documents JSONB,
    final_score INTEGER,
    final_status VARCHAR(100),
    result_run_id VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_jobs_project ON audit_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_jobs_status ON audit_jobs(status);

