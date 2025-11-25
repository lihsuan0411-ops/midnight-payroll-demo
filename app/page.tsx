'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Building2, User, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 背景裝飾 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="text-center mb-12 z-10">
        <div className="inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-500/30 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">Midnight Privacy Protocol</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Midnight <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Payroll</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          基於零知識證明的隱私薪資發放系統。<br/>請選擇您的身份以繼續。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full z-10">
        {/* 雇主入口 */}
        <Link href="/employer" className="group relative bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10">
          <div className="bg-slate-900/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
            <Building2 className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">我是雇主 (Issuer)</h2>
          <p className="text-slate-400 mb-8 h-12">發放加密薪資，生成零知識證明，確保企業金流隱私。</p>
          <div className="flex items-center text-sm font-bold text-cyan-500 gap-1 group-hover:gap-3 transition-all">
            進入管理後台 <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        {/* 員工入口 */}
        <Link href="/employee" className="group relative bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
          <div className="bg-slate-900/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
            <User className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">我是員工 (Verifier)</h2>
          <p className="text-slate-400 mb-8 h-12">查驗薪資紀錄，使用私鑰解密金額，驗證鏈上證明。</p>
          <div className="flex items-center text-sm font-bold text-indigo-400 gap-1 group-hover:gap-3 transition-all">
            查看薪資單 <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <footer className="absolute bottom-6 text-slate-600 text-xs text-center">
        &copy; 2025 Midnight Payroll Demo. Powered by Next.js & Zero-Knowledge Proofs.
      </footer>
    </div>
  );
}