"use client"

import { useState, useEffect } from "react"
import { FIGMA } from "@/data/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  AiMagicIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons"
import type { QuoteItemWithInsights } from "@/data/quotes"
import {
  MOCK_COMPARE_AI_VERDICTS,
  generateAiSummaryParagraph,
  generateSuggestedQuestions,
} from "@/data/quotes"
import type { QuoteDetail } from "@/data/events"
import { cn } from "@/lib/cn"

export interface CompareQuotesViewProps {
  quotes: QuoteItemWithInsights[]
  details: Record<string, QuoteDetail>
  onClose: () => void
  onAskAi: (initialQuestion?: string) => void
  onViewQuote: (quoteId: string) => void
  onRemoveQuote: (quoteId: string) => void
  onRequestFinalQuote: (quoteId: string) => void
}

type DiffRow = {
  label: string
  values: string[]
  bestIndices: number[]
}

function parseEuroNumber(s: string): number {
  return Number(s.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
}

function getKeyDifferences(quotes: QuoteItemWithInsights[], details: Record<string, QuoteDetail>): DiffRow[] {
  const prices = quotes.map((q) => q.numericTotal)
  const minPrice = Math.min(...prices)
  const priceRow: DiffRow = {
    label: "Total price",
    values: quotes.map((q) => `${q.currency} ${q.totalPrice}`),
    bestIndices: prices.map((p, i) => (p === minPrice ? i : -1)).filter((i) => i >= 0),
  }

  const pp = quotes.map((q) => q.numericPerPerson)
  const minPp = Math.min(...pp)
  const ppRow: DiffRow = {
    label: "Per person",
    values: quotes.map((q) => `${q.currency} ${q.perPerson}/person`),
    bestIndices: pp.map((p, i) => (p === minPp ? i : -1)).filter((i) => i >= 0),
  }

  const includedRow: DiffRow = {
    label: "Included",
    values: quotes.map((q) => q.includedServices.join(", ") || "—"),
    bestIndices: quotes
      .map((q, i) => (q.notIncluded.length === 0 ? i : -1))
      .filter((i) => i >= 0),
  }

  const availRow: DiffRow = {
    label: "Availability",
    values: quotes.map((q) => q.status),
    bestIndices: quotes
      .map((q, i) => (q.status === "Deposit paid" ? i : -1))
      .filter((i) => i >= 0),
  }

  const fees = quotes.map((q) => {
    const d = details[q.id]
    return d ? parseEuroNumber(d.serviceFees) : 999
  })
  const minFee = Math.min(...fees)
  const feesRow: DiffRow = {
    label: "Service fees",
    values: quotes.map((q) => {
      const d = details[q.id]
      return d ? `${d.serviceFees} ${d.currency}` : "—"
    }),
    bestIndices: fees.map((f, i) => (f === minFee ? i : -1)).filter((i) => i >= 0),
  }

  const cancelRank = { Flexible: 0, Standard: 1, Strict: 2 } as const
  const cancelScores = quotes.map((q) => cancelRank[q.cancellation])
  const bestCancel = Math.min(...cancelScores)
  const cancelRow: DiffRow = {
    label: "Cancellation",
    values: quotes.map((q) => q.cancellation),
    bestIndices: cancelScores.map((s, i) => (s === bestCancel ? i : -1)).filter((i) => i >= 0),
  }

  return [priceRow, ppRow, includedRow, availRow, feesRow, cancelRow]
}

export function CompareQuotesView({
  quotes,
  details,
  onClose,
  onAskAi,
  onViewQuote,
  onRemoveQuote,
  onRequestFinalQuote,
}: CompareQuotesViewProps) {
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null)
  const [shimmerDone, setShimmerDone] = useState(false)

  useEffect(() => {
    setShimmerDone(false)
    const t = setTimeout(() => setShimmerDone(true), 1200)
    return () => clearTimeout(t)
  }, [quotes.map((q) => q.id).join(",")])

  const differences = getKeyDifferences(quotes, details)
  const summaryParagraph = generateAiSummaryParagraph(quotes)
  const suggestedQuestions = generateSuggestedQuestions(quotes)

  const venueCount = new Map<string, number>()
  for (const q of quotes) venueCount.set(q.venueName, (venueCount.get(q.venueName) ?? 0) + 1)
  const quoteLabel = (q: QuoteItemWithInsights) =>
    (venueCount.get(q.venueName) ?? 0) > 1 ? `${q.venueName} (${q.dateRange})` : q.venueName

  const getVerdictBadges = (quoteId: string) =>
    MOCK_COMPARE_AI_VERDICTS.find((v) => v.quoteId === quoteId)?.badges ?? []

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

      <div className="min-h-0 flex-1 overflow-auto">
        {/* Sticky AI Recommendation — paragraph + verdict badges merged */}
        <div
          className="sticky top-0 z-10 shrink-0 border-b px-5 py-4"
          style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
        >
          <div className="flex items-center gap-2 mb-2">
            <HugeiconsIcon icon={AiMagicIcon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
            <p className="text-[13px] font-medium uppercase tracking-wider" style={{ color: FIGMA.colors.grey }}>
              AI Recommendation
            </p>
          </div>
          {!shimmerDone ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 w-full rounded bg-black/5" />
              <div className="h-4 w-4/5 rounded bg-black/5" />
              <div className="h-4 w-3/5 rounded bg-black/5" />
            </div>
          ) : (
            <>
              <p
                className="text-[14px] leading-[1.6] tracking-[-0.08px] mb-3"
                style={{ color: FIGMA.colors.black }}
              >
                {summaryParagraph}
              </p>
              <div className="flex flex-wrap gap-2">
                {quotes.map((q) => {
                  const badges = getVerdictBadges(q.id)
                  if (badges.length === 0) return null
                  return badges.map((badge) => (
                    <span
                      key={`${q.id}-${badge}`}
                      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[12px] font-medium"
                      style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
                    >
                      {badge}: {quoteLabel(q)}
                    </span>
                  ))
                })}
              </div>
            </>
          )}
        </div>

        <div className={cn("p-5 space-y-6 transition-opacity duration-300", shimmerDone ? "opacity-100" : "opacity-0")}>
          {/* Key differences with highlighted best values */}
          <section>
            <p className="mb-2 text-[13px] font-medium uppercase tracking-wider" style={{ color: FIGMA.colors.grey }}>
              Key differences
            </p>
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: FIGMA.colors.border }}>
              <table className="w-full min-w-[500px] border-collapse text-left text-[14px]">
                <thead>
                  <tr style={{ backgroundColor: FIGMA.colors.greyLight }}>
                    <th className="w-[140px] px-3 py-2.5 text-left font-medium" style={{ color: FIGMA.colors.grey }} />
                    {quotes.map((q) => (
                      <th key={q.id} className="min-w-[140px] px-3 py-2.5 text-left font-medium" style={{ color: FIGMA.colors.black }}>
                        <div className="flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <span className="block truncate">{q.venueName}</span>
                            <span className="block text-[11px] font-normal truncate" style={{ color: FIGMA.colors.grey }}>{q.dateRange}</span>
                          </div>
                          {quotes.length > 2 && (
                            <button
                              type="button"
                              onClick={() => onRemoveQuote(q.id)}
                              className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-black/10"
                              aria-label={`Remove ${q.venueName}`}
                            >
                              <HugeiconsIcon icon={Cancel01Icon} size={14} color={FIGMA.colors.grey} strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {differences.map((row, i) => (
                    <tr
                      key={row.label}
                      style={{
                        borderTop: i > 0 ? `1px solid ${FIGMA.colors.border}` : undefined,
                      }}
                    >
                      <td className="px-3 py-2.5 font-medium" style={{ color: FIGMA.colors.grey }}>
                        {row.label}
                      </td>
                      {row.values.map((value, j) => {
                        const isBest = row.bestIndices.includes(j)
                        return (
                          <td
                            key={j}
                            className="px-3 py-2.5"
                            style={{
                              color: isBest ? FIGMA.colors.black : FIGMA.colors.black,
                              fontWeight: isBest ? 600 : 400,
                              backgroundColor: isBest ? "rgba(198, 226, 120, 0.18)" : undefined,
                            }}
                          >
                            {value}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Expandable Full breakdown per quote */}
          <section>
            <p className="mb-2 text-[13px] font-medium uppercase tracking-wider" style={{ color: FIGMA.colors.grey }}>
              Full breakdown
            </p>
            <div className="flex flex-col gap-2">
              {quotes.map((q) => {
                const detail = details[q.id] as QuoteDetail | undefined
                const expanded = expandedQuoteId === q.id
                return (
                  <div
                    key={q.id}
                    className="rounded-lg border overflow-hidden"
                    style={{ borderColor: FIGMA.colors.border }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedQuoteId(expanded ? null : q.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-black/[0.02]"
                      style={{ color: FIGMA.colors.black }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium">{q.venueName}</span>
                        <span className="text-[13px] font-normal" style={{ color: FIGMA.colors.grey }}>
                          {q.dateRange}
                        </span>
                      </div>
                      <HugeiconsIcon
                        icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
                        size={18}
                        color={FIGMA.colors.grey}
                        strokeWidth={1.5}
                      />
                    </button>
                    {expanded && detail && (
                      <div className="border-t px-4 pb-4 pt-2" style={{ borderColor: FIGMA.colors.border }}>
                        {detail.days.map((day) => (
                          <div key={day.dateLabel} className="space-y-2">
                            <h4 className="text-[13px] font-medium" style={{ color: FIGMA.colors.grey }}>
                              {day.dateLabel}
                            </h4>
                            <table className="w-full border-collapse text-[13px]">
                              <tbody>
                                {day.services.map((svc, si) => (
                                  <tr key={si} style={{ borderBottom: `1px solid ${FIGMA.colors.border}` }}>
                                    <td className="py-1.5 pr-2" style={{ color: FIGMA.colors.black }}>
                                      {svc.label}
                                      {svc.description && (
                                        <span className="ml-1" style={{ color: FIGMA.colors.grey }}>– {svc.description}</span>
                                      )}
                                    </td>
                                    <td className="py-1.5 text-right whitespace-nowrap" style={{ color: FIGMA.colors.black }}>
                                      {svc.totalExclTax}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                        <div className="mt-3 flex justify-between text-[13px] font-medium" style={{ color: FIGMA.colors.black }}>
                          <span>Total excl. tax</span>
                          <span>{detail.totalExclTax} {detail.currency}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onViewQuote(q.id)}
                            className="text-[13px] font-medium underline underline-offset-2"
                            style={{ color: FIGMA.colors.grey }}
                          >
                            View full AI pre-quote
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Request final quote CTA */}
          <section>
            <p className="mb-2 text-[13px] font-medium uppercase tracking-wider" style={{ color: FIGMA.colors.grey }}>
              Next steps
            </p>
            <div className="flex flex-wrap gap-3">
              {quotes.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onRequestFinalQuote(q.id)}
                  className="flex items-center gap-2 rounded-[4px] px-4 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
                >
                  Request final quote – {quoteLabel(q)}
                </button>
              ))}
            </div>
          </section>

          {/* Ask AI CTA + suggested questions */}
          <section className="rounded-lg border p-4" style={{ borderColor: FIGMA.colors.border }}>
            <div className="flex items-center gap-2 mb-2">
              <HugeiconsIcon icon={AiMagicIcon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
              <p className="text-[14px] font-medium" style={{ color: FIGMA.colors.black }}>
                Ask AI about this comparison
              </p>
            </div>
            <p className="mb-3 text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              Get a recommendation or dig into the details.
            </p>
            <button
              type="button"
              onClick={() => onAskAi()}
              className="mb-4 flex items-center gap-2 rounded-[4px] px-4 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
            >
              <HugeiconsIcon icon={AiMagicIcon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
              Ask AI about this comparison
            </button>
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wider" style={{ color: FIGMA.colors.grey }}>
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onAskAi(question)}
                  className="rounded-full border px-3 py-1.5 text-[13px] transition-colors hover:bg-black/5"
                  style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
                >
                  {question}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
