"use client"

import { useRef, useEffect } from "react"
import { FIGMA } from "@/data/constants"
import { cn } from "@/lib/cn"

interface ChatInputProps {
  value: string
  onInputChange: (value: string) => void
  onSubmit?: (e: React.FormEvent) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  /** "big" = multi-line textarea (auto-resize); "small" = single-line input (event view). Default "big". */
  variant?: "big" | "small"
  /** Min height for big variant (e.g. "80px", "140px"). Ignored when variant="small". */
  minHeight?: string
  /** Focus the input on mount. */
  autoFocus?: boolean
}

/** AI chat input: big (multi-line) or small (single-line, ChatGPT-style). */
export function ChatInput({
  value,
  onInputChange,
  onSubmit,
  placeholder = "Ask any question...",
  className,
  disabled = false,
  variant = "big",
  minHeight = "80px",
  autoFocus = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  useEffect(() => {
    if (variant !== "big") return
    const el = textareaRef.current
    if (!el) return
    const adjust = () => {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
    el.addEventListener("input", adjust)
    adjust()
    return () => el.removeEventListener("input", adjust)
  }, [value, variant])

  const formClass = cn(
    "relative w-full overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow]",
    "border-black/15 focus-within:border-black/25",
    className,
  )
  const formStyleBig = { boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)" }
  const formStyleSmall = { boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)" }

  if (variant === "small") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.(e)
        }}
        className={cn(formClass, "flex items-center gap-2")}
        style={formStyleSmall}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDownInput}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "min-h-[60px] flex-1 border-0 bg-transparent px-4 py-3 outline-none focus:outline-none focus-visible:ring-0",
            "text-[17px] placeholder:text-[17px] placeholder:font-normal",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          style={{ color: FIGMA.colors.black }}
          data-chat-input
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
          aria-label="Send message"
        >
          <img src="/send-msg.svg" alt="" className="size-4" aria-hidden />
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
      className={formClass}
      style={formStyleBig}
    >
      <div className="flex h-full flex-col justify-between p-3" style={{ minHeight }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDownTextarea}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          autoFocus={autoFocus}
          className={cn(
            "min-h-10 w-full resize-none border-0 bg-transparent outline-none focus:outline-none focus-visible:ring-0",
            "text-[17px] placeholder:text-[17px] placeholder:font-normal",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          style={{ color: FIGMA.colors.black, minHeight: 40 }}
          data-chat-textarea
        />
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
            style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
            aria-label="Send message"
          >
            <img src="/send-msg.svg" alt="" className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  )
}
