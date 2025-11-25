'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Lock, Terminal, Activity, FileText, Globe, Server, Eye, EyeOff, 
  Download, Loader2, X, ChevronLeft, LogOut, Calculator, LogIn
} from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// --- TypeScript 定義 ---
declare global {
  interface Window {
    cardano?: any;
  }
}

type UserRole = 'landing' | 'employer' | 'employee';
type WalletType = 'lace' | 'eternl' | '';

// --- 模擬數據 ---
const EMPLOYEES = [
  { id: "emp01", name: "Alice", title: "Senior Dev", address: "addr_test1...Alice", base: 75000, allowance: 5000 },
  { id: "emp02", name: "Bob", title: "Product Lead", address: "addr_test1...Bob", base: 90000, allowance: 8000 },
  { id: "emp03", name: "Charlie", title: "Designer", address: "addr_test1...Charlie", base: 55000, allowance: 3000 },
];

const PAYROLL_DB = [
  { 
    id: 101, empId: "emp01", period: '2025-10', status: 'Settled', hash: 'zk-7f...9c',
    details: { base: 75000, allowance: 5000, bonus: 8000, labor: 1875, health: 1125, tax: 4300, net: 80700 }
  },
  { 
    id: 102, empId: "emp01", period: '2025-11', status: 'Pending', hash: 'zk-3b...1a',
    details: { base: 75000, allowance: 5000, bonus: 0, labor: 1875, health: 1125, tax: 3900, net: 73100 }
  },
  { 
    id: 201, empId: "emp02", period: '2025-11', status: 'Pending', hash: 'zk-9a...2b',
    details: { base: 90000, allowance: 8000, bonus: 0, labor: 2250, health: 1350, tax: 4720, net: 89680 }
  },
];

// --- 主程式 ---
export default function OnChainPayrollApp() {
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  
  // 狀態提升至頂層，確保切換頁面不中斷
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    if (typeof window === 'undefined') return;
    
    // 模擬連接成功
    setTimeout(() => {
      setWalletAddress(type === 'lace' ? "addr_test1...LaceUser" : "addr_test1...EternlUser");
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

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-2 rounded-lg"><Shield className="w-5 h-5 text-white" /></div>
          <div className="leading-tight hidden md:block"><div className="font-bold text-white tracking-wide">On-chain Payroll</div><div className="text-[10px] text-cyan-400 font-mono">ZK Privacy System</div></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3 text-[10px] font-mono border-r border-white/10 pr-4">
            <div className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Midnight DevNet</div>
            <div className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Cardano Testnet</div>
          </div>
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full border text-xs font-mono flex items-center gap-2 ${walletType === 'lace' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' : 'border-orange-500/30 bg-orange-500/10 text-orange-300'}`}><span className="w-2 h-2 bg-green-400 rounded-full"></span>{walletAddress}</div>
              <button onClick={disconnectWallet} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition" title="Disconnect"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => setShowWalletModal(true)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2">{isConnecting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wallet className="w-4 h-4" />} Connect</button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} />}
        {currentView === 'employer' && <EmployerView walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} />}
        {currentView === 'employee' && <EmployeeView walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} />}
      </main>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-white font-bold text-center mb-6 text-lg">Select Wallet Provider</h3>
            <div className="space-y-3">
              <button onClick={() => connectWallet('lace')} className="w-full bg-white/5 hover:bg-cyan-900/20 border border-white/5 hover:border-cyan-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group"><div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">L</div><div className="text-left"><div className="text-white font-bold group-hover:text-cyan-400">Lace</div><div className="text-xs text-slate-500">IOG Official</div></div></button>
              <button onClick={() => connectWallet('eternl')} className="w-full bg-white/5 hover:bg-orange-900/20 border border-white/5 hover:border-orange-500/50 p-4 rounded-xl flex items-center gap-4 transition-all group"><div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">E</div><div className="text-left"><div className="text-white font-bold group-hover:text-orange-400">Eternl</div><div className="text-xs text-slate-500">Community Favorite</div></div></button>
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
    <div className="max-w-6xl mx-auto p-6 pt-20 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-8">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
        <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Catalyst Project ID: 111124</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Selective Disclosure</span><br />Payroll System</h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">Midnight ZK contracts execute private salary logic & generate proofs.<br />Cardano settles the funds.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button onClick={() => onNavigate('employer')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-cyan-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 className="w-24 h-24 text-cyan-500" /></div>
          <div className="relative z-10"><div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform"><Server className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-white mb-2">Employer Portal</h2><p className="text-slate-400 text-sm mb-6">Execute private logic, generate ZK proofs.</p><div className="inline-flex items-center text-cyan-400 text-sm font-bold group-hover:gap-2 transition-all">Launch Dashboard <ChevronRight className="w-4 h-4 ml-1" /></div></div>
        </button>
        <button onClick={() => onNavigate('employee')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User className="w-24 h-24 text-purple-500" /></div>
          <div className="relative z-10"><div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform"><Shield className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-white mb-2">Employee Portal</h2><p className="text-slate-400 text-sm mb-6">Login, Verify income & Download PDF.</p><div className="inline-flex items-center text-purple-400 text-sm font-bold group-hover:gap-2 transition-all">Claim & Verify <ChevronRight className="w-4 h-4 ml-1" /></div></div>
        </button>
      </div>
    </div>
  );
}

