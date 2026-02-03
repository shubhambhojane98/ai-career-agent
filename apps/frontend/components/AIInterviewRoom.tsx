"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Loader2, Volume2, PhoneOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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
    <div className="bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="relative aspect-video bg-slate-950 border border-primary/20">
            <div className="absolute top-4 right-4">
              {state === "LISTENING" && (
                <Badge className="bg-primary animate-pulse">
                  <Mic className="w-3 h-3 mr-1" /> Listening
                </Badge>
              )}
              {state === "PROCESSING" && (
                <Badge variant="secondary">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Thinking
                </Badge>
              )}
              {state === "SPEAKING" && (
                <Badge variant="outline">
                  <Volume2 className="w-3 h-3 mr-1" />
                  AI Speaking
                </Badge>
              )}
            </div>

            <div className="absolute bottom-0 inset-x-0 p-6 text-center text-white text-lg">
              {currentText}
            </div>
          </Card>

          <div className="flex justify-center">
            {state === "IDLE" || state === "ENDED" ? (
              <Button size="lg" onClick={startInterview}>
                Start Interview
              </Button>
            ) : (
              <Button variant="destructive" size="icon" onClick={endInterview}>
                <PhoneOff />
              </Button>
            )}
          </div>
        </div>

        <Card>
          <ScrollArea className="p-4 h-[400px]">
            {messages.map((m, i) => (
              <p key={i}>
                <b>{m.role === "assistant" ? "AI:" : "YOU:"}</b> {m.text}
              </p>
            ))}
          </ScrollArea>

          {state === "ENDED" && feedback && (
            <pre className="p-4 text-xs">
              {JSON.stringify(feedback, null, 2)}
            </pre>
          )}
        </Card>
      </div>
    </div>
  );
}
