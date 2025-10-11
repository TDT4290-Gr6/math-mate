'use client';

import { sendMessageAction } from './actions';
import Header from '@/components/ui/header';
import Link from 'next/link';
import React from 'react';
export default function DashboardPage() {
    const [messages, setMessages] = React.useState<
        { role: 'user' | 'assistant'; content: string }[]
    >([]);
    const [input, setInput] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);

    const handleSend = async () => {
        setIsSending(true);
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');

        try {
            const reply = await sendMessageAction(input);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: reply },
            ]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Error: Unable to get response.',
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };
    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header
                variant="problem"
                mathProblem={
                    <div className="flex h-52 w-[60%] items-center justify-center bg-[var(--card)]">
                        {' '}
                        <h1>TODO: add math problem component here</h1>
                    </div>
                }
            />
            <h1 className="text-2xl font-bold">Dashboard Page</h1>
            <Link
                href="/login"
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
                Back to Login
            </Link>
            <Link
                href="/protected/method"
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
                Go to Method Page
            </Link>
            {/* ====== Chat Box ====== */}
            <div className="fixed bottom-4 flex w-full max-w-2xl flex-col gap-2 rounded border bg-white p-4 text-black shadow-lg">
                <div className="max-h-64 flex-1 space-y-2 overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`rounded p-2 ${
                                msg.role === 'user'
                                    ? 'self-end bg-green-400'
                                    : 'self-start bg-gray-400'
                            }`}
                        >
                            <strong>
                                {msg.role === 'user' ? 'You' : 'Bot'}:
                            </strong>{' '}
                            {msg.content}
                        </div>
                    ))}
                </div>
                <div className="mt-2 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 rounded border px-2 py-1"
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="rounded bg-blue-600 px-4 py-1 text-black hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
