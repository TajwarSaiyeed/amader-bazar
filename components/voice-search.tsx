"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, MicOff, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/store/useDebounce";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category" | "trending";
}

interface VoiceSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSearch({ isOpen, onClose }: VoiceSearchProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as WindowWithSpeech).SpeechRecognition ||
        (window as WindowWithSpeech).webkitSpeechRecognition;
      setIsVoiceSupported(!!SpeechRecognition);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("search-history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved).map(
            (item: { id: string; query: string; timestamp: string }) => ({
              ...item,
              timestamp: new Date(item.timestamp),
            })
          );
          setSearchHistory(parsed.slice(0, 5)); // Keep only last 5
        } catch (error) {
          console.error("Error loading search history:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      setTimeout(() => {
        const mockSuggestions: SearchSuggestion[] = [
          {
            id: "1",
            text: `${debouncedQuery} products`,
            type: "product" as const,
          },
          {
            id: "2",
            text: `${debouncedQuery} electronics`,
            type: "category" as const,
          },
          {
            id: "3",
            text: `best ${debouncedQuery}`,
            type: "trending" as const,
          },
          {
            id: "4",
            text: `${debouncedQuery} deals`,
            type: "trending" as const,
          },
        ].filter((s) => s.text.length < 50);

        setSuggestions(mockSuggestions);
      }, 200);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const saveToHistory = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      const newItem: SearchHistory = {
        id: Date.now().toString(),
        query: searchQuery.trim(),
        timestamp: new Date(),
      };

      const updated = [
        newItem,
        ...searchHistory.filter((item) => item.query !== searchQuery.trim()),
      ].slice(0, 5);
      setSearchHistory(updated);

      if (typeof window !== "undefined") {
        localStorage.setItem("search-history", JSON.stringify(updated));
      }
    },
    [searchHistory]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      saveToHistory(searchQuery);
      router.push(`/products?name=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setQuery("");
      setTranscript("");
    },
    [router, onClose, saveToHistory]
  );

  const startListening = useCallback(() => {
    if (!isVoiceSupported) return;

    const SpeechRecognition =
      (window as WindowWithSpeech).SpeechRecognition ||
      (window as WindowWithSpeech).webkitSpeechRecognition;
    const recognition = new SpeechRecognition() as SpeechRecognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      if (finalTranscript) {
        setQuery(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        handleSearch(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isVoiceSupported, transcript, handleSearch]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("search-history");
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                placeholder="Search products, categories..."
                className="pl-10 pr-20 h-12 text-base"
              />

              {/* Voice Button */}
              {isVoiceSupported && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "absolute right-12 h-8 w-8 p-0",
                    isListening && "text-red-500 animate-pulse"
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Search Button */}
              <Button
                onClick={() => handleSearch(query)}
                size="sm"
                className="absolute right-2 h-8"
              >
                Go
              </Button>
            </div>

            {/* Voice Transcript */}
            {isListening && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Listening...</span>
                </div>
                {transcript && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    &ldquo;{transcript}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Search Results Area */}
          <div className="max-h-80 overflow-y-auto space-y-4">
            {/* Suggestions */}
            {query && suggestions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Suggestions
                </h3>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSearch(suggestion.text)}
                      className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      {suggestion.type === "trending" ? (
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Search className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="flex-1">{suggestion.text}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {!query && searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Recent Searches
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs h-auto p-1"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearch(item.query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{item.query}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!query && searchHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Start typing to search</p>
                <p className="text-sm">
                  {isVoiceSupported
                    ? "Or tap the microphone to speak"
                    : "Find products, categories, and more"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {isVoiceSupported
                ? "Voice search available"
                : "Voice search not supported"}
            </span>
            <span>Press Enter to search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
