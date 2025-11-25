# Midnight Payroll 🌑 
### 基于 Cardano + Midnight 的隐私薪资發放系統

![Project Status](https://img.shields.io/badge/Status-Milestone_3_Complete-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20TypeScript%20%7C%20Tailwind-black)

## 📖 3.5 Solution Overview (解決方案概述)

本项目利用 **Midnight Network** 的零知识证明 (ZK-Proofs) 與 **Compact** 智能合約，構建了一個將「計算」與「結算」分離的雙層薪資系統，實現了基於 **選擇性披露 (Selective Disclosure)** 的合規架構。

### 核心價值主張：不只是隱藏數據，而是提供「合規的可驗證性」

1.  **隱私計算層 (Midnight Sidechain)**
    * 企業將敏感數據（員工等級、薪資算法、具體金額）加密存儲於 Midnight。
    * 所有的邏輯判斷（如 KPI 考核、工齡補貼）在 Midnight 的私密環境中執行。
    * **價值**：外界無法窺探數據，滿足 GDPR 要求，保護商業機密。

2.  **誠實性證明 (Proof of Honest Payment)**
    * 系統生成 ZK 證明，向外界聲明：「該企業已按照預設規則，向合法員工發放了總計 X 數額的資金」，但無需披露誰拿了多少。
    * **價值**：解決 DAO 治理中的信任問題——社區知道預算被正確使用了，但不知道細節。

3.  **監管友好型合規 (Regulatory Compliance)**
    * 利用 Midnight 的選擇性披露功能，企業可為審計師生成特定的「查看密鑰 (View Key)」。
    * **價值**：解決 Crypto 收入在現實世界難以證明的痛點。員工可向銀行出具「隱藏細節但經過驗證」的收入證明。

---

## 🔄 User Flow Comparison (用戶流程對比)

| 流程階段 | 🔴 現狀 (Without Our Solution) | 🟢 本方案 (With Midnight Payroll) |
| :--- | :--- | :--- |
| **發薪** | 公司擔心鏈上數據洩露，被迫使用中心化交易所手動分發。 | **智能合約自動執行**。Cardano 鏈上僅顯示「結算成功」，金額與規則對外不可見。 |
| **信任** | 社區無法驗證資金是否真的發給了員工，存在挪用風險。 | 生成 **誠實性證明 (ZK-Proof)**，數學上證明資金流向合規。 |
| **證明** | 員工申請貸款時，銀行看到的是匿名的高風險轉帳，貸款被拒。 | 員工生成 **可驗證收入憑證**，銀行通過工具驗證簽名真實性，無需查看機密數據即可通過審核。 |

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
* **Blockchain**: Cardano (Settlement Layer), Midnight (Privacy/Computation Layer)
* **Wallet Integration**: CIP-30 Standard (Lace, Eternl)
* **Security**: Non-custodial connection, Privacy masking UI

---

## 🚀 Getting Started (如何運行 Demo)

### 1. 安裝依賴
```bash
npm install
# 安裝 UI 圖標庫
npm install lucide-react