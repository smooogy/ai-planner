"use client"

import { useState } from "react"
import Link from "next/link"
import { FIGMA } from "@/data/constants"
import { MOCK_EVENTS, MOCK_QUOTES, MOCK_STATUS } from "@/data/events"
import type { EventDraft } from "@/data/events"
import { cn } from "@/lib/cn"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, ClipboardIcon, Calendar03Icon, LicenseDraftIcon, Clock01Icon, Notification01Icon } from "@hugeicons/core-free-icons"

const VENUE_IMAGES = ["/venues/venue1.png", "/venues/venue2.png", "/venues/venue3.png"]

type TabId = "active" | "drafts" | "booked"

function getEventType(event: EventDraft) {
  return event.name.split(" · ")[0]?.trim() || event.name
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("active")
  const events = MOCK_EVENTS
  const draftEvents = events.filter((_, i) => MOCK_STATUS[i] === "draft")
  const activeEvents = events.filter((_, i) => MOCK_STATUS[i] !== "draft")
  const tabEvents =
    activeTab === "active"
      ? activeEvents
      : activeTab === "drafts"
        ? draftEvents
        : []

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased bg-white">
      <main className="flex-1 overflow-auto py-6">
        <div className="mx-auto w-full">
          <h1 className="mb-6 px-6 text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            My events
          </h1>

          {events.length === 0 ? (
            <div
              className="rounded border border-dashed p-12 text-center px-6"
              style={{ borderColor: FIGMA.colors.border }}
            >
              <p className="mb-4 text-[16px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                No events
              </p>
              <p className="mb-6 text-[14px] font-normal tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                Create your first event to get started.
              </p>
              <Link
                href="/events/new"
                className="inline-flex items-center gap-2 rounded px-5 py-2.5 text-[16px] font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black, borderRadius: FIGMA.radius.button }}
              >
                <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={1.5} />
                New event
              </Link>
            </div>
          ) : (
            <section className="flex flex-col gap-4 w-full">
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-0 sm:h-[54px] px-6">
                  <div className="flex items-center gap-2 sm:gap-[22px] h-full overflow-x-auto pb-2 sm:pb-0" style={{ marginBottom: -2, zIndex: 10 }}>
                    <button
                      onClick={() => setActiveTab("active")}
                      className={cn(
                        "flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap transition-all border-b-2",
                        activeTab === "active" ? "border-black" : "border-transparent"
                      )}
                    >
                      <HugeiconsIcon icon={ClipboardIcon} size={20} color={activeTab === "active" ? FIGMA.colors.black : "#707885"} strokeWidth={1.5} />
                      <span className={cn("text-[14px] tracking-[-0.08px] transition-colors", activeTab === "active" ? "font-medium" : "font-normal", activeTab === "active" ? "text-black" : "text-[#707885]")}>
                        Active
                      </span>
                      <div className={cn("flex h-5 min-w-[20px] items-center justify-center rounded-full px-2.5 transition-colors", activeTab === "active" ? "" : "bg-[#f1f1f1]")} style={activeTab === "active" ? { backgroundColor: FIGMA.colors.green } : undefined}>
                        <span className={cn("text-[14px] font-medium tracking-[-0.08px]", activeTab === "active" ? "text-black" : "text-[#737876]")}>
                          {activeEvents.length}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("drafts")}
                      className={cn(
                        "flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap transition-all border-b-2",
                        activeTab === "drafts" ? "border-black" : "border-transparent"
                      )}
                    >
                      <HugeiconsIcon icon={LicenseDraftIcon} size={20} color={activeTab === "drafts" ? FIGMA.colors.black : "#707885"} strokeWidth={1.5} />
                      <span className={cn("text-[14px] tracking-[-0.08px] transition-colors", activeTab === "drafts" ? "font-medium" : "font-normal", activeTab === "drafts" ? "text-black" : "text-[#707885]")}>
                        Drafts
                      </span>
                      <div className={cn("flex h-5 min-w-[20px] items-center justify-center rounded-full px-2.5 transition-colors", activeTab === "drafts" ? "" : "bg-[#f1f1f1]")} style={activeTab === "drafts" ? { backgroundColor: FIGMA.colors.green } : undefined}>
                        <span className={cn("text-[14px] font-medium tracking-[-0.08px]", activeTab === "drafts" ? "text-black" : "text-[#737876]")}>
                          {draftEvents.length}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("booked")}
                      className={cn(
                        "flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap transition-all border-b-2",
                        activeTab === "booked" ? "border-black" : "border-transparent"
                      )}
                      style={activeTab === "booked" ? { borderColor: FIGMA.colors.black } : undefined}
                    >
                      <HugeiconsIcon icon={Calendar03Icon} size={20} color={activeTab === "booked" ? FIGMA.colors.black : "#707885"} strokeWidth={1.5} />
                      <span className={cn("text-[14px] tracking-[-0.08px] transition-colors", activeTab === "booked" ? "font-medium" : "font-normal", activeTab === "booked" ? "text-black" : "text-[#707885]")} style={activeTab === "booked" ? { color: FIGMA.colors.black } : undefined}>
                        Booked
                      </span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border-t border-b hidden lg:block" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                  <div
                    className={cn(
                      "grid px-6 py-3 border-b",
                      activeTab === "active" ? "grid-cols-[2fr_1fr_1fr_120px]" : "grid-cols-[2fr_1fr]"
                    )}
                    style={{ borderColor: "rgba(0,0,0,0.1)" }}
                  >
                    <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Event</span>
                    <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Quotes</span>
                    {activeTab === "active" && (
                      <>
                        <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Status</span>
                        <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Last updated</span>
                      </>
                    )}
                  </div>
                  {tabEvents.length === 0 ? (
                    <div className="px-6 py-8 text-center text-[14px]" style={{ color: FIGMA.colors.grey }}>
                      {activeTab === "active" && "No events"}
                      {activeTab === "drafts" && "No drafts"}
                      {activeTab === "booked" && "No events"}
                    </div>
                  ) : (
                    tabEvents.map((event, rowIndex) => {
                      const originalIndex = events.findIndex((e) => e.id === event.id)
                      const q = MOCK_QUOTES[originalIndex % MOCK_QUOTES.length]
                      const s = MOCK_STATUS[originalIndex % MOCK_STATUS.length]
                      const cardImage = VENUE_IMAGES[originalIndex % VENUE_IMAGES.length]
                      const eventType = getEventType(event)
                      const isBooked = s === "booked"
                      const proposalsCount = isBooked ? 0 : typeof s === "number" ? s : 0
                      let needsAttention: string | null = null
                      const lastUpdatedByRow = ["20mn ago", "2 days ago", "5 days ago"]
                      const lastUpdated = activeTab === "active" ? lastUpdatedByRow[rowIndex % lastUpdatedByRow.length] : null
                      if (activeTab === "active") {
                        if (rowIndex === 0) needsAttention = "2 new quotes"
                        else if (rowIndex === 1) needsAttention = "Awaiting deposit"
                      }
                      return (
                        <Link
                          key={event.id}
                          href={`/events/${event.id}`}
                          className={cn(
                            "grid px-6 py-4 items-center transition-colors hover:bg-black/[0.02] cursor-pointer",
                            activeTab === "active" ? "grid-cols-[2fr_1fr_1fr_120px]" : "grid-cols-[2fr_1fr]",
                            tabEvents.indexOf(event) < tabEvents.length - 1 ? "border-b" : ""
                          )}
                          style={{ borderColor: "rgba(0,0,0,0.1)" }}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative w-[58px] h-[58px] shrink-0 rounded overflow-hidden flex items-center justify-center" style={{ backgroundColor: activeTab === "drafts" ? FIGMA.colors.greyLight : "#f0f0f0" }}>
                              {activeTab === "drafts" ? (
                                <HugeiconsIcon icon={LicenseDraftIcon} size={24} color={FIGMA.colors.grey} strokeWidth={1.5} />
                              ) : (
                                <img src={cardImage} alt="" className="w-full h-full object-cover" width={58} height={58} />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[15px] font-medium truncate leading-[1.4]" style={{ color: FIGMA.colors.black }}>
                                {event.name}
                              </span>
                              <span className="text-[14px] truncate" style={{ color: FIGMA.colors.grey }}>
                                {eventType}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 w-fit">
                            <HugeiconsIcon icon={ClipboardIcon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
                            <span className="text-[14px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
                              {proposalsCount === 1 ? "1 quote" : `${proposalsCount} quotes`}
                            </span>
                          </div>
                          {activeTab === "active" && (
                            <div className="min-w-0">
                              {needsAttention === "2 new quotes" ? (
                                <span
                                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium"
                                  style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
                                >
                                  <HugeiconsIcon icon={Notification01Icon} size={14} color={FIGMA.colors.black} strokeWidth={1.5} />
                                  {needsAttention}
                                </span>
                              ) : needsAttention === "Awaiting deposit" ? (
                                <span
                                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-2.5 py-1 text-[13px] font-medium text-white"
                                >
                                  <HugeiconsIcon icon={Clock01Icon} size={14} color="#fff" strokeWidth={1.5} />
                                  {needsAttention}
                                </span>
                              ) : null}
                            </div>
                          )}
                          {activeTab === "active" && lastUpdated && (
                            <span className="text-[14px] tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
                              {lastUpdated}
                            </span>
                          )}
                        </Link>
                      )
                    })
                  )}
                </div>

                <div className="flex flex-col gap-3 lg:hidden">
                  {tabEvents.length === 0 ? (
                    <div className="rounded border border-dashed p-8 text-center" style={{ borderColor: FIGMA.colors.border }}>
                      <p className="text-[14px]" style={{ color: FIGMA.colors.grey }}>No events</p>
                    </div>
                  ) : (
                    tabEvents.map((event) => {
                      const originalIndex = events.findIndex((e) => e.id === event.id)
                      const q = MOCK_QUOTES[originalIndex % MOCK_QUOTES.length]
                      const s = MOCK_STATUS[originalIndex % MOCK_STATUS.length]
                      const cardImage = VENUE_IMAGES[originalIndex % VENUE_IMAGES.length]
                      const eventType = getEventType(event)
                      const isBooked = s === "booked"
                      const statusLabel = isBooked ? "Deposit paid" : s === "draft" ? "Draft" : `${s} proposals`
                      const quotesLabel = q.count === 0
                        ? "No quotes"
                        : q.isNew
                          ? <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-medium" style={{ borderColor: FIGMA.colors.border, color: FIGMA.colors.black }}>1 quote</span>
                          : `${q.count} quotes`
                      return (
                        <Link
                          key={event.id}
                          href={`/events/${event.id}`}
                          className="bg-white border rounded-lg shadow-sm p-4 active:bg-black/[0.02] transition-colors"
                          style={{ borderColor: FIGMA.colors.border }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "relative w-12 h-12 rounded shrink-0 overflow-hidden flex items-center justify-center",
                                activeTab === "drafts" ? "" : "bg-[#f0f0f0]"
                              )}
                              style={activeTab === "drafts" ? { backgroundColor: FIGMA.colors.greyLight } : undefined}
                            >
                              {activeTab === "drafts" ? (
                                <HugeiconsIcon icon={LicenseDraftIcon} size={20} color={FIGMA.colors.grey} strokeWidth={1.5} />
                              ) : (
                                <img src={cardImage} alt="" className="w-full h-full object-cover" width={48} height={48} />
                              )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-[15px] font-medium truncate" style={{ color: FIGMA.colors.black }}>{event.name}</span>
                              <span className="text-[13px] truncate" style={{ color: FIGMA.colors.grey }}>{eventType}</span>
                              <span className="text-[13px] mt-1" style={{ color: FIGMA.colors.grey }}>Quotes: {quotesLabel}</span>
                            </div>
                            {isBooked ? (
                              <span
                                className="rounded-full px-2.5 py-1 text-[12px] font-medium shrink-0"
                                style={{ backgroundColor: FIGMA.colors.green, color: FIGMA.colors.black }}
                              >
                                {statusLabel}
                              </span>
                            ) : s === "draft" ? (
                              <span
                                className="rounded-full px-2.5 py-1 text-[12px] font-medium shrink-0"
                                style={{ backgroundColor: FIGMA.colors.greyLight, color: FIGMA.colors.grey }}
                              >
                                {statusLabel}
                              </span>
                            ) : (
                              <span
                                className="rounded-full border px-2.5 py-1 text-[12px] font-medium shrink-0"
                                style={{ borderColor: FIGMA.colors.grey, color: FIGMA.colors.black, backgroundColor: "transparent" }}
                              >
                                {statusLabel}
                              </span>
                            )}
                          </div>
                        </Link>
                      )
                    })
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
