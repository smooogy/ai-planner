"use client"

import { useState } from "react"
import { FIGMA } from "@/data/constants"
import { ChatInput } from "@/components/ChatInput"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

export type AiChatContext =
  | { type: "proposal"; venueName: string }
  | { type: "quote"; quoteNumber: number; venueName?: string }

const PROPOSAL_SUGGESTIONS = [
  "What's included?",
  "Can you break down the pricing?",
  "When is it available?",
  "What's the capacity?",
]
const QUOTE_SUGGESTIONS = [
  "How do I change the dates?",
  "Can I add catering?",
  "Can you break down the pricing?",
  "What are the availability options?",
]

export interface AiChatDrawerProps {
  context: AiChatContext
  onClose?: () => void
}

export function AiChatDrawer({ context, onClose }: AiChatDrawerProps) {
  const [inputValue, setInputValue] = useState("")

  const title =
    context.type === "proposal"
      ? `Chat about ${context.venueName}`
      : `Quote #${context.quoteNumber} changes`

  const suggestions = context.type === "proposal" ? PROPOSAL_SUGGESTIONS : QUOTE_SUGGESTIONS

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) setInputValue("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[4px] border border-black/10 pb-4 overflow-hidden">
      {/* Top bar: title + close, with bottom separator */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b py-3 px-4"
        style={{ borderColor: FIGMA.colors.border }}
      >
        <h2 className="text-[16px] font-normal tracking-[-0.08px] min-w-0 truncate" style={{ color: FIGMA.colors.black }}>
          {title}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded p-1.5 transition-colors hover:bg-black/5"
            style={{ color: FIGMA.colors.grey }}
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Center: title + suggestions in grey pills */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto py-8">
        <p className="mb-3 text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
          Suggestions
        </p>
        <div className="flex flex-col gap-2">
          {suggestions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setInputValue(label)}
              className="rounded-full border bg-neutral-100 px-3 py-1.5 text-[14px] font-normal tracking-[-0.08px] transition-colors hover:bg-neutral-200"
              style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.grey }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed footer: chat input (no separator above) */}
      <div className="shrink-0 pt-4 px-4">
        <ChatInput
          variant="small"
          placeholder={context.type === "proposal" ? "Ask about this venue..." : "Ask about this quote..."}
          value={inputValue}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
