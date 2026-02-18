"use client"

import { useState } from "react"
import { FIGMA } from "@/data/constants"
import type { PreQuoteData } from "@/data/proposals"

interface QuoteGenerationSuccessItemProps {
  preQuote: PreQuoteData
  onRequestFinalQuote?: () => void
}

export function QuoteGenerationSuccessItem({ preQuote, onRequestFinalQuote }: QuoteGenerationSuccessItemProps) {
  const [showFullBreakdown, setShowFullBreakdown] = useState(false)
  const [pricePerPerson, setPricePerPerson] = useState(false)
  const topItems = preQuote.lineItems.slice(0, 3)
  const hasMore = preQuote.lineItems.length > 3
  const displayAmount = pricePerPerson ? preQuote.perPerson : preQuote.totalPrice
  const symbol = preQuote.currency === "EUR" ? "€" : preQuote.currency

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
    >
      {/* Venue header */}
      <div className="p-4 border-b" style={{ borderColor: FIGMA.colors.border }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              {preQuote.venueName}
            </h3>
            {preQuote.location && (
              <p className="mt-0.5 text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                {preQuote.location}
              </p>
            )}
            <div className="mt-1 flex flex-wrap gap-2 text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              {preQuote.dateRange && <span>{preQuote.dateRange}</span>}
              {preQuote.participants != null && <span>{preQuote.participants} participants</span>}
            </div>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium"
            style={{ backgroundColor: "rgba(198, 226, 120, 0.5)", color: FIGMA.colors.black }}
          >
            AI pre-quote
          </span>
        </div>
      </div>

      {/* Price + toggle */}
      <div className="px-4 py-3 flex items-center justify-between gap-4" style={{ backgroundColor: FIGMA.colors.greyLight }}>
        <div className="flex items-baseline gap-2">
          <span className="text-[24px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            {symbol}{displayAmount.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() => setPricePerPerson((p) => !p)}
            className="text-[14px] font-normal tracking-[-0.08px] underline"
            style={{ color: FIGMA.colors.grey }}
          >
            {pricePerPerson ? "Show total" : "Per person"}
          </button>
        </div>
      </div>

      {/* Line items summary */}
      <div className="p-4">
        <ul className="flex flex-col gap-1.5">
          {topItems.map((item, i) => (
            <li key={i} className="flex justify-between text-[14px] tracking-[-0.08px]">
              <span style={{ color: FIGMA.colors.grey }}>{item.label}</span>
              <span style={{ color: FIGMA.colors.black }}>
                {item.currency === "EUR" ? "€" : item.currency}{item.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <>
            <button
              type="button"
              onClick={() => setShowFullBreakdown((b) => !b)}
              className="mt-2 text-[14px] font-medium tracking-[-0.08px]"
              style={{ color: FIGMA.colors.black }}
            >
              {showFullBreakdown ? "Hide breakdown" : "View full breakdown"}
            </button>
            {showFullBreakdown && (
              <ul className="mt-2 flex flex-col gap-1.5 border-t pt-2" style={{ borderColor: FIGMA.colors.border }}>
                {preQuote.lineItems.slice(3).map((item, i) => (
                  <li key={i} className="flex justify-between text-[14px] tracking-[-0.08px]">
                    <span style={{ color: FIGMA.colors.grey }}>{item.label}</span>
                    <span style={{ color: FIGMA.colors.black }}>
                      {item.currency === "EUR" ? "€" : item.currency}{item.amount.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <button
          type="button"
          onClick={onRequestFinalQuote}
          className="mt-4 h-10 rounded-[4px] px-4 font-medium text-[15px] tracking-[-0.08px] transition-colors hover:opacity-90"
          style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
        >
          Request final quote
        </button>
      </div>
    </div>
  )
}
