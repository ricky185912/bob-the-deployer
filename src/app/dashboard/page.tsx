"use client";

import Link from "next/link";
import { Upload, Package, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="card max-w-2xl mx-auto text-center space-y-8 p-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl flex items-center justify-center glow mb-8">
            <LayoutDashboard className="w-12 h-12 text-orange-400" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {session?.user?.email?.split('@')[0] || 'Deployer'}
            </h1>
            <p className="text-zinc-400 text-lg">
              Deploy rollback-proof static sites forever
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-zinc-800">
            <Link href="/deploy" className="group card p-8 hover:bg-zinc-950/50 transition-all glow">
              <Upload className="w-12 h-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Deploy Site</h3>
              <p className="text-zinc-400">Upload ZIP → Get permanent URL</p>
            </Link>
            
            <Link href="/deployments" className="group card p-8 hover:bg-zinc-950/50 transition-all glow">
              <Package className="w-12 h-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">My Sites</h3>
              <p className="text-zinc-400">Manage all deployments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}