"use client"

import { useEffect, useState } from "react"
import { FIGMA } from "@/data/constants"

export type QuoteBannerItem = {
  id: string
  venueId: string | number
  venueName: string
  status: "loading" | "success" | "error"
}

const MAX_VISIBLE = 2
const SUCCESS_DISMISS_MS = 3500
const STEP_INTERVAL_MS = 1800

const LOADING_STEPS = [
  "Preparing quote…",
  "Checking availability…",
  "Applying Naboo rates…",
  "Building your package…",
  "Finalizing…",
]

interface QuoteGenerationBannerProps {
  items: QuoteBannerItem[]
  onDismiss: (id: string) => void
  onRetry?: (id: string) => void
}

export function QuoteGenerationBanner({ items, onDismiss, onRetry }: QuoteGenerationBannerProps) {
  const [dismissedSuccess, setDismissedSuccess] = useState<Set<string>>(new Set())
  const [stepIndex, setStepIndex] = useState(0)
  const visible = items.filter((i) => i.status !== "success" || !dismissedSuccess.has(i.id))
  const loadingCount = items.filter((i) => i.status === "loading").length
  const loadingStep = LOADING_STEPS[stepIndex % LOADING_STEPS.length]

  useEffect(() => {
    if (loadingCount === 0) return
    const t = setInterval(() => setStepIndex((i) => i + 1), STEP_INTERVAL_MS)
    return () => clearInterval(t)
  }, [loadingCount])

  useEffect(() => {
    const successItems = items.filter((i) => i.status === "success" && !dismissedSuccess.has(i.id))
    if (successItems.length === 0) return
    const t = setTimeout(() => {
      successItems.forEach((i) => {
        setDismissedSuccess((prev) => new Set(prev).add(i.id))
        onDismiss(i.id)
      })
    }, SUCCESS_DISMISS_MS)
    return () => clearTimeout(t)
  }, [items, dismissedSuccess, onDismiss])

  if (visible.length === 0) return null

  const loadingItems = visible.filter((i) => i.status === "loading")
  const successItems = visible.filter((i) => i.status === "success")
  const errorItems = visible.filter((i) => i.status === "error")

  const displayText =
    loadingCount > 0
      ? loadingCount > 1
        ? `Preparing ${loadingCount} quotes… ${loadingStep}`
        : `Preparing quote for ${loadingItems[0]?.venueName ?? "venue"}… ${loadingStep}`
      : successItems.length > 0
        ? successItems.length === 1
          ? `Quote ready for ${successItems[0].venueName}`
          : `${successItems.length} quotes ready`
        : errorItems.length > 0
          ? errorItems.length === 1
            ? `Couldn't generate quote for ${errorItems[0].venueName}`
            : "Some quotes couldn't be generated"
          : ""

  const showShimmer = loadingCount > 0
  const showCheck = successItems.length > 0 && loadingCount === 0
  const hasError = errorItems.length > 0

  return (
    <div className="w-full flex flex-col shrink-0">
      <div
        className="flex w-full items-center justify-center gap-1.5 px-4 py-3"
        style={{ backgroundColor: FIGMA.colors.white }}
      >
        {showCheck && (
          <span className="text-[12px] leading-none" style={{ color: FIGMA.colors.green }} aria-hidden>✓</span>
        )}
        <p
          className={`text-center text-[14px] font-normal tracking-[-0.08px] ${showShimmer ? "animate-text-shimmer" : ""}`}
          style={{ color: FIGMA.colors.black }}
        >
          {displayText}
        </p>
        {hasError && onRetry && errorItems.length === 1 && (
          <button
            type="button"
            onClick={() => onRetry(errorItems[0].id)}
            className="shrink-0 text-[13px] font-medium"
            style={{ color: FIGMA.colors.black }}
          >
            Retry
          </button>
        )}
      </div>
      <div
        className="h-px w-full animate-border-slide"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 0%, ${FIGMA.colors.green} 50%, transparent 100%)`,
        }}
        aria-hidden
      />
    </div>
  )
}
