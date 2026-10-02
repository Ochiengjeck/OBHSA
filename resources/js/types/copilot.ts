export type CopilotMessageEntry = {
    id: number;
    role: 'user' | 'assistant' | 'tool';
    content: string | null;
    created_at: string;
};

export type CopilotActionEntry = {
    id: number;
    tool_name: string;
    arguments: Record<string, unknown>;
    status: string;
    result: Record<string, unknown> | null;
    provider: string;
};

export type PolicyDocument = {
    id: number;
    title: string;
    body: string;
    is_active: boolean;
};
