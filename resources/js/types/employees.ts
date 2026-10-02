import type { EmployeeShiftAssignment } from './facilities';

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
            expiry_notifications: CredentialExpiryNotification[];
        }[];
    };
    application: {
        id: number;
        job_listing: { id: number; title: string } | null;
    } | null;
    shift_assignments: EmployeeShiftAssignment[];
};

export type CredentialExpiryNotification = {
    id: number;
    stage: string;
    sent_at: string;
    notified_employee: boolean;
    notified_staff: boolean;
};

export type ComplianceCredentialRow = {
    id: number;
    credential_name: string;
    expiry_date: string;
    verification_status: string;
    candidate: { id: number; full_name: string; email: string };
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
