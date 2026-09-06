// Claude Code Training — v3.0.2 minimal unit test
// 測試 src/lib/auth.ts 的純函數（hashPassword / verifyPassword）
import { describe, it, expect } from "vitest"
import { hashPassword, verifyPassword } from "@/lib/auth"

describe("auth — password hashing", () => {
  it("hashPassword 應回傳 bcrypt hash（$2a$ 或 $2b$ 開頭）", async () => {
    const hash = await hashPassword("hello-world-2026")
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/)
    expect(hash).not.toBe("hello-world-2026")
  })

  it("verifyPassword 對正確密碼回傳 true", async () => {
    const hash = await hashPassword("correct-password")
    expect(await verifyPassword("correct-password", hash)).toBe(true)
  })

  it("verifyPassword 對錯誤密碼回傳 false", async () => {
    const hash = await hashPassword("correct-password")
    expect(await verifyPassword("wrong-password", hash)).toBe(false)
  })

  it("兩次 hash 同一密碼結果不同（bcrypt salt）", async () => {
    const h1 = await hashPassword("same-input")
    const h2 = await hashPassword("same-input")
    expect(h1).not.toBe(h2)
    // 但兩個都能 verifyPassword
    expect(await verifyPassword("same-input", h1)).toBe(true)
    expect(await verifyPassword("same-input", h2)).toBe(true)
  })
})
