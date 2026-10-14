"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, ArrowRight, CornerDownLeft, Loader2 } from "lucide-react";
import { SearchResult } from "@/lib/reports";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Query search endpoint
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/reports/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 text-xs text-muted-foreground hover:text-foreground transition-all"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search audit reports...</span>
        <span className="inline sm:hidden">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 border border-slate-700">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3 bg-slate-950/40">
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search across all 7 reports, findings, contradictions, criteria..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {loading && <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 divide-y divide-slate-800/60">
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <div
                    key={`${item.slug}-${item.matchLine}-${idx}`}
                    onClick={() => handleSelect(item.slug)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors text-xs flex flex-col gap-1 ${
                      selectedIndex === idx
                        ? "bg-blue-600/15 border border-blue-500/30 text-blue-200"
                        : "hover:bg-slate-800/50 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        {item.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Line {item.matchLine}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-400 line-clamp-2 bg-slate-950/50 p-1.5 rounded border border-slate-800/80">
                      {item.matchSnippet}
                    </div>
                  </div>
                ))
              ) : query.trim() ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No matching occurrences found for &quot;{query}&quot;.
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Type keyword to search (e.g., &quot;WHMCS&quot;, &quot;salary&quot;, &quot;deception&quot;, &quot;BotifyAI&quot;)
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-muted-foreground flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">ESC</kbd> Close
                </span>
              </div>
              <span>{results.length} matches</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

