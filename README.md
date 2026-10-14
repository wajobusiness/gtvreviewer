# GTV Reviewer: UK Global Talent Visa AI Pre-Submission Audit & Reviewer

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-8%20Passing-emerald)](tests/)

An enterprise-grade, hostile-but-fair AI pre-submission audit and verification platform for the **UK Global Talent Visa (Digital Technology route endorsed by Tech Nation)**. 

GTV Reviewer cross-examines candidate evidence portfolios against official 2026 Tech Nation Guidelines and Appendix Global Talent rules, detecting contradictions, material misrepresentations, evidentiary shortfalls, and character/deception risks before formal submission to UK Visas & Immigration (UKVI).

---

## 🚀 Key Capabilities

### 1. Hostile Forensic Audit & Contradiction Detection
- **Deception & Character Grounds (Part 9):** Identifies name/pronoun discrepancies on third-party credentials, unverified licensing (e.g. warez cracks), and financial arithmetic mismatches (e.g. 1,000x dashboard revenue discrepancies).
- **Page Budget & Structural Limits:** Enforces strict 3 A4 page limits per evidentiary piece and 15 pages total portfolio allocation.
- **5-Assessor Simulated Panel:** Simulates 5 independent expert reviewers (Tech Nation Assessor, Technical Specialist, Commercial Scaleup Leader, Immigration Counsel, Academic Director).

### 2. Real-Time Ingestion & Streaming Monitor (`/jobs/[id]`)
- Asynchronous 7-stage pipeline worker using web-standard **Server-Sent Events (SSE)**.
- Live progress bars, stage indicators, and streaming terminal logs with severity filtering (`All`, `Errors`, `Warnings`, `Success`).

### 3. Audit Version Diff Engine (`/compare`)
- Side-by-side run comparison (**Run 1: Pre-Submission Audit** vs. **Run 2: Remediated Submission Draft**).
- Automated delta calculation: Overall score (+52 pts), visa success probability (+83%), and resolved refusal risks (-6 defects).
- 3-Way Comparative Radar Chart benchmarking applicant competency against Tech Nation endorsement thresholds.
- Concrete **Forensic Defect Resolution Matrix** linking original defects to remediated primary documentation.

### 4. Official Solicitor Export Bundle (`/export`)
- Courtroom-ready UKVI compliance dossier formatted for immigration solicitors, caseworkers, and tribunal reviews.
- Official legal cover sheet, Part 9 General Grounds for Refusal attestation, complete 10-piece evidence portfolio registry, and recommendation letters audit.
- Built-in `@media print` styling for 1-click **Print to PDF** and machine-readable JSON pack export.

### 5. Multi-Tenant Architecture & Commercial SaaS Billing (`/billing`)
- **Repository Pattern (`IAuditRepository`):** Decoupled storage supporting local cached filesystem and PostgreSQL/Supabase drivers.
- **Multi-Tenancy:** Workspaces, candidate portfolios, team seats, and versioned audit runs.
- **3-Tier Subscription Engine:** Starter Free Preview, Pro Applicant (£79/mo), and Immigration Law Firm Enterprise (£399/mo).

---

## 📁 Repository Structure

```
gtvreviewer/
├── audit/                          # Forensic audit markdown reports & transcripts
│   ├── FINAL-REPORT.md             # Complete 25-page hostile forensic audit
│   ├── evidence-matrix.md          # Structured criteria evidence matrix
│   ├── consistency-check.md        # Cross-document contradiction breakdown
│   ├── letter-forensics.md         # Recommendation letter authenticity audit
│   ├── panel-simulation.md         # 5-assessor deliberation & voting records
│   ├── requirements.md             # 2026 Tech Nation criteria analysis
│   └── transcripts/                # Multimodal OCR transcription archives
│
└── dashboard/                      # Next.js 15 Enterprise SaaS Web Application
    ├── app/
    │   ├── page.tsx                # Executive Dashboard (gauges, radar chart, KPIs)
    │   ├── compare/                # Audit Version Diff Engine (Run 1 vs Run 2)
    │   ├── export/                 # Official Solicitor PDF Export Bundle
    │   ├── billing/                # SaaS Plans & Subscription Management
    │   ├── upload/                 # Evidence Drag-and-Drop Ingestion Uploader
    │   ├── jobs/[id]/              # Real-Time SSE Pipeline Execution Monitor
    │   ├── projects/               # Candidate Portfolio Manager
    │   ├── reports/                # Analytical Markdown Reports Library
    │   └── api/                    # REST & SSE Streaming Endpoints
    ├── components/                 # UI Component Library (Sidebar, Switchers, Gauges)
    ├── lib/
    │   ├── repository/             # IAuditRepository decoupled storage drivers
    │   ├── queue/                  # 7-stage background job dispatcher & SSE streamer
    │   └── context/                # Multi-tenant AuthContext & Session Provider
    ├── types/                      # Comprehensive TypeScript schemas
    ├── tests/                      # Native node:test automated verification suite
    ├── prisma/                     # PostgreSQL relational database schema
    └── schema.sql                  # Production DDL schema
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+ (Node.js 24 recommended)
- npm or pnpm

### 1. Installation
```bash
cd dashboard
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
*Executes all 8 test suites validating schema compliance, report headers, OCR transcript cataloging, 7-stage queue sequence, full-text search index, version diff calculation, legal caps, and SaaS billing entitlements.*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ⚖️ License & Privacy Notice

This software is designed strictly for pre-submission compliance analysis and evidence structuring. It does not provide legal advice or guarantee visa endorsement. All candidate application evidence is processed with strict privacy controls; confidential applicant documents (`*.pdf`) are excluded from version control by default.
