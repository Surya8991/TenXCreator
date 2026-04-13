'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

// Web Speech API types not in standard TS lib — using any is intentional here
/* eslint-disable @typescript-eslint/no-explicit-any */

export function VoiceInput({ onTranscript, disabled }: Props) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check browser support (client-side only)
  const hasSupport = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  if (!hasSupport) return null;

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      className={cn(
        'rounded-xl p-2.5 sm:p-3 transition-all disabled:opacity-30',
        isListening
          ? 'bg-red-500/20 text-red-400 animate-pulse'
          : 'bg-white/10 hover:bg-white/20 text-white/60'
      )}
      title={isListening ? 'Stop listening' : 'Voice input'}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
