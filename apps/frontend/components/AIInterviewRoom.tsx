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

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  /* -------------------- AUDIO PLAYBACK -------------------- */
  const playAudioBuffer = async (arrayBuffer: ArrayBuffer) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();

    const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtxRef.current.destination);
    source.start();
  };

  /* -------------------- SPEECH RECOGNITION -------------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // allow partial results
    recognition.continuous = false; // one answer per question

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        if (transcript) sendUserAnswer(transcript);
      }
    };

    recognition.onerror = (e) => console.error("SpeechRecognition error:", e);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch {
      // Chrome throws if start() called twice
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  /* -------------------- SESSION + WEBSOCKET -------------------- */
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
      if (event.data instanceof ArrayBuffer) {
        await playAudioBuffer(event.data);
        return;
      }

      const data = JSON.parse(event.data);

      if (data.state === "SPEAKING") {
        stopListening();
        setState("SPEAKING");
        setCurrentText(data.text);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.text },
        ]);
      }

      if (data.state === "LISTENING") {
        setState("LISTENING");
        // User must click "Start Speaking" button to start mic
      }

      if (data.state === "PROCESSING") {
        stopListening();
        setState("PROCESSING");
      }

      if (data.state === "ENDED") {
        stopListening();
        setState("ENDED");
        setFeedback(data.feedback);
        ws.close();
      }
    };

    ws.onclose = () => {
      stopListening();
      setState("IDLE");
    };
  };

  /* -------------------- SEND USER ANSWER -------------------- */
  const sendUserAnswer = (text: string) => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "user_answer", text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setCurrentText("");
    setState("PROCESSING");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="relative aspect-video bg-black">
            <div className="absolute top-4 right-4">
              {state === "LISTENING" && (
                <Badge className="animate-pulse">
                  <Mic className="w-3 h-3" /> Listening
                </Badge>
              )}
              {state === "PROCESSING" && (
                <Badge variant="secondary">
                  <Loader2 className="w-3 h-3 animate-spin" /> Analyzing
                </Badge>
              )}
              {state === "SPEAKING" && (
                <Badge variant="outline">
                  <Volume2 className="w-3 h-3" /> AI Speaking
                </Badge>
              )}
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black p-6">
              <p className="text-xl text-white text-center">{currentText}</p>
            </div>
          </Card>

          {/* Start Speaking Button */}
          {state === "LISTENING" && (
            <div className="flex justify-center mt-4">
              <Button onClick={startListening}>🎤 Start Speaking</Button>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            {state === "IDLE" && (
              <Button size="lg" onClick={startInterview}>
                Start Interview
              </Button>
            )}

            {state !== "IDLE" && state !== "ENDED" && (
              <Button
                variant="destructive"
                onClick={() => wsRef.current?.close()}
              >
                <PhoneOff />
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Card className="flex-1 flex flex-col">
            <div className="p-4 border-b font-semibold">Transcript</div>
            <ScrollArea className="p-4 flex-1">
              <div className="space-y-4 text-sm">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`border-l-2 pl-3 ${
                      m.role === "assistant" ? "border-primary" : "border-muted"
                    }`}
                  >
                    <span className="text-xs uppercase font-bold">
                      {m.role}
                    </span>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

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
