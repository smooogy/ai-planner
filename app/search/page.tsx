"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { FIGMA } from "@/data/constants"
import { MOCK_PROPOSALS, AI_MESSAGE } from "@/data/proposals"
import type { Proposal } from "@/data/proposals"
import { ProposalCard } from "@/components/ProposalCard"
import { ProposalCarousel } from "@/components/ProposalCarousel"
import { ChatInput } from "@/components/ChatInput"
import { QuoteRequestProgressRow } from "@/components/QuoteRequestProgressRow"
import { QuotePreviewMessageCard } from "@/components/QuotePreviewMessageCard"
import { SignupGateModal } from "@/components/SignupGateModal"
import { InsetDrawer } from "@/components/InsetDrawer"
import { VenueDetailDrawer } from "@/components/VenueDetailDrawer"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiMagicIcon, Search01Icon, Loading03Icon, Home01Icon, Chat01Icon, BookmarkIcon } from "@hugeicons/core-free-icons"

const LOADING_STAGES = [
  { label: "Analyzing your brief...", icon: AiMagicIcon, duration: 1500 },
  { label: "Searching venues...", icon: Search01Icon, duration: 1500 },
  { label: "Generating proposals...", icon: Loading03Icon, duration: 1500 },
] as const

const TOTAL_LOADING_MS = LOADING_STAGES.reduce((sum, s) => sum + s.duration, 0)
const DEFAULT_BRIEF = "Team offsite for 30 people, 2 days near Paris, château style"
const TYPEWRITER_MS_PER_WORD = 72
const TYPEWRITER_DELAY_BEFORE_SUGGESTIONS_MS = 400
const TYPEWRITER_DELAY_BEFORE_SCROLL_MS = 300
const QUOTE_SIMULATE_MS = 5000
const FAIL_CHANCE = 0.08

type Phase = "loading" | "workspace"
type TabId = "activity" | "booking"

type QuoteRequestChatItem =
  | { id: string; venueId: string | number; venueName: string; status: "typing"; proposal: Proposal; typedAiWords: string[] }
  | { id: string; venueId: string | number; venueName: string; status: "progress"; proposal: Proposal; progressStartedAt: number }
  | { id: string; venueId: string | number; venueName: string; status: "ready"; proposal: Proposal }

function getQuoteAiMessage(venueName: string) {
  return `Got it — I'll request a quote from ${venueName}.`
}

const DISPLAY_EVENT_NAME = "Your event"