// --- 雇主端 (包含自動計算 + 成功彈窗 + 修復按鈕) ---
function EmployerView({ walletConnected, onConnect }: { walletConnected: boolean, onConnect: () => void }) {
  const [selectedEmpId, setSelectedEmpId] = useState('');
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
    }, 7000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      {/* Success Modal */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-[#111623] border border-green-500/50 p-8 rounded-3xl shadow-2xl text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-green-400"/></div>
                <h2 className="text-2xl font-bold text-white mb-2">Payroll Executed!</h2>
                <p className="text-slate-400 mb-6">Funds settled via Midnight & Cardano.</p>
                <button onClick={() => { setShowSuccess(false); setStep(0); }} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold">Done</button>
            </div>
        </div>
      )}

      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               {/* 返回首頁按鈕 */}
               <div className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition cursor-pointer" onClick={() => window.location.reload()}><ChevronLeft className="text-slate-400"/></div>
               <div><h2 className="text-2xl font-bold text-white">Private Payroll Execution</h2><p className="text-slate-400 text-sm mt-1">Logic runs on Midnight. Funds settle on Cardano.</p></div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> GDPR Compliant</div>
          </div>
          
          <div className="space-y-6">
            {/* Wallet Connection Prompt in View */}
            {!walletConnected && (
               <button onClick={onConnect} className="w-full bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl flex items-center justify-center gap-2 text-cyan-400 font-bold hover:bg-cyan-900/30 transition">
                  <Wallet className="w-5 h-5"/> Connect Wallet to Start
               </button>
            )}

            <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Select Employee</label><select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-500 cursor-pointer" onChange={(e) => setSelectedEmpId(e.target.value)}><option value="">Choose Employee...</option>{EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} - {e.title}</option>)}</select></div>
            
            {emp && (
              <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 animate-in zoom-in">
                <div className="mb-4"><div className="text-xs font-bold text-green-400 uppercase mb-2">Earnings</div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Base Salary</span><span className="text-white font-mono">{emp.base.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Allowance</span><span className="text-white font-mono">{emp.allowance.toLocaleString()}</span></div><div className="flex justify-between items-center text-sm pt-1 border-t border-white/5 mt-1"><span className="text-cyan-400">Bonus</span><input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-right text-white w-24 focus:border-cyan-500 outline-none"/></div></div>
                <div className="mb-4 pt-4 border-t border-white/5"><div className="text-xs font-bold text-red-400 uppercase mb-2">Deductions (Estimated)</div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Labor Ins. (2.5%)</span><span className="text-red-300 font-mono">-{laborFee.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Health Ins. (1.5%)</span><span className="text-red-300 font-mono">-{healthFee.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-1"><span className="text-slate-400">Income Tax (5%)</span><span className="text-red-300 font-mono">-{taxFee.toLocaleString()}</span></div></div>
                <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-white/10"><span className="text-white">Net Pay</span><span className="text-cyan-400">{totalNet.toLocaleString()} tDUST</span></div>
              </div>
            )}
            <button onClick={handleExecute} disabled={!selectedEmpId || (step > 0 && step < 5)} className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${!selectedEmpId ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : step === 5 ? 'bg-green-600 text-white' : step > 0 ? 'bg-indigo-600 text-white cursor-wait' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-900/20'}`}>{step === 0 && <><Activity className="w-5 h-5" /> Sign & Pay</>}{step > 0 && step < 5 && <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>}{step === 5 && <><CheckCircle className="w-5 h-5" /> Paid</>}</button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5"><div className="bg-[#05070a] border border-slate-800 rounded-3xl p-6 h-full min-h-[400px] flex flex-col font-mono text-xs shadow-2xl relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500" /><div className="flex items-center gap-2 text-slate-500 border-b border-white/5 pb-4 mb-4"><Terminal className="w-4 h-4" /><span>System Architecture Log</span></div><div className="space-y-4 flex-1 overflow-y-auto">{step === 0 && <div className="text-slate-600 italic">Waiting for command...</div>}{step >= 1 && <div className="animate-in slide-in-from-left-4 fade-in duration-500"><div className="text-indigo-400 font-bold mb-1">[Midnight Layer]</div><div className="text-slate-300">Encrypting sensitive fields...</div></div>}{step >= 2 && <div className="animate-in slide-in-from-left-4 fade-in duration-500 pt-2 border-t border-white/5"><div className="text-purple-400 font-bold mb-1">[ZK Circuit]</div><div className="text-slate-300">Generating Zero-Knowledge Proof...</div></div>}{step >= 3 && <div className="animate-in slide-in-from-left-4 fade-in duration-500 pt-2 border-t border-white/5"><div className="text-orange-400 font-bold mb-1 flex items-center gap-2">[Relay Oracle] <Globe className="w-3 h-3"/></div><div className="text-slate-300">Bridging Proof to Cardano Settlement Layer...</div></div>}{step >= 4 && <div className="animate-in slide-in-from-left-4 fade-in duration-500 pt-2 border-t border-white/5"><div className="text-cyan-400 font-bold mb-1">[Cardano Layer]</div><div className="text-slate-300">Verifying Proof & Settling Funds...</div><div className="text-green-400 mt-1 font-bold">{`> Transaction Confirmed!`}</div></div>}</div></div></div>
    </div>
  );
}

// --- 員工端 (包含登入 + PDF) ---
function EmployeeView({ walletConnected, onConnect }: { walletConnected: boolean, onConnect: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (EMPLOYEES.some(e => e.id === loginId)) setIsLoggedIn(true);
    else alert("Invalid ID. Try 'emp01'");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const emp = EMPLOYEES.find(e => e.id === loginId);
    const d = selectedRecord.details;
    
    doc.setFontSize(20);
    doc.text("Midnight Payroll System", 14, 22);
    doc.setFontSize(10);
    doc.text("Official Payment Receipt (GDPR Compliant)", 14, 28);
    
    doc.text(`Employee: ${emp?.name} (${emp?.title})`, 14, 40);
    doc.text(`Period: ${selectedRecord.period}`, 14, 46);
    doc.text(`Transaction Hash: ${selectedRecord.hash}`, 14, 52);

    autoTable(doc, {
      startY: 60,
      head: [['Description', 'Amount (tDUST)']],
      body: [
        ['Base Salary', d.base.toLocaleString()],
        ['Allowance', d.allowance.toLocaleString()],
        ['Bonus', d.bonus.toLocaleString()],
        ['Labor Insurance', `-${d.labor.toLocaleString()}`],
        ['Health Insurance', `-${d.health.toLocaleString()}`],
        ['Income Tax', `-${d.tax.toLocaleString()}`],
        ['NET PAYABLE', { content: d.net.toLocaleString(), styles: { fontStyle: 'bold', textColor: [0, 100, 0] } }],
      ],
    });
    doc.save(`Payslip_${selectedRecord.period}.pdf`);
  };

  if (!isLoggedIn) {
    return (
        <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in zoom-in">
            <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl text-center">
                <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400"><LogIn className="w-8 h-8"/></div>
                <h2 className="text-2xl font-bold text-white mb-6">Employee Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="text" placeholder="Employee ID (try 'emp01')" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"/>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition">Login to View Payslips</button>
                </form>
            </div>
        </div>
    );
  }

  const myPayslips = PAYROLL_DB.filter(p => p.empId === loginId);

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-3xl font-bold text-white">Welcome, {EMPLOYEES.find(e => e.id === loginId)?.name}</h2><p className="text-slate-400">My Payslips</p></div>
        <button onClick={() => setIsLoggedIn(false)} className="text-xs text-slate-500 hover:text-white border-b border-slate-700 pb-1">Logout</button>
      </div>
      <div className="space-y-4">
        {myPayslips.map(record => (
          <div key={record.id} className="bg-[#111623] border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all">
            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400"><FileText className="w-6 h-6"/></div><div><div className="text-white font-bold text-lg">{record.period} Payroll</div><div className="text-xs text-slate-500 font-mono">Proof: {record.hash}</div></div></div>
            <div className="text-right">{walletConnected ? <div className="text-2xl font-bold text-white font-mono">{record.details.net.toLocaleString()}</div> : <div className="text-2xl font-bold text-slate-600 blur-sm select-none">******</div>}<div className={`text-xs uppercase font-bold mt-1 ${record.status === 'Settled' ? 'text-green-500' : 'text-amber-500'}`}>{record.status}</div></div>
            <div className="ml-6 border-l border-white/10 pl-6"><button onClick={() => { if (!walletConnected) { onConnect(); } else { setSelectedRecord(record); setShowDetails(true); } }} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">{walletConnected ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}{walletConnected ? 'Reveal' : 'Decrypt'}</button></div>
          </div>
        ))}
      </div>
      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden relative shadow-2xl">
             <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
             <div className="bg-indigo-900/30 p-6 border-b border-indigo-500/20"><div className="flex items-center gap-2 text-indigo-400 font-bold mb-1"><Shield className="w-5 h-5" /> Verified by Midnight</div><h3 className="text-2xl font-bold text-white">Payslip: {selectedRecord.period}</h3></div>
             <div className="p-8 space-y-6">
                <div className="bg-slate-900 rounded-xl p-4 border border-white/5"><h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Selective Disclosure View</h4><div className="space-y-3"><div className="flex justify-between"><span className="text-slate-300">Source Origin</span><span className="text-green-400 font-mono">Verified (ZK-Proof)</span></div><div className="flex justify-between"><span className="text-slate-300">Compliance</span><span className="text-green-400 font-mono">GDPR Compliant</span></div></div></div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm text-slate-400"><span>Base Salary</span><span>{selectedRecord.details.base.toLocaleString()}</span></div>
                   <div className="flex justify-between text-sm text-slate-400"><span>Allowance</span><span>{selectedRecord.details.allowance.toLocaleString()}</span></div>
                   <div className="flex justify-between text-sm text-slate-400"><span>Bonus</span><span>{selectedRecord.details.bonus.toLocaleString()}</span></div>
                   <div className="h-px bg-white/10 my-2" />
                   <div className="flex justify-between text-sm text-red-300"><span>Labor/Health/Tax</span><span>-{(selectedRecord.details.labor + selectedRecord.details.health + selectedRecord.details.tax).toLocaleString()}</span></div>
                   <div className="flex justify-between text-xl font-bold text-white"><span>Net Pay</span><span className="text-cyan-400">{selectedRecord.details.net.toLocaleString()} tDUST</span></div>
                </div>
                <button onClick={generatePDF} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download PDF Payslip</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}