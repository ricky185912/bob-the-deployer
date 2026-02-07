// src/app/login/page.tsx - FIXED (theme-aligned)
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (!res?.ok) {
      setError("Invalid email or password.");
      return;
    }

    // Smooth redirect instead of window.location
    window.location.href = "/dashboard"; // or "/" for home
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Back link */}
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-2xl flex items-center justify-center glow">
              
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Log in to Bob</h1>
            <p className="text-zinc-400">Deploy immutable sites forever</p>
          </div>

          {error && (
            <div className="card bg-red-500/5 border-red-500/30 text-red-300 p-4 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-zinc-900/50 border border-zinc-700/50 hover:border-zinc-600 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all px-4 py-3 text-white placeholder-zinc-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-zinc-900/50 border border-zinc-700/50 hover:border-zinc-600 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all px-4 py-3 text-white placeholder-zinc-500"
                disabled={loading}
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary glow w-full h-12 font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-200"
            >
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-zinc-500">
              No account?{" "}
              <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium underline decoration-orange-500/50">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

