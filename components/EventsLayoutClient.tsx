"use client"

import { usePathname } from "next/navigation"
import { CompareUxOptionProvider } from "@/context/CompareUxOptionContext"
import { EventsSidebar } from "./EventsSidebar"

export function EventsLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isUnderEvents = pathname === "/events" || pathname?.startsWith("/events/")

  if (!isUnderEvents) {
    return (
      <div className="h-screen w-full overflow-hidden flex flex-col">
        {children}
      </div>
    )
  }

  return (
    <CompareUxOptionProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <EventsSidebar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </CompareUxOptionProvider>
  )
}
