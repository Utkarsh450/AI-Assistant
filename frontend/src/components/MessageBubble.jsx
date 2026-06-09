import React from "react";
import ReactMarkdown from "react-markdown";
const UserIcon = () => (
  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
    U
  </div>
);

const BotIcon = ({ streaming }) => (
  <div
    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
    style={{
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      boxShadow: streaming ? "0 0 14px rgba(99,102,241,0.6)" : "none",
      transition: "box-shadow 0.3s ease",
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
);

const Cursor = () => (
  <span
    className="inline-block w-[2px] h-[1em] ml-0.5 align-middle rounded-sm bg-indigo-400"
    style={{ animation: "blink 0.9s step-end infinite" }}
  />
);

// Custom markdown components for proper dark-theme rendering

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-2.5 mb-6">
        <div
          className="max-w-[72%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white/90"
          style={{
            background: "linear-gradient(135deg, #3730a3 0%, #4338ca 100%)",
            boxShadow: "0 2px 16px rgba(79,70,229,0.3)",
          }}
        >
          {/* User messages: plain whitespace-preserved text — no markdown needed */}
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        </div>
        <UserIcon />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6">
      <BotIcon streaming={message.streaming && message.content.length > 0} />

      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/85"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {message.content ? (
            <div className="break-words">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.streaming && <Cursor />}
            </div>
          ) : (
            <span className="text-white/30 italic text-xs">Thinking…</span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}