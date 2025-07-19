"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Monitor,
  Volume2,
  Settings,
  Camera,
  Keyboard,
  HelpCircle,
  Zap,
  Shield,
  Download,
  CheckCircle,
  Loader2,
  Github,
} from "lucide-react"
import { RecordingControls } from "@/components/recording-controls"
import { AudioMixer } from "@/components/audio-mixer"
import { VideoPreview } from "@/components/video-preview"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { MobileRecorder } from "@/components/mobile-recorder"
import { useRecording } from "@/hooks/use-recording"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useAccessibility } from "@/hooks/use-accessibility"

export default function Captura() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [activeTab, setActiveTab] = useState("record")
  const [isMobile, setIsMobile] = useState(false)

  const {
    recordingState,
    recordingTime,
    recordedBlob,
    mp4Blob,
    isConverting,
    error,
    settings,
    isEmbedded,
    countdown, // Destructure new state
    isCountingDown, // Destructure new state
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    updateSettings,
    downloadWebm,
    convertAndDownloadMp4,
  } = useRecording()

  const { announceToScreenReader } = useAccessibility()

  useKeyboardShortcuts({
    onStartStop: recordingState === "idle" ? startRecording : stopRecording,
    onPauseResume: recordingState === "recording" ? pauseRecording : resumeRecording,
    onShowShortcuts: () => setShowShortcuts(true),
    onShowTutorial: () => setShowTutorial(true),
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (recordingState === "recording") {
      announceToScreenReader("Recording started")
    } else if (recordingState === "stopped") {
      announceToScreenReader("Recording stopped")
    } else if (isCountingDown) {
      announceToScreenReader(`Recording starting in ${countdown} seconds`)
    }
  }, [recordingState, isCountingDown, countdown, announceToScreenReader])

  if (isMobile) {
    return <MobileRecorder />
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        {/* Header */}
        <header className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {/* OFFBEATS LOGO */}
                  <img src="/logo-offbeats.svg" alt="Offbeats Logo" className="w-12 h-12 object-contain" />
                  <span className="mx-2 text-slate-400">|</span>
                  {/* CAPTURA LOGO */}
                  <img src="/icon.svg" alt="Captura Logo" className="w-9 h-9 object-contain" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShortcuts(true)}
                      aria-label="Show keyboard shortcuts"
                    >
                      <Keyboard className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Keyboard Shortcuts (Ctrl+/)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setShowTutorial(true)} aria-label="Show tutorial">
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tutorial & Help</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="View on GitHub">
                      <a href="https://github.com/ayushmorbar/captura" target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on GitHub</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-aeonik font-bold text-slate-900 dark:text-white mb-4">
              Screen Recorder
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-inter max-w-3xl mx-auto">
              Capture, mix, and share your screen recordings
            </p>
          </div>

          {/* Embedded Warning */}
          {isEmbedded && recordingState === "idle" && (
            <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                  <div className="space-y-3">
                    <h3 className="font-aeonik font-semibold text-amber-900 dark:text-amber-100">
                      Browser Security Notice
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200 font-inter">
                      Screen capture is restricted in embedded previews for security. Launch Captura in a new tab to
                      access all recording features.
                    </p>
                    <Button
                      onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Launch Captura
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recording Panel */}
            <div className="lg:col-span-2 space-y-6">
              <RecordingControls
                recordingState={recordingState}
                recordingTime={recordingTime}
                error={error}
                countdown={countdown} // Pass countdown
                isCountingDown={isCountingDown} // Pass isCountingDown
                onStart={startRecording}
                onPause={pauseRecording}
                onResume={resumeRecording}
                onStop={stopRecording}
                onReset={resetRecording}
              />

              {/* Tabs Interface */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="record" className="font-inter">
                    Record
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="font-inter">
                    Audio
                  </TabsTrigger>
                  <TabsTrigger value="export" className="font-inter">
                    Export
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="record" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-aeonik flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Recording Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-inter font-medium text-slate-700 dark:text-slate-300">
                            Video Quality
                          </label>
                          <Select
                            value={settings.videoQuality}
                            onValueChange={(value: "low" | "medium" | "high") =>
                              updateSettings({ videoQuality: value })
                            }
                            disabled={recordingState !== "idle" || isCountingDown}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low (720p, 15fps)</SelectItem>
                              <SelectItem value="medium">Medium (1080p, 30fps)</SelectItem>
                              <SelectItem value="high">High (1440p, 60fps)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-inter font-medium text-slate-700 dark:text-slate-300">
                            Audio Source
                          </label>
                          <Select
                            value={settings.audioSource}
                            onValueChange={(value) => updateSettings({ audioSource: value })}
                            disabled={recordingState !== "idle" || isCountingDown}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Audio</SelectItem>
                              <SelectItem value="microphone">Microphone Only</SelectItem>
                              <SelectItem value="system">System Audio Only</SelectItem>
                              <SelectItem value="both">Both Sources</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* New Countdown Duration Setting */}
                        <div className="space-y-3">
                          <label className="text-sm font-inter font-medium text-slate-700 dark:text-slate-300">
                            Countdown Duration
                          </label>
                          <Select
                            value={String(settings.countdownDuration)}
                            onValueChange={(value) => updateSettings({ countdownDuration: Number(value) })}
                            disabled={recordingState !== "idle" || isCountingDown}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">No Countdown</SelectItem>
                              <SelectItem value="1">1 Second</SelectItem>
                              <SelectItem value="3">3 Seconds</SelectItem>
                              <SelectItem value="5">5 Seconds</SelectItem>
                              <SelectItem value="10">10 Seconds</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audio">
                  <AudioMixer settings={settings} onUpdateSettings={updateSettings} recordingState={recordingState} />
                </TabsContent>

                <TabsContent value="export">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-aeonik flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Export Recording
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {recordedBlob ? (
                        <>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-inter font-medium">Recording Ready</span>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-inter text-slate-600 dark:text-slate-400">File Size</span>
                              <span className="font-mono">{(recordedBlob.size / (1024 * 1024)).toFixed(1)} MB</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-inter text-slate-600 dark:text-slate-400">Format</span>
                              <span className="font-mono">WebM</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <Button
                              onClick={downloadWebm}
                              className="w-full font-inter bg-transparent"
                              variant="outline"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download as WebM
                            </Button>
                            <Button
                              onClick={convertAndDownloadMp4}
                              disabled={isConverting}
                              className="w-full font-inter bg-blue-600 hover:bg-blue-700"
                            >
                              {isConverting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Converting to MP4...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download as MP4
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 space-y-3">
                          <Download className="w-12 h-12 mx-auto text-slate-400" />
                          <h3 className="font-aeonik font-semibold text-lg">No Recording Available</h3>
                          <p className="font-inter text-slate-600 dark:text-slate-400">
                            Complete a recording to access export options.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Preview */}
              {recordingState !== "idle" && !isCountingDown && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-aeonik text-lg flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <div className="w-6 h-6 bg-white rounded-full"></div>
                        </div>
                        <p className="text-sm font-inter text-slate-600 dark:text-slate-400">
                          Recording in progress...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Countdown Preview */}
              {isCountingDown && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-aeonik text-lg flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Starting Soon...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="text-8xl font-bold text-blue-600 dark:text-blue-400 animate-bounce">
                          {countdown}
                        </div>
                        <p className="text-lg font-inter text-slate-600 dark:text-slate-400">Get ready to record!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-aeonik text-lg">Session Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-inter text-slate-600 dark:text-slate-400">Duration</span>
                    <span className="font-mono font-semibold">
                      {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-inter text-slate-600 dark:text-slate-400">Quality</span>
                    <Badge variant="outline" className="font-inter">
                      {settings.videoQuality.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-inter text-slate-600 dark:text-slate-400">Audio</span>
                    <Badge variant="outline" className="font-inter">
                      {settings.audioSource === "none" ? "Disabled" : "Enabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-aeonik text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-2">
                      <Monitor className="w-8 h-8 mx-auto text-blue-600" />
                      <p className="text-xs font-inter text-slate-600 dark:text-slate-400">Screen Capture</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Volume2 className="w-8 h-8 mx-auto text-green-600" />
                      <p className="text-xs font-inter text-slate-600 dark:text-slate-400">Audio Mixing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Video Preview Modal */}
        {recordedBlob && (
          <VideoPreview
            blob={recordedBlob}
            mp4Blob={mp4Blob}
            isConverting={isConverting}
            onDownloadWebm={downloadWebm}
            onConvertAndDownloadMp4={convertAndDownloadMp4}
          />
        )}

        {/* Tutorial Overlay */}
        <TutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

        {/* Screen Reader Announcements */}
        <div id="screen-reader-announcements" className="sr-only" aria-live="polite" aria-atomic="true" />
      </div>
    </TooltipProvider>
  )
}
