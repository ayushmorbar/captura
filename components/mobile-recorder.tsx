"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, AlertTriangle } from "lucide-react"

export function MobileRecorder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="font-aeonik text-2xl">Captura Mobile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-amber-500" />
            <h3 className="font-aeonik font-semibold text-lg">Desktop Required</h3>
            <p className="font-inter text-slate-600 leading-relaxed">
              Screen recording requires desktop browser APIs that aren't available on mobile devices. Please visit
              Captura on a desktop or laptop computer.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="font-inter font-medium">Supported Platforms</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-inter">Chrome Desktop</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-inter">Firefox Desktop</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-inter">Safari Desktop</span>
                <span className="text-amber-600">Partial</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-inter">Mobile Browsers</span>
                <span className="text-red-600">✗</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() =>
              window.open(
                "mailto:?subject=Captura - Professional Screen Recorder&body=Check out Captura for professional screen recording: " +
                  window.location.origin,
              )
            }
            variant="outline"
            className="w-full font-inter"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Share Desktop Link
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
