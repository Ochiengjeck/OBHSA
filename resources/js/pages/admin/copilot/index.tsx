import { Head, router, useForm } from '@inertiajs/react';
import { Bot, Send, User as UserIcon } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import type { CopilotActionEntry, CopilotMessageEntry } from '@/types';

export default function CopilotIndex({
    messages,
    pendingAction,
}: {
    conversationId: number;
    messages: CopilotMessageEntry[];
    pendingAction: CopilotActionEntry | null;
}) {
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

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
                            Try: "Find candidates named Jane" or "Show me the
                            dossier for candidate #4".
                        </p>
                    )}

                    {messages
                        .filter((message) => message.role !== 'tool')
                        .map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start gap-3 ${
                                    message.role === 'user' ? 'justify-end' : ''
                                }`}
                            >
                                {message.role === 'assistant' && (
                                    <Bot className="mt-1 size-5 shrink-0 text-primary" />
                                )}
                                <div
                                    className={`max-w-xl rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
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
                                {message.role === 'user' && (
                                    <UserIcon className="mt-1 size-5 shrink-0 text-muted-foreground" />
                                )}
                            </div>
                        ))}

                    {pendingAction && (
                        <Card className="border-amber-400">
                            <CardContent className="space-y-3 pt-6">
                                <p className="text-sm font-medium text-foreground">
                                    The copilot wants to run:{' '}
                                    <span className="font-mono">
                                        {pendingAction.tool_name}
                                    </span>
                                </p>
                                <pre className="overflow-x-auto rounded-md bg-muted p-2 text-xs">
                                    {JSON.stringify(
                                        pendingAction.arguments,
                                        null,
                                        2,
                                    )}
                                </pre>
                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            respondToAction(pendingAction, true)
                                        }
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            respondToAction(
                                                pendingAction,
                                                false,
                                            )
                                        }
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
