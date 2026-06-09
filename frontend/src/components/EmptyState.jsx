import React from "react";

const suggestions = [
  { icon: "🔍", label: "Search the web", prompt: "What are the latest breakthroughs in AI technology?" },
  { icon: "💡", label: "Brainstorm ideas", prompt: "Suggest 5 creative names for a software product." },
  { icon: "🐍", label: "Explain Python code", prompt: "Explain how list comprehensions work in Python." },
  { icon: "✍️", label: "Draft an email", prompt: "Write a polite follow-up email to a hiring manager." },
];

export default function EmptyState({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
      {/* Animated logo */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, #3730a3 0%, #6d28d9 100%)",
          boxShadow: "0 0 40px rgba(99,102,241,0.3), 0 0 80px rgba(99,102,241,0.1)",
          animation: "idlePulse 3s ease-in-out infinite",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="5" fill="white" opacity="0.9" />
          <path
            d="M15 2v3M15 25v3M2 15h3M25 15h3M5.5 5.5l2.1 2.1M22.4 22.4l2.1 2.1M22.4 7.6l-2.1 2.1M7.6 22.4l-2.1 2.1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-white/80 mb-2 tracking-tight">
        How can I help?
      </h2>
      <p className="text-sm text-white/35 max-w-xs mb-10 leading-relaxed">
        Ask me anything! I can answer questions, search the web, write code, and help brainstorm ideas.
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion?.(s.prompt)}
            className="flex flex-col items-start gap-1.5 p-4 rounded-xl text-left transition-all duration-200 group"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            <span className="text-lg">{s.icon}</span>
            <span className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors leading-snug">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes idlePulse {
          0%, 100% { box-shadow: 0 0 30px rgba(99,102,241,0.25), 0 0 60px rgba(99,102,241,0.08); }
          50% { box-shadow: 0 0 50px rgba(99,102,241,0.45), 0 0 90px rgba(99,102,241,0.15); }
        }
      `}</style>
    </div>
  );
}
