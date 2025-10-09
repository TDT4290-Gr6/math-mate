'use client';

import Header from '@/components/ui/header';
import Link from 'next/link';
import { sendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import React from 'react';
import { set } from 'zod';



export default function DashboardPage() {
    const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);



    const handleSend = async () => {
        setIsSending(true);
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');

        try {
            const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Unable to get response.' }]);
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
            <div className="fixed bottom-4 w-full max-w-2xl bg-white border text-black rounded shadow-lg p-4 flex flex-col gap-2">
                <div className="flex-1 overflow-y-auto max-h-64 space-y-2">
                {messages.map((msg, idx) => (
                    <div
                    key={idx}
                    className={`p-2 rounded ${
                        msg.role === 'user' ? 'bg-green-400 self-end' : 'bg-gray-400 self-start'
                    }`}
                    >
                    <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
                    </div>
                ))}
                </div>
                <div className="flex gap-2 mt-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-black px-4 py-1 rounded hover:bg-blue-700"
                >
                    Send
                </button>
                </div>
            </div>
        </div>
    );
}
