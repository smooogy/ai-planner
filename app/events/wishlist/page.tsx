"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/cn"
import { FIGMA } from "@/data/constants"
import { MOCK_PROPOSALS } from "@/data/proposals"
import type { Proposal } from "@/data/proposals"
import { ProposalCard } from "@/components/ProposalCard"
import { InsetDrawer } from "@/components/InsetDrawer"
import { AiChatDrawer } from "@/components/AiChatDrawer"
import type { AiChatContext } from "@/components/AiChatDrawer"
import { useCompareUxOption } from "@/context/CompareUxOptionContext"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu09Icon, MapsIcon, Cancel01Icon, ChangeScreenModeIcon } from "@hugeicons/core-free-icons"

const EVENT_ID = "e1"
const MAX_COMPARE = 4

export default function WishlistPage() {
  const router = useRouter()
  const { option: compareUxOption } = useCompareUxOption()
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [aiChatContext, setAiChatContext] = useState<AiChatContext | null>(null)
  const [compareSelectedIds, setCompareSelectedIds] = useState<Set<string | number>>(new Set())
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false)
  const [lastAddedId, setLastAddedId] = useState<string | number | null>(null)
  const [compareModeActive, setCompareModeActive] = useState(false)
  const [headerTransitioning, setHeaderTransitioning] = useState(false)
  const [pendingCompareMode, setPendingCompareMode] = useState<boolean | null>(null)
  const wishlistProposals = MOCK_PROPOSALS

  useEffect(() => {
    if (!headerTransitioning || pendingCompareMode === null) return
    const t = setTimeout(() => {
      setCompareModeActive(pendingCompareMode)
      if (!pendingCompareMode) clearCompareSelection()
      setHeaderTransitioning(false)
      setPendingCompareMode(null)
    }, 200)
    return () => clearTimeout(t)
  }, [headerTransitioning, pendingCompareMode])

  const toggleCompare = useCallback((id: string | number, isAdding: boolean) => {
    setCompareSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < MAX_COMPARE) {
        next.add(id)
      }
      return next
    })
    if (isAdding) {
      setLastAddedId(id)
      setTimeout(() => setLastAddedId(null), 500)
    }
  }, [])

  const clearCompareSelection = useCallback(() => {
    setCompareSelectedIds(new Set())
  }, [])

  const compareProposals = wishlistProposals.filter((p) => compareSelectedIds.has(p.id))
  const showCompareBar = compareSelectedIds.size >= 1
  const canCompare = compareSelectedIds.size >= 2

  // Option A: only show compare UI when in explicit compare mode
  const useFloatingPillAi = compareUxOption === "C"

  const showFloatingPill = showCompareBar && (compareUxOption === "C" || (compareUxOption === "A" && compareModeActive))

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden font-sans antialiased bg-white">
      <main className="min-h-0 flex-1 overflow-auto px-4 py-6 sm:px-6">
        <div className="w-full">
          <div
            className={cn(
              "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 transition-opacity duration-200 ease-out",
            )}
            style={{ opacity: headerTransitioning ? 0 : 1 }}
          >
            <h1 className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              {compareUxOption === "A" && compareModeActive
                ? "Select 2–4 venues to compare."
                : `Wishlist ${wishlistProposals.length > 0 ? `(${wishlistProposals.length})` : ""}`}
            </h1>
            <div className="flex items-center gap-2">
              {compareUxOption === "A" && (
                <>
                  {!compareModeActive && wishlistProposals.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPendingCompareMode(true)
                        setHeaderTransitioning(true)
                      }}
                      className="flex h-11 items-center gap-2 rounded px-2.5 font-sans text-[15px] font-medium transition-colors"
                      style={{
                        color: FIGMA.colors.black,
                        backgroundColor: FIGMA.colors.white,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        border: `1px solid ${FIGMA.colors.border}`,
                      }}
                    >
                      <HugeiconsIcon icon={ChangeScreenModeIcon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
                      <span>Compare venues</span>
                    </button>
                  ) : compareModeActive ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPendingCompareMode(false)
                        setHeaderTransitioning(true)
                      }}
                      className="rounded px-2.5 py-1.5 text-[14px] font-medium transition-colors hover:bg-black/[0.04]"
                      style={{ color: FIGMA.colors.grey }}
                    >
                      Annuler
                    </button>
                  ) : null}
                </>
              )}
              {!(compareUxOption === "A" && compareModeActive) && (
                <div className="flex items-center gap-1 rounded p-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[14px] font-medium transition-colors"
                    style={{
                      color: viewMode === "list" ? FIGMA.colors.black : FIGMA.colors.grey,
                      backgroundColor: viewMode === "list" ? FIGMA.colors.white : "transparent",
                      boxShadow: viewMode === "list" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    <HugeiconsIcon icon={Menu09Icon} size={14} color={viewMode === "list" ? FIGMA.colors.black : FIGMA.colors.grey} strokeWidth={1.5} />
                    <span>List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("map")}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[14px] font-medium transition-colors"
                    style={{
                      color: viewMode === "map" ? FIGMA.colors.black : FIGMA.colors.grey,
                      backgroundColor: viewMode === "map" ? FIGMA.colors.white : "transparent",
                      boxShadow: viewMode === "map" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    <HugeiconsIcon icon={MapsIcon} size={14} color={viewMode === "map" ? FIGMA.colors.black : FIGMA.colors.grey} strokeWidth={1.5} />
                    <span>Map</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {wishlistProposals.length === 0 ? (
            <div className="rounded border border-dashed p-8 text-center" style={{ borderColor: FIGMA.colors.border }}>
              <p className="mb-2 text-[16px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>Your wishlist is empty</p>
              <p className="text-[14px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>Tap the heart icon on any venue to add it to your wishlist.</p>
            </div>
          ) : viewMode === "list" ? (
            <ul className="grid grid-cols-1 gap-4">
                {wishlistProposals.map((p, i) => (
                  <li key={p.id}>
                    <ProposalCard
                      proposal={p}
                      rank={i + 1}
                      wishlisted
                      hideBriefMatching
                      hideBestFitBadge
                      selectedForCompare={compareSelectedIds.has(p.id)}
                      onToggleCompare={
                        (compareUxOption === "A" && compareModeActive) || compareUxOption === "C"
                          ? (e) => {
                              e.stopPropagation()
                              toggleCompare(p.id, !compareSelectedIds.has(p.id))
                            }
                          : undefined
                      }
                      footerCompareOnly={compareUxOption === "A" && compareModeActive}
                      onViewDetails={() => router.push(`/events/${EVENT_ID}`)}
                      onAskAi={() => setAiChatContext({ type: "proposal", venueName: p.proposalName })}
                    />
                  </li>
                ))}
              </ul>
          ) : (
            <div
              className="rounded border overflow-hidden min-h-[400px] flex items-center justify-center"
              style={{ borderColor: FIGMA.colors.border, borderRadius: FIGMA.radius.card, backgroundColor: FIGMA.colors.greyLight }}
            >
              <p className="text-[16px] font-medium" style={{ color: FIGMA.colors.grey }}>Map view (placeholder)</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating compare pill – Option C (Compare with AI) or Option A in compare mode */}
      {showFloatingPill && (
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center pointer-events-none">
          <div
            className="pointer-events-auto flex items-center gap-3 rounded-[4px] border bg-white pl-2 pr-3 py-1.5 shadow-lg animate-pill-appear"
            style={{
              borderColor: "rgba(0,0,0,0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
          <div className="flex items-center">
            {compareProposals.slice(0, 4).map((p, i) => {
              const img = typeof p.images === "string" ? p.images : p.images[0]
              const isJustAdded = lastAddedId === p.id
              return (
                <div
                  key={p.id}
                  className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#f0f0f0]"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                >
                  <div
                    className={cn(
                      "h-full w-full overflow-hidden rounded-full",
                      isJustAdded && "animate-circle-pop",
                    )}
                  >
                    <img src={img || "/venues/venue1.png"} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              )
            })}
          </div>
          <span className="font-sans text-[15px] font-medium leading-[1] tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            {compareSelectedIds.size} selected
          </span>
          <button
            type="button"
            onClick={clearCompareSelection}
            className="h-9 rounded-[4px] px-3 font-sans text-[15px] font-medium leading-[1] tracking-[-0.08px] transition-colors hover:bg-black/[0.06]"
            style={{ color: FIGMA.colors.grey }}
          >
            Clear
          </button>
          {useFloatingPillAi ? (
            <button
              type="button"
              onClick={() => canCompare && setAiChatContext({ type: "compare", venueNames: compareProposals.map((x) => x.proposalName) })}
              disabled={!canCompare}
              className="h-10 rounded-[4px] px-4 font-sans font-medium text-[15px] leading-[1] tracking-[-0.08px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
            >
              Compare with AI
            </button>
          ) : (
            <button
              type="button"
              onClick={() => canCompare && setCompareDrawerOpen(true)}
              disabled={!canCompare}
              className="h-10 rounded-[4px] px-4 font-sans font-medium text-[15px] leading-[1] tracking-[-0.08px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
            >
              Compare
            </button>
          )}
          </div>
        </div>
      )}

      <InsetDrawer
        open={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        maxWidth={900}
        borderRadius={FIGMA.radius.card}
        hideCloseButton
      >
        <CompareDrawerContent
          proposals={compareProposals}
          onClose={() => setCompareDrawerOpen(false)}
          onViewEvent={() => router.push(`/events/${EVENT_ID}`)}
        />
      </InsetDrawer>

      {aiChatContext && (
        <InsetDrawer open onClose={() => setAiChatContext(null)} maxWidth={500} borderRadius={4} hideCloseButton>
          <AiChatDrawer context={aiChatContext} onClose={() => setAiChatContext(null)} />
        </InsetDrawer>
      )}
    </div>
  )
}

function CompareDrawerContent({
  proposals,
  onClose,
  onViewEvent,
}: {
  proposals: Proposal[]
  onClose: () => void
  onViewEvent: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <h2 className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
          Compare venues
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
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[140px] pb-3 pr-4" aria-hidden />
                {proposals.map((p) => {
                  const img = typeof p.images === "string" ? p.images : p.images[0]
                  return (
                    <th key={p.id} className="min-w-[180px] max-w-[220px] pb-3 pr-4 align-top">
                      <div className="flex flex-col gap-2">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#f5f5f5]">
                          <img src={img || "/venues/venue1.png"} alt="" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-[15px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                          {p.proposalName}
                        </span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Location" values={proposals.map((p) => p.location ?? "—")} />
              <CompareRow
                label="Price per person"
                values={proposals.map((p) =>
                  p.estimatedTotal != null && p.participants
                    ? `~€${Math.round(p.estimatedTotal / p.participants)}`
                    : "—",
                )}
              />
              <CompareRow
                label="Capacity"
                values={proposals.map((p) => (p.participants != null ? `${p.participants} people` : "—"))}
              />
              <CompareRow label="Date" values={proposals.map((p) => p.dateRange ?? "—")} />
              <tr>
                <td className="py-3 pr-4 text-[13px] font-medium" style={{ color: FIGMA.colors.grey }}>
                  Actions
                </td>
                {proposals.map((p) => (
                  <td key={p.id} className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={onViewEvent}
                      className="text-[14px] font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
                      style={{ color: FIGMA.colors.black }}
                    >
                      View event
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="py-3 pr-4 text-[13px] font-medium" style={{ color: FIGMA.colors.grey }}>
        {label}
      </td>
      {values.map((value, i) => (
        <td key={i} className="py-3 pr-4 text-[14px] font-normal" style={{ color: FIGMA.colors.black }}>
          {value}
        </td>
      ))}
    </tr>
  )
}
