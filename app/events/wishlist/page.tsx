"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FIGMA } from "@/data/constants"
import { MOCK_PROPOSALS } from "@/data/proposals"
import { ProposalCard } from "@/components/ProposalCard"
import { InsetDrawer } from "@/components/InsetDrawer"
import { AiChatDrawer } from "@/components/AiChatDrawer"
import type { AiChatContext } from "@/components/AiChatDrawer"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu09Icon, MapsIcon } from "@hugeicons/core-free-icons"

const EVENT_ID = "e1"

export default function WishlistPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [aiChatContext, setAiChatContext] = useState<AiChatContext | null>(null)
  const wishlistProposals = MOCK_PROPOSALS

  return (
    <div className="flex h-full w-full flex-col overflow-hidden font-sans antialiased bg-white">
      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
              Wishlist {wishlistProposals.length > 0 && `(${wishlistProposals.length})`}
            </h1>
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
          </div>

          {wishlistProposals.length === 0 ? (
            <div className="rounded border border-dashed p-8 text-center" style={{ borderColor: FIGMA.colors.border }}>
              <p className="mb-2 text-[16px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>Your wishlist is empty</p>
              <p className="text-[14px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>Tap the heart icon on any venue to add it to your wishlist.</p>
            </div>
          ) : viewMode === "list" ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlistProposals.map((p, i) => (
                <li key={p.id}>
                  <ProposalCard
                    proposal={p}
                    rank={i + 1}
                    wishlisted
                    hideBriefMatching
                    viewDetailsLabel="View event"
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

      {aiChatContext && (
        <InsetDrawer open onClose={() => setAiChatContext(null)} maxWidth={500} borderRadius={4} hideCloseButton>
          <AiChatDrawer context={aiChatContext} onClose={() => setAiChatContext(null)} />
        </InsetDrawer>
      )}
    </div>
  )
}
