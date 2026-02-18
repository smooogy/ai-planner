"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FIGMA } from "@/data/constants"
import { cn } from "@/lib/cn"
import { MOCK_EVENTS } from "@/data/events"
import type { EventDraft } from "@/data/events"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Calendar03Icon,
  FavouriteIcon,
  Settings02Icon,
  ArchiveIcon,
  LicenseDraftIcon,
} from "@hugeicons/core-free-icons"

const RECENTS_MAX = 5
const VENUE_IMAGES = ["/venues/venue1.png", "/venues/venue2.png", "/venues/venue3.png"]
const DEFAULT_EVENT_NAME = "Untitled event"

export function EventsSidebar() {
  const pathname = usePathname()
  const recents = MOCK_EVENTS.slice(0, RECENTS_MAX)
  const activeEventId =
    pathname?.startsWith("/events/") && pathname !== "/events" && pathname !== "/events/new" && pathname !== "/events/archived" && pathname !== "/events/wishlist" && pathname !== "/events/overview"
      ? pathname.split("/")[2]
      : null
  const isListActive = pathname === "/events"
  const isWishlistActive = pathname === "/events/wishlist"

  return (
    <aside
      className="flex w-[275px] shrink-0 flex-col border-r"
      style={{ borderColor: FIGMA.colors.border, backgroundColor: "#F8F9FC" }}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 px-4">
        <Link href="/" className="flex h-[42px] items-center rounded-[6px] px-2 shrink-0 transition-colors hover:bg-black/[0.06]">
          <img src="/logo-v2.svg" alt="Naboo" className="h-[18px] w-auto object-contain" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0 overflow-hidden px-3 py-3" aria-label="Event navigation">
        <Link
          href="/events/new"
          className="mb-3 flex items-center justify-center gap-3 rounded-md border bg-white px-3 py-2 text-[14px] font-medium transition-colors hover:bg-black/[0.06]"
          style={{
            color: FIGMA.colors.black,
            borderColor: FIGMA.colors.border,
            borderRadius: FIGMA.radius.button,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <HugeiconsIcon icon={Add01Icon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
          New event
        </Link>
        <Link
          href="/events"
          className={cn(
            "flex items-center gap-3 rounded-[6px] px-3 py-2 text-[14px] font-normal transition-colors hover:bg-black/[0.06]",
            isListActive ? "bg-black/[0.06]" : "bg-transparent"
          )}
          style={{ color: FIGMA.colors.black }}
        >
          <HugeiconsIcon icon={Calendar03Icon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
          My events
        </Link>
        <Link
          href="/events/wishlist"
          className={cn(
            "flex items-center gap-3 rounded-[6px] px-3 py-2 text-[14px] font-normal transition-colors hover:bg-black/[0.06]",
            isWishlistActive ? "bg-black/[0.06]" : "bg-transparent"
          )}
          style={{ color: FIGMA.colors.black }}
        >
          <HugeiconsIcon icon={FavouriteIcon} size={18} color={FIGMA.colors.black} strokeWidth={1.5} />
          Wishlist
        </Link>

        <p className="mt-4 mb-1 px-3 text-[13px] font-medium tracking-[-0.08px]" style={{ color: FIGMA.colors.grey }}>
          Recent events
        </p>
        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-auto">
          {recents.length === 0 ? (
            <p className="px-3 py-1.5 text-[13px] font-normal" style={{ color: FIGMA.colors.grey }}>
              No recent events
            </p>
          ) : (
            recents.map((event: EventDraft, index) => {
              const isActive = activeEventId === event.id
              const isDraftStyle = index < 3
              const venueImage = !isDraftStyle ? VENUE_IMAGES[(index - 3) % VENUE_IMAGES.length] : null
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={cn(
                    "flex items-center gap-3 truncate rounded-[6px] px-3 py-2 text-[14px] font-normal transition-colors hover:bg-black/[0.06]",
                    isActive ? "bg-black/[0.06]" : "bg-transparent"
                  )}
                  style={{ color: FIGMA.colors.black }}
                  title={event.name}
                >
                  <div
                    className="h-[18px] w-[18px] shrink-0 rounded overflow-hidden flex items-center justify-center"
                  >
                    {isDraftStyle ? (
                      <HugeiconsIcon icon={LicenseDraftIcon} size={18} color={FIGMA.colors.grey} strokeWidth={1.5} />
                    ) : (
                      <img src={venueImage!} alt="" className="h-full w-full object-cover" width={18} height={18} />
                    )}
                  </div>
                  <span className="min-w-0 truncate">{event.name || DEFAULT_EVENT_NAME}</span>
                </Link>
              )
            })
          )}
        </div>

        <div className="mt-auto shrink-0 pt-1.5">
          <Link
            href="/events/archived"
            className="flex items-center gap-3 rounded-md px-3 py-1.5 text-[13px] font-normal transition-colors hover:bg-black/[0.06]"
            style={{ color: FIGMA.colors.black, borderRadius: FIGMA.radius.button }}
          >
            <HugeiconsIcon icon={ArchiveIcon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
            Archived
          </Link>
          <Link
            href="/events"
            className="flex items-center gap-3 rounded-md px-3 py-1.5 text-[13px] font-normal transition-colors hover:bg-black/[0.06]"
            style={{ color: FIGMA.colors.black, borderRadius: FIGMA.radius.button }}
          >
            <HugeiconsIcon icon={Settings02Icon} size={16} color={FIGMA.colors.black} strokeWidth={1.5} />
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  )
}
