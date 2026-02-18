import { EventsLayoutClient } from "@/components/EventsLayoutClient"

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <EventsLayoutClient>{children}</EventsLayoutClient>
}
