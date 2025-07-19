"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, Volume2, TestTube, VolumeX } from "lucide-react"
import { useState } from "react"

interface AudioMixerProps {
  settings: {
    audioSource: string
    microphoneVolume: number
    systemVolume: number
  }
  onUpdateSettings: (updates: any) => void
  recordingState: string
}

export function AudioMixer({ settings, onUpdateSettings, recordingState }: AudioMixerProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [audioLevels, setAudioLevels] = useState({ mic: 0, system: 0 })

  const testAudio = async () => {
    setIsTesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)

      microphone.connect(analyser)
      analyser.fftSize = 256

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateLevels = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        setAudioLevels((prev) => ({ ...prev, mic: (average / 255) * 100 }))

        if (isTesting) {
          requestAnimationFrame(updateLevels)
        }
      }

      updateLevels()

      setTimeout(() => {
        setIsTesting(false)
        stream.getTracks().forEach((track) => track.stop())
        audioContext.close()
      }, 3000)
    } catch (error) {
      console.error("Audio test failed:", error)
      setIsTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-aeonik flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Audio Mixer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Source Status */}
        <div className="flex items-center justify-between">
          <span className="font-inter font-medium">Audio Source</span>
          <Badge variant="outline" className="font-inter">
            {settings.audioSource === "none"
              ? "Disabled"
              : settings.audioSource === "microphone"
                ? "Microphone"
                : settings.audioSource === "system"
                  ? "System Audio"
                  : "Mixed"}
          </Badge>
        </div>

        {/* Microphone Controls */}
        {(settings.audioSource === "microphone" || settings.audioSource === "both") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="font-inter font-medium">Microphone</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={testAudio}
                disabled={isTesting || recordingState !== "idle"}
                className="font-inter bg-transparent"
              >
                <TestTube className="w-4 h-4 mr-2" />
                {isTesting ? "Testing..." : "Test"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-inter text-slate-600 dark:text-slate-400">Volume</span>
                <span className="text-sm font-mono">{settings.microphoneVolume}%</span>
              </div>
              <Slider
                value={[settings.microphoneVolume]}
                onValueChange={([value]) => onUpdateSettings({ microphoneVolume: value })}
                max={100}
                step={1}
                disabled={recordingState !== "idle"}
                className="w-full"
              />

              {/* Audio Level Indicator */}
              {isTesting && (
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${audioLevels.mic}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Audio Controls */}
        {(settings.audioSource === "system" || settings.audioSource === "both") && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span className="font-inter font-medium">System Audio</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-inter text-slate-600 dark:text-slate-400">Volume</span>
                <span className="text-sm font-mono">{settings.systemVolume}%</span>
              </div>
              <Slider
                value={[settings.systemVolume]}
                onValueChange={([value]) => onUpdateSettings({ systemVolume: value })}
                max={100}
                step={1}
                disabled={recordingState !== "idle"}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* No Audio Message */}
        {settings.audioSource === "none" && (
          <div className="text-center py-8 space-y-3">
            <VolumeX className="w-12 h-12 mx-auto text-slate-400" />
            <p className="font-inter text-slate-600 dark:text-slate-400">
              Audio recording is disabled. Enable audio in the Record tab to access mixer controls.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
