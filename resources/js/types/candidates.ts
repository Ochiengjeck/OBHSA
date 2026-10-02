import type { EducationRow } from './apply';

export type CommunicationTemplate = {
    id: number;
    name: string;
    subject: string;
    body: string;
};

export type RecruiterOption = {
    id: number;
    name: string;
};

export type ApplicationRequirementEntry = {
    id: number;
    requirement_type: string;
    status: string;
    is_blocking: boolean;
};

export type ApplicationStageHistoryEntry = {
    id: number;
    from_status: string | null;
    to_status: string;
    reason: string | null;
    occurred_at: string;
    changed_by: { id: number; name: string } | null;
};

export type ApplicationCommunicationEntry = {
    id: number;
    subject: string;
    body: string;
    created_at: string;
    sent_by: { id: number; name: string } | null;
    template: { id: number; name: string } | null;
};

export type ApplicationInterviewSummary = {
    id: number;
    scheduled_at: string;
    format: string;
    status: string;
    recommendation: string | null;
    interviewer: { id: number; name: string } | null;
};

export type CandidateApplication = {
    id: number;
    candidate_id: number;
    primary_specialty: string | null;
    status: string;
    current_stage_entered_at: string | null;
    created_at: string;
    cover_note: string | null;
    job_listing: { id: number; title: string } | null;
    requirements: ApplicationRequirementEntry[];
    stage_history: ApplicationStageHistoryEntry[];
    recruiter: { id: number; name: string } | null;
    communications: ApplicationCommunicationEntry[];
    interviews: ApplicationInterviewSummary[];
    resume_url: string | null;
    allowed_statuses: { value: string; label: string }[];
};

export type CandidateCredential = {
    id: number;
    credential_type: string;
    credential_name: string;
    credential_number: string | null;
    issuing_authority: string | null;
    jurisdiction: string | null;
    expiry_date: string | null;
    verification_status: string;
    verifier: { id: number; name: string } | null;
    notes: string | null;
};

export type ReferenceCheckEntry = {
    id: number;
    contact_method: string;
    contacted_at: string;
    outcome: string;
    notes: string | null;
    checked_by: { id: number; name: string } | null;
};

export type CandidateEmploymentHistoryEntry = {
    id: number;
    employer_name: string;
    job_title: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    supervisor_name: string | null;
    supervisor_contact: string | null;
    reference_checks: ReferenceCheckEntry[];
};

export type CandidateDocument = {
    id: number;
    document_type: string;
    original_filename: string;
    url: string;
};

export type CandidateDossier = {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    contact_verified_at: string | null;
    created_at: string;
    credentials: CandidateCredential[];
    documents: CandidateDocument[];
    employment_history: CandidateEmploymentHistoryEntry[];
    education: EducationRow[];
};
