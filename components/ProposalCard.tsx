"use client"

import { FIGMA } from "@/data/constants"
import type { Proposal } from "@/data/proposals"
import { cn } from "@/lib/cn"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FavouriteIcon,
  AiMagicIcon,
  Tick02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"

interface ProposalCardProps {
  proposal: Proposal
  rank?: number
  wishlisted?: boolean
  /** When true, hide the "Brief matching" label and capacity/location tick boxes (e.g. on wishlist). */
  hideBriefMatching?: boolean
  onWishlist?: () => void
  onRequestQuote?: () => void
  onViewDetails?: () => void
  viewDetailsLabel?: string
  onAskAi?: () => void
}

const btnBase =
  "h-10 px-4 rounded-[4px] font-sans font-medium text-[15px] leading-[1] tracking-[-0.08px] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
const btnPrimary = cn(btnBase, "bg-[#C6E278] text-black hover:bg-[#C6E278]/85")
const btnOutline = cn(
  btnBase,
  "border border-black/12 bg-white text-black hover:bg-black/[0.04]",
)

const WHY_THIS_VENUE_ITEMS: { label: string; text: string }[] = [
  {
    label: "Countryside environment",
    text: "in Île-de-France near Versailles, you get a calmer retreat setting.",
  },
  {
    label: "Castle-style venue",
    text: "near the Palace of Versailles, you tap into a strong historic-château atmosphere.",
  },
]

export function ProposalCard({
  proposal,
  rank,
  wishlisted = false,
  hideBriefMatching = false,
  onWishlist,
  onRequestQuote,
  onViewDetails,
  viewDetailsLabel = "View details",
  onAskAi,
}: ProposalCardProps) {
  const image = typeof proposal.images === "string" ? proposal.images : proposal.images[0]
  const heroImage = image || "/venues/venue1.png"
  const participants = proposal.participants ?? 30
  const currency = proposal.currency || "EUR"
  const estimatedTotal = proposal.estimatedTotal ?? 0

  return (
    <article
      className="flex w-full flex-col overflow-hidden bg-white"
      style={{
        borderRadius: FIGMA.radius.card,
        border: `1px solid ${FIGMA.colors.border}`,
        boxShadow: FIGMA.cardShadow,
      }}
    >
      {/* Top row: info + image (prototype-v2 carousel layout) */}
      <div className="flex w-full flex-row items-stretch justify-between gap-4 p-5 min-h-[180px]">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3
              className="mb-1 text-[20px] font-medium tracking-[-0.4px]"
              style={{ color: FIGMA.colors.black }}
            >
              {proposal.proposalName}
            </h3>
            {proposal.location && (
              <p
                className="text-[16px] font-normal tracking-[-0.32px]"
                style={{ color: FIGMA.colors.grey }}
              >
                {proposal.location}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <span
              className="text-[24px] font-medium tracking-[-0.48px]"
              style={{ color: FIGMA.colors.black }}
            >
              ~{currency === "EUR" ? "€" : currency}{estimatedTotal.toLocaleString()}
            </span>
            <span className="text-[16px] font-normal" style={{ color: FIGMA.colors.grey }}>
              per person
            </span>
          </div>
        </div>
        <div
          className="relative h-[180px] w-[260px] shrink-0 overflow-hidden rounded bg-[#f5f5f5]"
          style={{ borderRadius: 4 }}
        >
          <img
            src={heroImage}
            alt={proposal.proposalName}
            className="h-full w-full object-cover"
          />
          {rank != null && (
            <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              #{rank}
            </span>
          )}
        </div>
      </div>

      {/* Brief matching */}
      {!hideBriefMatching && (
        <div
          className="w-full border-t px-5 py-4"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <p
            className="mb-2 text-[13px] font-normal tracking-[-0.26px]"
            style={{ color: FIGMA.colors.grey }}
          >
            Brief matching
          </p>
          <div className="flex flex-row flex-wrap items-center gap-1.5">
            <div
              className="inline-flex items-center gap-1.5 border px-2 py-1"
              style={{ borderRadius: FIGMA.radius.card, borderColor: FIGMA.colors.border }}
            >
              <HugeiconsIcon icon={Tick02Icon} size={12} color={FIGMA.colors.black} strokeWidth={1.5} className="shrink-0" />
              <span className="text-[13px] font-normal tracking-[-0.26px]" style={{ color: FIGMA.colors.black }}>
                Capacity <span style={{ color: FIGMA.colors.grey }}>{participants} pers</span>
              </span>
            </div>
            {proposal.location && (
              <div
                className="inline-flex items-center gap-1.5 border px-2 py-1"
                style={{ borderRadius: FIGMA.radius.card, borderColor: FIGMA.colors.border }}
              >
                <HugeiconsIcon icon={Tick02Icon} size={12} color={FIGMA.colors.black} strokeWidth={1.5} className="shrink-0" />
                <span className="text-[13px] font-normal tracking-[-0.26px]" style={{ color: FIGMA.colors.black }}>
                  Location <span style={{ color: FIGMA.colors.grey }}>{proposal.location}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Why this venue */}
      <div className="w-full space-y-3 px-5 pb-4">
        <p
          className="text-[13px] font-normal tracking-[-0.26px]"
          style={{ color: FIGMA.colors.grey }}
        >
          Why this venue
        </p>
        {WHY_THIS_VENUE_ITEMS.map(({ label, text }) => (
          <div key={label} className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={16}
              color={FIGMA.colors.black}
              strokeWidth={1.5}
              className="shrink-0"
            />
            <div>
              <p
                className="text-[14px] font-medium tracking-[-0.28px]"
                style={{ color: FIGMA.colors.black }}
              >
                {label}:
              </p>
              <p
                className="text-[14px] font-normal leading-snug tracking-[-0.28px]"
                style={{ color: FIGMA.colors.grey }}
              >
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: actions (prototype-v2 layout) */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnPrimary} onClick={onRequestQuote}>
            Request a quote
          </button>
          <button type="button" className={btnOutline} onClick={onViewDetails}>
            {viewDetailsLabel}
          </button>
          <button type="button" className={btnOutline} onClick={onAskAi}>
            <HugeiconsIcon
              icon={AiMagicIcon}
              size={18}
              color={FIGMA.colors.black}
              strokeWidth={1.5}
            />
            Ask AI
          </button>
        </div>
        <button
          type="button"
          onClick={onWishlist}
          className="flex h-10 items-center gap-1.5 rounded border bg-white px-4 text-[16px] font-medium transition-colors hover:bg-black/5 disabled:opacity-50"
          style={{
            borderColor: FIGMA.colors.border,
            color: FIGMA.colors.black,
            borderRadius: FIGMA.radius.button,
          }}
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={16}
            strokeWidth={1.5}
            style={wishlisted ? { fill: "currentColor" } : undefined}
            color={FIGMA.colors.grey}
          />
          {!wishlisted && "Save"}
        </button>
      </div>
    </article>
  )
}
