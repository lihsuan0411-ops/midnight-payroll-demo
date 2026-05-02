/* eslint-disable */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, Building2, User, ChevronRight, CheckCircle, 
  Terminal, Activity, FileText, Globe, Server, Eye, Download, 
  Loader2, X, ChevronLeft, LogOut, LogIn, Calendar, BadgeCheck, FileSearch, Database, LockKeyhole
} from 'lucide-react';

// --- TypeScript Definitions ---
type UserRole = 'landing' | 'employer' | 'employee' | 'auditor';
type WalletType = 'metamask' | 'eternl' | 'safe' | '';
type Lang = 'en' | 'zh';

// --- Mock Data ---
const EMPLOYEES = [
  { id: "Aden", name: "Aden", title: "Operation Intern", address: "0x9E3...4A21", base: 40000, allowance: 2000 },
  { id: "emp01", name: "Alice", title: "Senior Dev", address: "0x71C...976F", base: 75000, allowance: 5000 },
  { id: "emp02", name: "Bob", title: "Product Lead", address: "0x3B2...1A9E", base: 90000, allowance: 8000 },
];

// --- Translations Dictionary ---
const T = {
  en: {
    navTitle: "On-chain Payroll",
    connect: "Connect Wallet",
    langToggle: "繁中",
    comingSoon: "Coming Soon",
    bankApi: "Bank API (Loan / Audit)",
    web3Standard: "Web3 Standard",
    // Landing
    titlePrefix: "Enterprise-Grade",
    titleSuffix: "On-Chain Payroll",
    desc: "Empower your organization with secure, compliant, and confidential salary distribution. Experience the future of Web3 human resources.",
    empPortal: "Employer Portal",
    empPortalDesc: "Manage compensation and execute secure payouts.",
    launch: "Launch Dashboard",
    employeePortal: "Employee Portal",
    employeePortalDesc: "Securely log in to claim salary and download official payslips.",
    claimVerify: "Claim & Verify",
    auditorPortal: "Auditor Portal",
    auditorPortalDesc: "Inspect compliance logs and export audit reports.",
    accessLogs: "Access Logs",
    // Employer
    employerTitle: "Private Payroll Disbursement",
    connectEmp: "Connect Enterprise Wallet",
    selectEmp: "1. Select Employee",
    currentPeriod: "2. Current Period (Locked)",
    base: "Base Salary (TWD)",
    allowance: "Allowance",
    bonus: "Discretionary Bonus",
    labor: "Labor Insurance",
    health: "Health Insurance",
    tax: "Income Tax",
    net: "Total Net Pay",
    signSettle: "Sign & Settle",
    encrypting: "Encrypting Data...",
    proving: "Generating ZK Proof...",
    relaying: "Relaying to Network...",
    settling: "Settling Funds...",
    complete: "Disbursement Complete",
    sysAlert: "System Alert",
    dupAlert: "salary for this period has already been claimed. Duplicate payout rejected.",
    dismiss: "Dismiss",
    added: "Disbursement Successful!",
    updated: "Record Updated!",
    done: "Done",
    // Employee
    employeeTitle: "Employee Portal Access",
    accId: "Account ID (e.g., Aden)",
    pwd: "Password",
    signIn: "Sign In",
    walletReq: "Wallet ID Required",
    walletReqDesc: "Please connect your personal wallet to verify identity and unlock your salary claim portal.",
    connectStd: "Connect Standard Wallet",
    welcome: "Welcome",
    dashboard: "Compensation Dashboard",
    logout: "Secure Logout",
    empty: "No pending salary disbursements found.",
    compProof: "Compensation",
    ready: "Ready to Claim",
    disbursed: "Disbursed",
    review: "Review",
    payslip: "Payslip",
    verified: "Verified Digital Payslip",
    claimed: "Funds Disbursed to Wallet",
    processing: "Processing...",
    withdraw: "Withdraw Salary",
    download: "Download PDF",
    claimConfirmed: "Claim Confirmed!",
    claimDesc: "Your salary disbursement has been successfully settled to your connected wallet. You can download the receipt from the dashboard.",
    returnDash: "Return to Dashboard",
    // Auditor
    auditTitle: "Compliance & Audit Portal",
    auditSub: "Real-time monitoring of on-chain disbursements.",
    exportCsv: "Export CSV Log",
    auditReq: "Auditor Authentication Required",
    auditReqDesc: "Please connect your authorized auditor wallet. The system will verify your address against the on-chain Auditor Registry.",
    connectAudit: "Connect Auditor Wallet",
    verifyingId: "Verifying On-Chain Identity...",
    verifyingDesc: "Checking Auditor Registry Smart Contract...",
    accessGranted: "Access Granted",
    emptyLedger: "No transaction records found on the ledger.",
    colEmp: "Employee",
    colPeriod: "Period",
    colNet: "Net Payout (TWD)",
    colStatus: "Status",
    colAction: "Action",
    inspect: "Inspect",
    cryptoProof: "Cryptographic Proof",
    verifiedZk: "Verified ZK-Rollup Transaction",
    empId: "Employee Identifier",
    disbPeriod: "Disbursement Period",
    gross: "Gross Allowances",
    deductions: "Total Deductions",
    netSettled: "Net Settled Amount",
    closeIns: "Close Inspector"
  },
  zh: {
    navTitle: "鏈上薪資系統",
    connect: "連接錢包",
    langToggle: "EN",
    comingSoon: "待推出",
    bankApi: "民間銀行 API (貸款/聯徵)",
    web3Standard: "Web3 標準協議",
    // Landing
    titlePrefix: "企業級",
    titleSuffix: "鏈上發薪方案",
    desc: "透過安全、合規且極具隱私的方式進行薪資發放。體驗 Web3 時代的人力資源管理未來。",
    empPortal: "雇主發放入口",
    empPortalDesc: "管理薪資結構並執行安全的鏈上發放。",
    launch: "進入控制台",
    employeePortal: "員工提領入口",
    employeePortalDesc: "安全登入以提領薪資並下載官方薪資證明。",
    claimVerify: "提領與驗證",
    auditorPortal: "審計查核入口",
    auditorPortalDesc: "查核合規紀錄並匯出系統審計報表。",
    accessLogs: "存取紀錄",
    // Employer
    employerTitle: "隱私薪資發放控制台",
    connectEmp: "連接企業錢包",
    selectEmp: "1. 選擇員工",
    currentPeriod: "2. 當前週期 (系統鎖定)",
    base: "本薪 (TWD)",
    allowance: "固定津貼",
    bonus: "浮動獎金",
    labor: "勞工保險",
    health: "健康保險",
    tax: "個人所得稅",
    net: "實領淨額",
    signSettle: "簽署與結算",
    encrypting: "資料加密中...",
    proving: "產生零知識證明...",
    relaying: "節點廣播中...",
    settling: "資金結算中...",
    complete: "發放完成",
    sysAlert: "系統攔截",
    dupAlert: "此週期的薪資已被提領，系統拒絕重複發放。",
    dismiss: "關閉",
    added: "薪資發放成功！",
    updated: "紀錄更新成功！",
    done: "完成",
    // Employee
    employeeTitle: "員工入口登入",
    accId: "員工帳號 (例如: Aden)",
    pwd: "登入密碼",
    signIn: "安全登入",
    walletReq: "需要錢包驗證",
    walletReqDesc: "請連接您的個人 Web3 錢包以驗證數位身分並解鎖薪資提領權限。",
    connectStd: "連接個人錢包",
    welcome: "歡迎",
    dashboard: "薪資提領儀表板",
    logout: "安全登出",
    empty: "目前沒有待處理的薪資發放紀錄。",
    compProof: "薪資單",
    ready: "待提領",
    disbursed: "已撥款",
    review: "查看",
    payslip: "薪資明細",
    verified: "已驗證的數位薪資單",
    claimed: "資金已提領至錢包",
    processing: "區塊鏈處理中...",
    withdraw: "提領薪資",
    download: "下載 PDF",
    claimConfirmed: "提領成功！",
    claimDesc: "您的薪資已成功結算並轉移至您連接的個人錢包中。您可以從儀表板下載薪資收據。",
    returnDash: "返回儀表板",
    // Auditor
    auditTitle: "財務合規與審計入口",
    auditSub: "即時監控所有鏈上資金撥款紀錄。",
    exportCsv: "匯出 CSV 報表",
    auditReq: "需要審計員身分驗證",
    auditReqDesc: "請連接授權的審計錢包。系統將會比對鏈上「審計員白名單合約 (Auditor Registry)」進行權限查核。",
    connectAudit: "連接審計錢包",
    verifyingId: "鏈上身分驗證中...",
    verifyingDesc: "正在核對智能合約白名單...",
    accessGranted: "授權通過",
    emptyLedger: "分類帳上目前無任何交易紀錄。",
    colEmp: "員工",
    colPeriod: "週期",
    colNet: "實發金額 (TWD)",
    colStatus: "狀態",
    colAction: "操作",
    inspect: "查核",
    cryptoProof: "密碼學證明",
    verifiedZk: "已驗證的 ZK-Rollup 交易",
    empId: "員工識別碼",
    disbPeriod: "撥款週期",
    gross: "應發總額",
    deductions: "代扣總額",
    netSettled: "鏈上結算淨額",
    closeIns: "關閉查核視窗"
  }
};

