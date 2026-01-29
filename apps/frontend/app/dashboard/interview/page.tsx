"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, PhoneOff, Loader2, Volume2 } from "lucide-react";

// --- State Types ---
type InterviewState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING";

export default function AIInterviewRoom() {
  // 1. State Management
  const [appState, setAppState] = useState<InterviewState>("IDLE");
  const [transcript, setTranscript] = useState<
    { role: string; text: string }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Click 'Start' to begin your interview."
  );
  const [progress, setProgress] = useState(30);

  // 2. Refs for Audio Visualizer
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3. Start Interview Logic (Handles Browser Audio Policy)
  const startInterview = () => {
    setAppState("SPEAKING");
    // In a real app, you would trigger your first FastAPI call here
    setCurrentQuestion(
      "Welcome! Can you tell me about a complex React project you've built recently?"
    );
  };

  //

  return (
    <div className=" bg-background text-foreground p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: THE STAGE (Video & Voice) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="relative aspect-video bg-slate-950 overflow-hidden border-2 border-primary/20 shadow-2xl">
            {/* 1. Status Overlays */}
            <div className="absolute top-4 right-4 z-30">
              {appState === "LISTENING" && (
                <Badge className="bg-primary animate-pulse gap-2 px-3 py-1">
                  <Mic className="w-3 h-3" /> Listening...
                </Badge>
              )}
              {appState === "PROCESSING" && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                </Badge>
              )}
              {appState === "SPEAKING" && (
                <Badge
                  variant="outline"
                  className="bg-background/50 backdrop-blur-md gap-2 px-3 py-1"
                >
                  <Volume2 className="w-3 h-3 text-primary" /> AI Speaking
                </Badge>
              )}
            </div>

            {/* 2. Video Placeholder (Webcam would go here) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 animate-pulse flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/30" />
                </div>
              </div>
            </div>

            {/* 3. Subtitle Overlay (The "Follow-up" text) */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
              <p className="text-xl md:text-2xl font-medium text-white text-center leading-snug max-w-3xl mx-auto">
                "{currentQuestion}"
              </p>
            </div>

            {/* 4. Audio Visualizer (Shows during Listening) */}
            {appState === "LISTENING" && (
              <div className="absolute bottom-24 inset-x-0 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={50}
                  className="opacity-80"
                />
              </div>
            )}
          </Card>

          {/* Controls Bar */}
          <div className="flex justify-center gap-4">
            {appState === "IDLE" ? (
              <Button
                size="lg"
                onClick={startInterview}
                className="rounded-full px-8 shadow-lg"
              >
                Start Interview
              </Button>
            ) : (
              <div className="bg-card border rounded-full px-6 py-2 flex items-center gap-6 shadow-xl">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-destructive/10"
                >
                  <MicOff className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTEXT & TRANSCRIPT */}
        <div className="space-y-4">
          {/* Progress Card */}
          <Card className="p-4 space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">Interview Progress</span>
              <span>Question 3 of 10</span>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>

          {/* Technical Focus Card */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">
              Current Technical Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">React Hooks</Badge>
              <Badge variant="secondary">useEffect</Badge>
              <Badge variant="secondary">API Optimization</Badge>
            </div>
          </Card>

          {/* Minimalist Transcript */}
          <Card className="flex-1 overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">Conversation Log</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground italic text-xs">
                  Transcribing in real-time...
                </p>
                <div className="border-l-2 border-primary pl-3 py-1">
                  <span className="font-bold text-primary block text-[10px] uppercase">
                    AI
                  </span>
                  Can you explain how you handle dependencies in useEffect?
                </div>
                <div className="border-l-2 border-muted pl-3 py-1">
                  <span className="font-bold text-muted-foreground block text-[10px] uppercase">
                    YOU
                  </span>
                  I usually include all external variables used inside the
                  hook...
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
