'use client';

import React, { useState } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Lock, Terminal, Activity, FileText, Globe, Server, Eye, EyeOff, 
  Download, Loader2, X, ChevronLeft, LogOut, Code, Cpu, GitMerge, Layers
} from 'lucide-react';

// --- TypeScript 定義 ---
declare global {
  interface Window {
    cardano?: any; // 修改：直接設為 any，徹底解決紅字問題
  }
}

type UserRole = 'landing' | 'employer' | 'employee';
type WalletType = 'lace' | 'eternl' | '';

// --- 模擬數據 ---
const EMPLOYEES = [
  { id: 1, name: "Alice (Senior Dev)", address: "addr_test1...Alice", level: "L3", base: 75000, allowance: 5000 },
  { id: 2, name: "Bob (Product Lead)", address: "addr_test1...Bob", level: "L4", base: 90000, allowance: 8000 },
  { id: 3, name: "Charlie (Designer)", address: "addr_test1...Charlie", level: "L2", base: 55000, allowance: 3000 },
];

const MOCK_PAYSLIPS = [
  { 
    id: 101, period: '2025-10', status: 'Settled', amount: 88000, hash: 'zk-7f...9c',
    breakdown: { base: 75000, allowance: 5000, bonus: 8000 } 
  },
  { 
    id: 102, period: '2025-11', status: 'Pending', amount: 0, hash: 'zk-3b...1a',
    breakdown: { base: 75000, allowance: 5000, bonus: 0 }
  },
];

export default function OnChainPayrollApp() {
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // 技術文檔 Modal 狀態
  const [showTechModal, setShowTechModal] = useState(false);

  // --- 連接邏輯 (已修復紅字) ---
  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setShowWalletModal(false);

    if (typeof window === 'undefined') return;

    // 這裡使用 window.cardano 就不會再報錯了，因為我們上面定義它是 any
    if (!window.cardano || !window.cardano[type]) {
      alert(`❌ 未偵測到 ${type === 'lace' ? 'Lace' : 'Eternl'} 錢包！`);
      setIsConnecting(false);
      return;
    }

    try {
      const api = await window.cardano[type].enable();
      await api.getNetworkId();
      
      // 為了演示美觀，這裡顯示模擬地址，實際開發可用 api.getUsedAddresses()
      setWalletAddress(type === 'lace' ? "addr_test1...LaceUser" : "addr_test1...EternlUser");
      setWalletType(type);
      setWalletConnected(true);
    } catch (error) { 
      console.error(error);
      alert("連接失敗或用戶拒絕"); 
    } finally { 
      setIsConnecting(false); 
    }
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

      <main className="relative z-10">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} onOpenTech={() => setShowTechModal(true)} />}
        {/* 傳遞必要的 props 給子組件 */}
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

      {/* Technical Docs Modal */}
      {showTechModal && <TechnicalDocsModal onClose={() => setShowTechModal(false)} />}
    </div>
  );
}

