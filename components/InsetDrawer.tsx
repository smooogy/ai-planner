"use client"

import { useState, useEffect } from "react"
import { FIGMA } from "@/data/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

export interface InsetDrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  /** Optional max width of the panel (default 680px) */
  maxWidth?: number | string
  /** Optional border radius in px (default 12) */
  borderRadius?: number
  /** When true, do not render the default close button (e.g. when child has its own) */
  hideCloseButton?: boolean
}

const TRANSITION_MS = 320

export function InsetDrawer({ open, onClose, children, maxWidth = 680, borderRadius = 12, hideCloseButton = false }: InsetDrawerProps) {
  const [entered, setEntered] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (open) {
      setExiting(false)
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true))
      })
      return () => cancelAnimationFrame(t)
    }
  }, [open])

  const handleClose = () => {
    setExiting(true)
  }

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return
    if (exiting) onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end p-3"
      aria-hidden={!open && exiting}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/20 ease-out"
        style={{
          opacity: entered && !exiting ? 1 : 0,
          transition: `opacity ${TRANSITION_MS}ms ease-out`,
        }}
        onClick={handleClose}
      />
      {/* Panel: right-aligned, slide from right with fade */}
      <div
        className="relative flex max-h-[calc(100vh-24px)] w-full flex-col overflow-hidden bg-white shadow-xl ease-out"
        style={{
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          borderRadius,
          transform: entered && !exiting ? "translateX(0)" : "translateX(100%)",
          opacity: entered && !exiting ? 1 : 0,
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1), opacity ${TRANSITION_MS}ms ease-out`,
        }}
        role="dialog"
        aria-modal="true"
        onTransitionEnd={handleTransitionEnd}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 rounded p-1.5 transition-colors hover:bg-black/5"
            style={{ color: FIGMA.colors.grey }}
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} strokeWidth={1.5} />
          </button>
        )}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ borderRadius }}>
          {children}
        </div>
      </div>
    </div>
  )
}
