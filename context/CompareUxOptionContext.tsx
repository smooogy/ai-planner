"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type CompareUxOption = "A" | "C"

const CompareUxOptionContext = createContext<{
  option: CompareUxOption
  setOption: (value: CompareUxOption) => void
} | null>(null)

export function CompareUxOptionProvider({ children }: { children: ReactNode }) {
  const [option, setOption] = useState<CompareUxOption>("A")
  return (
    <CompareUxOptionContext.Provider value={{ option, setOption }}>
      {children}
    </CompareUxOptionContext.Provider>
  )
}

export function useCompareUxOption() {
  const ctx = useContext(CompareUxOptionContext)
  if (!ctx) throw new Error("useCompareUxOption must be used within CompareUxOptionProvider")
  return ctx
}

export const COMPARE_UX_LABELS: Record<CompareUxOption, string> = {
  A: "Mode Compare (A)",
  C: "Compare with AI (C)",
}