function getMockServiceLines(proposal: Proposal) {
  const pax = proposal.participants ?? 30
  const total = proposal.estimatedTotal ?? 4500
  const perPerson = Math.round(total / pax)
  return [
    {
      label: `Forfait séminaire résidentiel single x ${pax}`,
      unitPrice: `${perPerson.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      totalExclTax: `${total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
    },
  ]
}

export default function SearchPage() {
  const [phase, setPhase] = useState<Phase>("loading")
  const [stageIndex, setStageIndex] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)
  const [activeTab, setActiveTab] = useState<TabId>("activity")
  const [quoteRequestChatItems, setQuoteRequestChatItems] = useState<QuoteRequestChatItem[]>([])
  const [quoteCountIncrement, setQuoteCountIncrement] = useState(0)
  const [requestedQuotes, setRequestedQuotes] = useState<{ id: string; venueId: string | number; venueName: string }[]>([])
  const [quotesBadgePulse, setQuotesBadgePulse] = useState(false)
  const [signupGateOpen, setSignupGateOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [chatValue, setChatValue] = useState("")
  const [typedWords, setTypedWords] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const progressRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const quoteRequestItemsRef = useRef<QuoteRequestChatItem[]>([])
  const lastQuoteUserMessageRef = useRef<HTMLDivElement | null>(null)

  // Loading: advance stages and run progress bar
  useEffect(() => {
    if (phase !== "loading") return

    const advanceStage = () => {
      setStageIndex((i) => {
        if (i >= LOADING_STAGES.length - 1) {
          setPhase("workspace")
          setProgressPercent(100)
          return i
        }
        return i + 1
      })
    }

    const timeout = setTimeout(advanceStage, LOADING_STAGES[stageIndex]!.duration)
    return () => clearTimeout(timeout)
  }, [phase, stageIndex])

  // Progress bar animation
  useEffect(() => {
    if (phase !== "loading") return
    startTimeRef.current = startTimeRef.current ?? Date.now()

    const tick = () => {
      const elapsed = Date.now() - (startTimeRef.current ?? 0)
      const p = Math.min(100, (elapsed / TOTAL_LOADING_MS) * 100)
      setProgressPercent(p)
      if (p < 100) {
        progressRef.current = requestAnimationFrame(tick)
      }
    }
    progressRef.current = requestAnimationFrame(tick)
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [phase])

  // Typewriter effect in workspace
  useEffect(() => {
    if (phase !== "workspace") return
    const wordGroups = AI_MESSAGE.split(/\s+/).filter(Boolean)
    let index = 0
    const t = setInterval(() => {
      if (index >= wordGroups.length) {
        clearInterval(t)
        setTimeout(() => {
          setShowAiSuggestions(true)
          setTimeout(() => {
            chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" })
          }, TYPEWRITER_DELAY_BEFORE_SCROLL_MS)
        }, TYPEWRITER_DELAY_BEFORE_SUGGESTIONS_MS)
        return
      }
      setTypedWords((prev) => [...prev, wordGroups[index]!])
      index += 1
    }, TYPEWRITER_MS_PER_WORD)
    return () => clearInterval(t)
  }, [phase])

  const toggleWishlist = (id: string | number) => {
    const s = String(id)
    setWishlistIds((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const handleRequestQuote = (proposal: Proposal) => {
    const id = `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const venueName = proposal.proposalName
    setQuoteRequestChatItems((prev) => [
      ...prev,
      { id, venueId: proposal.id, venueName, status: "typing", proposal, typedAiWords: [] },
    ])
  }

  // Typewriter for "Got it — I'll request a quote from X." per item
  const typingItems = quoteRequestChatItems.filter((i): i is QuoteRequestChatItem & { status: "typing" } => i.status === "typing")
  useEffect(() => {
    if (typingItems.length === 0) return
    const t = setInterval(() => {
      setQuoteRequestChatItems((prev) => {
        const next = prev.map((item) => {
          if (item.status !== "typing") return item
          const full = getQuoteAiMessage(item.venueName)
          const words = full.split(/\s+/).filter(Boolean)
          if (item.typedAiWords.length >= words.length) return item
          const nextWord = words[item.typedAiWords.length]
          if (!nextWord) return item
          const newTyped = [...item.typedAiWords, nextWord]
          if (newTyped.length >= words.length) {
            return {
              id: item.id,
              venueId: item.venueId,
              venueName: item.venueName,
              proposal: item.proposal,
              status: "progress" as const,
              progressStartedAt: Date.now(),
            }
          }
          return { ...item, typedAiWords: newTyped }
        })
        return next
      })
    }, TYPEWRITER_MS_PER_WORD)
    return () => clearInterval(t)
  }, [typingItems.length])

  quoteRequestItemsRef.current = quoteRequestChatItems

  // When progress phase has lasted QUOTE_SIMULATE_MS, transition to ready or remove (fail)
  const progressItems = quoteRequestChatItems.filter((i): i is QuoteRequestChatItem & { status: "progress" } => i.status === "progress")
  useEffect(() => {
    if (progressItems.length === 0) return
    const t = setInterval(() => {
      const now = Date.now()
      const prev = quoteRequestItemsRef.current
      const next = prev
        .map((item) => {
          if (item.status !== "progress") return item
          if (now - item.progressStartedAt < QUOTE_SIMULATE_MS) return item
          const fail = Math.random() < FAIL_CHANCE
          if (fail) return null
          return { ...item, status: "ready" as const }
        })
        .filter(Boolean) as QuoteRequestChatItem[]
      const newlyReady = next.filter((i) => i.status === "ready" && prev.some((p) => p.id === i.id && p.status === "progress"))
      setQuoteRequestChatItems(next)
      newlyReady.forEach((i) => {
        setQuoteCountIncrement((n) => n + 1)
        setRequestedQuotes((r) => [...r, { id: i.id, venueId: i.venueId, venueName: i.venueName }])
        setQuotesBadgePulse(true)
      })
    }, 500)
    return () => clearInterval(t)
  }, [progressItems.length])

  useEffect(() => {
    if (!quotesBadgePulse) return
    const t = setTimeout(() => setQuotesBadgePulse(false), 450)
    return () => clearTimeout(t)
  }, [quotesBadgePulse])

  // Scroll: new item → scroll so user message is at top of visible chat area (below header + 24px margin)
  const prevQuoteCountRef = useRef(0)
  useEffect(() => {
    const length = quoteRequestChatItems.length
    if (length === 0 || length <= prevQuoteCountRef.current) {
      prevQuoteCountRef.current = length
      return
    }
    prevQuoteCountRef.current = length
    let cancelled = false
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return
        const el = lastQuoteUserMessageRef.current
        const container = chatScrollRef.current
        if (el && container) {
          const paddingTop = parseFloat(getComputedStyle(container).paddingTop) || 0
          const elTop = el.getBoundingClientRect().top
          const containerTop = container.getBoundingClientRect().top
          const targetScrollTop = container.scrollTop + (elTop - containerTop) - paddingTop - 24
          container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: "smooth" })
        }
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(t)
    }
  }, [quoteRequestChatItems.length])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatValue.trim()) setChatValue("")
  }

  // Loading screen
  if (phase === "loading") {
    const currentStage = LOADING_STAGES[stageIndex]
    const Icon = currentStage?.icon ?? AiMagicIcon
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white font-sans antialiased">
        <div
          className="absolute left-0 top-0 h-0.5 transition-all duration-150 ease-linear"
          style={{ width: `${progressPercent}%`, backgroundColor: FIGMA.colors.green }}
        />
        <div className="flex flex-col items-center gap-6 px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: FIGMA.colors.greyLight }}>
            <HugeiconsIcon icon={Icon} size={28} color={FIGMA.colors.grey} strokeWidth={1.5} />
          </div>
          <p
            key={stageIndex}
            className="max-w-[280px] text-center text-[18px] font-medium tracking-[-0.08px] animate-loading-stage"
            style={{ color: FIGMA.colors.black }}
          >
            {currentStage?.label ?? "Generating proposals..."}
          </p>
        </div>
      </div>
    )
  }

  // Workspace: no sidebar, no quotes (fade in on enter)
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white font-sans antialiased animate-workspace-enter">
      <header
        className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:px-6"
        style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
      >
        <nav className="flex min-w-0 flex-1 items-center gap-2 text-[14px] font-normal tracking-[-0.08px]" aria-label="Breadcrumb">
          <Link href="/" className="flex shrink-0 items-center rounded p-1.5 transition-colors hover:bg-black/5" style={{ color: FIGMA.colors.black }} aria-label="Home">
            <HugeiconsIcon icon={Home01Icon} size={20} strokeWidth={1.5} />
          </Link>
          <span style={{ color: FIGMA.colors.grey }}>/</span>
          <div className="flex min-w-0 shrink-0 items-center gap-1.5">
            <p className="min-w-0 max-w-[220px] truncate p-0 text-[14px] font-normal shrink-0" style={{ color: FIGMA.colors.black }}>
              {DISPLAY_EVENT_NAME}
            </p>
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
              {tab === "booking" && quoteCountIncrement > 0 && (
                <div
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-2.5 transition-colors ${quotesBadgePulse ? "animate-badge-bounce" : ""}`}
                  style={{ backgroundColor: FIGMA.colors.green }}
                >
                  <span className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                    {quoteCountIncrement}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 justify-end items-center">
          <Link
            href="/events"
            className="rounded-[4px] border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-black/[0.04]"
            style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
          >
            Sign up
          </Link>
        </div>
      </header>

      <div ref={chatScrollRef} className="flex min-h-0 flex-1 flex-col overflow-auto pb-32 pt-14">
        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[760px]">
            {activeTab === "activity" && (
              <>
                <div className="mb-4 flex justify-end">
                  <div className="max-w-[85%] rounded-full px-4 py-2.5" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                    <p className="text-[16px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                      {DEFAULT_BRIEF}
                    </p>
                  </div>
                </div>
                <div className="mb-6 flex justify-start">
                  <p className="inline-block max-w-[85%] text-[16px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                    {typedWords.length > 0 ? (
                      <>
                        {typedWords.map((word, i) => (
                          <span key={i} className="animate-typewriter-word">
                            {word}
                            {i < typedWords.length - 1 ? " " : ""}
                          </span>
                        ))}
                      </>
                    ) : null}
                  </p>
                </div>
                {showAiSuggestions && (
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
                            Based on your brief: {DEFAULT_BRIEF}
                          </p>
                        </>
                      }
                    >
                      {MOCK_PROPOSALS.slice(0, 3).map((p, i) => (
                        <ProposalCard
                          key={p.id}
                          proposal={p}
                          rank={i + 1}
                          wishlisted={wishlistIds.includes(String(p.id))}
                          onWishlist={() => toggleWishlist(p.id)}
                          onRequestQuote={() => handleRequestQuote(p)}
                          onViewDetails={() => setSelectedProposal(p)}
                          onAskAi={() => {}}
                        />
                      ))}
                    </ProposalCarousel>
                  </div>
                )}
                {quoteRequestChatItems.map((item, index) => {
                  const fullAiMessage = getQuoteAiMessage(item.venueName)
                  const aiDisplayText = item.status === "typing" && "typedAiWords" in item ? item.typedAiWords.join(" ") : fullAiMessage
                  const isLastItem = index === quoteRequestChatItems.length - 1
                  return (
                  <div key={item.id} className="mt-4 space-y-2">
                    <div
                      ref={isLastItem ? lastQuoteUserMessageRef : undefined}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] rounded-full px-4 py-2.5" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                        <p className="text-[16px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                          Generate a quote for {item.venueName}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%]">
                        <p className="text-[16px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                          {item.status === "typing" && "typedAiWords" in item ? (
                            <>
                              {item.typedAiWords.map((word, i) => (
                                <span key={i} className="animate-typewriter-word">
                                  {word}
                                  {i < item.typedAiWords.length - 1 ? " " : ""}
                                </span>
                              ))}
                            </>
                          ) : (
                            aiDisplayText
                          )}
                        </p>
                      </div>
                    </div>
                    {(item.status === "progress" || item.status === "ready") && (
                    <div className={item.status === "ready" ? "w-full" : "flex w-full justify-start"}>
                      <div className={item.status === "ready" ? "w-full" : "max-w-[85%]"}>
                        {item.status === "progress" && (
                          <QuoteRequestProgressRow venueName={item.venueName} />
                        )}
                        {item.status === "ready" && (
                        <QuotePreviewMessageCard
                          venueName={item.venueName}
                          location={item.proposal.location}
                          image={typeof item.proposal.images === "string" ? item.proposal.images : item.proposal.images[0]}
                          participants={item.proposal.participants}
                          totalPrice={(item.proposal.estimatedTotal ?? 4500).toLocaleString("fr-FR")}
                          perPersonPrice={
                            item.proposal.estimatedTotal != null && (item.proposal.participants ?? 0) > 0
                              ? Math.round(item.proposal.estimatedTotal / (item.proposal.participants ?? 1)).toLocaleString("fr-FR")
                              : "150"
                          }
                          currency="€"
                          serviceLines={getMockServiceLines(item.proposal)}
                          onViewFullQuote={() => setSignupGateOpen(true)}
                          onAskAi={() => {}}
                        />
                      )}
                      </div>
                    </div>
                    )}
                  </div>
                  )
                })}
                {quoteRequestChatItems.length > 0 && (
                  <div aria-hidden style={{ minHeight: "40vh" }} />
                )}
              </>
            )}
            {activeTab === "booking" && (
              <div className="space-y-6">
                {requestedQuotes.length === 0 ? (
                  <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                    No quotes yet. Request a quote from a venue in the Chat tab to see it here.
                  </p>
                ) : (
                  <>
                    <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                      {requestedQuotes.length} quote{requestedQuotes.length !== 1 ? "s" : ""} requested
                    </p>
                    <ul className="flex flex-col gap-4">
                      {requestedQuotes.map((rq) => {
                        const proposal = MOCK_PROPOSALS.find((p) => p.id === rq.venueId)
                        const image = proposal && (typeof proposal.images === "string" ? proposal.images : proposal.images[0])
                        const estimatedPerPerson =
                          proposal?.estimatedTotal != null && (proposal.participants ?? 0) > 0
                            ? Math.round(proposal.estimatedTotal / (proposal.participants ?? 1))
                            : null
                        return (
                          <li
                            key={rq.id}
                            className="relative overflow-hidden rounded-lg border"
                            style={{ borderColor: FIGMA.colors.border, backgroundColor: FIGMA.colors.white }}
                          >
                            <div className="flex gap-4 p-4">
                              <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <span
                                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
                                  style={{ backgroundColor: "rgba(34, 197, 94, 0.08)", color: "#22C55E" }}
                                >
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />
                                  Quote requested
                                </span>
                                <p className="text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                                  {rq.venueName}
                                </p>
                                {proposal?.location && (
                                  <p className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                                    {proposal.location}
                                  </p>
                                )}
                                {estimatedPerPerson != null && (
                                  <p className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                                    ~€{estimatedPerPerson} / person
                                  </p>
                                )}
                              </div>
                              {image && (
                                <div className="h-[100px] w-[120px] shrink-0 overflow-hidden rounded-[4px] bg-[#f0f0f0]">
                                  <img src={image} alt="" className="h-full w-full object-cover" width={120} height={100} />
                                </div>
                              )}
                            </div>
                            <div
                              className="flex flex-wrap items-center gap-2 border-t px-4 py-3"
                              style={{ borderColor: FIGMA.colors.border }}
                            >
                              <button
                                type="button"
                                onClick={() => setSignupGateOpen(true)}
                                className="rounded-[4px] px-4 py-2 text-[14px] font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
                              >
                                View full quote
                              </button>
                              <button
                                type="button"
                                onClick={() => {}}
                                className="flex items-center gap-1.5 rounded-[4px] border px-4 py-2 text-[14px] font-medium transition-colors hover:bg-black/[0.04]"
                                style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}
                              >
                                <HugeiconsIcon icon={AiMagicIcon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
                                Ask AI
                              </button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-0">
        <div className="mx-auto max-w-[760px]">
          <ChatInput
            variant="small"
            placeholder="Ask any question..."
            value={chatValue}
            onInputChange={setChatValue}
            onSubmit={handleChatSubmit}
            autoFocus
          />
        </div>
      </div>

      {selectedProposal && (
        <InsetDrawer open onClose={() => setSelectedProposal(null)} maxWidth={680} hideCloseButton>
          <VenueDetailDrawer
            proposal={selectedProposal}
            onRequestQuote={() => {
              handleRequestQuote(selectedProposal)
              setSelectedProposal(null)
            }}
            onClose={() => setSelectedProposal(null)}
          />
        </InsetDrawer>
      )}

      <SignupGateModal
        open={signupGateOpen}
        onClose={() => setSignupGateOpen(false)}
        onContinue={(email) => {
          // Mock: could navigate to /events or show toast
        }}
      />
    </div>
  )
}
