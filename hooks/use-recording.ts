"use client"

import { useState, useRef, useCallback, useEffect } from "react"

type RecordingState = "idle" | "recording" | "paused" | "stopped"
type AudioSource = "none" | "microphone" | "system" | "both"

interface RecordingSettings {
  audioSource: AudioSource
  microphoneVolume: number
  systemVolume: number
  videoQuality: "low" | "medium" | "high"
  countdownDuration: number // New setting for countdown
}

export function useRecording() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [mp4Blob, setMp4Blob] = useState<Blob | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEmbedded, setIsEmbedded] = useState(false)
  const [countdown, setCountdown] = useState(0) // New state for countdown value
  const [isCountingDown, setIsCountingDown] = useState(false) // New state for countdown status

  const [settings, setSettings] = useState<RecordingSettings>({
    audioSource: "microphone",
    microphoneVolume: 80,
    systemVolume: 80,
    videoQuality: "medium",
    countdownDuration: 3, // Default countdown duration
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null) // Ref for countdown timer
  const chunksRef = useRef<Blob[]>([])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const getVideoConstraints = useCallback(() => {
    const constraints = {
      low: { width: 1280, height: 720, frameRate: 15 },
      medium: { width: 1920, height: 1080, frameRate: 30 },
      high: { width: 2560, height: 1440, frameRate: 60 },
    }
    return constraints[settings.videoQuality]
  }, [settings.videoQuality])

  const setupAudioMixing = useCallback(
    async (screenStream: MediaStream, micStream?: MediaStream) => {
      if (settings.audioSource === "none") return screenStream

      try {
        const audioContext = new AudioContext()
        audioContextRef.current = audioContext

        const destination = audioContext.createMediaStreamDestination()

        // Handle system audio
        if (settings.audioSource === "system" || settings.audioSource === "both") {
          const screenAudioTracks = screenStream.getAudioTracks()
          if (screenAudioTracks.length > 0) {
            const screenSource = audioContext.createMediaStreamSource(new MediaStream(screenAudioTracks))
            const screenGain = audioContext.createGain()
            screenGain.gain.value = settings.systemVolume / 100
            screenSource.connect(screenGain)
            screenGain.connect(destination)
          }
        }

        // Handle microphone audio
        if ((settings.audioSource === "microphone" || settings.audioSource === "both") && micStream) {
          const micSource = audioContext.createMediaStreamSource(micStream)
          const micGain = audioContext.createGain()
          micGain.gain.value = settings.microphoneVolume / 100
          micSource.connect(micGain)
          micGain.connect(destination)
        }

        // Combine video from screen with mixed audio
        const videoTracks = screenStream.getVideoTracks()
        const audioTracks = destination.stream.getAudioTracks()

        return new MediaStream([...videoTracks, ...audioTracks])
      } catch (error) {
        console.error("Audio mixing setup failed:", error)
        return screenStream
      }
    },
    [settings],
  )

  const startRecordingInternal = useCallback(async () => {
    try {
      setError(null)
      setRecordedBlob(null) // Clear previous recording
      setMp4Blob(null) // Clear previous MP4

      // Get screen capture
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: getVideoConstraints(),
        audio: settings.audioSource === "system" || settings.audioSource === "both",
      })

      // Get microphone if needed
      let micStream: MediaStream | undefined
      if (settings.audioSource === "microphone" || settings.audioSource === "both") {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (micError) {
          console.warn("Microphone access failed:", micError)
        }
      }

      // Setup audio mixing
      const finalStream = await setupAudioMixing(screenStream, micStream)
      streamRef.current = finalStream

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: "video/webm;codecs=vp9,opus",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        setRecordedBlob(blob)
        setRecordingState("stopped")
        stopTimer()
      }

      // Handle stream ending (user stops sharing)
      finalStream.getVideoTracks()[0].onended = () => {
        if (recordingState === "recording") {
          stopRecording()
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      setRecordingState("recording")
      setRecordingTime(0)
      startTimer()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("permissions policy") && window.top !== window) {
        setError("Screen capture is blocked in this preview. Open the recorder in a new tab.")
        return
      }
      console.error("Recording start failed:", err)
      setError("Failed to start recording. Please check permissions and try again.")
      setIsCountingDown(false) // Stop countdown if recording fails
      setCountdown(0)
    }
  }, [settings, getVideoConstraints, setupAudioMixing, recordingState, startTimer])

  const startRecording = useCallback(() => {
    if (recordingState === "idle" && !isCountingDown) {
      setIsCountingDown(true)
      setCountdown(settings.countdownDuration)

      let currentCount = settings.countdownDuration
      countdownTimerRef.current = setInterval(() => {
        currentCount -= 1
        setCountdown(currentCount)
        if (currentCount <= 0) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
          }
          setIsCountingDown(false)
          startRecordingInternal()
        }
      }, 1000)
    }
  }, [recordingState, isCountingDown, settings.countdownDuration, startRecordingInternal])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.pause()
      setRecordingState("paused")
      stopTimer()
    }
  }, [recordingState, stopTimer])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      mediaRecorderRef.current.resume()
      setRecordingState("recording")
      startTimer()
    }
  }, [recordingState, startTimer])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    stopTimer()
    if (countdownTimerRef.current) {
      // Stop countdown if recording is stopped prematurely
      clearInterval(countdownTimerRef.current)
      setIsCountingDown(false)
      setCountdown(0)
    }
  }, [stopTimer])

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const downloadWebm = useCallback(() => {
    if (recordedBlob) {
      downloadBlob(recordedBlob, `captura-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`)
    }
  }, [recordedBlob, downloadBlob])

  const convertAndDownloadMp4 = useCallback(async () => {
    if (!recordedBlob) return

    setIsConverting(true)
    setError(null)
    setMp4Blob(null)

    console.log("Simulating MP4 conversion...")
    await new Promise((resolve) => setTimeout(resolve, 3000))

    try {
      const simulatedMp4Blob = new Blob([recordedBlob], { type: "video/mp4" })
      setMp4Blob(simulatedMp4Blob)
      downloadBlob(
        simulatedMp4Blob,
        `captura-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.mp4`,
      )
    } catch (err) {
      console.error("MP4 conversion failed:", err)
      setError("Failed to convert to MP4. Please try again.")
    } finally {
      setIsConverting(false)
    }
  }, [recordedBlob, downloadBlob])

  const resetRecording = useCallback(() => {
    setRecordedBlob(null)
    setMp4Blob(null)
    setRecordingState("idle")
    setRecordingTime(0)
    setError(null)
    setIsConverting(false)
    setIsCountingDown(false) // Reset countdown states
    setCountdown(0)
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
    }
  }, [])

  const updateSettings = useCallback((updates: Partial<RecordingSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  useEffect(() => {
    setIsEmbedded(window.top !== window)
  }, [])

  useEffect(() => {
    return () => {
      stopTimer()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
    }
  }, [stopTimer])

  return {
    recordingState,
    recordingTime,
    recordedBlob,
    mp4Blob,
    isConverting,
    error,
    settings,
    isEmbedded,
    countdown, // Expose countdown
    isCountingDown, // Expose countdown status
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    updateSettings,
    downloadWebm,
    convertAndDownloadMp4,
  }
}
