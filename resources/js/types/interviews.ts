export type InterviewQuestion = {
    id: number;
    question: string;
    specialty: string | null;
    is_active: boolean;
    position: number;
};

export type InterviewQuestionResponseEntry = {
    id: number;
    question_text: string;
    score: number | null;
    notes: string | null;
    position: number;
};

export type InterviewListRow = {
    id: number;
    scheduled_at: string;
    format: string;
    status: string;
    recommendation: string | null;
    application: {
        id: number;
        candidate: { id: number; full_name: string };
    };
    interviewer: { id: number; name: string } | null;
};

export type InterviewDetail = {
    id: number;
    scheduled_at: string;
    format: string;
    location_or_link: string | null;
    status: string;
    recommendation: string | null;
    overall_notes: string | null;
    interviewer: { id: number; name: string } | null;
    responses: InterviewQuestionResponseEntry[];
    application: {
        id: number;
        candidate: { id: number; full_name: string; email: string };
    };
};