export default function OnChainPayrollApp() {
  const [lang, setLang] = useState<Lang>('en');
  const [currentView, setCurrentView] = useState<UserRole>('landing');
  const [payrollData, setPayrollData] = useState<any[]>([]); 
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);

  const t = T[lang];

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
      if (currentView === 'auditor') setWalletAddress("0xAUDIT...4242");
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

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20 relative">
      {duplicateAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-amber-500/30 w-full max-w-sm rounded-2xl p-8 shadow-2xl text-center">
            <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t.sysAlert}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{duplicateAlert}</p>
            <button onClick={() => setDuplicateAlert(null)} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold transition">{t.dismiss}</button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      <nav className="border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 cursor-pointer" onClick={navigateToLanding}>
          {/* 高質感 Web3 節點光暈 Logo */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 p-[1.5px] shadow-lg shadow-cyan-900/20">
            <div className="w-full h-full bg-[#0a0e17] rounded-[10px] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></div>
            </div>
          </div>
          <div className="font-bold text-white text-lg tracking-wide hidden md:block">{t.navTitle}</div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10 transition-colors">
            {t.langToggle}
          </button>

          {walletConnected ? (
            <div className="flex items-center gap-2">
              <div className={`px-4 py-1.5 rounded-full border text-xs font-mono flex items-center gap-2 ${currentView === 'auditor' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : walletType === 'metamask' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-300'}`}><span className="w-2 h-2 bg-green-400 rounded-full"></span>{walletAddress}</div>
              <button onClick={disconnectWallet} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            currentView !== 'landing' && (
              <button onClick={() => setShowWalletModal(true)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2">
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wallet className="w-4 h-4" />} {t.connect}
              </button>
            )
          )}
        </div>
      </nav>

      <main className="relative z-10">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} t={t} />}
        {currentView === 'employer' && <EmployerView payrollData={payrollData} walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} onPaymentSuccess={addPayrollRecord} onPaymentUpdate={updatePayrollRecord} onSetAlert={setDuplicateAlert} onNavigateBack={navigateToLanding} t={t} />}
        {currentView === 'employee' && <EmployeeView walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} payrollData={payrollData} onWithdraw={markAsWithdrawn} onLogout={navigateToLanding} t={t} />}
        {currentView === 'auditor' && <AuditorView payrollData={payrollData} walletConnected={walletConnected} onConnect={() => setShowWalletModal(true)} onNavigateBack={navigateToLanding} t={t} />}
      </main>

      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#111623] border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-white font-bold text-center mb-6 text-lg">{lang === 'en' ? 'Select Wallet' : '選擇錢包'}</h3>
            <div className="space-y-3">
              
              {/* Employer ONLY: Safe Wallet (Disabled Vision) */}
              {currentView === 'employer' && (
                <>
                  <button disabled className="w-full bg-emerald-900/5 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4 cursor-not-allowed opacity-50 relative">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10">{t.comingSoon}</div>
                    <div className="w-10 h-10 rounded-full bg-[#111623] flex items-center justify-center overflow-hidden border border-emerald-500/30 p-1">
                      <img src="/safe.png" alt="Safe" className="w-full h-full object-contain grayscale" />
                    </div>
                    <div className="text-left font-bold text-slate-300">Safe (Multi-Sig)</div>
                  </button>
                  <div className="flex items-center gap-4 py-1"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.web3Standard}</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              {/* Auditor ONLY: Traditional Bank API (Disabled Vision) */}
              {currentView === 'auditor' && (
                <>
                  <button disabled className="w-full bg-blue-900/5 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4 cursor-not-allowed opacity-50 relative">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/30 px-2 py-1 rounded bg-blue-500/10">{t.comingSoon}</div>
                    <div className="w-10 h-10 rounded-full bg-[#111623] flex items-center justify-center overflow-hidden border border-blue-500/30 p-2">
                      <Building2 className="w-full h-full text-blue-400" />
                    </div>
                    <div className="text-left font-bold text-slate-300">{t.bankApi}</div>
                  </button>
                  <div className="flex items-center gap-4 py-1"><div className="h-px bg-white/5 flex-1"></div><span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.web3Standard}</span><div className="h-px bg-white/5 flex-1"></div></div>
                </>
              )}

              {/* Standard Wallets */}
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

