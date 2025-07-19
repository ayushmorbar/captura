"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard } from "lucide-react"

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { key: "Space", action: "Start/Pause Recording", category: "Recording" },
  { key: "Esc", action: "Stop Recording", category: "Recording" },
  { key: "Ctrl + R", action: "Reset/New Recording", category: "Recording" },
  { key: "Ctrl + /", action: "Show Shortcuts", category: "Help" },
  { key: "Ctrl + H", action: "Show Tutorial", category: "Help" },
  { key: "Tab", action: "Navigate Controls", category: "Navigation" },
  { key: "Enter", action: "Activate Button", category: "Navigation" },
]

const categories = ["Recording", "Help", "Navigation"]

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-aeonik text-2xl flex items-center gap-2">
            <Keyboard className="w-6 h-6" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardContent className="p-4">
                <h3 className="font-aeonik font-semibold text-lg mb-4 text-slate-900 dark:text-white">{category}</h3>
                <div className="space-y-3">
                  {shortcuts
                    .filter((shortcut) => shortcut.category === category)
                    .map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-inter text-slate-600 dark:text-slate-400">{shortcut.action}</span>
                        <Badge variant="outline" className="font-mono">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <p className="font-inter text-sm text-slate-500 dark:text-slate-400">
              Press{" "}
              <Badge variant="outline" className="font-mono mx-1">
                Ctrl + /
              </Badge>{" "}
              anytime to view shortcuts
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
