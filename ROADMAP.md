# Recruitment & Credentialing Platform — Roadmap

Status tracker for OBHSA's move from a single-page job-application form to a staged recruitment → verification → credentialing → activation platform, modeled on IntelyCare's real application flow (see `artifacts/`). Each phase gets its own design pass before implementation starts on it; this file is updated as phases move between states.

**Legend:** ✅ Done · 🚧 In progress · ⏳ Not started

---

### 1. Data-model foundation — ✅ Done (2026-10-02)

Candidate/Application split, a 16-state application lifecycle with an immutable audit trail, structured Credentials/Documents/EmploymentHistory/Education. The existing single-page apply form and admin review screen were rewired onto the new schema so the app stayed fully functional throughout — no wizard required for the new model to go live.

**Delivered:**
- Models: `Candidate`, `Application`, `ApplicationStageHistory`, `ApplicationRequirement`, `Credential`, `Document`, `EmploymentHistory`, `Education`
- `Application::transitionTo()` + `ApplicationStateMachine` — the only way an application's status can change, validated against an explicit allow-list, every change audited in `application_stage_history`
- `JobApplicationIntakeService` — compatibility layer so the legacy single-page form keeps working unchanged from a candidate's perspective
- `job_applications` table dropped; `App\Models\JobApplication` removed
- 52 passing Pest tests (3 new, covering legal/illegal transitions and audit history)
- Real bug found & fixed: `Application::create()` left `status` unset in memory (Eloquent doesn't refetch DB column defaults after insert), which PHP 8.5 silently coerced to `0` when passed to the backed enum — fixed with an in-memory attribute default matching the migration

### 2. Public multi-step application wizard — 🚧 In progress

Replace the single-page form with a staged flow (contact → location/discipline eligibility check → work preferences → employment/education → credentials/documents → consent → review → submit), plus draft save/resume via the `resume_token` column reserved in Phase 1.

### 3. Recruiter processing pipeline — ⏳ Not started

Pipeline dashboard, candidate dossier screen, recruiter assignment, structured review decisions, requirement-driven "what's blocking this candidate," communication templates.

### 4. Interview workflow — ⏳ Not started

Scheduling, a controlled question bank, structured scoring, interviewer recommendation.

### 5. Credential verification & reference checking — ⏳ Not started

Admin verification actions on `credentials`, reference-check workflow.

### 6. Background screening — ⏳ Not started

Status-tracking subsystem now exists on `application_requirements`; a real provider integration needs a vendor chosen first.

### 7. Competency assessments — ⏳ Not started

Assessment definitions, attempts, scoring, pass/retry.

### 8. Offer → Onboarding → Activation — ⏳ Not started

Offer generation/acceptance, a checklist-driven onboarding engine, a deterministic activation-eligibility check, and Employee record creation.

### 9. Continuous compliance — ⏳ Not started

Staged credential-expiry warnings and notifications once people are active.

### 10. Facility / Shift / deployment matching — ⏳ Not started

A genuinely new domain — OBHSA doesn't model client facilities or shifts at all today.

### 11. AI copilot — ⏳ Not started

Tool-calling orchestrator, permission-inherited actions, a RAG layer over policy docs, a confirmation-level policy for high-impact actions, and a full audit log. Needs an LLM provider/budget and a vector-DB decision before it can be scoped concretely.
