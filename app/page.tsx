/* eslint-disable */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Terminal, Activity, FileText, Globe, Server, Eye, Download, 
  Loader2, X, ChevronLeft, LogOut, LogIn, Calendar, Hexagon, BadgeCheck
} from 'lucide-react';

// --- TypeScript Definitions ---
type UserRole = 'landing' | 'employer' | 'employee';
type WalletType = 'metamask' | 'eternl' | 'safe' | '';

// --- Mock Data ---
const EMPLOYEES = [
  { id: "Aden", name: "Aden", title: "Operation Intern", address: "0x9E3...4A21", base: 40000, allowance: 2000 },
  { id: "emp01", name: "Alice", title: "Senior Dev", address: "0x71C...976F", base: 75000, allowance: 5000 },
  { id: "emp02", name: "Bob", title: "Product Lead", address: "0x3B2...1A9E", base: 90000, allowance: 8000 },
];

export default function OnChainPayrollApp() {
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [payrollData, setPayrollData] = useState<any[]>([]); 
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);

  useEffect(() => {
    const savedDB = localStorage.getItem('payrollDB');
    if (savedDB) setPayrollData(JSON.parse(savedDB));
  }, []);

  useEffect(() => {
    localStorage.setItem('payrollDB', JSON.stringify(payrollData));
  }, [payrollData]);

  const addPayrollRecord = (record: any) => setPayrollData(prev => [record, ...prev]);
  const updatePayrollRecord = (updatedRecord: any) => setPayrollData(prev => prev.map(record => record.id === updatedRecord.id ? updatedRecord : record));
  const markAsWithdrawn = (id: number) => setPayrollData(prev => prev.map(record => record.id === id ? { ...record, status: 'Claimed' } : record));

  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    setTimeout(() => {
      if (type === 'safe') setWalletAddress("eth:0x4A2...MultiSig");
      else if (type === 'metamask') setWalletAddress("0x71C...976F");
      else setWalletAddress("addr_test1...User");
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
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20 relative">
      {/* Global Alert Modal */}
      {duplicateAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-amber-500/30 w-full max-w-sm rounded-2xl p-8 shadow-2xl text-center">
            <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">System Alert</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{duplicateAlert}</p>
            <button onClick={() => setDuplicateAlert(null)} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold transition">Dismiss</button>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToLanding}>
          <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-2 rounded-lg"><Hexagon className="w-5 h-5 text-white" /></div>
          <div className="font-bold text-white text-lg tracking-wide">On-chain Payroll</div>
        </div>
        <div className="flex items-center gap-4">
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>{walletAddress}
              </div>
              <button onClick={disconnectWallet} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            currentView !== 'landing' && (
              <button onClick={() => setShowWalletModal(true)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2">
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wallet className="w-4 h-4" />} Connect Wallet
              </button>
            )
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} />}
        {currentView === 'employer' && <EmployerView payrollData={payrollData} walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} onPaymentSuccess={addPayrollRecord} onPaymentUpdate={updatePayrollRecord} onSetAlert={setDuplicateAlert} onNavigateBack={navigateToLanding} />}
        {currentView === 'employee' && <EmployeeView walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} payrollData={payrollData} onWithdraw={markAsWithdrawn} onLogout={navigateToLanding} />}
      </main>

      {/* Wallet Selection Modal (Role-Based Logic) */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-white font-bold text-center mb-6 text-lg">Select Provider</h3>
            <div className="space-y-3">
              
              {/* Employer ONLY: Safe Multi-Sig */}
              {currentView === 'employer' && (
                <>
                  <button onClick={() => connectWallet('safe')} className="w-full bg-emerald-900/10 hover:bg-emerald-900/30 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-[#111623] flex items-center justify-center overflow-hidden border border-emerald-500/30 p-1">
                      <img src="/safe.png" alt="Safe" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left font-bold text-white group-hover:text-emerald-400 transition-colors">Safe (Multi-Sig)</div>
                  </button>
                  <div className="flex items-center gap-4 py-1"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-500 font-bold uppercase">Standard</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              {/* Shared: MetaMask & Eternl */}
              <button onClick={() => connectWallet('metamask')} className="w-full bg-white/5 hover:bg-orange-900/20 border border-white/5 p-4 rounded-xl flex items-center gap-4 transition-all group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center p-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-full h-full object-contain" />
                </div>
                <div className="text-left font-bold text-white group-hover:text-[#F6851B] transition-colors">MetaMask</div>
              </button>
              
              <button onClick={() => connectWallet('eternl')} className="w-full bg-white/5 hover:bg-blue-900/20 border border-white/5 p-4 rounded-xl flex items-center gap-4 transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#111623] flex items-center justify-center overflow-hidden border border-blue-500/30 p-0.5">
                  <img src="/eternl.png" alt="Eternl" className="w-full h-full object-contain rounded-md" />
                </div>
                <div className="text-left font-bold text-white group-hover:text-blue-400 transition-colors">Eternl</div>
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Landing View ---
function LandingView({ onNavigate }: { onNavigate: (role: UserRole) => void }) {
  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Enterprise-Grade</span><br />On-Chain Payroll
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">Empower your organization with secure, compliant, and confidential salary distribution. Experience the future of Web3 human resources.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button onClick={() => onNavigate('employer')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-cyan-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 className="w-24 h-24 text-cyan-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform"><Server className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Employer Portal</h2>
            <p className="text-slate-400 text-sm mb-6">Manage compensation and execute secure payouts.</p>
            <div className="inline-flex items-center text-cyan-400 text-sm font-bold group-hover:gap-2 transition-all">Launch Dashboard <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>
        <button onClick={() => onNavigate('employee')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User className="w-24 h-24 text-purple-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform"><Shield className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Employee Portal</h2>
            <p className="text-slate-400 text-sm mb-6">Securely log in to claim salary and download official payslips.</p>
            <div className="inline-flex items-center text-purple-400 text-sm font-bold group-hover:gap-2 transition-all">Claim & Verify <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>
      </div>
    </div>
  );
}

// --- Employer View ---
function EmployerView({ payrollData, walletConnected, onConnect, onPaymentSuccess, onPaymentUpdate, onSetAlert, onNavigateBack }: { payrollData: any[], walletConnected: boolean, onConnect: () => void, onPaymentSuccess: (record: any) => void, onPaymentUpdate: (record: any) => void, onSetAlert: (msg: string | null) => void, onNavigateBack: () => void }) {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [period, setPeriod] = useState(''); 
  const [bonus, setBonus] = useState(0);
  const [step, setStep] = useState(0); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<'Added' | 'Updated'>('Added');

  const emp = EMPLOYEES.find(e => e.id === selectedEmpId);
  const laborFee = emp ? Math.floor(emp.base * 0.025) : 0;
  const healthFee = emp ? Math.floor(emp.base * 0.015) : 0;
  const taxFee = emp ? Math.floor((emp.base + emp.allowance + bonus) * 0.05) : 0;
  const totalNet = emp ? (emp.base + emp.allowance + bonus - laborFee - healthFee - taxFee) : 0;

  const handleExecute = () => {
    if (!walletConnected) { onConnect(); return; }
    const existing = payrollData.find(r => r.empId === selectedEmpId && r.period === period);
    if (existing && existing.status === 'Claimed') {
      onSetAlert(`Employee ${selectedEmpId}'s salary for ${period} has already been claimed. You cannot disburse a duplicate payment.`);
      return;
    }
    
    setStep(1);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2500);
    setTimeout(() => setStep(4), 4000);
    setTimeout(() => { 
        setStep(5); 
        if (existing) {
          setSuccessType('Updated');
          onPaymentUpdate({...existing, details: { base: emp?.base, allowance: emp?.allowance, bonus, labor: laborFee, health: healthFee, tax: taxFee, net: totalNet }});
        } else {
          setSuccessType('Added');
          onPaymentSuccess({
              id: Date.now(), empId: selectedEmpId, period, status: 'Pending', 
              hash: '0x' + Math.random().toString(36).substring(2, 15),
              details: { base: emp?.base, allowance: emp?.allowance, bonus, labor: laborFee, health: healthFee, tax: taxFee, net: totalNet }
          });
        }
        setShowSuccess(true);
    }, 5000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in fade-in duration-500 relative">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-[#111623] border border-green-500/50 p-8 rounded-3xl shadow-2xl text-center w-full max-w-sm">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-black text-white mb-2">{successType === 'Added' ? 'Disbursement Successful!' : 'Record Updated!'}</h2>
                <p className="text-slate-400 mb-6 text-sm">Period: {period}<br/>Data encrypted and synced to the privacy layer.</p>
                <button onClick={() => { setShowSuccess(false); setStep(0); setSelectedEmpId(''); setPeriod(''); setBonus(0); }} className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-bold">Done</button>
            </div>
        </div>
      )}
      <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-white/5 p-2 rounded-full cursor-pointer" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
           <h2 className="text-2xl font-extrabold text-white">Private Payroll Disbursement</h2>
        </div>
        <div className="space-y-6">
          {!walletConnected && <button onClick={onConnect} className="w-full bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl text-cyan-400 font-bold flex justify-center gap-2 transition-all"><Wallet /> Connect Enterprise Wallet</button>}
          <div className="grid grid-cols-2 gap-4">
              <select className="bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 cursor-pointer" value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)}>
                  <option value="">Select Employee...</option>
                  {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} - {e.title}</option>)}
              </select>
              <div className="relative">
                  <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500"/>
                  <Calendar className="absolute right-4 top-4 text-slate-500 w-5 h-5 pointer-events-none"/>
              </div>
          </div>
          {emp && (
            <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10 animate-in zoom-in">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-slate-400"><span>Base Salary (TWD)</span><span className="text-white font-mono">{emp.base.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-slate-400"><span>Allowance</span><span className="text-white font-mono">{emp.allowance.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5"><span>Discretionary Bonus</span><input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="bg-black/60 border border-white/10 rounded px-2 py-1 text-right text-white w-24 outline-none"/></div>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm text-red-400/80"><span>Labor Insurance</span><span>-{laborFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-red-400/80"><span>Health Insurance</span><span>-{healthFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-red-400/80"><span>Income Tax</span><span>-{taxFee.toLocaleString()}</span></div>
              </div>
              <div className="flex justify-between items-center text-lg font-black pt-4 border-t border-white/10 mt-4"><span>Total Net Pay</span><span className="text-cyan-400 text-3xl font-black">{totalNet.toLocaleString()} TWD</span></div>
            </div>
          )}
          <button onClick={handleExecute} disabled={!selectedEmpId || !period || (step > 0 && step < 5)} className={`w-full py-4 rounded-xl font-black text-lg transition-all flex justify-center items-center gap-2 ${(!selectedEmpId || !period) ? 'bg-slate-800 text-slate-500' : step === 5 ? 'bg-green-600 text-white' : step > 0 ? 'bg-indigo-600 text-white' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white'}`}>
            {step === 0 && <><Activity /> Sign & Settle</>}
            {step > 0 && step < 5 && <><Loader2 className="animate-spin" /> {step === 1 ? 'Encrypting Data...' : step === 2 ? 'Generating ZK Proof...' : step === 3 ? 'Relaying to Network...' : 'Settling Funds...'}</>}
            {step === 5 && <><CheckCircle /> Disbursement Complete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Employee View ---
function EmployeeView({ walletConnected, onConnect, payrollData, onWithdraw, onLogout }: { walletConnected: boolean, onConnect: () => void, payrollData: any[], onWithdraw: (id: number) => void, onLogout: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'Aden') setIsLoggedIn(true);
    else alert("Invalid Account ID. (Hint: Use 'Aden')");
  };

  const handleWithdrawAction = (id: number) => {
    setProcessingId(id);
    setTimeout(() => {
      setProcessingId(null);
      onWithdraw(id); 
      setShowWithdrawSuccessModal(true); 
    }, 2500);
  };

  if (!isLoggedIn) {
    return (
        <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in duration-500">
          <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl text-center shadow-xl relative">
            <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white"><ChevronLeft/></button>
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400"><LogIn className="w-8 h-8"/></div>
            <h2 className="text-2xl font-bold text-white mb-6">Employee Portal Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Account ID (e.g., Aden)" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"/>
              <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"/>
              <button type="submit" disabled={!loginId} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition">Sign In</button>
            </form>
          </div>
        </div>
    );
  }

  if (isLoggedIn && !walletConnected) {
    return (
      <div className="max-w-md mx-auto p-6 pt-20 animate-in zoom-in">
        <div className="bg-[#111623] border border-orange-500/30 p-8 rounded-3xl text-center shadow-xl relative">
          <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white"><ChevronLeft/></button>
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400"><Wallet className="w-8 h-8"/></div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet ID Required</h2>
          <p className="text-slate-400 mb-8 text-sm">Hello Aden! Please connect your personal wallet to verify identity and unlock your salary claim portal.</p>
          <button onClick={onConnect} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">Connect Standard Wallet</button>
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
      doc.setFontSize(20); doc.text("Private Payroll Receipt", 14, 22);
      doc.setFontSize(10); doc.text("Officially Verified", 14, 30);
      doc.text(`Employee: Aden`, 14, 42);
      doc.text(`Period: ${selectedRecord.period}`, 14, 48);
      doc.text(`TxHash: ${selectedRecord.hash}`, 14, 54);
      (autoTable as any)(doc, {
        startY: 62, head: [['Description', 'Amount (TWD)']],
        body: [
          ['Base Salary', d.base.toLocaleString()], 
          ['Allowance', d.allowance.toLocaleString()], 
          ['Bonus', d.bonus.toLocaleString()], 
          ['Labor Insurance', `-${d.labor.toLocaleString()}`], 
          ['Health Insurance', `-${d.health.toLocaleString()}`], 
          ['Income Tax', `-${d.tax.toLocaleString()}`], 
          ['TOTAL NET PAY', { content: d.net.toLocaleString(), styles: { fontStyle: 'bold' } }]
        ],
      });
      doc.save(`Aden_Payslip_${selectedRecord.period}.pdf`);
    } catch (err) { alert("PDF Generation Failed"); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500 relative">
      {/* Withdraw Success Modal */}
      {showWithdrawSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in duration-300">
          <div className="bg-[#111623] border border-green-500/30 p-10 rounded-3xl text-center shadow-xl w-full max-w-sm">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6 animate-bounce"/>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Claim Confirmed!</h2>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed">Your salary disbursement has been successfully settled to your connected wallet. You can download the receipt from the dashboard.</p>
            <button onClick={() => setShowWithdrawSuccessModal(false)} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-green-900/30">Return to Dashboard</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-3xl font-extrabold text-white">Welcome, Aden</h2><p className="text-slate-500 text-sm mt-1">Operation Intern | Compensation Dashboard</p></div>
        <button onClick={onLogout} className="text-xs text-slate-500 hover:text-white border-b border-slate-700 pb-1">Logout</button>
      </div>

      <div className="space-y-4">
        {myRecords.length === 0 ? (
          <div className="bg-[#111623] border border-dashed border-white/5 p-16 rounded-3xl text-center text-slate-600"><FileText className="w-12 h-12 mx-auto mb-4 opacity-20"/>No pending salary disbursements found.</div>
        ) : (
          myRecords.map(record => (
            <div key={record.id} className="bg-[#111623] border border-white/5 p-6 rounded-2xl flex items-center justify-between group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500"><FileText/></div>
                <div><div className="text-white font-bold text-lg">{record.period} Compensation</div><div className="text-[10px] text-slate-500 font-mono">Hash: {record.hash}</div></div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white font-mono">{record.details.net.toLocaleString()}</div>
                <div className={`text-[10px] uppercase font-black mt-1 ${record.status === 'Claimed' ? 'text-green-500' : 'text-amber-500'}`}>{record.status === 'Claimed' ? 'Disbursed' : 'Ready to Claim'}</div>
              </div>
              <div className="ml-6 border-l border-white/5 pl-6">
                <button onClick={() => { setSelectedRecord(record); setShowDetails(true); }} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition"><Eye className="w-4 h-4" /> Review</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
             <button onClick={() => setShowDetails(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"><X /></button>
             <div className="bg-indigo-900/20 p-8 border-b border-white/5">
               <h3 className="text-3xl font-black text-white">{selectedRecord.period} Payslip</h3>
               <div className={`mt-4 flex items-center gap-2 text-sm font-bold ${selectedRecord.status === 'Claimed' ? 'text-green-400' : 'text-indigo-400'}`}>
                 {selectedRecord.status === 'Claimed' ? <BadgeCheck className="w-4 h-4"/> : <Shield className="w-4 h-4"/>}
                 {selectedRecord.status === 'Claimed' ? 'Funds Disbursed to Wallet' : 'Verified Digital Payslip'}
               </div>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-400"><span>Base Salary (TWD)</span><span className="text-white font-mono">{selectedRecord.details.base.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>Allowance / Bonus</span><span className="text-white font-mono">{(selectedRecord.details.allowance + selectedRecord.details.bonus).toLocaleString()}</span></div>
                  <div className="h-px bg-white/5 my-4" />
                  
                  {/* 分開列示勞保與健保 */}
                  <div className="flex justify-between text-xs text-red-400/80 italic"><span>Labor Insurance</span><span className="font-mono">-{selectedRecord.details.labor.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-red-400/80 italic"><span>Health Insurance</span><span className="font-mono">-{selectedRecord.details.health.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-red-400/80 italic"><span>Income Tax</span><span className="font-mono">-{selectedRecord.details.tax.toLocaleString()}</span></div>
                  
                  <div className="flex justify-between text-2xl font-black text-white pt-6 border-t border-white/5 mt-4">
                    <span>Total Net Pay</span><span className="text-cyan-400 text-3xl font-black">{selectedRecord.details.net.toLocaleString()} TWD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {/* Black disabled button when claimed */}
                  <button 
                    onClick={() => handleWithdrawAction(selectedRecord.id)} 
                    disabled={selectedRecord.status === 'Claimed' || processingId === selectedRecord.id}
                    className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
                      selectedRecord.status === 'Claimed' 
                      ? 'bg-black text-slate-500 cursor-not-allowed border border-white/10' 
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white'
                    }`}
                  >
                    {processingId === selectedRecord.id ? <Loader2 className="animate-spin" /> : selectedRecord.status === 'Claimed' ? <CheckCircle className="text-green-500" /> : <Wallet />}
                    {processingId === selectedRecord.id ? 'Processing...' : selectedRecord.status === 'Claimed' ? 'Claimed' : 'Withdraw Salary'}
                  </button>
                  <button onClick={generatePDF} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/5">
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