// --- Technical Docs Modal (保持不變，僅確保整合在同一文件) ---
function TechnicalDocsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'arch' | 'zk' | 'contract' | 'flow'>('arch');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-3"><div className="p-2 bg-indigo-500/20 rounded-lg"><Code className="w-5 h-5 text-indigo-400"/></div><div><h3 className="text-xl font-bold text-white">Technical Architecture</h3><p className="text-xs text-slate-400">Midnight Compact + Cardano Aiken</p></div></div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-full transition"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex border-b border-slate-700 bg-slate-900/50">
          {[{ id: 'arch', label: 'Architecture', icon: Layers }, { id: 'zk', label: 'ZK Circuit (Compact)', icon: Cpu }, { id: 'contract', label: 'Validator (Aiken)', icon: Shield }, { id: 'flow', label: 'User Flow', icon: GitMerge }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all ${activeTab === tab.id ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}><tab.icon className="w-4 h-4"/> {tab.label}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-[#0b1120]">
          {activeTab === 'arch' && (
            <div className="space-y-8">
              <div className="text-center mb-8"><h4 className="text-2xl font-bold text-white mb-2">Dual-Layer Model</h4><p className="text-slate-400">Separating Privacy (Computation) from Assets (Settlement)</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative">
                <div className="border border-indigo-500/30 bg-indigo-900/10 p-6 rounded-2xl text-center relative"><div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">Model & Proof</div><Cpu className="w-12 h-12 text-indigo-400 mx-auto mb-4" /><h5 className="text-lg font-bold text-white">Midnight Network</h5><p className="text-xs text-slate-400 mt-2">Private Smart Contracts (Compact)</p></div>
                <div className="flex flex-col items-center justify-center text-slate-500"><div className="w-full h-px bg-slate-700 relative top-3"></div><div className="z-10 bg-[#0b1120] px-4 py-2 border border-orange-500/30 rounded-xl text-center"><Globe className="w-6 h-6 text-orange-400 mx-auto mb-1"/><span className="text-xs font-bold text-orange-300">Relay Oracle</span></div></div>
                <div className="border border-cyan-500/30 bg-cyan-900/10 p-6 rounded-2xl text-center relative"><div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold">Settlement</div><Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" /><h5 className="text-lg font-bold text-white">Cardano L1</h5><p className="text-xs text-slate-400 mt-2">Settlement Validators (Aiken)</p></div>
              </div>
            </div>
          )}
          {activeTab === 'zk' && (
            <div><div className="mb-6"><h4 className="text-xl font-bold text-white">Midnight Compact Circuit</h4></div><div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 font-mono text-sm overflow-x-auto shadow-inner"><div className="text-gray-400 mb-2">// midnight_payroll.compact</div><div className="text-purple-400">export circuit</div> <span className="text-yellow-300">pay_employee</span>...</div></div>
          )}
          {activeTab === 'contract' && (
            <div><div className="mb-6"><h4 className="text-xl font-bold text-white">Cardano Settlement Validator</h4></div><div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 font-mono text-sm overflow-x-auto shadow-inner"><div className="text-gray-400 mb-2">// validators/settlement.aiken</div><span className="text-purple-400">validator</span> &#123; ... &#125;</div></div>
          )}
          {activeTab === 'flow' && (
            <div className="flex flex-col gap-8 relative"><div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-500 to-indigo-500 opacity-30"></div>{[ { title: "1. HR Input", desc: "Employer selects employee...", role: "Off-chain" }, { title: "2. Privacy Computation", desc: "Midnight Compact Contract verifies logic...", role: "Midnight Layer" }, { title: "3. Proof Generation", desc: "ZK-SNARK proof generated...", role: "ZK Circuit" }, { title: "4. Relay", desc: "Oracle submits proof...", role: "Relay Oracle" }, { title: "5. Settlement", desc: "Cardano validator checks proof...", role: "Cardano L1" }, { title: "6. Verification", desc: "Employee uses View Key...", role: "Employee Portal" } ].map((step, i) => (<div key={i} className="flex gap-6 items-start relative z-10 group"><div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-white">{i + 1}</div><div className="flex-1 bg-white/5 border border-white/5 p-4 rounded-xl"><h5 className="font-bold text-white">{step.title}</h5><p className="text-slate-400 text-sm">{step.desc}</p></div></div>))}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Landing View ---
function LandingView({ onNavigate, onOpenTech }: { onNavigate: (role: UserRole) => void, onOpenTech: () => void }) {
  return (
    <div className="max-w-6xl mx-auto p-6 pt-20 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-8">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
        <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Catalyst Project ID: 111124</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Selective Disclosure</span><br />Payroll System</h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">Midnight ZK contracts execute private salary logic & generate proofs.<br />Cardano settles the funds.</p>
      <button onClick={onOpenTech} className="mb-12 flex items-center gap-2 text-sm text-slate-400 hover:text-white border-b border-slate-700 hover:border-white pb-1 transition-all"><Code className="w-4 h-4"/> View Technical Architecture & Contracts</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button onClick={() => onNavigate('employer')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-cyan-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 className="w-24 h-24 text-cyan-500" /></div>
          <div className="relative z-10"><div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform"><Server className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-white mb-2">Employer Portal</h2><p className="text-slate-400 text-sm mb-6">Execute private logic, generate ZK proofs.</p><div className="inline-flex items-center text-cyan-400 text-sm font-bold group-hover:gap-2 transition-all">Launch Dashboard <ChevronRight className="w-4 h-4 ml-1" /></div></div>
        </button>
        <button onClick={() => onNavigate('employee')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User className="w-24 h-24 text-purple-500" /></div>
          <div className="relative z-10"><div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform"><Shield className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-white mb-2">Employee Portal</h2><p className="text-slate-400 text-sm mb-6">Verify income with View Keys.</p><div className="inline-flex items-center text-purple-400 text-sm font-bold group-hover:gap-2 transition-all">Claim & Verify <ChevronRight className="w-4 h-4 ml-1" /></div></div>
        </button>
      </div>
    </div>
  );
}

// --- 雇主端 (Employer) ---
function EmployerView({ walletConnected, onConnect }: { walletConnected: boolean, onConnect: () => void }) {
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [bonus, setBonus] = useState(0);
  const [step, setStep] = useState(0); 
  const emp = EMPLOYEES.find(e => e.id === selectedEmp);
  const total = emp ? emp.base + emp.allowance + bonus : 0;
  const handleExecute = () => { if (!walletConnected) { onConnect(); return; } setStep(1); setTimeout(() => setStep(2), 1500); setTimeout(() => setStep(3), 3500); setTimeout(() => setStep(4), 5000); setTimeout(() => setStep(5), 7000); };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl">
          <div className="flex justify-between items-start mb-6"><div><h2 className="text-2xl font-bold text-white">Private Payroll Execution</h2><p className="text-slate-400 text-sm mt-1">Logic runs on Midnight. Funds settle on Cardano.</p></div><div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> GDPR Compliant</div></div>
          <div className="space-y-6">
            <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Select Employee</label><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{EMPLOYEES.map(e => (<div key={e.id} onClick={() => { setSelectedEmp(e.id); setStep(0); }} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedEmp === e.id ? 'bg-cyan-900/20 border-cyan-500/50 ring-1 ring-cyan-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}><div className="font-bold text-white text-sm">{e.name}</div><div className="text-xs text-slate-500 mt-1">{e.address.slice(0,8)}...</div></div>))}</div></div>
            {selectedEmp && emp && (<div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 animate-in zoom-in duration-300"><div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Base Salary ({emp.level})</span><span className="text-white font-mono">{emp.base.toLocaleString()}</span></div><div className="flex justify-between text-sm mb-2"><span className="text-slate-400">Allowance</span><span className="text-white font-mono">{emp.allowance.toLocaleString()}</span></div><div className="flex justify-between items-center text-sm mb-4 pt-2 border-t border-white/5"><span className="text-cyan-400">Performance Bonus</span><input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded px-3 py-1 text-right text-white w-24 focus:border-cyan-500 outline-none"/></div><div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-white/10"><span className="text-white">Total Settlement</span><span className="text-cyan-400">{total.toLocaleString()} tDUST</span></div></div>)}
            <button onClick={handleExecute} disabled={!selectedEmp || (step > 0 && step < 5)} className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${!selectedEmp ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : step === 5 ? 'bg-green-600 text-white' : step > 0 ? 'bg-indigo-600 text-white cursor-wait' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-900/20'}`}>{step === 0 && <><Activity className="w-5 h-5" /> Execute Private Contract</>}{step > 0 && step < 5 && <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>}{step === 5 && <><CheckCircle className="w-5 h-5" /> Settlement Complete</>}</button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="bg-[#05070a] border border-slate-800 rounded-3xl p-6 h-full min-h-[400px] flex flex-col font-mono text-xs shadow-2xl relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500" /><div className="flex items-center gap-2 text-slate-500 border-b border-white/5 pb-4 mb-4"><Terminal className="w-4 h-4" /><span>System Architecture Log</span></div>
           <div className="space-y-4 flex-1 overflow-y-auto">
             {step === 0 && <div className="text-slate-600 italic">Waiting for execution command...</div>}
             {step >= 1 && <div className="animate-in slide-in-from-left-4 fade-in duration-500"><div className="text-indigo-400 font-bold mb-1">[Midnight Layer]</div><div className="text-slate-300">Encrypting sensitive fields (Salary, Bonus)...</div></div>}
             {step >= 2 && <div className="animate-in slide-in-from-left-4 fade-in duration-500 pt-2 border-t border-white/5"><div className="text-purple-400 font-bold mb-1">[ZK Circuit]</div><div className="text-slate-300">Generating Zero-Knowledge Proof...</div></div>}
             {step >= 3 && <div className="animate-in slide-in-from-left-4 fade-in duration-500 pt-2 border-t border-white/5"><div className="text-orange-400 font-bold mb-1 flex items-center gap-2">[Relay Oracle] <Globe className="w-3 h-3"/></div><div className="text-slate-300">Bridging Proof to Cardano Settlement Layer...</div></div>}
             {step >= 4 && <div className="animate-in slide-in-from-left-4 fade-in duration-500 pt-2 border-t border-white/5"><div className="text-cyan-400 font-bold mb-1">[Cardano Layer]</div><div className="text-slate-300">Verifying Proof & Settling Funds...</div><div className="text-green-400 mt-1 font-bold">{`> Transaction Confirmed!`}</div></div>}
           </div>
        </div>
      </div>
    </div>
  );
}

// --- 員工端 (Employee) ---
function EmployeeView({ walletConnected, onConnect }: { walletConnected: boolean, onConnect: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const handleDownload = () => { const proofData = { timestamp: new Date().toISOString(), employee: "addr_test1...User", amount: selectedRecord.amount, breakdown: selectedRecord.breakdown, zk_proof: "0x8a72...9f21", validator: "Midnight Network" }; const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `Proof_Income_${selectedRecord.period}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8"><div><h2 className="text-3xl font-bold text-white">My Payslips</h2><p className="text-slate-400">Selective Disclosure Dashboard</p></div>{!walletConnected && <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm"><Lock className="w-4 h-4" /><span>Connect wallet to decrypt View Keys</span></div>}</div>
      <div className="space-y-4">{MOCK_PAYSLIPS.map(record => (<div key={record.id} className="bg-[#111623] border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400"><FileText className="w-6 h-6" /></div><div><div className="text-white font-bold text-lg">{record.period} Payroll</div><div className="text-xs text-slate-500 font-mono">Proof: {record.hash}</div></div></div><div className="text-right">{walletConnected ? <div className="text-2xl font-bold text-white font-mono">{record.status === 'Pending' ? '---' : record.amount.toLocaleString()}</div> : <div className="text-2xl font-bold text-slate-600 blur-sm select-none">******</div>}<div className={`text-xs uppercase font-bold mt-1 ${record.status === 'Settled' ? 'text-green-500' : 'text-amber-500'}`}>{record.status}</div></div><div className="ml-6 border-l border-white/10 pl-6"><button onClick={() => { if (!walletConnected) { onConnect(); } else { setSelectedRecord(record); setShowDetails(true); } }} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">{walletConnected ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}{walletConnected ? 'Reveal Details' : 'Decrypt'}</button></div></div>))}</div>
      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden relative shadow-2xl">
             <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
             <div className="bg-indigo-900/30 p-6 border-b border-indigo-500/20"><div className="flex items-center gap-2 text-indigo-400 font-bold mb-1"><Shield className="w-5 h-5" /> Verified by Midnight</div><h3 className="text-2xl font-bold text-white">Payslip: {selectedRecord.period}</h3></div>
             <div className="p-8 space-y-6">
                <div className="bg-slate-900 rounded-xl p-4 border border-white/5"><h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Selective Disclosure View</h4><div className="space-y-3"><div className="flex justify-between"><span className="text-slate-300">Source Origin</span><span className="text-green-400 font-mono">Verified (ZK-Proof)</span></div><div className="flex justify-between"><span className="text-slate-300">Compliance</span><span className="text-green-400 font-mono">GDPR Compliant</span></div></div></div>
                <div className="space-y-2"><div className="flex justify-between text-sm text-slate-400"><span>Base Salary</span><span>{selectedRecord.breakdown.base.toLocaleString()}</span></div><div className="flex justify-between text-sm text-slate-400"><span>Allowance</span><span>{selectedRecord.breakdown.allowance.toLocaleString()}</span></div><div className="flex justify-between text-sm text-slate-400"><span>Bonus (Encrypted)</span><span>{selectedRecord.breakdown.bonus.toLocaleString()}</span></div><div className="h-px bg-white/10 my-2" /><div className="flex justify-between text-xl font-bold text-white"><span>Net Pay</span><span className="text-cyan-400">{selectedRecord.amount.toLocaleString()} tDUST</span></div></div>
                <button onClick={handleDownload} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Export Proof for Bank/Audit</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}