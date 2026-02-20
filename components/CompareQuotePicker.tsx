"use client"

import { useState, useMemo } from "react"
import { FIGMA } from "@/data/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Tick02Icon, LayoutThreeColumnIcon } from "@hugeicons/core-free-icons"
import type { QuoteItemWithInsights } from "@/data/quotes"
import { cn } from "@/lib/cn"

export interface CompareQuotePickerProps {
  quotes: QuoteItemWithInsights[]
  initialSelectedIds: string[]
  onCompare: (quoteIds: string[]) => void
  onClose: () => void
}

const MIN_SELECT = 2
const MAX_SELECT = 4

/** Status styling: color dot + optional background tint */
const STATUS_STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  "AI pre-quote": { dot: "#A78BFA", bg: "rgba(167, 139, 250, 0.08)", text: FIGMA.colors.black },
  "Availability to be confirmed": { dot: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)", text: FIGMA.colors.black },
  "Awaiting deposit": { dot: "#F97316", bg: "rgba(249, 115, 22, 0.08)", text: FIGMA.colors.black },
  "Deposit paid": { dot: "#22C55E", bg: "rgba(34, 197, 94, 0.08)", text: FIGMA.colors.black },
}

function StatusPill({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? { dot: FIGMA.colors.grey, bg: FIGMA.colors.greyLight, text: FIGMA.colors.black }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: style.dot }} />
      {status}
    </span>
  )
}

export { StatusPill }

export function CompareQuotePicker({
  quotes,
  initialSelectedIds,
  onCompare,
  onClose,
}: CompareQuotePickerProps) {
  const stableKey = useMemo(() => initialSelectedIds.join(","), [initialSelectedIds])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initialSelectedIds))
  const [prevKey, setPrevKey] = useState(stableKey)

  if (stableKey !== prevKey) {
    setPrevKey(stableKey)
    setSelectedIds(new Set(initialSelectedIds))
  }

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < MAX_SELECT) next.add(id)
      return next
    })
  }

  const canCompare = selectedIds.size >= MIN_SELECT && selectedIds.size <= MAX_SELECT

  const venueGroups = useMemo(() => {
    const groups: { venue: string; image?: string; quotes: QuoteItemWithInsights[] }[] = []
    for (const q of quotes) {
      let g = groups.find((g) => g.venue === q.venueName)
      if (!g) {
        g = { venue: q.venueName, image: q.image, quotes: [] }
        groups.push(g)
      }
      g.quotes.push(q)
    }
    return groups
  }, [quotes])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className="flex shrink-0 items-center justify-between border-b px-5 py-4"
        style={{ borderColor: FIGMA.colors.border }}
      >
        <h2 className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
          Compare quotes
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={FIGMA.colors.black} strokeWidth={1.5} />
        </button>
      </div>

      <div className="shrink-0 border-b px-5 py-3" style={{ borderColor: FIGMA.colors.border }}>
        <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
          Choose 2–4 quotes to compare. Click a card to add or remove.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="flex flex-col gap-5">
          {venueGroups.map((group) => (
            <div key={group.venue}>
              <div className="flex items-center gap-2 mb-2">
                {group.image && (
                  <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#f0f0f0]">
                    <img src={group.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <p className="text-[13px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                  {group.venue}
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {group.quotes.map((q) => {
                  const selected = selectedIds.has(q.id)
                  return (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={() => toggle(q.id)}
                        className={cn(
                          "flex w-full gap-4 rounded-lg border p-3.5 text-left transition-all duration-150",
                          selected
                            ? "border-black/20 bg-black/[0.03] shadow-sm"
                            : "hover:bg-black/[0.02]"
                        )}
                        style={{
                          borderColor: selected ? undefined : FIGMA.colors.border,
                          backgroundColor: selected ? undefined : FIGMA.colors.white,
                        }}
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
                                selected ? "border-black bg-black" : "border-black/20"
                              )}
                            >
                              {selected && <HugeiconsIcon icon={Tick02Icon} size={12} color="white" strokeWidth={2} />}
                            </span>
                            <p className="text-[15px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                              {q.dateRange}
                            </p>
                            <StatusPill status={q.status} />
                          </div>
                          <p className="ml-7 text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                            {q.attendees} pax · {q.totalPrice} {q.currency} · {q.perPerson} {q.currency}/person
                          </p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        className="shrink-0 border-t px-5 py-4"
        style={{ borderColor: FIGMA.colors.border }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
            {selectedIds.size} selected
          </span>
          <button
            type="button"
            disabled={!canCompare}
            onClick={() => canCompare && onCompare(Array.from(selectedIds))}
            className={cn(
              "flex h-11 items-center gap-2 rounded px-4 font-sans text-[15px] font-medium transition-colors",
              canCompare ? "opacity-100 hover:opacity-90" : "cursor-not-allowed opacity-50"
            )}
            style={{
              backgroundColor: FIGMA.colors.green,
              color: FIGMA.colors.black,
            }}
          >
            <HugeiconsIcon icon={LayoutThreeColumnIcon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}
