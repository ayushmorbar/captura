"use client"

import { useEffect } from "react"

interface UseKeyboardShortcutsProps {
  onStartStop: () => void
  onPauseResume: () => void
  onShowShortcuts: () => void
  onShowTutorial: () => void
}

export function useKeyboardShortcuts({
  onStartStop,
  onPauseResume,
  onShowShortcuts,
  onShowTutorial,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key) {
        case " ":
          event.preventDefault()
          onPauseResume()
          break
        case "Escape":
          event.preventDefault()
          onStartStop()
          break
        case "/":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onShowShortcuts()
          }
          break
        case "h":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onShowTutorial()
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onStartStop, onPauseResume, onShowShortcuts, onShowTutorial])
}
