/* eslint-disable */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Lock, Terminal, Activity, FileText, Globe, Server, Eye, Download, 
  Loader2, X, ChevronLeft, LogOut, LogIn, Calendar, Hexagon
} from 'lucide-react';

// --- TypeScript 定義 ---
type UserRole = 'landing' | 'employer' | 'employee';
type WalletType = 'metamask' | 'eternl' | 'safe' | '';

// --- 初始模擬數據 ---
const EMPLOYEES = [
  { id: "emp01", name: "Alice", title: "Senior Dev", address: "0x71C...976F", base: 75000, allowance: 5000 },
  { id: "emp02", name: "Bob", title: "Product Lead", address: "0x3B2...1A9E", base: 90000, allowance: 8000 },
  { id: "emp03", name: "Charlie", title: "Designer", address: "0x8D4...5C2B", base: 55000, allowance: 3000 },
  { id: "emp04", name: "Aden", title: "Operation Intern", address: "0x9E3...4A21", base: 40000, allowance: 2000 }, // 🎉 Aden 登場！
];

// 為了展示完整流程，初始資料設為空
const INITIAL_DB: any[] = []; 

// --- 主程式 ---
export default function OnChainPayrollApp() {
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [payrollData, setPayrollData] = useState<any[]>([]); // 預設為空
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // 1. 網頁載入時，從 LocalStorage 讀取資料
  useEffect(() => {
    const savedDB = localStorage.getItem('payrollDB');
    if (savedDB) {
      setPayrollData(JSON.parse(savedDB));
    }
  }, []);

  // 2. 當薪資資料有變動時，自動存入 LocalStorage
  useEffect(() => {
    localStorage.setItem('payrollDB', JSON.stringify(payrollData));
  }, [payrollData]);

  // 新增薪資紀錄
  const addPayrollRecord = (record: any) => {
    setPayrollData(prev => [record, ...prev]);
  };

  // 將薪資狀態改為「已提領」
  const markAsWithdrawn = (id: number) => {
    setPayrollData(prev => prev.map(record => 
      record.id === id ? { ...record, status: 'Withdrawn' } : record
    ));
  };

  // 專為 Demo 設計的模擬錢包連接 (抓取官方資源圖示)
  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    
    setTimeout(() => {
      // 依據不同錢包給予不同的模擬地址
      if (type === 'safe') setWalletAddress("eth:0x4A2...MultiSig");
      else if (type === 'metamask') setWalletAddress("0x71C...976F");
      else setWalletAddress("addr_test1...EternlUser");
      
      setWalletType(type);
      setWalletConnected(true);
      setIsConnecting(false);
    }, 800);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletType('');
    setWalletAddress('');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    disconnectWallet();
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToLanding}>
          <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-2 rounded-lg"><Hexagon className="w-5 h-5 text-white" /></div>
          <div className="leading-tight hidden md:block"><div className="font-bold text-white text-lg tracking-wide">On-chain Payroll</div></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3 text-[10px] font-mono border-r border-white/10 pr-4">
            <div className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Privacy Network</div>
            <div className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Mainnet</div>
          </div>
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full border text-xs font-mono flex items-center gap-2 ${walletType === 'metamask' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : walletType === 'safe' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-300'}`}><span className="w-2 h-2 bg-green-400 rounded-full"></span>{walletAddress}</div>
              <button onClick={disconnectWallet} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition" title="Disconnect"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            currentView !== 'landing' && (
              <button onClick={() => setShowWalletModal(true)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2">{isConnecting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wallet className="w-4 h-4" />} Connect</button>
            )
          )}
        </div>
      </nav>

      <main className="relative z-10">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} />}
        {currentView === 'employer' && <EmployerView walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} onPaymentSuccess={addPayrollRecord} onNavigateBack={navigateToLanding} />}
        {currentView === 'employee' && <EmployeeView walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} payrollData={payrollData} onWithdraw={markAsWithdrawn} onLogout={navigateToLanding} />}
      </main>

      {/* 選擇錢包 Modal (已將 Logo 替換為官方圖片資源，並基於身分進行過濾) */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-white font-bold text-center mb-6 text-lg">Select Provider</h3>
            <div className="space-y-3">
              
              {/* 核心邏輯：只有在 Employer 視圖下才顯示 Safe 多簽選項 */}
              {currentView === 'employer' && (
                <>
                  <button onClick={() => connectWallet('safe')} className="w-full bg-emerald-900/10 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group">
                    {/* 使用 Safe 的官方圖示圖片 (抓取官方資源 URL) */}
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden p-1.5">
                      <img src="https://avatars.githubusercontent.com/u/102200823?s=200&v=4" alt="Safe" className="w-full h-full object-contain rounded-md" />
                    </div>
                    <div className="text-left"><div className="text-white font-bold group-hover:text-emerald-400 transition-colors">Safe (Multi-Sig)</div></div>
                  </button>
                  <div className="flex items-center gap-4 py-2"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Standard</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              {/* 雙方共用的一般錢包 (已砍掉描述) */}
              <button onClick={() => connectWallet('metamask')} className="w-full bg-white/5 hover:bg-orange-900/20 border border-white/5 hover:border-orange-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group">
                {/* 使用 MetaMask 的官方 Fox 圖片 (抓取官方資源 URL) */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-full h-full object-contain" />
                </div>
                <div className="text-left"><div className="text-white font-bold group-hover:text-[#F6851B] transition-colors">MetaMask</div></div>
              </button>
              
              <button onClick={() => connectWallet('eternl')} className="w-full bg-white/5 hover:bg-blue-900/20 border border-white/5 hover:border-blue-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group">
                {/* 使用 Eternl 的官方圖示圖片 (抓取官方資源 URL) */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-1.5">
                  <img src="https://avatars.githubusercontent.com/u/101235147?s=200&v=4" alt="Eternl" className="w-full h-full object-contain rounded-md" />
                </div>
                <div className="text-left"><div className="text-white font-bold group-hover:text-blue-400 transition-colors">Eternl</div></div>
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 首頁 (已拿掉特色標籤) ---
function LandingView({ onNavigate }: { onNavigate: (role: UserRole) => void }) {
  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
          Enterprise-Grade
        </span><br />
        On-Chain Payroll
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
        Empower your organization with secure, compliant, and confidential salary distribution. Experience the future of Web3 human resources.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button onClick={() => onNavigate('employer')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-cyan-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg shadow-cyan-900/10 hover:shadow-cyan-900/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 className="w-24 h-24 text-cyan-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform"><Server className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Employer Portal</h2>
            <p className="text-slate-400 text-sm mb-6">Manage compensation, select pay periods, and execute secure payouts.</p>
            <div className="inline-flex items-center text-cyan-400 text-sm font-bold group-hover:gap-2 transition-all">Launch Dashboard <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>
        <button onClick={() => onNavigate('employee')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User className="w-24 h-24 text-purple-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform"><Shield className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Employee Portal</h2>
            <p className="text-slate-400 text-sm mb-6">Securely log in to claim salary and download official PDF payslips.</p>
            <div className="inline-flex items-center text-purple-400 text-sm font-bold group-hover:gap-2 transition-all">Claim & Verify <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>
      </div>
    </div>
  );
}

// --- 雇主端 (已移除右側 Log，並修正返回鍵) ---
function EmployerView({ walletConnected, onConnect, onPaymentSuccess, onNavigateBack }: { walletConnected: boolean, onConnect: () => void, onPaymentSuccess: (record: any) => void, onNavigateBack: () => void }) {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [period, setPeriod] = useState(''); 
  const [bonus, setBonus] = useState(0);
  const [step, setStep] = useState(0); 
  const [showSuccess, setShowSuccess] = useState(false);

  const emp = EMPLOYEES.find(e => e.id === selectedEmpId);
  
  const laborFee = emp ? Math.floor(emp.base * 0.025) : 0;
  const healthFee = emp ? Math.floor(emp.base * 0.015) : 0;
  const taxFee = emp ? Math.floor((emp.base + emp.allowance + bonus) * 0.05) : 0;
  const totalNet = emp ? (emp.base + emp.allowance + bonus - laborFee - healthFee - taxFee) : 0;

  const handleExecute = () => {
    if (!walletConnected) { onConnect(); return; }
    setStep(1);
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3500);
    setTimeout(() => setStep(4), 5000);
    setTimeout(() => { 
        setStep(5); 
        setShowSuccess(true);
        const newRecord = {
            id: Date.now(),
            empId: selectedEmpId,
            period: period,
            status: 'Pending', // 剛發放時是 Pending 狀態
            hash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            details: { base: emp?.base, allowance: emp?.allowance, bonus: bonus, labor: laborFee, health: healthFee, tax: taxFee, net: totalNet }
        };
        onPaymentSuccess(newRecord);
    }, 6000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-[#111623] border border-green-500/50 p-8 rounded-3xl shadow-2xl text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-green-400"/></div>
                <h2 className="text-2xl font-bold text-white mb-2">Payroll Executed!</h2>
                <p className="text-slate-400 mb-6">Period: <span className="text-white font-bold">{period}</span><br/>Funds settled securely on-chain.</p>
                <button onClick={() => { setShowSuccess(false); setStep(0); setSelectedEmpId(''); setPeriod(''); setBonus(0); }} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold">Done</button>
            </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               {/* 返回鍵修正：使用 onNavigateBack，斷開錢包並回首頁 */}
               <div className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition cursor-pointer" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
               <div><h2 className="text-2xl font-bold text-white">Private Payroll Execution</h2><p className="text-slate-400 text-sm mt-1">Logic runs securely on-chain. Funds settle via Smart Contract.</p></div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> GDPR Compliant</div>
          </div>
          
          <div className="space-y-6">
            {!walletConnected && <button onClick={onConnect} className="w-full bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl flex items-center justify-center gap-2 text-cyan-400 font-bold hover:bg-cyan-900/30 transition"><Wallet className="w-5 h-5"/> Connect Wallet to Start</button>}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">1. Select Employee</label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500 cursor-pointer" value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)}>
                        <option value="">Choose...</option>
                        {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} - {e.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">2. Select Period</label>
                    <div className="relative">
                        <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500"/>
                        <Calendar className="absolute right-4 top-4 text-slate-500 w-5 h-5 pointer-events-none"/>
                    </div>
                </div>
            </div>

            {emp && (
              <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 animate-in zoom-in">
                <div className="mb-4"><div className="text-xs font-bold text-green-400 uppercase mb-2">Earnings</div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Base Salary</span><span className="text-white font-mono">{emp.base.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Allowance</span><span className="text-white font-mono">{emp.allowance.toLocaleString()}</span></div><div className="flex justify-between items-center text-sm pt-1 border-t border-white/5 mt-1"><span className="text-cyan-400">Bonus</span><input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-right text-white w-24 focus:border-cyan-500 outline-none"/></div></div>
                <div className="mb-4 pt-4 border-t border-white/5"><div className="text-xs font-bold text-red-400 uppercase mb-2">Deductions (Estimated)</div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Labor Ins. (2.5%)</span><span className="text-red-300 font-mono">-{laborFee.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Health Ins. (1.5%)</span><span className="text-red-300 font-mono">-{healthFee.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Income Tax (5%)</span><span className="text-red-300 font-mono">-{taxFee.toLocaleString()}</span></div></div>
                <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-white/10"><span className="text-white">Net Pay</span><span className="text-cyan-400">{totalNet.toLocaleString()} TWD</span></div>
              </div>
            )}
            <button onClick={handleExecute} disabled={!selectedEmpId || !period || (step > 0 && step < 5)} className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${(!selectedEmpId || !period) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : step === 5 ? 'bg-green-600 text-white' : step > 0 ? 'bg-indigo-600 text-white cursor-wait' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-900/20'}`}>
              {step === 0 && <><Activity className="w-5 h-5" /> Sign & Pay</>}
              {step > 0 && step < 5 && <><Loader2 className="w-5 h-5 animate-spin" /> {step === 1 ? 'Encrypting Data...' : step === 2 ? 'Generating ZK Proof...' : step === 3 ? 'Bridging to Network...' : 'Settling Funds...'}</>}
              {step === 5 && <><CheckCircle className="w-5 h-5" /> Paid</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 員工端 (已換成 TWD，單獨列示勞健稅，並加入三階段流程) ---
function EmployeeView({ walletConnected, onConnect, payrollData, onWithdraw, onLogout }: { walletConnected: boolean, onConnect: () => void, payrollData: any[], onWithdraw: (id: number) => void, onLogout: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  // 記錄哪些薪資已經被提領，以及提領中的動畫狀態
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleWithdraw = (id: number) => {
    setProcessingId(id);
    // 模擬區塊鏈交易處理時間 (2秒)，然後將資料庫狀態改為已提領
    setTimeout(() => {
      setProcessingId(null);
      onWithdraw(id); // 更新全域資料庫
    }, 2000);
  };

  // 狀態 1：還沒登入 (顯示帳號密碼輸入框)
  if (!isLoggedIn) {
    return (
        <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in zoom-in">
          <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl text-center shadow-xl relative">
            {/* 員工端也加上返回鍵，確保安全登出 */}
            <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white"><ChevronLeft className="w-6 h-6"/></button>
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400"><LogIn className="w-8 h-8"/></div>
            <h2 className="text-2xl font-bold text-white mb-6">Employee Login</h2>
            <form onSubmit={(e) => { e.preventDefault(); if (loginId) setIsLoggedIn(true); }} className="space-y-4">
              <select value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 cursor-pointer appearance-none">
                <option value="">Select User ID...</option>
                {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.id} ({e.name})</option>)}
              </select>
              <input type="password" placeholder="Password (any)" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"/>
              <button type="submit" disabled={!loginId} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-xl font-bold transition">Login to Portal</button>
            </form>
          </div>
        </div>
    );
  }

  // 狀態 2：已登入，但沒連錢包 (強制要求連錢包)
  if (isLoggedIn && !walletConnected) {
    return (
      <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in zoom-in">
        <div className="bg-[#111623] border border-orange-500/30 p-8 rounded-3xl text-center shadow-xl shadow-orange-900/10 relative">
          {/* 返回鍵修正：使用 onLogout，斷開回首頁 */}
          <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white"><ChevronLeft className="w-6 h-6"/></button>
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400"><Wallet className="w-8 h-8"/></div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
          <p className="text-slate-400 mb-8">Hello, {EMPLOYEES.find(e => e.id === loginId)?.name}! Please connect your Web3 wallet to verify your identity and claim your salary.</p>
          <button onClick={onConnect} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5"/> Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // 狀態 3：已登入，且已連錢包 (顯示薪資單或空畫面)
  const myPayslips = payrollData.filter(p => p.empId === loginId);

  const generatePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();
      const emp = EMPLOYEES.find(e => e.id === loginId);
      const d = selectedRecord.details;
      
      doc.setFontSize(20); doc.text("Decentralized Payroll System", 14, 22);
      doc.setFontSize(10); doc.text("Official Payment Receipt (GDPR Compliant)", 14, 28);
      doc.text(`Employee: ${emp?.name} (${emp?.title})`, 14, 40);
      doc.text(`Period: ${selectedRecord.period}`, 14, 46);
      doc.text(`Transaction Hash: ${selectedRecord.hash}`, 14, 52);

      (autoTable as any)(doc, {
        startY: 60, head: [['Description', 'Amount (TWD)']],
        body: [['Base Salary', d.base.toLocaleString()], ['Allowance', d.allowance.toLocaleString()], ['Bonus', d.bonus.toLocaleString()], ['Labor Insurance', `-${d.labor.toLocaleString()}`], ['Health Insurance', `-${d.health.toLocaleString()}`], ['Income Tax', `-${d.tax.toLocaleString()}`], ['NET PAYABLE', { content: d.net.toLocaleString(), styles: { fontStyle: 'bold', textColor: [0, 100, 0] } }]],
      });
      doc.save(`Payslip_${selectedRecord.period}.pdf`);
    } catch (err) { alert("PDF Generation Failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-3xl font-bold text-white">Welcome, {EMPLOYEES.find(e => e.id === loginId)?.name}</h2><p className="text-slate-400">Your Payroll Dashboard</p></div>
        {/* 安全登出按鈕：除了切換回首頁，同時斷開錢包 */}
        <button onClick={onLogout} className="text-xs text-slate-500 hover:text-white border-b border-slate-700 pb-1">Logout</button>
      </div>

      {myPayslips.length === 0 ? (
        <div className="bg-[#111623] border border-dashed border-white/20 p-12 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-500"><FileText className="w-8 h-8"/></div>
          <h3 className="text-xl font-bold text-white mb-2">No Salary Records Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Your employer hasn't executed any payroll for you yet. Once they do, it will appear here for you to claim.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myPayslips.map(record => {
            const isWithdrawn = record.status === 'Withdrawn';
            return (
              <div key={record.id} className="bg-[#111623] border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400"><FileText className="w-6 h-6"/></div>
                  <div><div className="text-white font-bold text-lg">{record.period} Payroll</div><div className="text-xs text-slate-500 font-mono">Proof: {record.hash}</div></div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white font-mono">{record.details.net.toLocaleString()}</div>
                  <div className={`text-xs uppercase font-bold mt-1 ${isWithdrawn ? 'text-green-500' : 'text-amber-500'}`}>
                    {isWithdrawn ? 'Withdrawn' : 'Ready to Claim'}
                  </div>
                </div>
                <div className="ml-6 border-l border-white/10 pl-6">
                  <button onClick={() => { setSelectedRecord(record); setShowDetails(true); }} className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-900/20">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden relative shadow-2xl">
             <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
             {/* 提領成功後的頂部 banner (增加了圖示和文字) */}
             <div className="bg-indigo-900/30 p-6 border-b border-indigo-500/20">
               {selectedRecord.status === 'Withdrawn' ? (
                 <div className="flex items-center gap-2 text-green-400 font-bold mb-1 animate-in zoom-in"><CheckCircle className="w-5 h-5" /> Successfully Withdrawn</div>
               ) : (
                 <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1"><Shield className="w-5 h-5" /> Verified securely</div>
               )}
               <h3 className="text-2xl font-bold text-white">Payslip: {selectedRecord.period}</h3>
             </div>
             <div className="p-8 space-y-6">
                <div className="bg-slate-900 rounded-xl p-4 border border-white/5"><h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Selective Disclosure View</h4><div className="space-y-3"><div className="flex justify-between"><span className="text-slate-300">Source Origin</span><span className="text-green-400 font-mono">Verified (ZK-Proof)</span></div><div className="flex justify-between"><span className="text-slate-300">Compliance</span><span className="text-green-400 font-mono">GDPR Compliant</span></div></div></div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-400"><span>Base Salary</span><span>{selectedRecord.details.base.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>Allowance</span><span>{selectedRecord.details.allowance.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>Bonus (Encrypted)</span><span>{selectedRecord.details.bonus.toLocaleString()}</span></div>
                  <div className="h-px bg-white/10 my-2" />
                  
                  {/* 將扣除項目獨立分開列示 (並更換文字) */}
                  <div className="flex justify-between text-sm text-red-300"><span>勞工保險 (勞保)</span><span>-{selectedRecord.details.labor.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-red-300"><span>全民健康保險 (健保)</span><span>-{selectedRecord.details.health.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-red-300"><span>個人所得稅 (所得稅)</span><span>-{selectedRecord.details.tax.toLocaleString()}</span></div>
                  
                  {/* 幣別改為 TWD */}
                  <div className="flex justify-between text-xl font-bold text-white pt-2"><span>Net Pay</span><span className="text-cyan-400">{selectedRecord.details.net.toLocaleString()} TWD</span></div>
                </div>

                {/* 重新設計按鈕區 (並排放置提領與下載按鈕) */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button 
                    onClick={() => handleWithdraw(selectedRecord.id)} 
                    disabled={selectedRecord.status === 'Withdrawn' || processingId === selectedRecord.id}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${selectedRecord.status === 'Withdrawn' ? 'bg-green-600/20 text-green-400 cursor-not-allowed border border-green-500/30' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}`}
                  >
                    {processingId === selectedRecord.id ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedRecord.status === 'Withdrawn' ? <CheckCircle className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                    {processingId === selectedRecord.id ? 'Processing...' : selectedRecord.status === 'Withdrawn' ? 'Withdrawn' : 'Withdraw Salary'}
                  </button>
                  <button onClick={generatePDF} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                    <Download className="w-4 h-4" /> PDF Payslip
                  </button>
                </div>

             </div>
          </div>
        </div>
      )}
    </div>
  );
}