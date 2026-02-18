export interface Proposal {
  id: string | number
  proposalName: string
  location?: string
  estimatedTotal: number | null
  currency: string
  images: string | string[]
  participants?: number
  dateRange?: string
  /** Naboo insight quote for card */
  nabooInsight?: string
  /** Brief matching labels (e.g. "30 people", "Paris") for pills */
  reformulatedInsights?: Record<string, string>
  /** Rating for badge on image (e.g. 4.2) */
  rating?: number
  ratingsTotal?: number
}

const VENUE_IMAGES = ["/venues/venue1.png", "/venues/venue2.png", "/venues/venue3.png"]

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "p1",
    proposalName: "Château de la Roche",
    location: "Île-de-France, 30 min from Paris",
    estimatedTotal: 4500,
    currency: "EUR",
    images: VENUE_IMAGES[0]!,
    participants: 30,
    dateRange: "Mar 15–17, 2026",
    nabooInsight: "Ideal for team offsites with a large garden and on-site catering.",
    reformulatedInsights: { capacity: "30 people", location: "Paris, France", budget: "€150/person", MEETING_ROOM: "Meeting room" },
    rating: 4.2,
    ratingsTotal: 24,
  },
  {
    id: "p2",
    proposalName: "Domaine des Sources",
    location: "Loire Valley",
    estimatedTotal: 5200,
    currency: "EUR",
    images: VENUE_IMAGES[1]!,
    participants: 30,
    dateRange: "Mar 15–17, 2026",
    nabooInsight: "Château-style venue with multiple breakout rooms and excellent AV.",
    reformulatedInsights: { capacity: "30 people", location: "Paris, France", ON_SITE_PARKING: "On-site parking" },
    rating: 4.8,
    ratingsTotal: 12,
  },
  {
    id: "p3",
    proposalName: "Manoir du Bois",
    location: "Normandy",
    estimatedTotal: 3800,
    currency: "EUR",
    images: VENUE_IMAGES[2]!,
    participants: 30,
    dateRange: "Mar 15–17, 2026",
    nabooInsight: "Rustic farmhouse with lavender fields and outdoor dining spaces.",
    reformulatedInsights: { capacity: "30 people", budget: "€150/person" },
    rating: 4.5,
    ratingsTotal: 8,
  },
]

export const AI_MESSAGE =
  "Got it — 30 ppl, 2 days, near Paris. Budget mindful + inspiring setting. I'm pulling options with on-site rooms and workshop spaces…"
