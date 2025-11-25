'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Wallet, Loader2, Lock, Terminal, Building2, ChevronLeft, CheckCircle, LogOut, X, User, Activity, Globe } from 'lucide-react';

export default function EmployerPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connectedWalletName, setConnectedWalletName] = useState<'Lace' | 'Eternl' | ''>('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // 流程控制
  const [step, setStep] = useState(0); // 0:idle, 1:encrypt, 2:zk, 3:relay, 4:settle, 5:done
  
  // 表單資料
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [bonus, setBonus] = useState(0);

  // 模擬數據
  const EMPLOYEES = [
    { id: 1, name: "Alice (Senior)", address: "addr_test1...Alice", base: 75000, allowance: 5000 },
    { id: 2, name: "Bob (Manager)", address: "addr_test1...Bob", base: 90000, allowance: 8000 },
  ];

  // 連接錢包函數 (使用 as any 避開 TS 錯誤)
  const connectWallet = async (walletName: 'lace' | 'eternl') => {
    setShowWalletModal(false);
    if (typeof window === 'undefined') return;
    
    // @ts-ignore
    const cardano = window.cardano;
    
    if (!cardano || !cardano[walletName]) {
        alert(`❌ 未偵測到 ${walletName} 錢包！`);
        return;
    }

    try {
      const api = await cardano[walletName].enable();
      await api.getNetworkId(); // 測試連接
      setWalletAddress(walletName === 'lace' ? "addr...LaceHost" : "addr...EternlHost");
      setConnectedWalletName(walletName === 'lace' ? 'Lace' : 'Eternl');
      setWalletConnected(true);
    } catch (e) { alert("連接失敗"); }
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setStep(0);
  };

  const handleExecute = () => {
    if (!walletConnected) { setShowWalletModal(true); return; }
    setStep(1);
    // 模擬提案中的 Relay Oracle 流程
    setTimeout(() => setStep(2), 1500); // Midnight ZK
    setTimeout(() => setStep(3), 3500); // Relay Oracle
    setTimeout(() => setStep(4), 5000); // Cardano Settlement
    setTimeout(() => setStep(5), 7000); // Done
  };

  const currentEmp = EMPLOYEES.find(e => e.address === selectedEmployee);
  const total = currentEmp ? currentEmp.base + currentEmp.allowance + bonus : 0;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
            <Link href="/" className="hover:bg-white/10 p-2 rounded-full transition"><ChevronLeft className="text-slate-400"/></Link>
            <Shield className="text-cyan-400 w-5 h-5" />
            <span className="font-bold text-white">Employer Portal</span>
        </div>
        {!walletConnected ? (
            <button onClick={() => setShowWalletModal(true)} className="bg-cyan-600 px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2"><Wallet className="w-3 h-3"/> Connect</button>
        ) : (
            <button onClick={handleDisconnect} className="bg-cyan-900/30 border border-cyan-500/30 px-4 py-2 rounded-full text-xs text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/> {connectedWalletName} Connected
            </button>
        )}
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* 左側操作區 */}
        <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Private Payroll Execution</h2>
                        <p className="text-slate-400 text-sm mt-1">Logic runs on Midnight. Funds settle on Cardano.</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> GDPR Compliant
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Select Employee</label>
                        <select 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                            <option value="">Choose...</option>
                            {EMPLOYEES.map(e => <option key={e.id} value={e.address}>{e.name}</option>)}
                        </select>
                    </div>

                    {currentEmp && (
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 animate-in zoom-in">
                            <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Base Salary</span><span className="text-white font-mono">{currentEmp.base.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Allowance</span><span className="text-white font-mono">{currentEmp.allowance.toLocaleString()}</span></div>
                            <div className="flex justify-between items-center text-sm mb-4 pt-2 border-t border-white/5">
                                <span className="text-cyan-400">Bonus</span>
                                <input type="number" value={bonus} onChange={e => setBonus(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-right text-white w-24 focus:border-cyan-500 outline-none"/>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-white/10">
                                <span className="text-white">Total</span><span className="text-cyan-400">{total.toLocaleString()} tDUST</span>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleExecute}
                        disabled={!selectedEmployee || (step > 0 && step < 5)}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${step > 0 && step < 5 ? 'bg-indigo-600 cursor-wait' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white'}`}
                    >
                        {step === 0 && <><Activity className="w-5 h-5"/> Execute Private Contract</>}
                        {step > 0 && step < 5 && <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</>}
                        {step === 5 && <><CheckCircle className="w-5 h-5"/> Settlement Complete</>}
                    </button>
                </div>
            </div>
        </div>

        {/* 右側 Oracle Log */}
        <div className="lg:col-span-5">
            <div className="bg-[#05070a] border border-slate-800 rounded-3xl p-6 h-full min-h-[400px] flex flex-col font-mono text-xs shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500" />
                <div className="flex items-center gap-2 text-slate-500 border-b border-white/5 pb-4 mb-4"><Terminal className="w-4 h-4" /><span>System Architecture Log</span></div>
                <div className="space-y-4 flex-1 overflow-y-auto">
                    {step === 0 && <div className="text-slate-600 italic">Waiting for command...</div>}
                    {step >= 1 && <div className="text-indigo-400 font-bold animate-in slide-in-from-left-4">[Midnight] Encrypting Salary Data...</div>}
                    {step >= 2 && <div className="text-purple-400 font-bold animate-in slide-in-from-left-4 pt-2 border-t border-white/5">[ZK Circuit] Generating Proof (Groth16)...</div>}
                    {step >= 3 && <div className="text-orange-400 font-bold animate-in slide-in-from-left-4 pt-2 border-t border-white/5 flex items-center gap-2">[Relay Oracle] <Globe className="w-3 h-3"/> Bridging Proof...</div>}
                    {step >= 4 && <div className="text-cyan-400 font-bold animate-in slide-in-from-left-4 pt-2 border-t border-white/5">[Cardano] Settling Funds... Tx: 8a7c...</div>}
                </div>
            </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 relative">
                <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500"><X/></button>
                <h3 className="text-white font-bold text-center mb-4">Connect Wallet</h3>
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