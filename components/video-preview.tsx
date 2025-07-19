"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface VideoPreviewProps {
  blob: Blob
  mp4Blob: Blob | null // New prop for MP4 blob
  isConverting: boolean // New prop for conversion status
  onDownloadWebm: () => void // Renamed prop
  onConvertAndDownloadMp4: () => void // New prop
}

export function VideoPreview({
  blob,
  mp4Blob,
  isConverting,
  onDownloadWebm,
  onConvertAndDownloadMp4,
}: VideoPreviewProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-aeonik text-2xl">Recording Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          <div className="relative">
            <video
              ref={videoRef}
              src={URL.createObjectURL(blob)}
              className="w-full rounded-lg shadow-lg"
              controls={false}
            />

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={togglePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={() => skip(-10)} className="text-white hover:bg-white/20">
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => skip(10)} className="text-white hover:bg-white/20">
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="flex-1 flex items-center space-x-2 text-white font-mono text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/30 rounded-full">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button onClick={onDownloadWebm} variant="outline" className="font-inter bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download WebM
            </Button>
            <Button
              onClick={onConvertAndDownloadMp4}
              disabled={isConverting}
              className="bg-blue-600 hover:bg-blue-700 font-inter"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download MP4
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
