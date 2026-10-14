"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="prose-custom max-w-none text-slate-300 text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => {
            const text = String(props.children);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <h1
                id={id}
                className="text-2xl font-extrabold text-foreground tracking-tight border-b border-slate-800 pb-3 mt-8 mb-4 first:mt-0 scroll-mt-20"
                {...props}
              />
            );
          },
          h2: ({ node, ...props }) => {
            const text = String(props.children);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <h2
                id={id}
                className="text-xl font-bold text-foreground tracking-tight border-b border-slate-800/60 pb-2 mt-8 mb-3 scroll-mt-20 flex items-center gap-2"
                {...props}
              />
            );
          },
          h3: ({ node, ...props }) => {
            const text = String(props.children);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <h3
                id={id}
                className="text-base font-semibold text-foreground tracking-tight mt-6 mb-2 scroll-mt-20"
                {...props}
              />
            );
          },
          p: ({ node, ...props }) => (
            <p className="my-3 text-slate-300 leading-relaxed text-sm" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-3 space-y-1 text-slate-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-3 space-y-1 text-slate-300" {...props} />
          ),
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          blockquote: ({ node, children, ...props }) => {
            const raw = String(children);
            const isWarning =
              raw.includes("[!WARNING]") || raw.includes("[!CAUTION]") || raw.includes("CRITICAL");
            const isNote = raw.includes("[!NOTE]") || raw.includes("[!TIP]");

            return (
              <blockquote
                className={`my-4 p-4 rounded-r-lg border-l-4 backdrop-blur-sm ${
                  isWarning
                    ? "bg-red-950/20 border-red-500 text-red-300"
                    : isNote
                    ? "bg-blue-950/20 border-blue-500 text-blue-300"
                    : "bg-slate-900/60 border-slate-700 text-slate-300"
                }`}
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-slate-800 bg-slate-900/30">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="bg-slate-900/90 py-2.5 px-3.5 font-semibold text-slate-200 border-b border-slate-800 uppercase tracking-wider text-[11px]"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="py-2.5 px-3.5 border-b border-slate-800/60 text-slate-300" {...props} />
          ),
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[12px] text-blue-400 border border-slate-700/50"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <span>Code snippet</span>
                  <button
                    onClick={() =>
                      copyToClipboard(String(children), String(children).slice(0, 10))
                    }
                    className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                  >
                    {copiedCode === String(children).slice(0, 10) ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto font-mono text-xs">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

