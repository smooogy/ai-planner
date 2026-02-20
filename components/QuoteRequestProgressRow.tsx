"use client"

import { useState, useEffect } from "react"
import { FIGMA } from "@/data/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

const SWITCH_TO_GENERATING_MS = 2500

export interface QuoteRequestProgressRowProps {
  venueName: string
}

export function QuoteRequestProgressRow({ venueName }: QuoteRequestProgressRowProps) {
  const [step, setStep] = useState<"contacting" | "generating">("contacting")

  useEffect(() => {
    const t = setTimeout(() => setStep("generating"), SWITCH_TO_GENERATING_MS)
    return () => clearTimeout(t)
  }, [])

  const label = step === "contacting" ? `Contacting ${venueName}…` : "Generating quote..."

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="flex shrink-0 animate-spin-accoup" style={{ color: FIGMA.colors.grey }}>
        <HugeiconsIcon icon={Loading03Icon} size={20} strokeWidth={1.5} />
      </span>
      <p
        className="text-[14px] font-medium tracking-[-0.08px] animate-text-shimmer-quote"
        style={{ ["--shimmer-base" as string]: FIGMA.colors.black }}
      >
        {label}
      </p>
    </div>
  )
}
