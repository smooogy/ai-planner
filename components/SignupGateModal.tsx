"use client"

import { useState } from "react"
import { FIGMA } from "@/data/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

export interface SignupGateModalProps {
  open: boolean
  onClose: () => void
  /** Called with email when user clicks Continue (mock only) */
  onContinue?: (email: string) => void
}

const TITLE = "Create your event workspace"
const SUBTITLE = "Access full pricing, coordinate with the venue, and manage all your quotes in one place."
const EMAIL_PLACEHOLDER = "you@company.com"
const CONTINUE_LABEL = "Continue"
const LATER_LABEL = "I'll do it later"

export function SignupGateModal({ open, onClose, onContinue }: SignupGateModalProps) {
  const [email, setEmail] = useState("")

  const handleContinue = () => {
    onContinue?.(email.trim() || email)
    onClose()
    setEmail("")
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-lg border bg-white p-6 shadow-lg"
        style={{ borderColor: FIGMA.colors.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            {TITLE}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-black/5"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} color={FIGMA.colors.grey} strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-2 text-[14px] leading-[1.5] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
          {SUBTITLE}
        </p>
        <div className="mt-4">
          <label htmlFor="signup-email" className="sr-only">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={EMAIL_PLACEHOLDER}
            className="w-full rounded-[4px] border px-3 py-2.5 text-[14px] outline-none transition-[border-color] focus:border-black/30"
            style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
          />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-[4px] px-4 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
          >
            {CONTINUE_LABEL}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[4px] px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-black/[0.04]"
            style={{ color: FIGMA.colors.grey }}
          >
            {LATER_LABEL}
          </button>
        </div>
      </div>
    </div>
  )
}