function LandingView({ onNavigate, t }: { onNavigate: (role: UserRole) => void, t: any }) {
  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">{t.titlePrefix}</span><br />{t.titleSuffix}
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">{t.desc}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <button onClick={() => onNavigate('employer')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-cyan-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 className="w-24 h-24 text-cyan-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform"><Server className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.empPortal}</h2>
            <p className="text-slate-400 text-sm mb-6">{t.empPortalDesc}</p>
            <div className="inline-flex items-center text-cyan-400 text-sm font-bold group-hover:gap-2 transition-all">{t.launch} <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>

        <button onClick={() => onNavigate('employee')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User className="w-24 h-24 text-purple-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform"><Shield className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.employeePortal}</h2>
            <p className="text-slate-400 text-sm mb-6">{t.employeePortalDesc}</p>
            <div className="inline-flex items-center text-purple-400 text-sm font-bold group-hover:gap-2 transition-all">{t.claimVerify} <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>

        <button onClick={() => onNavigate('auditor')} className="group relative bg-[#111623] hover:bg-[#161b2c] border border-white/10 hover:border-emerald-500/50 p-8 rounded-3xl transition-all text-left overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FileSearch className="w-24 h-24 text-emerald-500" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform"><Database className="w-6 h-6" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.auditorPortal}</h2>
            <p className="text-slate-400 text-sm mb-6">{t.auditorPortalDesc}</p>
            <div className="inline-flex items-center text-emerald-400 text-sm font-bold group-hover:gap-2 transition-all">{t.accessLogs} <ChevronRight className="w-4 h-4 ml-1" /></div>
          </div>
        </button>
      </div>
    </div>
  );
}

