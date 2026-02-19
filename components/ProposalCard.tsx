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
  Add01Icon,
} from "@hugeicons/core-free-icons"

const DEFAULT_INSIGHT =
  "This venue matches your capacity, location and château style preferences."

interface ProposalCardProps {
  proposal: Proposal
  rank?: number
  wishlisted?: boolean
  /** When true, hide the "Brief matching" label and capacity/location tick boxes (e.g. on wishlist). */
  hideBriefMatching?: boolean
  /** Small text for "Naboo insight" section (only when hideBriefMatching is false). */
  insight?: string
  onWishlist?: () => void
  onRequestQuote?: () => void
  /** Called when the card (not a button) is clicked; opens details. */
  onViewDetails?: () => void
  onAskAi?: () => void
  /** When set, show "Add to compare" / "In compare" and call on toggle (e.g. wishlist). */
  selectedForCompare?: boolean
  onToggleCompare?: (e: React.MouseEvent) => void
  /** When true, footer only shows the compare button (hide Request quote, Ask AI, Save). */
  footerCompareOnly?: boolean
  /** When true, hide the "Best fit for your brief" badge (e.g. on wishlist). */
  hideBestFitBadge?: boolean
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
  insight = DEFAULT_INSIGHT,
  onWishlist,
  onRequestQuote,
  onViewDetails,
  onAskAi,
  selectedForCompare = false,
  onToggleCompare,
  footerCompareOnly = false,
  hideBestFitBadge = false,
}: ProposalCardProps) {
  const image = typeof proposal.images === "string" ? proposal.images : proposal.images[0]
  const heroImage = image || "/venues/venue1.png"
  const participants = proposal.participants ?? 30
  const currency = proposal.currency || "EUR"
  const estimatedTotal = proposal.estimatedTotal ?? 0

  const handleCardClick = () => {
    onViewDetails?.()
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleCardClick()
        }
      }}
      className="flex w-full cursor-pointer flex-col overflow-hidden bg-white transition-colors hover:bg-black/[0.02]"
      style={{
        borderRadius: FIGMA.radius.card,
        border: `1px solid ${FIGMA.colors.border}`,
        boxShadow: FIGMA.cardShadow,
      }}
    >
      {/* Top row: info + image (prototype-v2 carousel layout) */}
      <div className="flex w-full flex-row items-stretch justify-between gap-4 p-5 min-h-[180px]">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">
            {rank === 1 && !hideBestFitBadge && (
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium"
                style={{
                  borderColor: FIGMA.colors.border,
                  backgroundColor: FIGMA.colors.white,
                  color: FIGMA.colors.black,
                }}
              >
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  size={14}
                  strokeWidth={1.5}
                  style={{ fill: "#ec4899", color: "#ec4899" }}
                />
                Our top pick for your brief
              </span>
            )}
            <h3
              className="mb-1 text-[20px] font-medium tracking-[-0.4px]"
              style={{ color: FIGMA.colors.black }}
            >
              {proposal.proposalName}
            </h3>
            {proposal.location && (
              <p
                className="text-[15px] font-normal tracking-[-0.32px]"
                style={{ color: FIGMA.colors.grey }}
              >
                {proposal.location}
              </p>
            )}
          </div>
          <p className="text-[15px] font-medium leading-tight" style={{ color: FIGMA.colors.black }}>
            <span style={{ color: FIGMA.colors.grey }}>Estimated: </span>
            {currency === "EUR" ? "€" : currency}
            {participants > 0 ? Math.round(estimatedTotal / participants) : estimatedTotal}
            /person
          </p>
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

      {/* Naboo insight (above Brief matching when visible) */}
      {!hideBriefMatching && (
        <div
          className="w-full border-t px-5 py-4"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <p
            className="mb-1.5 text-[13px] font-normal tracking-[-0.26px]"
            style={{ color: FIGMA.colors.grey }}
          >
            Naboo insight
          </p>
          <p
            className="text-[15px] font-normal leading-snug tracking-[-0.28px]"
            style={{ color: FIGMA.colors.black }}
          >
            {insight}
          </p>
        </div>
      )}

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
                className="text-[15px] font-medium tracking-[-0.28px]"
                style={{ color: FIGMA.colors.black }}
              >
                {label}:
              </p>
              <p
                className="text-[15px] font-normal leading-snug tracking-[-0.28px]"
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap gap-2">
          {!footerCompareOnly && (
            <>
              <button type="button" className={btnPrimary} onClick={onRequestQuote}>
                Request a quote
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
            </>
          )}
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleCompare(e)
              }}
              className={cn(
                "h-10 px-4 rounded-[4px] font-sans font-medium text-[15px] leading-[1] tracking-[-0.08px] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap",
                selectedForCompare
                  ? "bg-black/8 text-black border border-black"
                  : "border border-black/12 bg-white text-black hover:bg-black/[0.04]",
              )}
            >
              <HugeiconsIcon
                icon={selectedForCompare ? Tick02Icon : Add01Icon}
                size={18}
                color={FIGMA.colors.black}
                strokeWidth={1.5}
              />
              {selectedForCompare ? "Selected" : "Add to compare"}
            </button>
          )}
        </div>
        {!footerCompareOnly && (
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
        )}
      </div>
    </article>
  )
}
