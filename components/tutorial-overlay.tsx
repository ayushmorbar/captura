"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Monitor, Mic, Settings, Download, ChevronRight, ChevronLeft } from "lucide-react"
import { useState } from "react"

interface TutorialOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const tutorialSteps = [
  {
    title: "Welcome to Captura",
    content: "Professional screen recording made simple. Let's walk through the key features.",
    icon: Monitor,
    color: "bg-blue-500",
  },
  {
    title: "Recording Controls",
    content:
      "Use the large timer display and control buttons to start, pause, and stop your recordings. Keyboard shortcuts are available for quick access.",
    icon: Monitor,
    color: "bg-red-500",
  },
  {
    title: "Audio Mixing",
    content:
      "Configure your audio sources in the Audio tab. Test your microphone levels and adjust volume controls for perfect sound.",
    icon: Mic,
    color: "bg-green-500",
  },
  {
    title: "Settings & Quality",
    content:
      "Choose your video quality, audio sources, and enable annotations in the Record tab. Higher quality means larger file sizes.",
    icon: Settings,
    color: "bg-purple-500",
  },
  {
    title: "Export & Share",
    content: "Preview your recordings, download them locally, or upload directly to cloud storage services.",
    icon: Download,
    color: "bg-orange-500",
  },
]

export function TutorialOverlay({ isOpen, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = tutorialSteps[currentStep]
  const Icon = step.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-aeonik text-2xl">Getting Started</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-aeonik text-xl font-semibold">{step.title}</h3>
                  <p className="font-inter text-slate-600 dark:text-slate-400 leading-relaxed">{step.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-blue-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="font-inter bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Badge variant="outline" className="font-inter">
              {currentStep + 1} of {tutorialSteps.length}
            </Badge>

            <Button onClick={nextStep} className="font-inter">
              {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
