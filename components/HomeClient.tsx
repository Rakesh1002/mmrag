"use client";

import Link from 'next/link';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';

export default function HomeClient({ session }: { session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Multimodal RAG Chatbot
        </h1>

        <p className="mt-3 text-2xl">
          Powered by Next.js and Llama 3.1
        </p>

        <div className="flex mt-6">
          {session ? (
            <Link href="/chat">
              <Button>Go to Chat</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}