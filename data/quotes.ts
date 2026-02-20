/**
 * Extended quote data for Compare flow and AI-native Quotes tab.
 * 6 quotes across 3 venues, statuses, AI insights, line items.
 */

import type { QuoteItem, QuoteDetail, QuoteDetailDay, QuoteServiceLine } from "@/data/events"

/** QuoteItem with structured services and AI insights for card/compare display */
export type QuoteItemWithInsights = QuoteItem & {
  aiInsights?: string[]
  includedServices: string[]
  notIncluded: string[]
  cancellation: "Flexible" | "Standard" | "Strict"
  /** Numeric total for sorting/highlighting (derived from totalPrice) */
  numericTotal: number
  numericPerPerson: number
}

/** AI verdict badge per quote (e.g. Best value, Best match) */
export type QuoteAiVerdict = {
  quoteId: string
  badges: string[]
}

/** Mock: 6 quotes across 3 venues */
export const MOCK_QUOTES_EXTENDED: QuoteItemWithInsights[] = [
  {
    id: "q1",
    venueName: "L'Hôtel Abbaye du Golf",
    dateRange: "Feb 17 – Feb 18, 2026",
    attendees: 30,
    location: "Île-de-France",
    status: "Availability to be confirmed",
    totalPrice: "5 749",
    perPerson: "192",
    currency: "€",
    image: "/venues/venue1.png",
    aiInsights: ["Includes meeting room", "Dinner not included"],
    includedServices: ["Lunch & coffee", "Meeting room"],
    notIncluded: ["Dinner", "Accommodation"],
    cancellation: "Flexible",
    numericTotal: 5749,
    numericPerPerson: 192,
  },
  {
    id: "q2",
    venueName: "L'Hôtel Abbaye du Golf",
    dateRange: "Feb 24 – Feb 25, 2026",
    attendees: 30,
    location: "Île-de-France",
    status: "AI pre-quote",
    totalPrice: "6 120",
    perPerson: "204",
    currency: "€",
    image: "/venues/venue1.png",
    aiInsights: ["Budget above target by +8%", "Flexible cancellation"],
    includedServices: ["Lunch & coffee"],
    notIncluded: ["Dinner", "Meeting room", "Accommodation"],
    cancellation: "Flexible",
    numericTotal: 6120,
    numericPerPerson: 204,
  },
  {
    id: "q3",
    venueName: "La Maison du Val",
    dateRange: "Feb 18 – Feb 19, 2026",
    attendees: 30,
    location: "Saint-Germain-en-Laye",
    status: "Awaiting deposit",
    totalPrice: "16 806",
    perPerson: "560",
    currency: "€",
    image: "/venues/venue2.png",
    aiInsights: ["All-inclusive package", "Cancellation terms strict"],
    includedServices: ["All-inclusive: meals, rooms, meeting room"],
    notIncluded: [],
    cancellation: "Strict",
    numericTotal: 16806,
    numericPerPerson: 560,
  },
  {
    id: "q4",
    venueName: "La Maison du Val",
    dateRange: "Mar 2 – Mar 3, 2026",
    attendees: 30,
    location: "Saint-Germain-en-Laye",
    status: "Deposit paid",
    totalPrice: "15 200",
    perPerson: "507",
    currency: "€",
    image: "/venues/venue2.png",
    aiInsights: ["Best value for 30 pax", "Meeting room included"],
    includedServices: ["All-inclusive: meals, rooms, meeting room"],
    notIncluded: [],
    cancellation: "Standard",
    numericTotal: 15200,
    numericPerPerson: 507,
  },
  {
    id: "q5",
    venueName: "Château de la Roche",
    dateRange: "Feb 20 – Feb 21, 2026",
    attendees: 30,
    location: "Loire Valley",
    status: "AI pre-quote",
    totalPrice: "12 400",
    perPerson: "413",
    currency: "€",
    image: "/venues/venue3.png",
    aiInsights: ["Fastest to confirm", "Dinner not included"],
    includedServices: ["Exclusive venue hire", "Lunch"],
    notIncluded: ["Dinner", "Accommodation", "Meeting room"],
    cancellation: "Flexible",
    numericTotal: 12400,
    numericPerPerson: 413,
  },
  {
    id: "q6",
    venueName: "Château de la Roche",
    dateRange: "Mar 10 – Mar 11, 2026",
    attendees: 30,
    location: "Loire Valley",
    status: "Availability to be confirmed",
    totalPrice: "11 900",
    perPerson: "397",
    currency: "€",
    image: "/venues/venue3.png",
    aiInsights: ["Budget above target by +12%", "Add meeting room possible"],
    includedServices: ["Exclusive venue hire", "Lunch"],
    notIncluded: ["Dinner", "Meeting room"],
    cancellation: "Standard",
    numericTotal: 11900,
    numericPerPerson: 397,
  },
]

