/* eslint-disable */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Lock, Terminal, Activity, FileText, Globe, Server, Eye, Download, 
  Loader2, X, ChevronLeft, LogOut, LogIn, Calendar, Hexagon, BadgeCheck
} from 'lucide-react';

// --- TypeScript 定義 ---
type UserRole = 'landing' | 'employer' | 'employee';
type WalletType = 'metamask' | 'eternl' | 'safe' | '';

// --- 初始模擬數據 ---
const EMPLOYEES = [
  { id: "Aden", name: "Aden", title: "Operation Intern", address: "0x9E3...4A21", base: 40000, allowance: 2000 },
  { id: "emp01", name: "Alice", title: "Senior Dev", address: "0x71C...976F", base: 75000, allowance: 5000 },
  { id: "emp02", name: "Bob", title: "Product Lead", address: "0x3B2...1A9E", base: 90000, allowance: 8000 },
];

// --- 主程式 ---
export default function OnChainPayrollApp() {
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [payrollData, setPayrollData] = useState<any[]>([]); 
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const savedDB = localStorage.getItem('payrollDB');
    if (savedDB) {
      setPayrollData(JSON.parse(savedDB));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('payrollDB', JSON.stringify(payrollData));
  }, [payrollData]);

  const addPayrollRecord = (record: any) => {
    setPayrollData(prev => [record, ...prev]);
  };

  const markAsWithdrawn = (id: number) => {
    setPayrollData(prev => prev.map(record => 
      record.id === id ? { ...record, status: 'Withdrawn' } : record
    ));
  };

  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    
    setTimeout(() => {
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

      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-white font-bold text-center mb-6 text-lg">Select Provider</h3>
            <div className="space-y-3">
              {currentView === 'employer' && (
                <>
                  <button onClick={() => connectWallet('safe')} className="w-full bg-emerald-900/10 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center overflow-hidden p-1">
                      {/* 使用你提供的 Safe 官方圖示 */}
                      <img src="https://raw.githubusercontent.com/safe-global/safe-brand-assets/main/Logos/Safe_Logomark_Green.png" alt="Safe" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left"><div className="text-white font-bold group-hover:text-emerald-400 transition-colors">Safe (Multi-Sig)</div></div>
                  </button>
                  <div className="flex items-center gap-4 py-2"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Standard</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              <button onClick={() => connectWallet('metamask')} className="w-full bg-white/5 hover:bg-orange-900/20 border border-white/5 hover:border-orange-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-full h-full object-contain" />
                </div>
                <div className="text-left"><div className="text-white font-bold group-hover:text-[#F6851B] transition-colors">MetaMask</div></div>
              </button>
              
              <button onClick={() => connectWallet('eternl')} className="w-full bg-white/5 hover:bg-blue-900/20 border border-white/5 hover:border-blue-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group">
                <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center p-1 overflow-hidden">
                  {/* 使用你提供的 Eternl 官方圖示 */}
                  <img src="https://avatars.githubusercontent.com/u/101235147?s=200&v=4" alt="Eternl" className="w-full h-full object-contain rounded-lg" />
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

// --- 首頁 ---
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

// --- 雇主端 ---
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
            status: 'Pending', 
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
               <div className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition cursor-pointer" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
               <div><h2 className="text-2xl font-bold text-white">Private Payroll Execution</h2><p className="text-slate-400 text-sm mt-1">Securely manage on-chain disbursements.</p></div>
            </div>
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

// --- 員工端 (已移除下拉式選單，改為手動輸入 Aden 登入，且清理薪資單介面) ---
function EmployeeView({ walletConnected, onConnect, payrollData, onWithdraw, onLogout }: { walletConnected: boolean, onConnect: () => void, payrollData: any[], onWithdraw: (id: number) => void, onLogout: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 規定必須輸入 Aden 才能進入
    if (loginId === 'Aden') setIsLoggedIn(true);
    else alert("Invalid Account ID. (Try 'Aden')");
  };

  const handleWithdrawAction = (id: number) => {
    setProcessingId(id);
    setTimeout(() => {
      setProcessingId(null);
      onWithdraw(id); 
    }, 2500);
  };

  if (!isLoggedIn) {
    return (
        <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in zoom-in">
          <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl text-center shadow-xl relative">
            <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors"><ChevronLeft className="w-6 h-6"/></button>
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400"><LogIn className="w-8 h-8"/></div>
            <h2 className="text-2xl font-bold text-white mb-6">Employee Portal Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* 改回手動輸入框，增加擬真感 */}
              <input 
                type="text" 
                placeholder="Account ID (e.g. Aden)" 
                value={loginId} 
                onChange={e => setLoginId(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
              />
              <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all"/>
              <button type="submit" disabled={!loginId} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-900/20">Login</button>
            </form>
          </div>
        </div>
    );
  }

  if (isLoggedIn && !walletConnected) {
    return (
      <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in zoom-in">
        <div className="bg-[#111623] border border-orange-500/30 p-8 rounded-3xl text-center shadow-xl shadow-orange-900/10 relative">
          <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white"><ChevronLeft className="w-6 h-6"/></button>
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400"><Wallet className="w-8 h-8"/></div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Verification</h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">Hello, {loginId}! Please connect your personal Web3 wallet to verify the digital signature and unlock your salary claim.</p>
          <button onClick={onConnect} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20">
            <Wallet className="w-5 h-5"/> Connect Standard Wallet
          </button>
        </div>
      </div>
    );
  }

  const myRecords = payrollData.filter(p => p.empId === loginId);

  const generatePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();
      const d = selectedRecord.details;
      doc.setFontSize(20); doc.text("On-Chain Payroll System", 14, 22);
      doc.setFontSize(10); doc.text("Official Payment Receipt", 14, 30);
      doc.text(`Employee: Aden`, 14, 42);
      doc.text(`Period: ${selectedRecord.period}`, 14, 48);
      doc.text(`Hash: ${selectedRecord.hash}`, 14, 54);
      (autoTable as any)(doc, {
        startY: 62, head: [['Description', 'Amount (TWD)']],
        body: [['Base Salary', d.base.toLocaleString()], ['Allowance', d.allowance.toLocaleString()], ['Bonus', d.bonus.toLocaleString()], ['Labor Insurance', `-${d.labor.toLocaleString()}`], ['Health Insurance', `-${d.health.toLocaleString()}`], ['Income Tax', `-${d.tax.toLocaleString()}`], ['TOTAL NET', { content: d.net.toLocaleString(), styles: { fontStyle: 'bold' } }]],
      });
      doc.save(`Aden_Payslip_${selectedRecord.period}.pdf`);
    } catch (err) { alert("PDF Generation Failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-3xl font-bold text-white tracking-tight">Welcome, {loginId}</h2><p className="text-slate-500 text-sm mt-1 tracking-wide">Operation Intern | Payroll Portal</p></div>
        <button onClick={onLogout} className="text-xs text-slate-500 hover:text-white border-b border-slate-700 pb-1 transition-all">Secure Logout</button>
      </div>

      {myRecords.length === 0 ? (
        <div className="bg-[#111623] border border-dashed border-white/10 p-16 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mb-4 text-slate-600"><FileText className="w-8 h-8"/></div>
          <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">No new salary disbursements detected for your account at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myRecords.map(record => {
            const isWithdrawn = record.status === 'Withdrawn';
            return (
              <div key={record.id} className="bg-[#111623] border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-white/15 transition-all group shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors"><FileText className="w-6 h-6"/></div>
                  <div><div className="text-white font-bold text-lg">{record.period} Compensation</div><div className="text-[10px] text-slate-500 font-mono tracking-tighter mt-0.5">TxID: {record.hash}</div></div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white font-mono">{record.details.net.toLocaleString()}</div>
                  <div className={`text-[10px] uppercase font-black mt-1 tracking-widest ${isWithdrawn ? 'text-green-500' : 'text-amber-500'}`}>
                    {isWithdrawn ? 'Disbursed' : 'Ready to Claim'}
                  </div>
                </div>
                <div className="ml-6 border-l border-white/5 pl-6">
                  <button onClick={() => { setSelectedRecord(record); setShowDetails(true); }} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
                    <Eye className="w-4 h-4" /> Review & Claim
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden relative shadow-2xl">
             <button onClick={() => setShowDetails(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"><X /></button>
             
             {/* 頂部橫幅：根據提領狀態切換 */}
             <div className="bg-indigo-900/20 p-8 border-b border-white/5">
               {selectedRecord.status === 'Withdrawn' ? (
                 <div className="flex items-center gap-3 text-green-400 font-bold mb-1 animate-in zoom-in slide-in-from-bottom-2 duration-500">
                    <BadgeCheck className="w-6 h-6" /> 
                    <span className="text-lg">Salary Claimed Successfully</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-3 text-indigo-400 font-bold mb-1">
                    <Shield className="w-6 h-6" /> 
                    <span className="text-lg tracking-tight">Verified Digital Payslip</span>
                 </div>
               )}
               <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{selectedRecord.period} Period</h3>
             </div>

             <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-400"><span>Base Salary</span><span className="text-white font-mono">{selectedRecord.details.base.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>Allowances</span><span className="text-white font-mono">{selectedRecord.details.allowance.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>Bonus Payments</span><span className="text-white font-mono">{selectedRecord.details.bonus.toLocaleString()}</span></div>
                  <div className="h-px bg-white/5 my-4" />
                  <div className="flex justify-between text-sm text-red-400/80 italic"><span>Labor Insurance (勞保)</span><span className="font-mono">-{selectedRecord.details.labor.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-red-400/80 italic"><span>Health Insurance (健保)</span><span className="font-mono">-{selectedRecord.details.health.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-red-400/80 italic"><span>Personal Income Tax (所得稅)</span><span className="font-mono">-{selectedRecord.details.tax.toLocaleString()}</span></div>
                  <div className="flex justify-between text-2xl font-black text-white pt-6 border-t border-white/5 mt-4">
                    <span className="tracking-tighter">TOTAL NET PAY</span>
                    <span className="text-cyan-400 font-mono">{selectedRecord.details.net.toLocaleString()} TWD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button 
                    onClick={() => handleWithdrawAction(selectedRecord.id)} 
                    disabled={selectedRecord.status === 'Withdrawn' || processingId === selectedRecord.id}
                    className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${selectedRecord.status === 'Withdrawn' ? 'bg-green-500/10 text-green-500 cursor-not-allowed border border-green-500/20' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-900/20'}`}
                  >
                    {processingId === selectedRecord.id ? <Loader2 className="w-5 h-5 animate-spin" /> : selectedRecord.status === 'Withdrawn' ? <CheckCircle className="w-5 h-5 animate-bounce" /> : <Wallet className="w-5 h-5" />}
                    {processingId === selectedRecord.id ? 'Processing...' : selectedRecord.status === 'Withdrawn' ? 'Claimed' : 'Withdraw Salary'}
                  </button>
                  <button onClick={generatePDF} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/5">
                    <Download className="w-5 h-5" /> Download PDF
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}