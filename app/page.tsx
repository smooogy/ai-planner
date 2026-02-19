"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/cn"
import { FIGMA } from "@/data/constants"

const SUGGESTIONS = [
  "Team offsite for 30 people, 2 days near Paris, château style",
  "Company retreat for 50 people, 3 nights in Normandy with team activities",
]

const CHECKLIST_PILLS = [
  { key: "eventType", label: "Event type", detected: true },
  { key: "participants", label: "Participants", detected: true },
  { key: "location", label: "Location", detected: true },
  { key: "date", label: "Date", detected: false },
  { key: "budget", label: "Budget", detected: false },
]

export default function LandingPage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [showPills, setShowPills] = useState(false)
  const pillsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      pillsTimerRef.current = setTimeout(() => setShowPills(true), 500)
    } else {
      setShowPills(false)
      if (pillsTimerRef.current) clearTimeout(pillsTimerRef.current)
    }
    return () => {
      if (pillsTimerRef.current) clearTimeout(pillsTimerRef.current)
    }
  }, [inputValue])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [inputValue])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (inputValue.trim()) {
        router.push("/events/e1")
      }
    },
    [inputValue, router],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="relative min-h-screen bg-white font-sans antialiased">
      {/* Blue gradient background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[550px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(122, 160, 238, 0.14) 10%, rgba(122, 160, 238, 0.04) 59.14%, rgba(122, 160, 238, 0) 100%)",
        }}
      />

      {/* Header */}
      <header className="relative z-20 flex h-16 items-center justify-between px-6">
        <Link href="/" className="h-[18px] shrink-0">
          <img src="/logo-v2.svg" alt="Naboo" className="h-full w-auto object-contain" />
        </Link>
        <Link
          href="/events"
          className="rounded-[4px] border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-black/[0.04]"
          style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
        >
          My events
        </Link>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex w-full justify-center px-4 pt-16">
        <div className="flex w-full max-w-[800px] flex-col items-center gap-6">

          {/* Title + subtitle */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1
              className="text-2xl font-normal leading-[0.95] tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: FIGMA.colors.black }}
            >
              Where should your next event be?
            </h1>
            <p
              className="text-base leading-[1.4] tracking-[-0.2px] sm:text-lg"
              style={{ color: FIGMA.colors.grey }}
            >
              Describe your event and let Naboo find the perfect venue.
            </p>
          </div>

          {/* Input */}
          <div className="w-full max-w-full md:w-[620px]">
            <form onSubmit={handleSubmit}>
              <div
                className="relative w-full overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow] focus-within:border-black/25"
                style={{
                  borderColor: "rgba(0,0,0,0.15)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex flex-col gap-3 p-4">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your event — type, number of people, location, dates…"
                    rows={1}
                    className="w-full resize-none border-0 bg-transparent text-[16px] font-normal leading-snug outline-none placeholder:text-[#9ca3af] focus:outline-none focus-visible:ring-0"
                    style={{ color: FIGMA.colors.black, minHeight: 40 }}
                  />

                  <div className="flex items-center justify-between gap-2">
                    {/* Detection pills */}
                    <div className="flex min-h-[28px] flex-1 flex-wrap items-center gap-1.5">
                      {showPills &&
                        CHECKLIST_PILLS.map(({ key, label, detected }) => (
                          <span
                            key={key}
                            className={cn(
                              "inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] font-normal transition-opacity",
                              !detected && "opacity-40",
                            )}
                            style={{
                              borderColor: detected ? FIGMA.colors.green : FIGMA.colors.border,
                              backgroundColor: detected ? "rgba(198,226,120,0.15)" : "transparent",
                              color: "#5c5f62",
                            }}
                          >
                            {label}
                          </span>
                        ))}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-90 disabled:opacity-40"
                      style={{ backgroundColor: FIGMA.colors.green }}
                      aria-label="Search"
                    >
                      <img src="/send-msg.svg" alt="" className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Suggestions */}
            <div className="mt-5 flex flex-col items-center gap-3">
              <p className="text-center text-[12px]" style={{ color: FIGMA.colors.grey }}>
                Quick examples
              </p>
              <div className="flex flex-col items-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInputValue(s)}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-[14px] font-medium transition-colors hover:border-black/30"
                    style={{ color: FIGMA.colors.black }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
