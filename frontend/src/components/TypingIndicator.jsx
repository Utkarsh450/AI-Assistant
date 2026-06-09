import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      {/* Animated bot icon */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          animation: "logoPulse 1.4s ease-in-out infinite",
          boxShadow: "0 0 14px rgba(99,102,241,0.5)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="2" fill="white" />
          <path
            d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3.1 3.1l.7.7M10.2 10.2l.7.7M10.9 3.1l-.7.7M3.8 10.2l-.7.7"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Dot animation */}
      <div
        className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
              animation: `typingBounce 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.4); transform: scale(1); }
          50% { box-shadow: 0 0 18px rgba(99,102,241,0.7); transform: scale(1.08); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}