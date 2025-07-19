"use client"

import { useCallback } from "react"

export function useAccessibility() {
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.getElementById("screen-reader-announcements")
    if (announcement) {
      announcement.textContent = message
      // Clear after a short delay to allow for repeated announcements
      setTimeout(() => {
        announcement.textContent = ""
      }, 1000)
    }
  }, [])

  return { announceToScreenReader }
}
