'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Wallet, Loader2, CheckCircle, ChevronLeft, Lock, Eye, Download, X, FileText } from 'lucide-react';

export default function EmployeePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const connectWallet = async (walletName: 'lace' | 'eternl') => {
    setShowWalletModal(false);
    if (typeof window === 'undefined') return;
    // @ts-ignore
    const cardano = window.cardano;
    if (!cardano || !cardano[walletName]) { alert(`❌ 未偵測到 ${walletName} 錢包！`); return; }
    try {
      const api = await cardano[walletName].enable();
      await api.getNetworkId();
      setWalletConnected(true);
    } catch (e) { alert("連接失敗"); }
  };

  const MOCK_PAYSLIPS = [
    { id: 101, period: '2025-10', status: 'Settled', amount: 88000, hash: 'zk-7f...9c' },
    { id: 102, period: '2025-11', status: 'Pending', amount: 0, hash: 'zk-3b...1a' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans">
      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
            <Link href="/" className="hover:bg-white/10 p-2 rounded-full transition"><ChevronLeft className="text-slate-400"/></Link>
            <Shield className="text-indigo-400 w-5 h-5" />
            <span className="font-bold text-white">Employee Portal</span>
        </div>
        {!walletConnected ? (
            <button onClick={() => setShowWalletModal(true)} className="bg-indigo-600 px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2"><Wallet className="w-3 h-3"/> Connect</button>
        ) : (
            <button onClick={() => setWalletConnected(false)} className="bg-indigo-900/30 border border-indigo-500/30 px-4 py-2 rounded-full text-xs text-indigo-300">Connected</button>
        )}
      </nav>

      <div className="max-w-4xl mx-auto p-6 mt-6">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">My Payslips</h2>
            {!walletConnected && <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-sm flex gap-2"><Lock className="w-4 h-4"/> Connect to decrypt</div>}
        </div>

        <div className="space-y-4">
            {MOCK_PAYSLIPS.map(record => (
                <div key={record.id} className="bg-[#111623] border border-white/10 p-6 rounded-2xl flex justify-between items-center hover:border-white/20 transition">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400"><FileText className="w-6 h-6"/></div>
                        <div>
                            <div className="text-white font-bold text-lg">{record.period} Payroll</div>
                            <div className="text-xs text-slate-500 font-mono">Proof: {record.hash}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-white">{walletConnected ? record.amount.toLocaleString() : '******'}</div>
                        <div className={`text-xs font-bold uppercase ${record.status === 'Settled' ? 'text-green-500' : 'text-amber-500'}`}>{record.status}</div>
                    </div>
                    <div className="pl-6 border-l border-white/10 ml-6">
                        <button 
                            onClick={() => { if(!walletConnected) setShowWalletModal(true); else { setSelectedRecord(record); setShowDetails(true); }}}
                            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold flex gap-2"
                        >
                            {walletConnected ? <Eye className="w-4 h-4"/> : <Lock className="w-4 h-4"/>} {walletConnected ? 'View' : 'Decrypt'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
            <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl relative shadow-2xl">
                <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-slate-500"><X/></button>
                <div className="bg-indigo-900/30 p-6 border-b border-indigo-500/20">
                    <div className="flex gap-2 text-indigo-400 font-bold mb-1"><Shield className="w-5 h-5"/> Verified by Midnight</div>
                    <h3 className="text-2xl font-bold text-white">Payslip: {selectedRecord.period}</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="bg-slate-900 rounded-xl p-4 border border-white/5">
                        <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Selective Disclosure View</h4>
                        <div className="flex justify-between mb-2"><span className="text-slate-300">Source</span><span className="text-green-400 font-mono">Verified (ZK-Proof)</span></div>
                        <div className="flex justify-between"><span className="text-slate-300">Compliance</span><span className="text-green-400 font-mono">GDPR Compliant</span></div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-400"><span>Base Salary</span><span>75,000</span></div>
                        <div className="flex justify-between text-sm text-slate-400"><span>Allowance</span><span>5,000</span></div>
                        <div className="flex justify-between text-sm text-slate-400"><span>Bonus (Encrypted)</span><span>8,000</span></div>
                        <div className="h-px bg-white/10 my-2"/>
                        <div className="flex justify-between text-xl font-bold text-white"><span>Net Pay</span><span className="text-cyan-400">{selectedRecord.amount.toLocaleString()} tDUST</span></div>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex justify-center gap-2">
                        <Download className="w-4 h-4"/> Export Proof for Bank/Audit
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 relative">
                <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500"><X/></button>
                <h3 className="text-white font-bold text-center mb-4">Select Wallet</h3>
                <div className="space-y-3">
                    <button onClick={() => connectWallet('lace')} className="w-full bg-slate-800 p-4 rounded-xl text-white hover:bg-cyan-900/50 flex gap-3 items-center"><div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">L</div> Lace</button>
                    <button onClick={() => connectWallet('eternl')} className="w-full bg-slate-800 p-4 rounded-xl text-white hover:bg-orange-900/50 flex gap-3 items-center"><div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-bold">E</div> Eternl</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}