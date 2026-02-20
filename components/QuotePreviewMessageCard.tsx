"use client"

import { FIGMA } from "@/data/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiMagicIcon, Tick01Icon, Location01Icon, DocumentValidationIcon } from "@hugeicons/core-free-icons"

export interface QuoteServiceLine {
  label: string
  unitPrice: string
  totalExclTax: string
}

export interface QuotePreviewMessageCardProps {
  venueName: string
  location?: string
  image?: string
  participants?: number
  totalPrice: string
  perPersonPrice: string
  currency?: string
  serviceLines: QuoteServiceLine[]
  onViewFullQuote: () => void
  onAskAi?: () => void
}

export function QuotePreviewMessageCard({
  venueName,
  location,
  image,
  participants,
  totalPrice,
  perPersonPrice,
  currency = "€",
  serviceLines = [],
  onViewFullQuote,
  onAskAi,
}: QuotePreviewMessageCardProps) {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
    >
      {/* Label bar */}
      <div className="flex items-center gap-1.5 px-5 py-2.5" style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}>
        <HugeiconsIcon icon={DocumentValidationIcon} size={15} color={FIGMA.colors.grey} strokeWidth={1.5} />
        <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
          Generated quote
        </p>
      </div>

      {/* Header */}
      <div className="flex gap-4 p-5">
        {image && (
          <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[6px] bg-[#f0f0f0]">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-medium tracking-[-0.2px]" style={{ color: FIGMA.colors.black }}>
            {venueName}
          </p>
          {location && (
            <div className="mt-0.5 flex items-center gap-1">
              <HugeiconsIcon icon={Location01Icon} size={13} color={FIGMA.colors.grey} strokeWidth={1.5} />
              <p className="text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                {location}
              </p>
            </div>
          )}
          {participants != null && (
            <span
              className="mt-2 inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[12px] font-medium tracking-[-0.08px]"
              style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
            >
              {participants} participants
            </span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium"
            style={{ backgroundColor: "rgba(198, 226, 120, 0.25)", color: "#4d7c0f" }}
          >
            <HugeiconsIcon icon={Tick01Icon} size={13} color="#4d7c0f" strokeWidth={2} />
            Pré-devis IA
          </span>
          <p className="mt-2 text-[24px] font-medium tracking-[-0.5px] leading-tight" style={{ color: FIGMA.colors.black }}>
            {totalPrice} {currency}
            <span className="ml-1 text-[13px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              excl. tax
            </span>
          </p>
          <p className="mt-0.5 text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
            {perPersonPrice} {currency} excl. tax/person
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="border-t px-5 pt-4 pb-2" style={{ borderColor: FIGMA.colors.border }}>
        <table className="w-full text-[13px] tracking-[-0.08px]">
          <thead>
            <tr className="border-b" style={{ borderColor: FIGMA.colors.border }}>
              <th className="pb-2 text-left font-medium" style={{ color: FIGMA.colors.grey }}>Services</th>
              <th className="pb-2 text-right font-medium" style={{ color: FIGMA.colors.grey }}>Unit price</th>
              <th className="pb-2 text-right font-medium" style={{ color: FIGMA.colors.grey }}>Total excl. tax</th>
            </tr>
          </thead>
          <tbody>
            {serviceLines.map((line, i) => (
              <tr key={i} className="border-b last:border-0" style={{ borderColor: FIGMA.colors.border }}>
                <td className="py-3 pr-4 font-normal" style={{ color: FIGMA.colors.black }}>
                  {line.label}
                </td>
                <td className="py-3 text-right whitespace-nowrap font-normal" style={{ color: FIGMA.colors.black }}>
                  {line.unitPrice}
                </td>
                <td className="py-3 text-right whitespace-nowrap font-normal" style={{ color: FIGMA.colors.black }}>
                  {line.totalExclTax}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fade overlay + Actions */}
      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 right-0"
          style={{ top: -100, height: 100, background: "linear-gradient(to bottom, transparent, white)" }}
        />
        <div
          className="relative flex flex-wrap items-center gap-2 border-t px-5 py-3"
          style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
        >
        <button
          type="button"
          onClick={onViewFullQuote}
          className="rounded-[4px] px-4 py-2 text-[14px] font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
        >
          View full quote
        </button>
        {onAskAi && (
          <button
            type="button"
            onClick={onAskAi}
            className="flex items-center gap-1.5 rounded-[4px] border px-4 py-2 text-[14px] font-medium transition-colors hover:bg-black/[0.04]"
            style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
          >
            <HugeiconsIcon icon={AiMagicIcon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
            Ask AI
          </button>
        )}
        </div>
      </div>
    </div>
  )
}
