"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FIGMA } from "@/data/constants"
import { PROTOTYPE_ADVISOR } from "@/data/advisor"
import { cn } from "@/lib/cn"
import { ChatInput } from "@/components/ChatInput"

export default function NewEventPage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    // Design-only: redirect to first mock event after a short delay
    setTimeout(() => router.push("/events/e2"), 800)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden font-sans antialiased bg-white">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 px-4 sm:px-6 bg-white">
        <p className="flex-1 min-w-0 text-[14px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
          New event
        </p>
        <div
          className="flex items-center gap-2 rounded-full border pl-1 pr-3 py-1 shrink-0"
          style={{ borderColor: FIGMA.colors.border }}
        >
          <img src={PROTOTYPE_ADVISOR.avatar ?? ""} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          <span className="text-[14px] font-medium truncate max-w-[120px]" style={{ color: FIGMA.colors.black }}>
            {PROTOTYPE_ADVISOR.name}
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center overflow-auto px-4 py-8">
        {isSubmitting ? (
          <div className="flex w-full max-w-[620px] flex-col items-center gap-8 text-center">
            <div
              className="h-10 w-10 shrink-0 rounded-full border-2 border-black/20 border-t-black animate-spin"
              aria-hidden
            />
            <p className="text-[16px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              Creating your workspace…
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[620px] flex flex-col items-center gap-6">
            <div className="flex flex-col gap-3 items-center text-center">
              <h2
                className="font-aeonik text-2xl sm:text-3xl font-normal tracking-[-0.08px] leading-[0.95]"
                style={{ color: FIGMA.colors.black }}
              >
                Describe your event
              </h2>
              <p className="text-base sm:text-lg tracking-[-0.08px] leading-[1.4]" style={{ color: FIGMA.colors.grey }}>
                Tell us what you need and we'll find the best venues for you.
              </p>
            </div>

            <div className="w-full">
              <ChatInput
                placeholder="e.g. 2-day offsite, 30 people, Paris, budget €150/person"
                value={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleSubmit}
                disabled={isSubmitting}
                minHeight="140px"
                className="w-full max-w-[620px]"
                autoFocus
              />
            </div>

            <p className="text-[12px] font-normal text-center" style={{ color: FIGMA.colors.grey }}>
              E.g. team offsite, board meeting, product launch…
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {["Team offsite", "Multi-day retreat"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInputValue(suggestion)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[14px] font-medium transition-colors",
                    "border-black/10 bg-white hover:border-black/30",
                  )}
                  style={{ color: FIGMA.colors.black }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
