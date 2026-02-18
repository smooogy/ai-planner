"use client"

import { FIGMA } from "@/data/constants"
import type { Proposal } from "@/data/proposals"
import { HugeiconsIcon } from "@hugeicons/react"
import { Location01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

export interface VenueDetailDrawerProps {
  proposal: Proposal
  onRequestQuote?: () => void
  onClose?: () => void
}

export function VenueDetailDrawer({ proposal, onRequestQuote, onClose }: VenueDetailDrawerProps) {
  const image = typeof proposal.images === "string" ? proposal.images : proposal.images[0]
  const heroImage = image || "/venues/venue1.png"
  const participants = proposal.participants ?? 30
  const currency = proposal.currency || "EUR"
  const estimatedPerPerson =
    proposal.estimatedTotal != null && participants > 0
      ? Math.round(proposal.estimatedTotal / participants)
      : null
  const hasNaboo = !!proposal.nabooInsight
  const hasBrief =
    proposal.reformulatedInsights && Object.keys(proposal.reformulatedInsights).length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top bar: title + close */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b px-5 py-3"
        style={{ borderColor: FIGMA.colors.border }}
      >
        <h2 className="text-[16px] font-normal tracking-[-0.08px] min-w-0 truncate" style={{ color: FIGMA.colors.black }}>
          {proposal.proposalName}
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
        {/* Location */}
        {proposal.location && (
          <p className="flex items-center gap-1.5 text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
            <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={1.5} />
            {proposal.location}
          </p>
        )}

        {/* Hero image */}
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-[#f0f0f0]">
          <img src={heroImage} alt={proposal.proposalName} className="h-full w-full object-cover" />
        </div>

        {/* Rating + pricing */}
        <div className="flex flex-wrap items-baseline gap-4">
          {(proposal.rating != null || proposal.ratingsTotal != null) && (
            <span className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              {proposal.rating != null ? proposal.rating.toFixed(1) : "—"}
              {proposal.ratingsTotal != null ? ` (${proposal.ratingsTotal} reviews)` : ""}
            </span>
          )}
          {estimatedPerPerson != null && (
            <span className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              Starts at {currency === "EUR" ? "€" : currency}{estimatedPerPerson.toLocaleString()} per person
            </span>
          )}
        </div>

        {/* Naboo insight */}
        {hasNaboo && (
          <div className="rounded-[4px] p-3" style={{ backgroundColor: FIGMA.colors.greyLight }}>
            <p className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              Why Naboo recommends this venue
            </p>
            <p className="mt-1.5 text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              &ldquo;{proposal.nabooInsight}&rdquo;
            </p>
          </div>
        )}

        {/* Capacity / date */}
        <div className="flex flex-wrap gap-2">
          {participants > 0 && (
            <span
              className="rounded-full px-2.5 py-1 text-[13px] font-normal"
              style={{ backgroundColor: FIGMA.colors.greyLight, color: FIGMA.colors.grey }}
            >
              Up to {participants} participants
            </span>
          )}
          {proposal.dateRange && (
            <span
              className="rounded-full px-2.5 py-1 text-[13px] font-normal"
              style={{ backgroundColor: FIGMA.colors.greyLight, color: FIGMA.colors.grey }}
            >
              {proposal.dateRange}
            </span>
          )}
        </div>

        {/* Brief matching */}
        {hasBrief && (
          <div>
            <p className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
              Brief matching
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(proposal.reformulatedInsights!).map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-full border px-2.5 py-1 text-[13px] font-normal"
                  style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed footer: CTA */}
      <div className="shrink-0 border-t px-5 pb-5 pt-4" style={{ borderColor: FIGMA.colors.border }}>
        <button
          type="button"
          onClick={onRequestQuote}
          className="rounded-[4px] px-4 py-3 text-[15px] font-medium tracking-[-0.08px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
        >
          Request a quote
        </button>
      </div>
    </div>
  )
}
