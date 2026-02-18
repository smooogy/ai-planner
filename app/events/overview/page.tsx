"use client"

import { useState } from "react"
import Link from "next/link"
import { FIGMA } from "@/data/constants"
import { MOCK_ACTION_REQUIRED } from "@/data/events"
import type { ActionRequiredItem } from "@/data/events"
import { ChatInput } from "@/components/ChatInput"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon, SparklesIcon } from "@hugeicons/core-free-icons"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

/** Overview page: greetings, AI input, Action required cards (quotes expiring, new quotes). */
export default function OverviewPage() {
  const [inputValue, setInputValue] = useState("")
  const actionItems = MOCK_ACTION_REQUIRED

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    // Design-only: no navigation
    setInputValue("")
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden font-sans antialiased bg-white">
      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-[640px]">
          <h1 className="mb-6 text-[24px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            {getGreeting()}
          </h1>

          <div className="mb-8">
            <ChatInput
              value={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleSubmit}
              placeholder="What are you planning?"
              minHeight="80px"
            />
          </div>

          {actionItems.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                Action required
              </h2>
              <ul className="flex flex-col gap-3">
                {actionItems.map((item: ActionRequiredItem) => (
                  <li key={item.id}>
                    <Link
                      href={`/events/${item.eventId}`}
                      className="flex items-start gap-3 rounded-lg border bg-white p-4 transition-colors hover:bg-black/[0.02]"
                      style={{ borderColor: FIGMA.colors.border }}
                    >
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: item.type === "quote_expiring" ? "rgba(220, 53, 69, 0.12)" : "rgba(198, 226, 120, 0.4)",
                        }}
                      >
                        <HugeiconsIcon
                          icon={item.type === "quote_expiring" ? AlertCircleIcon : SparklesIcon}
                          size={18}
                          color={item.type === "quote_expiring" ? "#dc3545" : FIGMA.colors.black}
                          strokeWidth={1.5}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium tracking-[-0.08px] line-clamp-1" style={{ color: FIGMA.colors.black }}>
                          {item.eventName}
                        </p>
                        <p className="mt-0.5 text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                          {item.message}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
