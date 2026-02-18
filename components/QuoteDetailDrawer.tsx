"use client"

import { useState } from "react"
import { FIGMA } from "@/data/constants"
import type { QuoteDetail } from "@/data/events"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Location01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

export interface QuoteDetailDrawerProps {
  detail: QuoteDetail
  onRequestFinalQuote?: () => void
  onClose?: () => void
}

type PriceView = "group" | "person"

export function QuoteDetailDrawer({ detail, onRequestFinalQuote, onClose }: QuoteDetailDrawerProps) {
  const [priceView, setPriceView] = useState<PriceView>("person")

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top bar: title + close */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b px-5 py-3"
        style={{ borderColor: FIGMA.colors.border }}
      >
        <h2 className="text-[16px] font-normal tracking-[-0.08px] min-w-0 truncate" style={{ color: FIGMA.colors.black }}>
          AI pre-quote
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
      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-6 p-5">
        {/* Property block + quote summary */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            {detail.image && (
              <div className="h-[80px] w-[120px] shrink-0 overflow-hidden rounded-[4px] bg-[#f0f0f0]">
                <img src={detail.image} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[16px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                {detail.venueName}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} />
              {detail.location}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className="rounded-full px-2.5 py-1 text-[12px] font-normal"
                style={{ backgroundColor: FIGMA.colors.greyLight, color: FIGMA.colors.grey }}
              >
                {detail.dateRange}
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[12px] font-normal"
                style={{ backgroundColor: FIGMA.colors.greyLight, color: FIGMA.colors.grey }}
              >
                {detail.participants} participants
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="flex items-center justify-end gap-1.5 text-[14px] font-medium" style={{ color: FIGMA.colors.black }}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} color={FIGMA.colors.green} strokeWidth={1.5} />
            AI pre-quote
          </p>
          <p className="mt-1 text-[20px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            {detail.totalExclTax} {detail.currency} excl. tax
          </p>
          <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
            {detail.perPersonExclTax} {detail.currency} excl. tax/person
          </p>
        </div>
        </div>

        {/* Group / person toggle */}
        <div className="flex gap-0 rounded-[4px] p-0.5" style={{ backgroundColor: FIGMA.colors.greyLight }}>
          {(["group", "person"] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setPriceView(view)}
            className="flex-1 rounded-[4px] py-2 text-[14px] font-medium capitalize transition-colors"
              style={{
              color: priceView === view ? FIGMA.colors.black : FIGMA.colors.grey,
                backgroundColor: priceView === view ? FIGMA.colors.white : "transparent",
                boxShadow: priceView === view ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Service breakdown by day */}
        {detail.days.map((day) => (
          <div key={day.dateLabel} className="space-y-3">
            <h3 className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              {day.dateLabel}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-[14px]">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${FIGMA.colors.border}` }}>
                    <th className="pb-2 pr-2 text-left font-medium" style={{ color: FIGMA.colors.grey }}>Services</th>
                    <th className="pb-2 pr-2 text-right font-medium" style={{ color: FIGMA.colors.grey }}>Unit price</th>
                    <th className="pb-2 text-right font-medium" style={{ color: FIGMA.colors.grey }}>Total excl. tax</th>
                  </tr>
                </thead>
                <tbody>
                  {day.services.map((svc, i) => (
                    <tr key={i} style={{ borderBottom: i < day.services.length - 1 ? `1px solid ${FIGMA.colors.border}` : undefined }}>
                      <td className="py-2.5 pr-2 align-top" style={{ color: FIGMA.colors.black }}>
                        <span className="font-medium">{svc.label}</span>
                        {svc.description && (
                          <p className="mt-0.5 text-[13px] font-normal" style={{ color: FIGMA.colors.grey }}>{svc.description}</p>
                        )}
                      </td>
                      <td className="py-2.5 pr-2 text-right align-top" style={{ color: FIGMA.colors.black }}>{svc.unitPrice}</td>
                      <td className="py-2.5 text-right align-top" style={{ color: FIGMA.colors.black }}>{svc.totalExclTax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="space-y-2 border-t pt-4" style={{ borderColor: FIGMA.colors.border }}>
          <div className="flex justify-between text-[14px]" style={{ color: FIGMA.colors.grey }}>
            <span>Service fees</span>
            <span>{detail.serviceFees} {detail.currency}</span>
          </div>
          <div className="flex justify-between text-[14px] font-medium" style={{ color: FIGMA.colors.black }}>
            <span>Total excl. tax / person</span>
            <span className="text-[16px]">{detail.perPersonExclTax} {detail.currency}</span>
          </div>
          <div className="flex justify-between text-[14px]" style={{ color: FIGMA.colors.grey }}>
            <span>Total incl. tax / person</span>
            <span>{detail.perPersonInclTax} {detail.currency}</span>
          </div>
        </div>
      </div>

      {/* Fixed footer: disclaimer + CTA */}
      <div className="shrink-0 space-y-3 border-t px-5 pb-5 pt-4" style={{ borderColor: FIGMA.colors.border }}>
        <p className="text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
          Please note, this is a pre-quote. Request a final quote to get the complete pricing.
        </p>
        <button
          type="button"
          onClick={onRequestFinalQuote}
          className="rounded-[4px] px-4 py-3 text-[15px] font-medium tracking-[-0.08px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
        >
          Request a final quote
        </button>
      </div>
    </div>
  )
}
