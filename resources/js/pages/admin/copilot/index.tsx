import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Bot, Send } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { CopilotToolCallCard } from '@/components/admin/copilot-tool-call-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import admin from '@/routes/admin';
import type { Auth } from '@/types';
import type { CopilotActionEntry, CopilotMessageEntry } from '@/types/copilot';

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

    return (
        <>
            <Head title="Copilot" />
            <div className="flex h-[calc(100vh-4rem)] flex-col p-4 sm:p-6">
                <AdminPageHeader
                    title="Copilot"
                    description="Ask about candidates or ask it to take action on your behalf."
                />

                <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                    {messages.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Try: "Find candidates named Jane", "Show me the
                            dossier for candidate #4", or "Any applications that
                            need my action?"
                        </p>
                    )}

                    {messages
                        .filter((message) => message.role !== 'tool')
                        .map((message) => (
                            <div
                                key={message.id}
                                className={`flex animate-in items-start gap-3 duration-200 fade-in slide-in-from-bottom-1 ${
                                    message.role === 'user' ? 'justify-end' : ''
                                }`}
                            >
                                {message.role === 'assistant' && (
                                    <Avatar className="mt-0.5">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            <Bot className="size-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={
                                        message.role === 'user'
                                            ? 'max-w-xl'
                                            : 'max-w-xl flex-1'
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
                                            className={`rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                                                message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-foreground'
                                            }`}
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
                                    <Avatar className="mt-0.5">
                                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                    {processing && (
                        <div className="flex animate-in items-center gap-3 duration-200 fade-in">
                            <Avatar className="mt-0.5">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    <Bot className="size-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
                                <Spinner />
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <form onSubmit={submit} className="flex gap-3 border-t pt-4">
                    <Textarea
                        rows={2}
                        placeholder="Ask the copilot..."
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        disabled={processing || !!pendingAction}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submit(e);
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={
                            processing ||
                            !!pendingAction ||
                            !data.message.trim()
                        }
                    >
                        <Send className="size-4" />
                        {processing ? 'Sending...' : 'Send'}
                    </Button>
                </form>
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
