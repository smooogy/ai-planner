"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FIGMA } from "@/data/constants"
import { MOCK_EVENTS, MOCK_QUOTES, MOCK_QUOTE_ITEMS, MOCK_QUOTE_DETAILS, MOCK_STATUS } from "@/data/events"
import { MOCK_PROPOSALS, AI_MESSAGE } from "@/data/proposals"
import type { Proposal } from "@/data/proposals"
import { PROTOTYPE_ADVISOR } from "@/data/advisor"
import { ProposalCard } from "@/components/ProposalCard"
import { ProposalCarousel } from "@/components/ProposalCarousel"
import { ChatInput } from "@/components/ChatInput"
import { QuoteGenerationBanner, type QuoteBannerItem } from "@/components/QuoteGenerationBanner"
import { InsetDrawer } from "@/components/InsetDrawer"
import { QuoteDetailDrawer } from "@/components/QuoteDetailDrawer"
import { VenueDetailDrawer } from "@/components/VenueDetailDrawer"
import { AiChatDrawer } from "@/components/AiChatDrawer"
import type { AiChatContext } from "@/components/AiChatDrawer"
import { HugeiconsIcon } from "@hugeicons/react"
import { Chat01Icon, BookmarkIcon, Home01Icon, AiMagicIcon, Clock01Icon } from "@hugeicons/core-free-icons"
import { ClipboardIcon } from "@hugeicons/core-free-icons"
import { ChatArtifactCard } from "@/components/ChatArtifactCard"

const DEFAULT_EVENT_NAME = "Untitled event"
const BRIEF_SUMMARY = "Multi-day Retreat · 30 people · Paris, France"
const QUOTE_SIMULATE_MS = 3200
const FAIL_CHANCE = 0.08
const TYPEWRITER_MS_PER_WORD = 72
const TYPEWRITER_DELAY_BEFORE_SUGGESTIONS_MS = 400
const TYPEWRITER_DELAY_BEFORE_SCROLL_MS = 300

type TabId = "activity" | "booking"