/** Line items / service lines for full breakdown (reused in QuoteDetail) */
function day(label: string, services: QuoteServiceLine[]): QuoteDetailDay {
  return { dateLabel: label, services }
}

/** Full quote details for all 6 quotes (drawer + compare breakdown) */
export const MOCK_QUOTE_DETAILS_EXTENDED: Record<string, QuoteDetail> = {
  q1: {
    quoteId: "q1",
    venueName: "L'Hôtel Abbaye du Golf",
    location: "Île-de-France",
    dateRange: "Feb 17 – Feb 18, 2026",
    participants: 30,
    totalExclTax: "5 749",
    perPersonExclTax: "192",
    perPersonInclTax: "215",
    currency: "€",
    serviceFees: "34",
    image: "/venues/venue1.png",
    days: [
      day("Monday, February 17, 2026", [
        { label: "Venue hire x 1", description: "Full day", unitPrice: "2 500 €", totalExclTax: "2 500 €", currency: "€" },
        { label: "Catering x 30", description: "Lunch & coffee", unitPrice: "85 €", totalExclTax: "2 550 €", currency: "€" },
        { label: "Meeting room", description: "Included", unitPrice: "0 €", totalExclTax: "0 €", currency: "€" },
      ]),
    ],
  },
  q2: {
    quoteId: "q2",
    venueName: "L'Hôtel Abbaye du Golf",
    location: "Île-de-France",
    dateRange: "Feb 24 – Feb 25, 2026",
    participants: 30,
    totalExclTax: "6 120",
    perPersonExclTax: "204",
    perPersonInclTax: "228",
    currency: "€",
    serviceFees: "34",
    image: "/venues/venue1.png",
    days: [
      day("Monday, February 24, 2026", [
        { label: "Venue hire x 1", description: "Full day", unitPrice: "2 700 €", totalExclTax: "2 700 €", currency: "€" },
        { label: "Catering x 30", description: "Lunch & coffee", unitPrice: "110 €", totalExclTax: "3 300 €", currency: "€" },
      ]),
    ],
  },
  q3: {
    quoteId: "q3",
    venueName: "La Maison du Val",
    location: "Saint-Germain-en-Laye",
    dateRange: "Feb 18 – Feb 19, 2026",
    participants: 30,
    totalExclTax: "16 806",
    perPersonExclTax: "560",
    perPersonInclTax: "628",
    currency: "€",
    serviceFees: "0",
    image: "/venues/venue2.png",
    days: [
      day("Wednesday, February 18, 2026", [
        { label: "Forfait séminaire résidentiel x 30", description: "All-inclusive", unitPrice: "518,97 €", totalExclTax: "15 569 €", currency: "€" },
        { label: "Taxe de séjour x 30", unitPrice: "7,27 €", totalExclTax: "218 €", currency: "€" },
      ]),
    ],
  },
  q4: {
    quoteId: "q4",
    venueName: "La Maison du Val",
    location: "Saint-Germain-en-Laye",
    dateRange: "Mar 2 – Mar 3, 2026",
    participants: 30,
    totalExclTax: "15 200",
    perPersonExclTax: "507",
    perPersonInclTax: "568",
    currency: "€",
    serviceFees: "0",
    image: "/venues/venue2.png",
    days: [
      day("Monday, March 2, 2026", [
        { label: "Forfait séminaire x 30", description: "All-inclusive + meeting room", unitPrice: "506,67 €", totalExclTax: "15 200 €", currency: "€" },
      ]),
    ],
  },
  q5: {
    quoteId: "q5",
    venueName: "Château de la Roche",
    location: "Loire Valley",
    dateRange: "Feb 20 – Feb 21, 2026",
    participants: 30,
    totalExclTax: "12 400",
    perPersonExclTax: "413",
    perPersonInclTax: "463",
    currency: "€",
    serviceFees: "45",
    image: "/venues/venue3.png",
    days: [
      day("Thursday, February 20, 2026", [
        { label: "Château hire x 1 day", description: "Exclusive use", unitPrice: "5 000 €", totalExclTax: "5 000 €", currency: "€" },
        { label: "Catering x 30", description: "Lunch only", unitPrice: "245 €", totalExclTax: "7 350 €", currency: "€" },
      ]),
    ],
  },
  q6: {
    quoteId: "q6",
    venueName: "Château de la Roche",
    location: "Loire Valley",
    dateRange: "Mar 10 – Mar 11, 2026",
    participants: 30,
    totalExclTax: "11 900",
    perPersonExclTax: "397",
    perPersonInclTax: "445",
    currency: "€",
    serviceFees: "40",
    image: "/venues/venue3.png",
    days: [
      day("Tuesday, March 10, 2026", [
        { label: "Château hire x 1 day", description: "Exclusive use", unitPrice: "4 500 €", totalExclTax: "4 500 €", currency: "€" },
        { label: "Catering x 30", description: "Lunch only", unitPrice: "245 €", totalExclTax: "7 350 €", currency: "€" },
      ]),
    ],
  },
}

