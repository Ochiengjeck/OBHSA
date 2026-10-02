export type EmploymentHistoryRow = {
    employer_name: string;
    job_title: string;
    employment_type: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    responsibilities: string | null;
    supervisor_name: string | null;
    supervisor_contact: string | null;
    reason_for_leaving: string | null;
};

export type EducationRow = {
    institution_name: string;
    credential_earned: string | null;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    country: string | null;
    state: string | null;
};

export type WizardCredential = {
    id: number;
    credential_type: string;
    credential_name: string;
    credential_number: string | null;
    issuing_authority: string | null;
    jurisdiction: string | null;
};

export type WizardDocument = {
    id: number;
    document_type: string;
    original_filename: string;
};

export type WizardApplicationReview = {
    id: number;
    primary_specialty: string | null;
    secondary_specialty: string | null;
    desired_employment_type: string | null;
    desired_start_timeframe: string | null;
    work_settings: string[] | null;
    consent_signature_name: string | null;
    candidate: {
        full_name: string;
        email: string;
        phone: string | null;
        city: string | null;
        state: string | null;
        employment_history: EmploymentHistoryRow[];
        education: EducationRow[];
        credentials: WizardCredential[];
    };
    documents: WizardDocument[];
};
