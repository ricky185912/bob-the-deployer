import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center space-y-8">

        {/* Bob Core */}
        <div className="relative mx-auto w-40 h-40">
          <div className="bob-core" />
          <div className="bob-ring" />
          <div className="bob-ring delay" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Artifact not found
        </h1>

        <p className="text-zinc-400">
          The requested resource does not exist.
          <br />
          Bob only serves immutable artifacts.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/" className="btn-primary glow">
            Go home
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-zinc-700 px-6 py-3"
          >
            Read docs
          </Link>
        </div>

        <p className="text-xs text-zinc-600 pt-8">
          404 · No mutable fallback · No silent redirect
        </p>
      </div>
    </main>
  );
}
