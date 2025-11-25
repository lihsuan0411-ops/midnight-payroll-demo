'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Building2, User, ChevronRight, Server } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 背景動畫 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="text-center mb-12 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Catalyst ID Tag */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Catalyst ID: 111124</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Selective Disclosure</span>
          <br />
          Payroll System
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Midnight ZK contracts execute private salary logic.
          <br />
          Cardano settles the funds.
          <span className="block mt-2 text-sm text-slate-500">An auditable privacy primitive for the Cardano ecosystem.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full z-10">
        {/* 雇主入口 */}
        <Link href="/employer" className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-cyan-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-24 h-24 text-cyan-500" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Employer Portal</h2>
            <p className="text-slate-400 text-sm mb-6 h-10">Execute private logic, generate ZK proofs, and settle via Relay Oracle.</p>
            <div className="flex items-center text-sm font-bold text-cyan-500 gap-1 group-hover:gap-3 transition-all">
              Launch Dashboard <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* 員工入口 */}
        <Link href="/employee" className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <User className="w-24 h-24 text-purple-500" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Employee Portal</h2>
            <p className="text-slate-400 text-sm mb-6 h-10">Verify income with View Keys. Selective disclosure for banks/auditors.</p>
            <div className="flex items-center text-sm font-bold text-purple-400 gap-1 group-hover:gap-3 transition-all">
              Claim & Verify <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      <footer className="absolute bottom-6 text-slate-600 text-xs text-center uppercase tracking-widest">
        MIT License • GDPR Compliant • 3 Month Roadmap
      </footer>
    </div>
  );
}
