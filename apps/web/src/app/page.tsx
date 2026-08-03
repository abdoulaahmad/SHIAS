import Link from "next/link";
import { Shield, ArrowRight, Lock, Users, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">SHIAS</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400 mb-8">
          <Lock className="h-3.5 w-3.5" />
          <span>Healthcare-grade security</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Secure Health Identity
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            & Access System
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
          A decentralized platform for patients and healthcare providers to manage
          identity, consent, and secure data access â€” with full audit transparency.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-8 h-12 text-base">
              Access Portal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 px-8 h-12 text-base">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-left backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Patient Portal</h3>
            <p className="mt-2 text-sm text-slate-400">
              Manage your health identity, review consent requests, and control who accesses your data.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-left backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <FileCheck className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white">Provider Portal</h3>
            <p className="mt-2 text-sm text-slate-400">
              Register pointers, request access to patient records, and manage active grants.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-left backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Shield className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white">Admin Portal</h3>
            <p className="mt-2 text-sm text-slate-400">
              Monitor users, audit events, and oversee platform operations with full visibility.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-slate-500">
        Â© 2026 SHIAS â€” Secure Health Identity & Access System
      </footer>
    </div>
  );
}
