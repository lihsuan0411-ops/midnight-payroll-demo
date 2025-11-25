'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Wallet, Loader2, CheckCircle, ChevronRight, X, ChevronLeft, User, Lock, Eye, EyeOff, LogOut } from 'lucide-react';

declare global { interface Window { cardano?: any; } }

export default function EmployeePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // 隱私控制
  const [showBalance, setShowBalance] = useState(false);

  // Modal 與 列表狀態
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState(0);
  const [records, setRecords] = useState([
    { id: '1', date: '2025-10', amount: '5,000 tDUST', status: 'verified', hash: 'zk-7f8a...9c2d' },
    { id: '2', date: '2025-11', amount: '********', status: 'pending', hash: 'zk-3b2e...1a4f' },
  ]);

  const handleConnect = async () => {
    setIsConnecting(true);
    if (typeof window === 'undefined') return;
    if (!window.cardano || !window.cardano.lace) {
        alert("❌ 未偵測到 Lace 錢包！請先安裝插件。");
        setIsConnecting(false);
        return;
    }
    try {
      const api = await window.cardano.lace.enable();
      const networkId = await api.getNetworkId();
      
      // 隱私優化：對地址進行遮罩
      const rawAddress = "addr_test1...8Xj9"; 
      const maskedAddress = `${rawAddress.slice(0, 9)}...${rawAddress.slice(-4)}`;
      
      setWalletAddress(maskedAddress);
      setWalletConnected(true);
    } catch (error) {
      alert("⚠️ 連接失敗！");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
    // 斷開時可以選擇是否清空列表，這裡為了演示保留列表但重置狀態
    alert("已安全斷開連接，並清除本地暫存數據。");
  };

  const handleVerifyClick = (id: string) => {
    if(!walletConnected) {
        alert("🔒 安全性攔截：請先連接您的錢包以驗證身份並解密數據。");
        return;
    }
    setVerifyingId(id);
    setVerificationStep(0);
    setTimeout(() => setVerificationStep(1), 1000);
    setTimeout(() => setVerificationStep(2), 2500);
    setTimeout(() => setVerificationStep(3), 4000);
    setTimeout(() => {
        setRecords(prev => prev.map(r => r.id === id ? {...r, status: 'verified', amount: '5,200 tDUST'} : r));
        setTimeout(() => setVerifyingId(null), 1200);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:bg-slate-800 p-2 rounded-full transition"><ChevronLeft className="w-5 h-5 text-slate-400"/></Link>
            <Shield className="text-indigo-400 w-6 h-6" />
            <span className="font-bold text-lg text-white">Employee Portal</span>
          </div>

          <div className="flex items-center gap-3">
             {/* 安全徽章 */}
             {!walletConnected && (
                <div className="hidden md:flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                  <Lock className="w-3 h-3" />
                  <span>Read-Only Access</span>
                </div>
             )}
             
             {walletConnected ? (
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-slate-800 border border-slate-600 text-slate-300 cursor-default">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        {walletAddress}
                    </button>
                    {/* 斷開按鈕 */}
                    <button onClick={handleDisconnect} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition" title="Disconnect">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
             ) : (
                <button 
                    onClick={handleConnect}
                    disabled={walletConnected}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${walletConnected ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                >
                    {isConnecting ? <Loader2 className="animate-spin w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                    Connect Lace
                </button>
             )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 p-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-900/30 rounded-xl border border-indigo-500/20"><User className="w-8 h-8 text-indigo-400"/></div>
            <div>
                <h1 className="text-3xl font-bold text-white">薪資查驗</h1>
                <p className="text-slate-400">使用私鑰解密您的鏈上薪資紀錄</p>
            </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            <div className="overflow-hidden rounded-xl border border-slate-700/50">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-wider text-xs">
                <tr><th className="p-4">Period</th><th className="p-4">Amount</th><th className="p-4">Proof Hash</th><th className="p-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 font-medium text-slate-200">{rec.date}</td>
                    <td className="p-4 font-mono text-slate-400">
                        {rec.status === 'verified' ? (
                            <div className="flex items-center gap-2">
                                <span className={showBalance ? "text-green-400 font-bold" : "text-slate-500 blur-sm select-none"}>
                                    {rec.amount}
                                </span>
                                <button onClick={() => setShowBalance(!showBalance)} className="text-slate-600 hover:text-white transition">
                                    {showBalance ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                                </button>
                            </div>
                        ) : (
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Encrypted</span>
                        )}
                    </td>
                    <td className="p-4 text-xs text-slate-500 font-mono">{rec.hash}</td>
                    <td className="p-4 text-right">
                        {rec.status === 'verified' ? <span className="inline-flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold border border-green-400/20"><CheckCircle className="w-3 h-3"/> Verified</span> : 
                        <button onClick={() => handleVerifyClick(rec.id)} className="flex items-center gap-1 ml-auto text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-bold transition-all">Verify Proof <ChevronRight className="w-3 h-3" /></button>}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Verification Modal */}
        {verifyingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative ring-1 ring-white/10">
                    <button onClick={() => setVerifyingId(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="text-indigo-400" /> Verifying Proof...</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className={`flex items-center gap-4 transition-all duration-500 ${verificationStep >= step ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${verificationStep >= step ? 'bg-green-500 border-green-500 text-black' : 'border-slate-500 text-slate-500'}`}>{verificationStep > step ? <CheckCircle className="w-5 h-5"/> : step}</div>
                                <div>
                                    <div className="text-sm font-bold text-slate-200">{step === 1 ? 'Fetching Data' : step === 2 ? 'Verifying ZK-SNARK' : 'Decrypting Amount'}</div>
                                    <div className="text-xs text-slate-500">{step === 1 ? 'Downloading from Network...' : step === 2 ? 'Checking validity...' : 'Using private key...'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {verificationStep >= 3 && <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center animate-in zoom-in duration-300"><div className="text-xs text-green-300 uppercase font-bold mb-1">Decrypted Amount</div><div className="text-2xl font-mono font-bold text-white">5,200 tDUST</div></div>}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}