'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Wallet, CheckCircle, User, Building2, Loader2, FileCode, Lock, ChevronRight, Terminal, X } from 'lucide-react';

// 定義 window.cardano 類型，避免 TypeScript 報錯
declare global {
  interface Window {
    cardano?: any;
  }
}

export default function SalaryDApp() {
  const [role, setRole] = useState<'employer' | 'employee'>('employer');
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // --- 核心功能：真實連接 Lace 錢包 ---
  const handleConnect = async () => {
    setIsConnecting(true);
    
    // 1. 檢查瀏覽器環境
    if (typeof window === 'undefined') {
        alert("請在瀏覽器環境下執行");
        setIsConnecting(false);
        return;
    }

    // 2. 嚴格檢查 Lace 是否存在
    if (!window.cardano || !window.cardano.lace) {
        alert("❌ 未偵測到 Lace 錢包！\n\n請確保：\n1. 您使用的是 Chrome 或 Brave 瀏覽器\n2. 已安裝 Lace Wallet 擴充功能\n3. 已重新整理頁面");
        setIsConnecting(false);
        return;
    }

    try {
      console.log("正在呼叫 Lace API...");
      
      // 3. 呼叫 Lace 授權視窗
      const api = await window.cardano.lace.enable();
      
      // 4. 獲取網路資訊 (用於顯示)
      const networkId = await api.getNetworkId();
      console.log("Connected to Network ID:", networkId);

      // 5. 連接成功
      // 這裡顯示 Network ID，證明是真的連接上了
      const netName = networkId === 0 ? "Testnet" : "Mainnet";
      setWalletAddress(`Lace Wallet (${netName})`);
      setWalletConnected(true);
      
    } catch (error) {
      console.error("連接失敗:", error);
      alert("⚠️ 用戶拒絕授權或連接失敗！");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 背景裝飾光暈 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <Shield className="text-cyan-400 w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide text-white">Midnight Payroll</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Privacy First Protocol</span>
            </div>
          </div>
          <button 
            onClick={handleConnect}
            disabled={walletConnected}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              walletConnected 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]'
            }`}
          >
            {isConnecting ? <Loader2 className="animate-spin w-4 h-4" /> : <Wallet className="w-4 h-4" />}
            {walletConnected ? walletAddress : 'Connect Lace'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-12 p-6 pb-20">
        
        {/* Role Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-sm inline-flex relative">
            <button 
              onClick={() => setRole('employer')}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                role === 'employer' ? 'bg-slate-800 text-cyan-400 shadow-lg border border-slate-600' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" /> 雇主 (Issuer)
            </button>
            <button 
              onClick={() => setRole('employee')}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                role === 'employee' ? 'bg-slate-800 text-cyan-400 shadow-lg border border-slate-600' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" /> 員工 (Verifier)
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
            {role === 'employer' ? <EmployerPanel walletConnected={walletConnected} /> : <EmployeePanel walletConnected={walletConnected} />}
        </div>

      </main>
    </div>
  );
}

// --- Sub Components ---

function EmployerPanel({ walletConnected }: { walletConnected: boolean }) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
        alert("請先點擊右上角連接 Lace 錢包！");
        return;
    }
    setStatus('processing');
    setLogs([]);

    const steps = [
        "Initializing ZK-Circuit...",
        "Encrypting salary amount (Homomorphic Enc)...",
        "Generating ZK-Proof (Groth16)...",
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* 左側表單 */}
      <div className="md:col-span-2 bg-slate-800/40 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            發放薪資
            <span className="text-xs font-normal px-2 py-1 rounded bg-cyan-900/50 text-cyan-400 border border-cyan-800">Compact Language</span>
        </h2>
        <p className="text-slate-400 text-sm mb-8">生成零知識證明，確保金額僅對接收方可見。</p>
        
        <form onSubmit={handlePay} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Address</label>
            <div className="relative">
                <input required type="text" placeholder="mid1qq..." className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition font-mono" />
                <div className="absolute right-4 top-4 text-slate-600">
                    <User className="w-5 h-5" />
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (tDUST)</label>
                <input required type="number" placeholder="0.00" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition font-mono" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Period</label>
                <input required type="month" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === 'processing'} 
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all ${
                status === 'processing' 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/20'
            }`}
          >
            {status === 'processing' ? <Loader2 className="animate-spin" /> : <Lock className="w-5 h-5" />}
            {status === 'processing' ? 'Processing...' : 'Generate Proof & Pay'}
          </button>
        </form>
      </div>

      {/* 右側終端機 */}
      <div className="md:col-span-1 bg-black/80 border border-slate-800 rounded-3xl p-6 font-mono text-xs overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4 text-slate-500">
            <Terminal className="w-4 h-4" />
            <span>Transaction Logs</span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto">
            {logs.length === 0 && (
                <div className="text-slate-600 italic mt-10 text-center">Waiting for transaction...</div>
            )}
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2 text-cyan-400 animate-in slide-in-from-left-2 duration-300">
                    <span className="opacity-50">{'>'}</span>
                    <span>{log}</span>
                </div>
            ))}
            {status === 'success' && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-center animate-bounce">
                    <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                    Proof Generated Successfully!
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function EmployeePanel({ walletConnected }: { walletConnected: boolean }) {
  // Modal 與 列表狀態
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState(0);
  
  const [records, setRecords] = useState([
    { id: '1', date: '2025-10', amount: '5,000 tDUST', status: 'verified', hash: 'zk-7f8a...9c2d' },
    { id: '2', date: '2025-11', amount: '********', status: 'pending', hash: 'zk-3b2e...1a4f' },
  ]);

  const handleVerifyClick = (id: string) => {
    if(!walletConnected) {
        alert("🔒 安全性攔截：\n請先連接您的錢包以驗證身份並解密數據。");
        return;
    }
    setVerifyingId(id);
    setVerificationStep(0);

    // 模擬驗證過程時間軸
    setTimeout(() => setVerificationStep(1), 1000); // 1. 下載
    setTimeout(() => setVerificationStep(2), 2500); // 2. 驗證
    setTimeout(() => setVerificationStep(3), 4000); // 3. 解密
    setTimeout(() => {
        // 更新數據顯示
        setRecords(prev => prev.map(r => r.id === id ? {...r, status: 'verified', amount: '5,200 tDUST'} : r));
        // 關閉 Modal
        setTimeout(() => setVerifyingId(null), 1200);
    }, 5000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      
       <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-indigo-400"/> 
            薪資證明紀錄 (On-Chain)
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-semibold">Period</th>
                <th className="p-4 font-semibold">Amount (Encrypted)</th>
                <th className="p-4 font-semibold">Proof Hash</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-700/30 transition group">
                  <td className="p-4 font-medium text-slate-200">{rec.date}</td>
                  <td className="p-4 font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                    {rec.status === 'verified' ? (
                        <span className="text-green-400 font-bold">{rec.amount}</span>
                    ) : (
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Encrypted</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-mono">{rec.hash}</td>
                  <td className="p-4 text-right">
                    {rec.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold border border-green-400/20">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleVerifyClick(rec.id)}
                        className="flex items-center gap-1 ml-auto text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                      >
                        Verify Proof <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 驗證過程 Modal (彈出視窗) */}
      {verifyingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative ring-1 ring-white/10">
                <button onClick={() => setVerifyingId(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition">
                    <X className="w-5 h-5"/>
                </button>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="text-indigo-400" />
                    Verifying Proof...
                </h3>

                <div className="space-y-6">
                    {/* 步驟 1 */}
                    <div className={`flex items-center gap-4 transition-all duration-500 ${verificationStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${verificationStep > 1 ? 'bg-green-500 border-green-500 text-black' : 'border-slate-500 text-slate-500'}`}>
                            {verificationStep > 1 ? <CheckCircle className="w-5 h-5"/> : "1"}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-200">Fetching Proof Data</div>
                            <div className="text-xs text-slate-500">Downloading from Midnight Network...</div>
                        </div>
                    </div>

                    {/* 步驟 2 */}
                    <div className={`flex items-center gap-4 transition-all duration-500 ${verificationStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${verificationStep > 2 ? 'bg-green-500 border-green-500 text-black' : 'border-slate-500 text-slate-500'}`}>
                            {verificationStep > 2 ? <CheckCircle className="w-5 h-5"/> : "2"}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-200">Verifying ZK-SNARK</div>
                            <div className="text-xs text-slate-500">Checking cryptographic validity...</div>
                        </div>
                    </div>

                    {/* 步驟 3 */}
                    <div className={`flex items-center gap-4 transition-all duration-500 ${verificationStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${verificationStep >= 3 ? 'bg-green-500 border-green-500 text-black' : 'border-slate-500 text-slate-500'}`}>
                            {verificationStep >= 3 ? <CheckCircle className="w-5 h-5"/> : "3"}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-200">Decrypting Amount</div>
                            <div className="text-xs text-slate-500">Using your private key to view data...</div>
                        </div>
                    </div>
                </div>

                {verificationStep >= 3 && (
                    <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center animate-in zoom-in duration-300">
                        <div className="text-xs text-green-300 uppercase font-bold mb-1">Decrypted Amount</div>
                        <div className="text-2xl font-mono font-bold text-white">5,200 tDUST</div>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}