import React from "react";

const BotLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    <circle cx="14" cy="14" r="13" fill="url(#logoGrad)" opacity="0.15" />
    <path
      d="M8 14c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6"
      stroke="url(#logoGrad)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="14" cy="14" r="2.5" fill="url(#logoGrad)" />
    <path
      d="M14 5v2M14 21v2M5 14h2M21 14h2"
      stroke="#818cf8"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M12 1H2C1.45 1 1 1.45 1 2v8c0 .55.45 1 1 1h2l2 2 2-2h4c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
);

// Skeleton for sidebar conversation items
const ConversationSkeleton = () => (
  <div className="space-y-1 px-2 py-1">
    {[80, 60, 72, 55, 65].map((w, i) => (
      <div
        key={i}
        className="flex items-center gap-2.5 px-3 py-2.5"
      >
        <div className="w-3.5 h-3.5 rounded bg-white/[0.07] animate-pulse shrink-0" />
        <div
          className="h-2.5 rounded-full bg-white/[0.07] animate-pulse"
          style={{ width: `${w}%` }}
        />
      </div>
    ))}
  </div>
);

export default function Sidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  loadingChats = false,
}) {
  return (
    <div
      className="w-64 flex flex-col shrink-0 border-r border-white/[0.06]"
      style={{
        background: "linear-gradient(180deg, #0d0f18 0%, #10121c 100%)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.05]">
        <BotLogo />
        <span
          className="text-sm font-semibold tracking-wide"
          style={{
            background: "linear-gradient(90deg, #818cf8, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ChatPDF
        </span>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white/70 border border-white/[0.08] hover:border-indigo-500/40 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New conversation
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-none">
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/20">
          Recent
        </p>

        {loadingChats ? (
          <ConversationSkeleton />
        ) : chats.length === 0 ? (
          <p className="px-3 py-3 text-xs text-white/25 italic">
            No conversations yet
          </p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-150 group ${
                chat.id === activeChatId
                  ? "bg-indigo-500/[0.12] text-white border border-indigo-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <span
                className={
                  chat.id === activeChatId
                    ? "text-indigo-400"
                    : "text-white/25 group-hover:text-white/40"
                }
              >
                <ChatIcon />
              </span>
              <span className="truncate leading-tight">
                {chat.title || "Untitled"}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/70 truncate">Utkarsh</p>
            <p className="text-[10px] text-white/30 truncate">Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}