import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Bot, CornerDownLeft, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { CopilotToolCallCard } from '@/components/admin/copilot-tool-call-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Auth } from '@/types';
import type { CopilotActionEntry, CopilotMessageEntry } from '@/types/copilot';

const SUGGESTED_PROMPTS = [
    'Find candidates named Jane',
    'Show me the dossier for candidate #4',
    'Any applications that need my action?',
];

export default function CopilotIndex({
    messages,
    pendingAction,
}: {
    conversationId: number;
    messages: CopilotMessageEntry[];
    pendingAction: CopilotActionEntry | null;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, pendingAction, processing]);

    function submit(event: React.FormEvent) {
        event.preventDefault();

        if (!data.message.trim()) {
            return;
        }

        post(admin.copilot.message().url, {
            preserveScroll: true,
            onSuccess: () => reset('message'),
        });
    }

    function respondToAction(action: CopilotActionEntry, confirm: boolean) {
        router.post(
            confirm
                ? admin.copilot.actions.confirm(action.id).url
                : admin.copilot.actions.reject(action.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function useSuggestion(prompt: string) {
        setData('message', prompt);
        textareaRef.current?.focus();
    }

    const composerDisabled = processing || !!pendingAction;

    return (
        <>
            <Head title="Copilot" />
            <div className="flex h-[calc(100vh-4rem)] flex-col p-4 sm:p-6">
                <AdminPageHeader
                    title="Copilot"
                    description="Ask about candidates or ask it to take action on your behalf."
                    icon={Bot}
                />

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
                    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                        <div className="mx-auto w-full max-w-3xl space-y-4">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center gap-4 py-10 text-center">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Ask Copilot anything
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            It can look up candidates,
                                            applications, and take action on
                                            your behalf.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {SUGGESTED_PROMPTS.map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                onClick={() =>
                                                    useSuggestion(prompt)
                                                }
                                                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages
                                .filter((message) => message.role !== 'tool')
                                .map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            'flex animate-in items-start gap-3 duration-200 fade-in slide-in-from-bottom-1',
                                            message.role === 'user' &&
                                                'justify-end',
                                        )}
                                    >
                                        {message.role === 'assistant' && (
                                            <Avatar className="mt-0.5 size-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    <Bot className="size-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div
                                            className={
                                                message.role === 'user'
                                                    ? 'max-w-[85%] sm:max-w-xl'
                                                    : 'max-w-[85%] flex-1 sm:max-w-xl'
                                            }
                                        >
                                            {message.action ? (
                                                <CopilotToolCallCard
                                                    action={message.action}
                                                    onConfirm={
                                                        message.action.id ===
                                                        pendingAction?.id
                                                            ? () =>
                                                                  respondToAction(
                                                                      message.action!,
                                                                      true,
                                                                  )
                                                            : undefined
                                                    }
                                                    onReject={
                                                        message.action.id ===
                                                        pendingAction?.id
                                                            ? () =>
                                                                  respondToAction(
                                                                      message.action!,
                                                                      false,
                                                                  )
                                                            : undefined
                                                    }
                                                />
                                            ) : (
                                                <div
                                                    className={cn(
                                                        'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
                                                        message.role === 'user'
                                                            ? 'rounded-tr-sm bg-primary text-primary-foreground'
                                                            : 'rounded-tl-sm bg-muted text-foreground',
                                                    )}
                                                >
                                                    {message.content || (
                                                        <span className="italic opacity-70">
                                                            (no reply text)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {message.role === 'user' && (
                                            <Avatar className="mt-0.5 size-8">
                                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}

                            {processing && (
                                <div className="flex animate-in items-center gap-3 duration-200 fade-in">
                                    <Avatar className="mt-0.5 size-8">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            <Bot className="size-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                                        <Spinner />
                                        Thinking...
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>
                    </div>

                    <div className="border-t border-border p-3 sm:p-4">
                        <form
                            onSubmit={submit}
                            className="mx-auto w-full max-w-3xl"
                        >
                            {pendingAction && (
                                <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">
                                    Resolve the pending action above before
                                    sending another message.
                                </p>
                            )}
                            <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:ring-1 focus-within:ring-primary/40">
                                <Textarea
                                    ref={textareaRef}
                                    rows={1}
                                    placeholder="Ask the copilot..."
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    disabled={composerDisabled}
                                    className="max-h-40 min-h-9 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            submit(e);
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={
                                        composerDisabled || !data.message.trim()
                                    }
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <Send className="size-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <CornerDownLeft className="size-3" />
                                Enter to send, Shift+Enter for a new line
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

CopilotIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Copilot', href: admin.copilot.index() },
    ],
};
