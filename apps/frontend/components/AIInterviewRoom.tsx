"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Loader2, Volume2, PhoneOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type InterviewState =
  | "IDLE"
  | "LISTENING"
  | "PROCESSING"
  | "SPEAKING"
  | "ENDED";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const LISTENING_DELAY_MS = 1200; // 🧠 gives user breathing room

export default function AIInterviewRoom({
  atsAnalysisId,
}: {
  atsAnalysisId: string;
}) {
  const { user } = useUser();

  const [state, setState] = useState<InterviewState>("IDLE");
  const [currentText, setCurrentText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isFinalRef = useRef(false);
  const isEndingRef = useRef(false);
  const isPlayingAudioRef = useRef(false);
  const listenTimeoutRef = useRef<number | null>(null);
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  /* ---------------- AUDIO ---------------- */
  const playAudioBuffer = async (arrayBuffer: ArrayBuffer) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const buffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);

    isPlayingAudioRef.current = true;

    return new Promise<void>((resolve) => {
      const source = audioCtxRef.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current!.destination);

      source.onended = () => {
        isPlayingAudioRef.current = false;
        resolve();
      };

      source.start();
    });
  };

  /* ---------------- SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      if (isEndingRef.current) return;

      const result = event.results[event.resultIndex];
      if (!result.isFinal) return;

      const transcript = result[0].transcript.trim();
      if (!transcript) return;

      sendUserAnswer(transcript);
    };

    recognition.onerror = () => {};

    recognition.onend = () => {
      // ❌ DO NOTHING
      // We manually control restart timing
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const startListeningWithDelay = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
    }

    listenTimeoutRef.current = window.setTimeout(() => {
      if (
        isEndingRef.current ||
        isPlayingAudioRef.current ||
        !recognitionRef.current
      )
        return;

      setState("LISTENING");
      try {
        recognitionRef.current.start();
      } catch {}
    }, LISTENING_DELAY_MS);
  };

  const stopListening = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  /* ---------------- SESSION ---------------- */
  const createSession = async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/interview/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ats_analysis_id: atsAnalysisId,
        user_id: user?.id,
      }),
    });

    const data = await res.json();
    return data.session_id;
  };

  const startInterview = async () => {
    isEndingRef.current = false;
    isFinalRef.current = false;
    setMessages([]);
    setFeedback(null);
    setCurrentText("");
    setState("PROCESSING");

    const sessionId = await createSession();
    if (!sessionId) return;

    const ws = new WebSocket(
      `${API_BASE_URL.replace(
        /^http/,
        "ws"
      )}/api/v1/interview/session/${sessionId}?user_id=${user?.id}`
    );

    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      if (isEndingRef.current) return;

      if (event.data instanceof ArrayBuffer) {
        await playAudioBuffer(event.data);

        if (isFinalRef.current) {
          endInterview();
        } else {
          startListeningWithDelay();
        }
        return;
      }

      const data = JSON.parse(event.data);

      if (data.state === "SPEAKING") {
        stopListening();
        setState("SPEAKING");
        setCurrentText(data.text);
        setMessages((p) => [...p, { role: "assistant", text: data.text }]);
      }

      if (data.state === "PROCESSING") {
        stopListening();
        setState("PROCESSING");
      }

      if (data.state === "ENDED") {
        isFinalRef.current = true;
        setFeedback(data.feedback);
      }
    };

    ws.onclose = () => {
      if (!isEndingRef.current) endInterview();
    };
  };

  /* ---------------- END ---------------- */
  const endInterview = () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    stopListening();
    wsRef.current?.close();
    wsRef.current = null;

    setState("ENDED");
    router.push("/result");
  };

  /* ---------------- USER ANSWER ---------------- */
  const sendUserAnswer = (text: string) => {
    if (!wsRef.current || isEndingRef.current) return;

    stopListening();
    wsRef.current.send(JSON.stringify({ type: "user_answer", text }));

    setMessages((p) => [...p, { role: "user", text }]);
    setCurrentText("");
    setState("PROCESSING");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-background text-foreground p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="relative aspect-video bg-slate-950 overflow-hidden border-2 border-primary/20 shadow-2xl">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-30">
              {state === "LISTENING" && (
                <Badge className="bg-primary animate-pulse gap-2 px-3 py-1">
                  <Mic className="w-3 h-3" /> Listening...
                </Badge>
              )}
              {state === "PROCESSING" && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                </Badge>
              )}
              {state === "SPEAKING" && (
                <Badge
                  variant="outline"
                  className="bg-background/50 backdrop-blur-md gap-2 px-3 py-1"
                >
                  <Volume2 className="w-3 h-3 text-primary" /> AI Speaking
                </Badge>
              )}
            </div>

            {/* Avatar Pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 animate-pulse flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/30" />
                </div>
              </div>
            </div>

            {/* Question Subtitle */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
              <p className="text-xl md:text-2xl font-medium text-white text-center leading-snug max-w-3xl mx-auto">
                {currentText}
              </p>
            </div>
          </Card>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {state === "IDLE" || state === "ENDED" ? (
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
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={endInterview}
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Transcript */}
          <Card className="flex-1 overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">Conversation Log</h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 text-sm">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`border-l-2 pl-3 py-1 ${
                      m.role === "assistant" ? "border-primary" : "border-muted"
                    }`}
                  >
                    <span className="font-bold text-[10px] uppercase block">
                      {m.role === "assistant" ? "AI" : "YOU"}
                    </span>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Feedback */}
          {state === "ENDED" && feedback && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Interview Feedback</h3>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(feedback, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
