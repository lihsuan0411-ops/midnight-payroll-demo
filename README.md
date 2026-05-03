# On-Chain Payroll 🛡️

**Enterprise-Grade Privacy-Preserving Salary Distribution System**  
**企業級隱私鏈上薪資發放系統 (MVP)**

![Version](https://img.shields.io/badge/Version-MVP_1.0-blue)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js_%7C_Tailwind-black)
![Web3](https://img.shields.io/badge/Web3-Ready-emerald)

## 📖 Project Overview (專案簡介)
On-Chain Payroll is a next-generation HR and financial compliance platform built for the Web3 era. It leverages blockchain technology to ensure secure, immutable, and privacy-preserving salary disbursements while providing seamless auditing interfaces for traditional finance and government entities.

本專案是一個專為 Web3 時代打造的新世代企業薪資發放與財務合規平台。透過區塊鏈技術，確保薪資發放的安全、不可竄改與隱私保護，同時為傳統金融與政府審計機關提供完美的查核介面。

## 🔄 System Architecture (系統運作流程)
```mermaid
graph TD
    Employer["🏢 Employer (雇主)"]
    Employee["👤 Employee (員工)"]
    Auditor["⚖️ Auditor / Banks / Gov (審計/銀行/政府)"]
    Contract{"Escrow Smart Contract (託管智能合約)"}
    Ledger[("Immutable Ledger (不可竄改分類帳)")]
    Local["💻 Local Device (本地裝置)"]

    Employer -->|1. Setup Payroll & Lock Funds| Contract
    Employee -->|2. Authenticate Wallet| Contract
    Contract -->|3. Auto-Disburse Net Pay| Employee
    Employee -.->|4. Download Verified PDF| Local
    Contract ==>|Log ZK-Proof Hash| Ledger
    Auditor -->|5. Verify On-Chain Identity| Ledger
    Ledger -->|6. Export CSV / API Sync| Auditor