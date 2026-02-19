"use client"

import { useRef, useState, useEffect, useLayoutEffect } from "react"
import { cn } from "@/lib/cn"
import { FIGMA } from "@/data/constants"

interface ProposalCarouselProps {
  children: React.ReactNode
  className?: string
  /** When set, header row is rendered above the carousel with this content on the left and arrow controls on the right (overlay arrows are hidden). */
  artifactHeader?: React.ReactNode
}

const arrowBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-black/[0.04] disabled:opacity-40 disabled:pointer-events-none"

export function ProposalCarousel({ children, className = "", artifactHeader }: ProposalCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showArrows, setShowArrows] = useState(false)

  const childrenArray = Array.isArray(children) ? children : [children]
  const totalCards = childrenArray.length

  const getCardStep = () => {
    const container = scrollContainerRef.current
    if (!container) return 0
    const firstCard = container.children[0] as HTMLElement | undefined
    if (!firstCard) return 0
    return firstCard.offsetWidth + 16
  }

  const updateScrollState = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    const cardStep = getCardStep()
    const index = cardStep > 0 ? Math.round(scrollLeft / cardStep) : 0
    setCurrentIndex(index)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollState()
    container.addEventListener("scroll", updateScrollState)
    window.addEventListener("resize", updateScrollState)

    return () => {
      container.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [totalCards])

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardStep = getCardStep()
    container.scrollTo({
      left: cardStep * index,
      behavior: "smooth",
    })
  }

  const scrollLeft = () => scrollToIndex(Math.max(0, currentIndex - 1))
  const scrollRight = () => scrollToIndex(Math.min(totalCards - 1, currentIndex + 1))

  return (
    <div
      className={cn("relative w-full", artifactHeader ? "" : "group", className)}
      onMouseEnter={artifactHeader ? undefined : () => setShowArrows(true)}
      onMouseLeave={artifactHeader ? undefined : () => setShowArrows(false)}
    >
      {artifactHeader && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pr-5">
          <div className="min-w-0">{artifactHeader}</div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canScrollLeft || currentIndex <= 0}
              className={arrowBtnClass}
              style={{ borderColor: FIGMA.colors.border }}
              aria-label="Previous proposal"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={arrowBtnClass}
              style={{ borderColor: FIGMA.colors.border }}
              aria-label="Next proposal"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-4 overflow-x-auto overflow-y-hidden",
          "snap-x snap-mandatory scroll-smooth",
          "scrollbar-hide",
          "pl-1 pr-5",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0 snap-start w-full min-w-full",
              "first:ml-0 last:mr-0",
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {!artifactHeader && canScrollLeft && currentIndex > 0 && (
        <button
          type="button"
          onClick={scrollLeft}
          className={cn(
            "hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "w-10 h-10 rounded-full bg-white border shadow-lg",
            "items-center justify-center",
            "transition-all duration-200",
            "hover:bg-gray-50 hover:scale-110 active:scale-95",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          style={{ borderColor: FIGMA.colors.border }}
          aria-label="Previous proposal"
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {!artifactHeader && canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className={cn(
            "hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "w-10 h-10 rounded-full bg-white border shadow-lg",
            "items-center justify-center",
            "transition-all duration-200",
            "hover:bg-gray-50 hover:scale-110 active:scale-95",
            showArrows ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          style={{ borderColor: FIGMA.colors.border }}
          aria-label="Next proposal"
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {totalCards > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                "hover:opacity-80",
                index === currentIndex ? "w-6" : "w-2",
              )}
              style={{
                backgroundColor: index === currentIndex ? FIGMA.colors.green : "#d1d5db",
              }}
              aria-label={`Go to proposal ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
