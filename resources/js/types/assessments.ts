export type Assessment = {
    id: number;
    name: string;
    description: string | null;
    delivery_mode: string;
    passing_score: number;
    max_attempts: number;
    is_active: boolean;
    questions_count?: number;
};

export type AssessmentQuestion = {
    id: number;
    assessment_id: number;
    question: string;
    question_type: string;
    options: string[] | null;
    correct_option: string | null;
    points: number;
    position: number;
};

export type AssessmentResponseEntry = {
    id: number;
    question_text: string;
    question_type: string;
    options: string[] | null;
    selected_option: string | null;
    answer_text: string | null;
    is_correct: boolean | null;
    points_awarded: number | null;
    points_possible: number;
    position: number;
};

export type AssessmentAttemptListRow = {
    id: number;
    attempt_number: number;
    status: string;
    score: number | null;
    passed: boolean | null;
    created_at: string;
    assessment: { id: number; name: string };
    application: {
        id: number;
        candidate: { id: number; full_name: string };
    };
};

export type AssessmentAttemptDetail = {
    id: number;
    attempt_number: number;
    status: string;
    score: number | null;
    passed: boolean | null;
    started_at: string | null;
    submitted_at: string | null;
    assessment: {
        id: number;
        name: string;
        description: string | null;
        passing_score: number;
        delivery_mode: string;
    };
    application: {
        id: number;
        candidate: { id: number; full_name: string; email: string };
    };
    administered_by: { id: number; name: string } | null;
    responses: AssessmentResponseEntry[];
};
