export type Facility = {
    id: number;
    name: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    contact_name: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    facility_type: string;
    is_active: boolean;
    shifts_count?: number;
};

export type ShiftAssignmentEntry = {
    id: number;
    status: string;
    assigned_at: string;
    employee: {
        id: number;
        candidate: { id: number; full_name: string; email: string };
    };
};

export type Shift = {
    id: number;
    facility_id: number;
    specialty: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    slots_needed: number;
    pay_rate: string | null;
    status: string;
    notes: string | null;
    assignments_count?: number;
    assignments?: ShiftAssignmentEntry[];
    facility?: { id: number; name: string };
};

export type AssignableEmployee = {
    id: number;
    candidate: { id: number; full_name: string };
};

export type EmployeeShiftAssignment = {
    id: number;
    status: string;
    assigned_at: string;
    shift: {
        id: number;
        shift_date: string;
        start_time: string;
        end_time: string;
        facility: { id: number; name: string };
    };
};