function EmployerView({ payrollData, walletConnected, onConnect, onPaymentSuccess, onPaymentUpdate, onSetAlert, onNavigateBack, t }: any) {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  
  // Hardcoded to current period, removed date selection input
  const period = "2026-05"; 
  
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
      onSetAlert(`Employee ${selectedEmpId}'s ${t.dupAlert}`);
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
                <h2 className="text-2xl font-black text-white mb-2">{successType === 'Added' ? t.added : t.updated}</h2>
                <p className="text-slate-400 mb-6 text-sm">Period: {period}<br/>Data encrypted and synced to the privacy layer.</p>
                <button onClick={() => { setShowSuccess(false); setStep(0); setSelectedEmpId(''); setBonus(0); }} className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-bold">{t.done}</button>
            </div>
        </div>
      )}
      <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-white/5 p-2 rounded-full cursor-pointer" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
           <h2 className="text-2xl font-extrabold text-white">{t.employerTitle}</h2>
        </div>
        <div className="space-y-6">
          {!walletConnected && <button onClick={onConnect} className="w-full bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl text-cyan-400 font-bold flex justify-center gap-2 transition-all"><Wallet /> {t.connectEmp}</button>}
          
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.selectEmp}</label>
                <select className="bg-black/40 border border-white/10 rounded-xl p-4 w-full text-white outline-none focus:border-cyan-500 cursor-pointer" value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)}>
                    <option value="">Choose...</option>
                    {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} - {e.title}</option>)}
                </select>
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.currentPeriod}</label>
                  {/* System Locked Period Display */}
                  <div className="w-full bg-[#0a0e17] border border-white/5 rounded-xl p-4 text-slate-400 font-mono flex items-center justify-between cursor-not-allowed">
                      <span>{period}</span>
                      <LockKeyhole className="w-4 h-4 text-slate-600" />
                  </div>
              </div>
          </div>

          {emp && (
            <div className="bg-slate-900/50 rounded-xl p-6 border border-white/10 animate-in zoom-in">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-slate-400"><span>{t.base}</span><span className="text-white font-mono">{emp.base.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-slate-400"><span>{t.allowance}</span><span className="text-white font-mono">{emp.allowance.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5"><span>{t.bonus}</span><input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="bg-black/60 border border-white/10 rounded px-2 py-1 text-right text-white w-24 outline-none"/></div>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm text-red-400/80"><span>{t.labor}</span><span>-{laborFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-red-400/80"><span>{t.health}</span><span>-{healthFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-red-400/80"><span>{t.tax}</span><span>-{taxFee.toLocaleString()}</span></div>
              </div>
              <div className="flex justify-between items-center text-lg font-black pt-4 border-t border-white/10 mt-4"><span>{t.net}</span><span className="text-cyan-400 text-3xl font-black">{totalNet.toLocaleString()} TWD</span></div>
            </div>
          )}
          <button onClick={handleExecute} disabled={!selectedEmpId || !period || (step > 0 && step < 5)} className={`w-full py-4 rounded-xl font-black text-lg transition-all flex justify-center items-center gap-2 ${(!selectedEmpId || !period) ? 'bg-slate-800 text-slate-500' : step === 5 ? 'bg-green-600 text-white' : step > 0 ? 'bg-indigo-600 text-white' : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white'}`}>
            {step === 0 && <><Activity /> {t.signSettle}</>}
            {step > 0 && step < 5 && <><Loader2 className="animate-spin" /> {step === 1 ? t.encrypting : step === 2 ? t.proving : step === 3 ? t.relaying : t.settling}</>}
            {step === 5 && <><CheckCircle /> {t.complete}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeView({ walletConnected, onConnect, payrollData, onWithdraw, onLogout, t }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'Aden') setIsLoggedIn(true);
    else alert("Invalid ID");
  };

  const handleWithdrawAction = (id: number) => {
    setProcessingId(id);
    setTimeout(() => {
      setProcessingId(null);
      onWithdraw(id); 
      setSelectedRecord(prev => prev ? { ...prev, status: 'Claimed' } : null);
      setShowWithdrawSuccessModal(true); 
    }, 2500);
  };

  if (!isLoggedIn) {
    return (
        <div className="max-w-md mx-auto p-6 pt-20 animate-in fade-in duration-500">
          <div className="bg-[#111623] border border-white/10 p-8 rounded-3xl text-center shadow-xl relative">
            <button onClick={onLogout} className="absolute top-6 left-6 text-slate-500 hover:text-white"><ChevronLeft/></button>
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400"><LogIn className="w-8 h-8"/></div>
            <h2 className="text-2xl font-bold text-white mb-6">{t.employeeTitle}</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder={t.accId} value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"/>
              <input type="password" placeholder={t.pwd} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500"/>
              <button type="submit" disabled={!loginId} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition">{t.signIn}</button>
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
          <h2 className="text-2xl font-bold text-white mb-2">{t.walletReq}</h2>
          <p className="text-slate-400 mb-8 text-sm">{t.walletReqDesc}</p>
          <button onClick={onConnect} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">{t.connectStd}</button>
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
      {showWithdrawSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in duration-300">
          <div className="bg-[#111623] border border-green-500/30 p-10 rounded-3xl text-center shadow-xl w-full max-w-sm">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6 animate-bounce"/>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">{t.claimConfirmed}</h2>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed">{t.claimDesc}</p>
            <button onClick={() => setShowWithdrawSuccessModal(false)} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition">{t.returnDash}</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-3xl font-extrabold text-white">{t.welcome}, Aden</h2><p className="text-slate-500 text-sm mt-1">Operation Intern | {t.dashboard}</p></div>
        <button onClick={onLogout} className="text-xs text-slate-500 hover:text-white border-b border-slate-700 pb-1">{t.logout}</button>
      </div>

      <div className="space-y-4">
        {myRecords.length === 0 ? (
          <div className="bg-[#111623] border border-dashed border-white/5 p-16 rounded-3xl text-center text-slate-600"><FileText className="w-12 h-12 mx-auto mb-4 opacity-20"/>{t.empty}</div>
        ) : (
          myRecords.map(record => (
            <div key={record.id} className="bg-[#111623] border border-white/5 p-6 rounded-2xl flex items-center justify-between group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500"><FileText/></div>
                <div><div className="text-white font-bold text-lg">{record.period} {t.compProof}</div><div className="text-[10px] text-slate-500 font-mono">Hash: {record.hash}</div></div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white font-mono">{record.details.net.toLocaleString()}</div>
                <div className={`text-[10px] uppercase font-black mt-1 ${record.status === 'Claimed' ? 'text-green-500' : 'text-amber-500'}`}>{record.status === 'Claimed' ? t.disbursed : t.ready}</div>
              </div>
              <div className="ml-6 border-l border-white/5 pl-6">
                <button onClick={() => { setSelectedRecord(record); setShowDetails(true); }} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition"><Eye className="w-4 h-4" /> {t.review}</button>
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
               <h3 className="text-3xl font-black text-white">{selectedRecord.period} {t.payslip}</h3>
               <div className={`mt-4 flex items-center gap-2 text-sm font-bold ${selectedRecord.status === 'Claimed' ? 'text-green-400' : 'text-indigo-400'}`}>
                 {selectedRecord.status === 'Claimed' ? <BadgeCheck className="w-4 h-4"/> : <Shield className="w-4 h-4"/>}
                 {selectedRecord.status === 'Claimed' ? t.claimed : t.verified}
               </div>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-400"><span>{t.base}</span><span className="text-white font-mono">{selectedRecord.details.base.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>{t.allowance} / {t.bonus}</span><span className="text-white font-mono">{(selectedRecord.details.allowance + selectedRecord.details.bonus).toLocaleString()}</span></div>
                  <div className="h-px bg-white/5 my-4" />
                  
                  <div className="flex justify-between text-xs text-red-400/80 italic"><span>{t.labor}</span><span className="font-mono">-{selectedRecord.details.labor.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-red-400/80 italic"><span>{t.health}</span><span className="font-mono">-{selectedRecord.details.health.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-red-400/80 italic"><span>{t.tax}</span><span className="font-mono">-{selectedRecord.details.tax.toLocaleString()}</span></div>
                  
                  <div className="flex justify-between text-2xl font-black text-white pt-6 border-t border-white/5 mt-4">
                    <span>{t.net}</span><span className="text-cyan-400 text-3xl font-black">{selectedRecord.details.net.toLocaleString()} TWD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
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
                    {processingId === selectedRecord.id ? t.processing : selectedRecord.status === 'Claimed' ? t.claimed : t.withdraw}
                  </button>
                  <button onClick={generatePDF} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/5">
                    <Download className="w-5 h-5" /> {t.download}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Auditor View ---
function AuditorView({ payrollData, walletConnected, onConnect, onNavigateBack, t }: any) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  // Simulation for On-Chain ID Verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    if (walletConnected && !authSuccess) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setAuthSuccess(true);
      }, 1500); 
    }
  }, [walletConnected, authSuccess]);

  const downloadCSV = () => {
    const headers = ["Transaction ID", "Employee", "Period", "Base Salary", "Allowances", "Bonus", "Labor Ins.", "Health Ins.", "Tax", "Net Payout", "Status", "Blockchain Hash"];
    const rows = payrollData.map(r => [
      r.id, r.empId, r.period, 
      r.details.base, r.details.allowance, r.details.bonus, 
      r.details.labor, r.details.health, r.details.tax, 
      r.details.net, r.status, r.hash
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Audit_Compliance_Log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500 relative">
      <div className="bg-[#111623] border border-emerald-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-900/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
             <div className="bg-white/5 p-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors" onClick={onNavigateBack}><ChevronLeft className="text-slate-400"/></div>
             <div>
               <h2 className="text-3xl font-extrabold text-white tracking-tight">{t.auditTitle}</h2>
               <p className="text-emerald-400/80 text-sm mt-1">{t.auditSub}</p>
             </div>
          </div>
          {authSuccess && payrollData.length > 0 && (
             <button onClick={downloadCSV} className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
               <Download className="w-4 h-4" /> {t.exportCsv}
             </button>
          )}
        </div>

        {!walletConnected ? (
          <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
            <LockKeyhole className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t.auditReq}</h3>
            <p className="text-slate-400 mb-8 max-w-md text-center text-sm">{t.auditReqDesc}</p>
            <button onClick={onConnect} className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
              <Wallet className="w-5 h-5"/> {t.connectAudit}
            </button>
          </div>
        ) : isVerifying ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t.verifyingId}</h3>
            <p className="text-emerald-400/60 font-mono text-sm">{t.verifyingDesc}</p>
          </div>
        ) : (
          <div className="space-y-4 relative z-10 animate-in fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mb-6 w-fit">
              <CheckCircle className="w-4 h-4"/> {t.accessGranted}
            </div>

            {payrollData.length === 0 ? (
              <div className="border border-dashed border-white/10 p-16 rounded-2xl text-center text-slate-500">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-20"/>
                {t.emptyLedger}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-medium">{t.colEmp}</th>
                      <th className="p-4 font-medium">{t.colPeriod}</th>
                      <th className="p-4 font-medium">{t.colNet}</th>
                      <th className="p-4 font-medium">{t.colStatus}</th>
                      <th className="p-4 font-medium text-right">{t.colAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.map(record => (
                      <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-4 text-white font-bold">{record.empId}</td>
                        <td className="p-4 text-slate-300">{record.period}</td>
                        <td className="p-4 font-mono text-cyan-400">{record.details.net.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${record.status === 'Claimed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {record.status === 'Claimed' ? t.disbursed : t.ready}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                           <button onClick={() => { setSelectedRecord(record); setShowDetails(true); }} className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1 justify-end w-full">
                             <Eye className="w-4 h-4" /> {t.inspect}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showDetails && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-emerald-500/30 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
             <button onClick={() => setShowDetails(false)} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"><X /></button>
             
             <div className="bg-emerald-900/20 p-8 border-b border-emerald-500/20">
               <h3 className="text-2xl font-black text-white">{t.cryptoProof}</h3>
               <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-400">
                 <Shield className="w-4 h-4"/> {t.verifiedZk}
               </div>
               <div className="mt-2 text-[10px] text-slate-500 font-mono break-all bg-black/40 p-2 rounded border border-white/5">
                 Hash: {selectedRecord.hash}
               </div>
             </div>
             
             <div className="p-8 space-y-4">
                <div className="flex justify-between text-sm text-slate-400 border-b border-white/5 pb-2"><span>{t.empId}</span><span className="text-white font-bold">{selectedRecord.empId}</span></div>
                <div className="flex justify-between text-sm text-slate-400 border-b border-white/5 pb-2"><span>{t.disbPeriod}</span><span className="text-white">{selectedRecord.period}</span></div>
                <div className="flex justify-between text-sm text-slate-400 border-b border-white/5 pb-2"><span>{t.colStatus}</span><span className={selectedRecord.status === 'Claimed' ? 'text-green-400' : 'text-amber-400'}>{selectedRecord.status === 'Claimed' ? t.disbursed : t.ready}</span></div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500"><span>{t.gross}</span><span className="font-mono">{(selectedRecord.details.base + selectedRecord.details.allowance + selectedRecord.details.bonus).toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-slate-500"><span>{t.deductions}</span><span className="font-mono text-red-400/80">-{ (selectedRecord.details.labor + selectedRecord.details.health + selectedRecord.details.tax).toLocaleString()}</span></div>
                  <div className="flex justify-between text-lg font-black text-white pt-2">
                    <span>{t.netSettled}</span><span className="text-emerald-400 font-mono">{selectedRecord.details.net.toLocaleString()} TWD</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button onClick={() => setShowDetails(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all border border-white/10">
                    {t.closeIns}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}