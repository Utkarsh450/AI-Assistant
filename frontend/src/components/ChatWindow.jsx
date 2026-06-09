import React, { useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";

// Skeleton shimmer for message loading
const MessageSkeleton = () => (
  <div className="space-y-6 py-8 px-4 max-w-3xl mx-auto">
    {/* Bot message skeleton */}
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-white/[0.06] shrink-0 mt-0.5 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-full bg-white/[0.06] animate-pulse w-3/4" />
        <div className="h-3 rounded-full bg-white/[0.06] animate-pulse w-full" />
        <div className="h-3 rounded-full bg-white/[0.06] animate-pulse w-5/6" />
      </div>
    </div>
    {/* User message skeleton */}
    <div className="flex justify-end items-start gap-2.5">
      <div className="w-48 h-9 rounded-2xl rounded-tr-sm bg-white/[0.06] animate-pulse" />
      <div className="w-7 h-7 rounded-full bg-white/[0.06] shrink-0 animate-pulse" />
    </div>
    {/* Bot message skeleton */}
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-white/[0.06] shrink-0 mt-0.5 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-full bg-white/[0.06] animate-pulse w-full" />
        <div className="h-3 rounded-full bg-white/[0.06] animate-pulse w-4/5" />
      </div>
    </div>
  </div>
);

export default function ChatWindow({ chat, onSend, loading, onToggleSidebar }) {
  const bottomRef = useRef(null);
  const messages = chat?.messages ?? [];
  const isStreaming = messages.some((m) => m.role === "assistant" && m.streaming);
  const lastMsg = messages[messages.length - 1];
  const showTyping =
    isStreaming && lastMsg?.role === "assistant" && lastMsg?.content === "";

  // loading = true means we're fetching conversation messages from backend
  const isLoadingMessages = loading && messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#0f1117" }}>
      {/* Top bar */}
      <div
        className="flex items-center px-6 py-3.5 border-b border-white/[0.05] shrink-0"
        style={{
          background: "rgba(15,17,23,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 mr-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-sm font-medium text-white/60">
            {chat?.title || "New conversation"}
          </span>
        </div>
        {isStreaming && (
          <div className="ml-auto flex items-center gap-2 text-xs text-indigo-400/80">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            Generating…
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {isLoadingMessages ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <EmptyState onSuggestion={onSend} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-2">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {showTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}