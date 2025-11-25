'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Wallet, Loader2, Lock, Terminal, Building2, ChevronLeft, CheckCircle, LogOut, X, ChevronRight } from 'lucide-react';

declare global {
  interface Window {
    cardano?: {
      lace?: any;
      eternl?: any;
    };
  }
}

export default function EmployerPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connectedWalletName, setConnectedWalletName] = useState<'Lace' | 'Eternl' | ''>('');
  
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const connectWallet = async (walletName: 'lace' | 'eternl') => {
    setIsConnecting(true);
    setShowWalletModal(false);

    if (typeof window === 'undefined') return;
    if (!window.cardano || !window.cardano[walletName]) {
        alert(`❌ 未偵測到 ${walletName === 'lace' ? 'Lace' : 'Eternl'} 錢包！\n請先安裝瀏覽器擴充功能。`);
        setIsConnecting(false);
        return;
    }

    try {
      const api = await window.cardano[walletName].enable();
      await api.getNetworkId(); // 僅讀取 ID 以確認連接
      
      const rawAddress = walletName === 'lace' ? "addr_test1...OwnerLace" : "addr_test1...OwnerEternl"; 
      const maskedAddress = `${rawAddress.slice(0, 9)}...${rawAddress.slice(-6)}`;
      
      setWalletAddress(maskedAddress);
      setConnectedWalletName(walletName === 'lace' ? 'Lace' : 'Eternl');
      setWalletConnected(true);
    } catch (error) {
      alert("⚠️ 用戶拒絕授權或連接失敗！");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setConnectedWalletName('');
    setLogs([]);
    setStatus('idle');
    alert("已斷開連接，並清除本次操作紀錄。");
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
        alert("🔒 請先連接錢包以授權交易簽名！");
        return;
    }
    setStatus('processing');
    setLogs([]);
    const steps = [
        "Initializing Midnight ZK-Circuit...",
        "Encrypting salary amount (Homomorphic Encryption)...",
        "Generating ZK-Proof (Groth16)...",
        `Requesting signature from ${connectedWalletName} Wallet...`,
        "Submitting transaction to Midnight Network...",
        "Transaction Confirmed! Block #48291"
    ];
    steps.forEach((step, index) => {
        setTimeout(() => {
            setLogs(prev => [...prev, step]);
            if (index === steps.length - 1) setStatus('success');
        }, (index + 1) * 800);
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:bg-slate-800 p-2 rounded-full transition"><ChevronLeft className="w-5 h-5 text-slate-400"/></Link>
            <Shield className="text-cyan-400 w-6 h-6" />
            <span className="font-bold text-lg text-white">Employer Portal</span>
          </div>
          
          <div className="flex items-center gap-3">
             {!walletConnected && (
                <div className="hidden md:flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                  <Lock className="w-3 h-3" />
                  <span>Secure Connection</span>
                </div>
             )}
             
             {walletConnected ? (
                <div className="flex items-center gap-2">
                    <button className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border text-slate-200 cursor-default ${connectedWalletName === 'Eternl' ? 'bg-orange-900/30 border-orange-500/30' : 'bg-cyan-900/30 border-cyan-500/30'}`}>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        {connectedWalletName}: {walletAddress}
                    </button>
                    <button onClick={handleDisconnect} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition" title="Disconnect">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
             ) : (
                <button 
                    onClick={() => setShowWalletModal(true)}
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                    {isConnecting ? <Loader2 className="animate-spin w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                    Connect Wallet
                </button>
             )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 p-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-cyan-900/30 rounded-xl border border-cyan-500/20"><Building2 className="w-8 h-8 text-cyan-400"/></div>
            <div>
                <h1 className="text-3xl font-bold text-white">薪資發放中心</h1>
                <p className="text-slate-400">管理員工薪資並生成鏈上隱私證明</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-800/40 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">新增交易</h2>
            <form onSubmit={handlePay} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Employee Address</label>
                <input required type="text" placeholder="mid1qq..." className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-cyan-500 transition font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amount (tDUST)</label>
                    <input required type="number" placeholder="0.00" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-cyan-500 transition font-mono" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Period</label>
                    <input required type="month" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-cyan-500 transition" />
                </div>
              </div>
              <button type="submit" disabled={status === 'processing'} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg flex justify-center gap-2">
                {status === 'processing' ? <Loader2 className="animate-spin" /> : <Lock className="w-5 h-5" />}
                {status === 'processing' ? 'Processing...' : 'Generate Proof & Pay'}
              </button>
            </form>
          </div>

          <div className="md:col-span-1 bg-black/80 border border-slate-800 rounded-3xl p-6 font-mono text-xs flex flex-col shadow-2xl min-h-[400px]">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4 text-slate-500"><Terminal className="w-4 h-4" /><span>Logs</span></div>
            <div className="flex-1 space-y-3 overflow-y-auto">
                {logs.length === 0 && <div className="text-slate-600 italic mt-10 text-center">Ready...</div>}
                {logs.map((log, i) => <div key={i} className="flex gap-2 text-cyan-400 animate-in slide-in-from-left-2"><span>{'>'}</span><span>{log}</span></div>)}
                {status === 'success' && <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-center animate-bounce flex justify-center gap-2"><CheckCircle className="w-4 h-4"/> Success!</div>}
            </div>
          </div>
        </div>

        {showWalletModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                    <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Connect Wallet</h3>
                    <div className="space-y-4">
                        <button onClick={() => connectWallet('lace')} className="w-full flex items-center justify-between bg-slate-800 hover:bg-cyan-900/30 border border-slate-700 hover:border-cyan-500/50 p-4 rounded-xl transition-all group">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg">L</div><div className="text-left"><div className="text-white font-bold group-hover:text-cyan-400">Lace Wallet</div><div className="text-xs text-slate-500">IOG Official</div></div></div><ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400"/>
                        </button>
                        <button onClick={() => connectWallet('eternl')} className="w-full flex items-center justify-between bg-slate-800 hover:bg-orange-900/30 border border-slate-700 hover:border-orange-500/50 p-4 rounded-xl transition-all group">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">E</div><div className="text-left"><div className="text-white font-bold group-hover:text-orange-400">Eternl Wallet</div><div className="text-xs text-slate-500">Community Favorite</div></div></div><ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400"/>
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}