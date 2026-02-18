/** Event draft shape (design-only mock data) */
export type EventDraft = {
  id: string
  name: string
  briefSummary?: string
}

/** Mock events for prototype UI */
export const MOCK_EVENTS: EventDraft[] = [
  { id: "e1", name: "Multi-day Retreat · 30 people · Paris, France", briefSummary: "Multi-day Retreat · 30 people · Paris, France" },
  { id: "e2", name: "Team Offsite · 30 ppl · Paris", briefSummary: "30 ppl, 2 days, near Paris" },
  { id: "e3", name: "Product Launch · 50 people · London", briefSummary: "Product Launch · 50 people · London" },
  { id: "e4", name: "Workshop · 20 people · Amsterdam", briefSummary: "Workshop · 20 people · Amsterdam" },
  { id: "e5", name: "Board Meeting · 8 people · Dublin", briefSummary: "Board Meeting · 8 people · Dublin" },
  { id: "e6", name: "Conference · 100 people · Barcelona", briefSummary: "Conference · 100 people · Barcelona" },
]

/** Mock quote summary per event (count, isNew) */
export const MOCK_QUOTES = [
  { count: 3, isNew: true },
  { count: 0 },
  { count: 5, isNew: false },
  { count: 1, isNew: true },
  { count: 2 },
  { count: 4, isNew: false },
]

/** Mock status per event: "booked" | "draft" | number (proposal count) */
export const MOCK_STATUS: ("booked" | "draft" | number)[] = [
  "draft",
  "draft",
  3,
  "booked",
  2,
  "draft",
]

/** Action required item: quote expiring or new quotes for an event */
export type ActionRequiredItem = {
  id: string
  type: "quote_expiring" | "new_quotes"
  eventId: string
  eventName: string
  /** e.g. "2 quotes expire in 3 days" or "1 new quote" */
  message: string
  /** ISO date for expiring (optional) */
  expiresAt?: string
}

/** Mock action-required items for Overview (quotes expiring, new quotes) */
export const MOCK_ACTION_REQUIRED: ActionRequiredItem[] = [
  {
    id: "ar1",
    type: "quote_expiring",
    eventId: "e1",
    eventName: "Multi-day Retreat · 30 people · Paris, France",
    message: "2 quotes expire in 3 days",
    expiresAt: "2026-02-20",
  },
  {
    id: "ar2",
    type: "new_quotes",
    eventId: "e3",
    eventName: "Product Launch · 50 people · London",
    message: "1 new quote",
  },
]

/** Quote card for Quotes tab (fake/detail) */
export type QuoteItem = {
  id: string
  venueName: string
  dateRange: string
  attendees: number
  location: string
  status: string
  totalPrice: string
  perPerson: string
  currency: string
  image?: string
}

/** Service line for quote detail breakdown */
export type QuoteServiceLine = {
  label: string
  description?: string
  unitPrice: string
  totalExclTax: string
  currency: string
}

/** Day group in quote detail */
export type QuoteDetailDay = {
  dateLabel: string
  services: QuoteServiceLine[]
}

/** Full quote detail for drawer (AI pre-quote breakdown) */
export type QuoteDetail = {
  quoteId: string
  venueName: string
  location: string
  dateRange: string
  participants: number
  totalExclTax: string
  perPersonExclTax: string
  perPersonInclTax: string
  currency: string
  serviceFees: string
  days: QuoteDetailDay[]
  image?: string
}

/** Fake quotes for Quotes tab */
export const MOCK_QUOTE_ITEMS: QuoteItem[] = [
  {
    id: "q1",
    venueName: "L'Hôtel Abbaye du Golf",
    dateRange: "from Feb 17 to Feb 18, 2026",
    attendees: 30,
    location: "Île-de-France",
    status: "Availability to be confirmed",
    totalPrice: "5 749,46",
    perPerson: "191,65",
    currency: "€",
    image: "/venues/venue1.png",
  },
  {
    id: "q2",
    venueName: "La Maison du Val",
    dateRange: "Feb 18, 2026 — Feb 19, 2026",
    attendees: 30,
    location: "Saint-Germain-en-Laye",
    status: "AI pre-quote",
    totalPrice: "16 806",
    perPerson: "560",
    currency: "€",
    image: "/venues/venue2.png",
  },
]

/** Detailed quote data for drawer (keyed by quote id) */
export const MOCK_QUOTE_DETAILS: Record<string, QuoteDetail> = {
  q1: {
    quoteId: "q1",
    venueName: "L'Hôtel Abbaye du Golf",
    location: "Île-de-France",
    dateRange: "Feb 17, 2026 — Feb 18, 2026",
    participants: 30,
    totalExclTax: "5 749,46",
    perPersonExclTax: "191,65",
    perPersonInclTax: "215",
    currency: "€",
    serviceFees: "34",
    image: "/venues/venue1.png",
    days: [
      {
        dateLabel: "Monday, February 17, 2026",
        services: [
          { label: "Venue hire x 1", description: "Full day", unitPrice: "2 500,00 €", totalExclTax: "2 500,00 €", currency: "€" },
          { label: "Catering x 30", description: "Lunch & coffee", unitPrice: "85,00 €", totalExclTax: "2 550,00 €", currency: "€" },
        ],
      },
    ],
  },
  q2: {
    quoteId: "q2",
    venueName: "La Maison du Val",
    location: "Saint-Germain-en-Laye",
    dateRange: "Feb 18, 2026 — Feb 19, 2026",
    participants: 30,
    totalExclTax: "16 806",
    perPersonExclTax: "560",
    perPersonInclTax: "628",
    currency: "€",
    serviceFees: "34",
    image: "/venues/venue2.png",
    days: [
      {
        dateLabel: "Wednesday, February 18, 2026",
        services: [
          { label: "Forfait séminaire résidentiel single x 30", description: "Séminaire résidentiel", unitPrice: "518,97 €", totalExclTax: "518,97 €", currency: "€" },
          { label: "Taxe de séjour x 30", unitPrice: "7,27 €", totalExclTax: "7,27 €", currency: "€" },
        ],
      },
    ],
  },
}