/** AI verdict badges per quote for compare view (mock) */
export const MOCK_COMPARE_AI_VERDICTS: QuoteAiVerdict[] = [
  { quoteId: "q1", badges: ["Best value"] },
  { quoteId: "q2", badges: [] },
  { quoteId: "q3", badges: ["Best match"] },
  { quoteId: "q4", badges: ["Best value", "Best match"] },
  { quoteId: "q5", badges: ["Fastest to confirm"] },
  { quoteId: "q6", badges: ["Best value"] },
]

/**
 * Generates a natural-language AI summary paragraph for a set of compared quotes.
 * Pure function — mock only, no API call.
 */
export function generateAiSummaryParagraph(quotes: QuoteItemWithInsights[]): string {
  if (quotes.length < 2) return ""
  const cheapest = [...quotes].sort((a, b) => a.numericTotal - b.numericTotal)[0]
  const allInclusive = quotes.find((q) => q.notIncluded.length === 0)
  const flexible = quotes.find((q) => q.cancellation === "Flexible")
  const priceRange = quotes.map((q) => q.numericPerPerson)
  const min = Math.min(...priceRange)
  const max = Math.max(...priceRange)

  let s = `For your ${quotes[0].attendees}-person event, `
  if (allInclusive && allInclusive.id !== cheapest.id) {
    s += `${allInclusive.venueName} offers the most complete package (all-inclusive), `
    s += `while ${cheapest.venueName} comes in ${Math.round(((allInclusive.numericTotal - cheapest.numericTotal) / allInclusive.numericTotal) * 100)}% cheaper `
    s += `at ${cheapest.currency} ${cheapest.totalPrice} but doesn't include ${cheapest.notIncluded.slice(0, 2).join(" or ").toLowerCase()}. `
  } else {
    s += `${cheapest.venueName} is the most affordable at ${cheapest.currency} ${cheapest.perPerson}/person. `
  }
  s += `Per-person prices range from ${cheapest.currency} ${min} to ${cheapest.currency} ${max}. `
  if (flexible && flexible.id !== cheapest.id) {
    s += `${flexible.venueName} has the most flexible cancellation terms.`
  }
  return s.trim()
}

/**
 * Generates dynamic suggested questions referencing actual venue names and price data.
 */
export function generateSuggestedQuestions(quotes: QuoteItemWithInsights[]): string[] {
  if (quotes.length < 2) return []
  const sorted = [...quotes].sort((a, b) => a.numericTotal - b.numericTotal)
  const cheapest = sorted[0]
  const priciest = sorted[sorted.length - 1]
  const hasDinnerMissing = quotes.some((q) => q.notIncluded.includes("Dinner"))
  const hasStrict = quotes.some((q) => q.cancellation === "Strict")

  const questions: string[] = []
  questions.push(`Why is ${cheapest.venueName} ${cheapest.currency} ${(priciest.numericTotal - cheapest.numericTotal).toLocaleString("fr-FR")} cheaper than ${priciest.venueName}?`)
  if (hasDinnerMissing) {
    questions.push(`What would it cost to add dinner to ${quotes.find((q) => q.notIncluded.includes("Dinner"))?.venueName ?? "the venue"}?`)
  }
  if (hasStrict) {
    questions.push(`What are the cancellation terms for ${quotes.find((q) => q.cancellation === "Strict")?.venueName}?`)
  }
  questions.push("Which option is safest for availability?")
  return questions.slice(0, 3)
}