export default function EventWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const eventId = (params?.eventId as string) ?? ""
  const [activeTab, setActiveTab] = useState<TabId>("activity")
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [chatValue, setChatValue] = useState("")
  const [quoteQueue, setQuoteQueue] = useState<QuoteBannerItem[]>([])
  const [quoteCountIncrement, setQuoteCountIncrement] = useState(0)
  const [lastSuccessVenueName, setLastSuccessVenueName] = useState<string | null>(null)
  const [quotesBadgePulse, setQuotesBadgePulse] = useState(false)
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)
  const [selectedProposalForDetails, setSelectedProposalForDetails] = useState<Proposal | null>(null)
  const [aiChatContext, setAiChatContext] = useState<AiChatContext | null>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const [typedAiMessage, setTypedAiMessage] = useState("")
  const [typedWords, setTypedWords] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)

  const isNewEventFlow = eventId === "e2"
  const event = MOCK_EVENTS.find((e) => e.id === eventId) ?? null
  const displayName = event?.name ?? DEFAULT_EVENT_NAME
  const briefSummary = event?.briefSummary ?? BRIEF_SUMMARY

  const proposals = MOCK_PROPOSALS
  const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId)
  const isDraftEvent = eventIndex >= 0 && MOCK_STATUS[eventIndex % MOCK_STATUS.length] === "draft"

  // Redirect any draft event to e2 (except e1 and when already on e2)
  useEffect(() => {
    if (isDraftEvent && eventId !== "e2" && eventId !== "e1") {
      router.replace("/events/e2")
    }
  }, [isDraftEvent, eventId, router])
  const baseQuoteCount = eventIndex >= 0 ? MOCK_QUOTES[eventIndex % MOCK_QUOTES.length]?.count ?? 0 : 0
  const displayQuoteCount = baseQuoteCount + quoteCountIncrement

  const toggleWishlist = (id: string | number) => {
    const s = String(id)
    setWishlistIds((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const handleRequestQuote = (proposal: Proposal) => {
    const id = `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const venueName = proposal.proposalName
    setQuoteQueue((prev) => [...prev, { id, venueId: proposal.id, venueName, status: "loading" }])
    setTimeout(() => {
      const fail = Math.random() < FAIL_CHANCE
      setQuoteQueue((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: fail ? "error" : "success" } : i
        )
      )
      if (!fail) {
        setQuoteCountIncrement((n) => n + 1)
        setLastSuccessVenueName(venueName)
        setQuotesBadgePulse(true)
      }
    }, QUOTE_SIMULATE_MS)
  }

  const handleQuoteDismiss = (id: string) => {
    setQuoteQueue((prev) => prev.filter((i) => i.id !== id))
  }

  const handleQuoteRetry = (id: string) => {
    const item = quoteQueue.find((i) => i.id === id)
    if (!item) return
    setQuoteQueue((prev) => prev.filter((i) => i.id !== id))
    const proposal = proposals.find((p) => p.id === item.venueId)
    if (proposal) handleRequestQuote(proposal)
  }

  useEffect(() => {
    if (!quotesBadgePulse) return
    const t = setTimeout(() => setQuotesBadgePulse(false), 450)
    return () => clearTimeout(t)
  }, [quotesBadgePulse])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatValue.trim()) setChatValue("")
  }

  // New event flow (e2): word-by-word typewriter with fade-in, then reveal AI suggestions, then scroll
  useEffect(() => {
    if (!isNewEventFlow) {
      setTypedAiMessage(AI_MESSAGE)
      setTypedWords([])
      setShowAiSuggestions(true)
      return
    }
    const wordGroups = AI_MESSAGE.split(/\s+/).filter(Boolean)
    let index = 0
    const t = setInterval(() => {
      if (index >= wordGroups.length) {
        clearInterval(t)
        setTypedAiMessage(AI_MESSAGE)
        setTimeout(() => {
          setShowAiSuggestions(true)
          setTimeout(() => {
            const el = chatScrollRef.current
            if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
          }, TYPEWRITER_DELAY_BEFORE_SCROLL_MS)
        }, TYPEWRITER_DELAY_BEFORE_SUGGESTIONS_MS)
        return
      }
      setTypedWords((prev) => [...prev, wordGroups[index]!])
      index += 1
    }, TYPEWRITER_MS_PER_WORD)
    return () => clearInterval(t)
  }, [isNewEventFlow])

  // Scroll chat to bottom when user sends a message, switches to activity tab, or when "Quote requested for X" artifact appears
  useEffect(() => {
    if (activeTab !== "activity") return
    const el = chatScrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [activeTab, chatValue, lastSuccessVenueName])

  if (!eventId) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans bg-white">
        <p style={{ color: FIGMA.colors.grey }}>Session not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden font-sans antialiased bg-white">
      <header className="fixed top-0 left-[275px] right-0 z-30 flex h-14 items-center gap-4 px-4 sm:px-6 bg-white border-b" style={{ borderColor: FIGMA.colors.border }}>
        <nav className="flex min-w-0 flex-1 items-center gap-2 text-[14px] font-normal tracking-[-0.08px]" aria-label="Breadcrumb">
          <Link href="/events" className="flex shrink-0 items-center rounded p-1.5 transition-colors hover:bg-black/5" style={{ color: FIGMA.colors.black }} aria-label="My events">
            <HugeiconsIcon icon={Home01Icon} size={20} strokeWidth={1.5} />
          </Link>
          <span style={{ color: FIGMA.colors.grey }}>/</span>
          <div className="flex items-center gap-1.5 shrink-0 min-w-0">
            <p className="min-w-0 max-w-[220px] truncate shrink-0 p-0 text-[14px] font-normal" style={{ color: FIGMA.colors.black }}>
              {displayName}
            </p>
            {eventId !== "e1" && (
              <span
                className="shrink-0 rounded-full px-2 py-1.5 text-[14px] font-normal capitalize leading-none"
                style={{ backgroundColor: FIGMA.colors.greyLight, color: FIGMA.colors.grey }}
              >
                {event?.status ?? "draft"}
              </span>
            )}
          </div>
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          {(["activity", "booking"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex h-[55px] items-center gap-1.5 px-2.5 text-[14px] font-medium transition-colors"
              style={{
                color: activeTab === tab ? FIGMA.colors.black : FIGMA.colors.grey,
                backgroundColor: "transparent",
                borderBottom: activeTab === tab ? `2px solid ${FIGMA.colors.black}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {tab === "activity" && <HugeiconsIcon icon={Chat01Icon} size={18} color={activeTab === tab ? FIGMA.colors.black : FIGMA.colors.grey} strokeWidth={1.5} />}
              {tab === "booking" && <HugeiconsIcon icon={BookmarkIcon} size={18} color={activeTab === tab ? FIGMA.colors.black : FIGMA.colors.grey} strokeWidth={1.5} />}
              <span>
                {tab === "activity" && "Chat"}
                {tab === "booking" && "Quotes"}
              </span>
              {tab === "booking" && (
                <div
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-2.5 transition-colors ${quotesBadgePulse ? "animate-badge-bounce" : ""}`}
                  style={{ backgroundColor: FIGMA.colors.green }}
                >
                  <span
                    className="text-[14px] font-medium tracking-[-0.08px]"
                    style={{ color: FIGMA.colors.black }}
                  >
                    {displayQuoteCount}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 justify-end items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border pl-1 pr-3 py-1" style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}>
            <img src={PROTOTYPE_ADVISOR.avatar ?? ""} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            <span className="text-[14px] font-medium truncate max-w-[120px]" style={{ color: FIGMA.colors.black }}>{PROTOTYPE_ADVISOR.name}</span>
          </div>
        </div>
      </header>

      {activeTab === "activity" && quoteQueue.length > 0 && (
        <div className="fixed left-[275px] right-0 z-20" style={{ top: 56 }}>
          <QuoteGenerationBanner
            items={quoteQueue}
            onDismiss={handleQuoteDismiss}
            onRetry={handleQuoteRetry}
          />
        </div>
      )}

      <div ref={chatScrollRef} className="flex flex-1 min-h-0 flex-col overflow-auto pt-14 pb-32">
        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[760px]">
            {activeTab === "activity" && (
              <>
                <div className="mb-4 flex justify-end">
                  <div className="rounded-full px-4 py-2.5 max-w-[85%]" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                    <p className="text-[16px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>{briefSummary}</p>
                  </div>
                </div>
                <div className="mb-6 flex justify-start">
                  <p className="inline-block max-w-[85%] text-[16px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                    {isNewEventFlow && typedWords.length > 0 ? (
                      <>
                        {typedWords.map((word, i) => (
                          <span key={i} className="animate-typewriter-word">
                            {word}{i < typedWords.length - 1 ? " " : ""}
                          </span>
                        ))}
                      </>
                    ) : isNewEventFlow ? null : (
                      AI_MESSAGE
                    )}
                  </p>
                </div>
                {/* AI Suggestions artifact container — for e2 shown after typewriter completes */}
                {(!isNewEventFlow || showAiSuggestions) && (
                  <div
                    className="rounded-lg border pl-5 pt-5 pb-5"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      borderColor: FIGMA.colors.border,
                    }}
                  >
                    <ProposalCarousel
                      artifactHeader={
                        <>
                          <h2 className="text-[16px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                            AI suggestions
                          </h2>
                          <p className="mt-0.5 text-[13px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                            Based on your brief: {briefSummary}
                          </p>
                        </>
                      }
                    >
                      {proposals.slice(0, 3).map((p, i) => (
                        <ProposalCard
                          key={p.id}
                          proposal={p}
                          rank={i + 1}
                          wishlisted={wishlistIds.includes(String(p.id))}
                          onWishlist={() => toggleWishlist(p.id)}
                          onRequestQuote={() => handleRequestQuote(p)}
                          onViewDetails={() => setSelectedProposalForDetails(p)}
                          onAskAi={() => setAiChatContext({ type: "proposal", venueName: p.proposalName })}
                        />
                      ))}
                    </ProposalCarousel>
                  </div>
                )}
                {/* AI updated quote artefact — hidden for e2 (no quotes yet) */}
                {!isNewEventFlow && (
                  <ChatArtifactCard
                    icon={
                      <HugeiconsIcon
                        icon={AiMagicIcon}
                        size={20}
                        strokeWidth={1.5}
                        style={{ color: FIGMA.colors.grey }}
                      />
                    }
                    message="AI updated Quote #3"
                    actionLabel="View changes"
                    onAction={() => setAiChatContext({ type: "quote", quoteNumber: 3, venueName: "La Maison du Val" })}
                  />
                )}
                {lastSuccessVenueName && (
                  <ChatArtifactCard
                    icon={
                      <HugeiconsIcon
                        icon={ClipboardIcon}
                        size={20}
                        strokeWidth={1.5}
                        style={{ color: FIGMA.colors.grey }}
                      />
                    }
                    message={`Quote requested for ${lastSuccessVenueName}`}
                    actionLabel="View in Quotes"
                    onAction={() => {
                      setLastSuccessVenueName(null)
                      setActiveTab("booking")
                    }}
                  />
                )}
              </>
            )}

            {activeTab === "booking" && (
              <div className="space-y-6">
                {isNewEventFlow ? (
                  <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                    No quotes yet. Request a quote from a venue in the Chat tab to see it here.
                  </p>
                ) : (
                <ul className="flex flex-col gap-4">
                  {MOCK_QUOTE_ITEMS.map((quote, quoteIndex) => (
                    <li
                      key={quote.id}
                      className="flex gap-4 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-black/[0.02]"
                      style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
                      onClick={() => setSelectedQuoteId(quote.id)}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedQuoteId(quote.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <span
                          className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1 text-[13px] font-normal tracking-[-0.08px]"
                          style={{
                            backgroundColor: FIGMA.colors.white,
                            borderColor: FIGMA.colors.border,
                            color: FIGMA.colors.black,
                          }}
                        >
                          {quote.status === "Availability to be confirmed" && (
                            <HugeiconsIcon icon={Clock01Icon} size={14} color={FIGMA.colors.black} strokeWidth={1.5} />
                          )}
                          {quote.status}
                        </span>
                        <p className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                          {quote.venueName}
                        </p>
                        <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                          {quote.dateRange} · {quote.attendees} attendees · {quote.location}
                        </p>
                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                          <span className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                            From
                          </span>
                          <span className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                            {quote.totalPrice} {quote.currency} excl. tax
                          </span>
                          <span className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                            {quote.perPerson} {quote.currency} excl. tax/person
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-[4px] px-4 py-2 text-[14px] font-medium tracking-[-0.08px] transition-colors hover:opacity-90"
                            style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Request final quote
                          </button>
                          <button
                            type="button"
                            className="rounded-[4px] border px-4 py-2 text-[14px] font-medium tracking-[-0.08px] transition-colors hover:bg-black/[0.04]"
                            style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedQuoteId(quote.id)
                            }}
                          >
                            See AI pre-quote
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-[4px] border px-4 py-2 text-[14px] font-medium tracking-[-0.08px] transition-colors hover:bg-black/[0.04]"
                            style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setAiChatContext({ type: "quote", quoteNumber: quoteIndex + 1, venueName: quote.venueName })
                            }}
                          >
                            <HugeiconsIcon icon={AiMagicIcon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
                            Ask AI
                          </button>
                        </div>
                      </div>
                      {quote.image && (
                        <div className="h-[140px] w-[140px] shrink-0 overflow-hidden rounded-[4px] bg-[#f0f0f0]">
                          <img src={quote.image} alt="" className="h-full w-full object-cover" width={140} height={140} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-[275px] right-0 z-20 px-4 pb-6 pt-0">
        <div className="mx-auto max-w-[760px]">
          <ChatInput variant="small" placeholder="Ask any question..." value={chatValue} onInputChange={setChatValue} onSubmit={handleChatSubmit} autoFocus />
        </div>
      </div>

      {selectedQuoteId && MOCK_QUOTE_DETAILS[selectedQuoteId] && (
        <InsetDrawer open onClose={() => setSelectedQuoteId(null)} maxWidth={680} hideCloseButton>
          <QuoteDetailDrawer
            detail={MOCK_QUOTE_DETAILS[selectedQuoteId]}
            onRequestFinalQuote={() => setSelectedQuoteId(null)}
            onClose={() => setSelectedQuoteId(null)}
          />
        </InsetDrawer>
      )}

      {selectedProposalForDetails && (
        <InsetDrawer open onClose={() => setSelectedProposalForDetails(null)} maxWidth={680} hideCloseButton>
          <VenueDetailDrawer
            proposal={selectedProposalForDetails}
            onRequestQuote={() => {
              handleRequestQuote(selectedProposalForDetails)
              setSelectedProposalForDetails(null)
            }}
            onClose={() => setSelectedProposalForDetails(null)}
          />
        </InsetDrawer>
      )}

      {aiChatContext && (
        <InsetDrawer open onClose={() => setAiChatContext(null)} maxWidth={500} borderRadius={4} hideCloseButton>
          <AiChatDrawer context={aiChatContext} onClose={() => setAiChatContext(null)} />
        </InsetDrawer>
      )}
    </div>
  )
}
