"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const initial = session?.user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 flex justify-between items-center">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/bob-badger-logo.png"
            alt="Bob the Deployer"
            width={36}
            height={36}
            className="rounded-xl glow hover:scale-110 transition-transform"
            priority
          />
          <span className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Bob the Deployer-v0.1
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {!session && (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/50 transition-all duration-300 glow"
              >
                Sign up
              </Link>
            </>
          )}

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm font-semibold hover:bg-zinc-800 glow transition-all"
            >
              {initial}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl">
                {session ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    Sign out
                  </button>
                ) : (
                  <div className="px-4 py-2 text-sm text-zinc-500">
                    Not signed in
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
