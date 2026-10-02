export type EmployeeListRow = {
    id: number;
    employee_number: string | null;
    hire_date: string;
    status: string;
    specialty: string | null;
    candidate: { id: number; full_name: string; email: string };
};

export type EmployeeProfile = {
    id: number;
    employee_number: string | null;
    hire_date: string;
    status: string;
    specialty: string | null;
    pay_rate: string | null;
    terminated_at: string | null;
    termination_reason: string | null;
    candidate: {
        id: number;
        full_name: string;
        email: string;
        phone: string | null;
        credentials: {
            id: number;
            credential_name: string;
            verification_status: string;
            expiry_date: string | null;
        }[];
    };
    application: {
        id: number;
        job_listing: { id: number; title: string } | null;
    } | null;
};

export type OnboardingChecklistTemplate = {
    id: number;
    name: string;
    description: string | null;
    is_default: boolean;
    is_active: boolean;
    items_count?: number;
};

export type OnboardingChecklistTemplateItem = {
    id: number;
    onboarding_checklist_template_id: number;
    task_key: string;
    label: string;
    is_blocking: boolean;
    position: number;
};
