# On-chain Payroll: A ZK Privacy System 🌑

![Project Status](https://img.shields.io/badge/Status-Milestone_3_Complete-success)
![Catalyst ID](https://img.shields.io/badge/Catalyst_ID-111124-blue)
![Tech](https://img.shields.io/badge/Stack-Midnight_ZK_%7C_Cardano_%7C_Next.js-black)

## 📖 Project Overview
This project is a **Selective Disclosure payroll system** built for the Cardano & Midnight ecosystem. 
It solves the conflict between **enterprise privacy (GDPR)** and **on-chain transparency**.

### 💡 Core Value Proposition
1.  **Privacy Calculation**: Midnight ZK contracts execute private salary logic (bonuses, levels).
2.  **Public Settlement**: Cardano settles the final funds via a **Relay Oracle**.
3.  **Selective Disclosure**: Employees can use **View Keys** to prove income to banks/auditors without revealing the company's entire payroll structure.

---

## 🚀 Features (Milestone #3 Deliverables)

### 1. Employer Portal (Issuer)
* **Real Wallet Integration**: Supports **Lace** and **Eternl** (CIP-30).
* **Privacy Execution**: Simulates the encryption -> ZK-Proof -> Relay Oracle -> Settlement flow.
* **GDPR Compliance**: Visual indicators ensuring data masking.

### 2. Employee Portal (Verifier)
* **View Key Decryption**: Users connect wallets to decrypt sensitive salary data.
* **Payslip Management**: Detailed breakdown of Base Salary, Allowance, and Bonus.
* **Audit Export**: One-click generation of income proof for third-party verification.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
* **Blockchain Integration**: 
    * `window.cardano` API for wallet connection.
    * Mocked Midnight Compact Circuit interaction (for MVP).
* **Security**: Non-custodial session management, auto-disconnect logic.

---

## 📦 How to Run Locally

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/YOUR_GITHUB_ACCOUNT/midnight-payroll-demo.git](https://github.com/YOUR_GITHUB_ACCOUNT/midnight-payroll-demo.git)
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Start the server**
    ```bash
    npm run dev
    ```
4.  **Access**: Open `http://localhost:3000`

---

## 🔗 Delivery Evidence
* **Live Demo**: [https://midnight-payroll-demo.vercel.app/](https://midnight-payroll-demo.vercel.app/)
* **Final Report**: See `Final-Report.pdf` (submitted separately).

---
*MIT License • 2025 Midnight Catalyst Project*
