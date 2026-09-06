# Changelog

All notable changes to this project will be documented in this file.

> v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet

---

## v3.0.2 — 2026-09-06 — Sean 10-repo-fleet

### Fleet Alignment
- **§0 Banner**：補上 v3.0.2 Fleet Alignment Banner，維護者換成 Sean 10-repo-fleet，對齊 SPEC v3.0 契約
- **§17 監控與可觀測性**：新增 — Vercel Analytics + Functions Logs + 6 個關鍵 KPI + 告警規則
- **§18 維運與升級 SOP**：新增 — Preview/Production 雙環境 + Patch/Minor/Major 升級流程 + DB 遷移 + Rollback SOP
- **§19 安全與合規**：新增 — OWASP Top 10 對照表 + Secret 管理 + PDPA/GDPR 個資保護
- **目錄重整**：`SPEC.md` 從根目錄搬遷至 `PRD/SPEC.md`，補 `PRD/CHANGELOG.md`（本檔）
- **GHA workflow**：新增 `.github/workflows/ci.yml` — 4-job CI（lint / test / build / deploy-to-vercel）

### 對齊 v2.2.1
- v2.2.1 §1–§16 完整 1047 行規格書（§15 深度市調 + §16 內容深度策略）已完備，**本輪不動**。
- 全部 17 API + 9 Prisma tables + 5 變現引擎 + Sprint 1+2 home/4 子頁 + Vercel Production 上線 = production code 完整度不變。
- v3.0.2 = 純 fleet alignment：補 §0 + §17-19 + 目錄重整 + GHA workflow。

### 已知 issue（升級週處理）
- `npm audit` 顯示 7 個 high vulnerability（多為 Prisma 5.x / Stripe 17.x transitive deps）— 待 2026-09 升級週跑 `npm audit fix` 評估。
- 暫無 unit test（v2.2.1 純 API + DB 整合測試）— v3.0.3 規劃補 vitest + mock Prisma。

---

## v2.2.1 — 2026-07-11 — Sophia (CPO) + Alan (CTO) + Hermes Agent

### Added
- **§15 深度市調報告**：
  - §15.1 市場規模（全球 + 華文 + 5 種變現 ARR 潛在 = NT$4.61 億）
  - §15.2 競品分析（5 家 + quadrant chart）
  - §15.3 預期收益（保守 / 中等 / 樂觀 三情境 + Unit Economics）
  - §15.4 商業化評分（6 維細項 + 加權平均 81/100 = 高水平）
- **§2-13 完整功能規格**：17 個 API + 8 個 tables + 5 種變現引擎 + DoD 8 條
- **DoD (Definition of Done)**：明確 8 條完成標準
- **Sprint 拆解**：Sprint 1 (前端 prototype) + Sprint 2 (後端 + Auth + DB) + Sprint 3 (Stripe + 證書)
- **5 種變現引擎**：個人學習者 + 工程師訂閱 + 企業內訓 + 政府標案 + 顧問服務
- **定價心理學**：NT$199/月 / NT$499/堂 / NT$5 萬/堂 / NT$10 萬/月 / NT$100 萬/標
- **Error Code 統一字典**：12 個錯誤代碼
- **市場驗證計畫**：3 個關鍵問題 + 訪談 SOP
- **失敗模式 SOP**：付費轉換率 <2% / 企業內訓沒客戶 / 政府標案拿不到

### Status
- Demo: https://claude-code-training-gilt.vercel.app ⭐ Vercel Production 2026-07-11 上線
- Source: https://github.com/openclawsean024-create/claude-code-training
- Sprint 1+2 完成：home/4 子頁（courses / dashboard / login / pricing / register）+ 17 API（auth × 3 / courses × 2 / enrollments / dashboard / lessons / progress）+ 9 Prisma tables

---

## v2 — 2026-07-11 — Sophia (CPO)

### Added
- **§15 深度市調報告**：v1 補完，奠基於市場研究。

---

## v1 — 2026-07-08 — Alan (CTO)

### Added
- **Sprint 1 純前端 prototype**：Next.js 16 + React 19 + Tailwind 4 + mock 課程資料
- **首頁 + 課程列表**：靜態展示 4 堂基礎 + 進階 + 企業內訓 + 顧問
- **5 種變現路徑視覺化**：個人 / 訂閱 / 企業 / 標案 / 顧問

### Notes
- v1 純前端，無後端 / 無 DB / 無 Auth。
- v2 起改 Sprint 拆解（純前端 → 全端 SaaS）。
