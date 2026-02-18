"use client"

import { useState } from "react"
import Link from "next/link"
import { FIGMA } from "@/data/constants"
import { cn } from "@/lib/cn"
import { HugeiconsIcon } from "@hugeicons/react"
import { ClipboardIcon, Calendar03Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

type TabId = "active" | "booked" | "archived"

export default function ArchivedEventsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("archived")

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased bg-white">
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto w-full">
          <h1 className="mb-6 text-[18px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.black }}>
            My events
          </h1>
          <section className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-0 sm:h-[54px]">
              <div className="flex items-center gap-2 sm:gap-[22px] h-full overflow-x-auto pb-2 sm:pb-0">
                <Link
                  href="/events"
                  className="flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap border-b-2 border-transparent hover:border-black/10"
                >
                  <HugeiconsIcon icon={ClipboardIcon} size={20} color="#707885" strokeWidth={1.5} />
                  <span className="text-[14px] text-[#707885]">Active</span>
                </Link>
                <button
                  type="button"
                  className="flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap border-b-2 border-transparent"
                >
                  <HugeiconsIcon icon={Calendar03Icon} size={20} color="#707885" strokeWidth={1.5} />
                  <span className="text-[14px] text-[#707885]">Booked</span>
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 sm:gap-2.5 h-[54px] px-2 whitespace-nowrap border-b-2",
                    "border-[#D3D676]"
                  )}
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={FIGMA.colors.green} strokeWidth={1.5} />
                  <span className="text-[14px] font-medium text-[#D3D676]">Archived</span>
                </button>
              </div>
            </div>
            <div className="bg-white border rounded shadow-sm hidden lg:block" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
              <div className="grid grid-cols-[1fr_140px_240px] px-5 py-3 border-b" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Event</span>
                <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Status</span>
                <span className="text-[12px] font-medium tracking-[-0.08px]" style={{ color: "#7b7b7b" }}>Quotes</span>
              </div>
              <div className="px-5 py-8 text-center text-[14px]" style={{ color: FIGMA.colors.grey }}>
                No events
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="rounded border border-dashed p-8 text-center" style={{ borderColor: FIGMA.colors.border }}>
                <p className="text-[14px]" style={{ color: FIGMA.colors.grey }}>No events</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
