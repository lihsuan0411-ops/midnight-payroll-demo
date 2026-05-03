# On-Chain Payroll 

**Enterprise-Grade Privacy-Preserving Salary Distribution System**  
**企業級隱私鏈上薪資發放系統 (MVP)**

![Version](https://img.shields.io/badge/Version-MVP_1.0-blue)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js_%7C_Tailwind-black)
![Web3](https://img.shields.io/badge/Web3-Ready-emerald)

## Project Overview (專案簡介)
On-Chain Payroll is a next-generation HR and financial compliance platform built for the Web3 era. It leverages blockchain technology to ensure secure, immutable, and privacy-preserving salary disbursements while providing seamless auditing interfaces for traditional finance and government entities.

本專案是一個專為 Web3 時代打造的新世代企業薪資發放與財務合規平台。透過區塊鏈技術，確保薪資發放的安全、不可竄改與隱私保護，同時為傳統金融與政府審計機關提供完美的查核介面。

## Core Portals (三大核心入口)

### 1.Employer Portal (雇主發放控制台)
* **Private Disbursement:** Execute bulk salary payouts with strict access control.
* **Locked Billing Cycles:** System-locked payroll periods to prevent manipulation.
* **Immutable Records:** Generates cryptographic proofs (simulated ZK-proofs) for every transaction.

### 2.Employee Portal (員工提領入口)
* **Web3 Login:** Passwordless authentication using standard Web3 wallets (MetaMask, Eternl).
* **Fund Claiming:** Securely withdraw net payouts directly to personal wallets.
* **Digital Payslips:** Download officially verified, auto-calculated PDF payslips (Base, Allowance, Tax, Insurance).

### 3.Auditor & Compliance Portal (財務合規與審計入口)
* **Read-Only Ledger:** Complete transparency for authorized auditor wallets.
* **Granular Inspection:** Detailed breakdown of every transaction's gross and deduction amounts.
* **Export & API Vision:** 1-click CSV export, with reserved API gateways for **Commercial Banks (Loans)** and **Gov/CPA (Taxation)**.

## System Architecture (系統運作流程)

```mermaid
graph TD
    %% Define Styles
    classDef employer fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef employee fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff
    classDef auditor fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
    classDef contract fill:#0f172a,stroke:#22d3ee,stroke-width:2px,color:#22d3ee
    classDef ledger fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#f59e0b

    %% Actors
    Employer(["🏢 Employer"])
    Employee(["👤 Employee"])
    Auditor(["⚖️ Auditor / Banks / Gov"])

    %% Core System (Web3)
    subgraph Web3 ["Web3 Privacy Network"]
        Contract{"Escrow Smart Contract"}
        Ledger[("Immutable Ledger")]
    end

    %% Apply Styles Safely
    class Employer employer
    class Employee employee
    class Auditor auditor
    class Contract contract
    class Ledger ledger

    %% Employer Flow
    Employer -->|"1. Setup Payroll & Lock Funds"| Contract
    
    %% Employee Flow
    Employee -->|"2. Authenticate Wallet"| Contract
    Contract -->|"3. Auto-Disburse Net Pay"| Employee
    Employee -.->|"4. Download Verified PDF"| Local["Local Device"]
    
    %% Auditor Flow
    Contract ==>|"Log ZK-Proof Hash"| Ledger
    Auditor -->|"5. Verify On-Chain Identity"| Ledger
    Ledger -->|"6. Export CSV / API Sync"| Auditor

## Roadmap (未來藍圖)
1. **Smart Contract Integration:** Transition from LocalStorage to real Escrow Smart Contracts.
2. **Privacy Network Deployment:** Deploy on privacy-preserving sidechains (e.g., Midnight) to shield specific salary amounts from the public public block explorer.
3. **B2B / B2G API Implementation:** Unlock the "Coming Soon" gateways to allow seamless real-world asset (RWA) scoring by banks and tax verification by authorities.

---
*Built for the future of decentralized organizations.*