"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Square, Pause, RotateCcw, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecordingControlsProps {
  recordingState: "idle" | "recording" | "paused" | "stopped"
  recordingTime: number
  error: string | null
  countdown: number // New prop for countdown value
  isCountingDown: boolean // New prop for countdown status
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onReset: () => void
}

export function RecordingControls({
  recordingState,
  recordingTime,
  error,
  countdown, // Destructure new prop
  isCountingDown, // Destructure new prop
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: RecordingControlsProps) {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = () => {
    if (isCountingDown) return "bg-orange-500" // New color for countdown
    switch (recordingState) {
      case "recording":
        return "bg-red-500"
      case "paused":
        return "bg-yellow-500"
      case "stopped":
        return "bg-green-500"
      default:
        return "bg-slate-400"
    }
  }

  const getStatusText = () => {
    if (isCountingDown) return "Starting..." // New text for countdown
    switch (recordingState) {
      case "recording":
        return "Recording"
      case "paused":
        return "Paused"
      case "stopped":
        return "Completed"
      default:
        return "Ready"
    }
  }

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-aeonik text-2xl flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", getStatusColor())} />
            Recording Studio
          </CardTitle>
          <Badge variant={recordingState === "recording" ? "destructive" : "outline"} className="font-inter">
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl sm:text-7xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
            {isCountingDown ? countdown : formatTime(recordingTime)} {/* Display countdown or time */}
          </div>
          {recordingState === "recording" && (
            <Progress value={(recordingTime % 60) * (100 / 60)} className="w-full max-w-md mx-auto" />
          )}
          {isCountingDown && (
            <p className="text-lg font-inter text-slate-600 dark:text-slate-400">Recording will start in...</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-inter font-medium text-red-900 dark:text-red-100 mb-1">Recording Error</h4>
                <p className="text-red-700 dark:text-red-300 font-inter text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          {recordingState === "idle" && (
            <Button
              onClick={onStart}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-inter"
              aria-label="Start recording (Space)"
              disabled={isCountingDown} // Disable during countdown
            >
              <Play className="w-6 h-6 mr-3" />
              {isCountingDown ? "Starting..." : "Start Recording"}
            </Button>
          )}

          {recordingState === "recording" && (
            <>
              <Button
                onClick={onPause}
                size="lg"
                variant="outline"
                className="px-6 py-3 font-inter bg-transparent"
                aria-label="Pause recording (Space)"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
              <Button
                onClick={onStop}
                size="lg"
                variant="destructive"
                className="px-6 py-3 font-inter"
                aria-label="Stop recording (Esc)"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}

          {recordingState === "paused" && (
            <>
              <Button
                onClick={onResume}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-inter"
                aria-label="Resume recording (Space)"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
              <Button
                onClick={onStop}
                size="lg"
                variant="destructive"
                className="px-6 py-3 font-inter"
                aria-label="Stop recording (Esc)"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}

          {recordingState === "stopped" && (
            <Button
              onClick={onReset}
              size="lg"
              variant="outline"
              className="px-6 py-3 font-inter bg-transparent"
              aria-label="Start new recording"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
