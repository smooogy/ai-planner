"use client"

import { FIGMA } from "@/data/constants"

interface ChatArtifactCardProps {
  icon?: React.ReactNode
  message: string
  actionLabel: string
  onAction: () => void
}

export function ChatArtifactCard({ icon, message, actionLabel, onAction }: ChatArtifactCardProps) {
  return (
    <div
      className="mt-4 flex items-center justify-between gap-4 rounded-lg border p-3"
      style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
    >
      <div className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="text-[16px] tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
          {message}
        </span>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="shrink-0 rounded-[4px] border px-3 py-2 text-[14px] font-medium tracking-[-0.08px] transition-colors hover:bg-black/[0.04]"
        style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
      >
        {actionLabel}
      </button>
    </div>
  )
}
