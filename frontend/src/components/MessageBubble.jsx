import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
const markdownComponents = {
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
  ),
  h1: ({ children }) => (
    <h1 className="text-lg font-semibold text-white/90 mb-3 mt-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-semibold text-white/85 mb-2 mt-4 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-white/80 mb-2 mt-3 first:mt-0">{children}</h3>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white/95">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/75">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 ml-4 space-y-1 list-disc marker:text-indigo-400">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-4 space-y-1 list-decimal marker:text-indigo-400">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-white/80 leading-relaxed">{children}</li>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
        {children}
      </code>
    ) : (
      <code className="block text-xs font-mono text-white/80">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="mb-3 rounded-xl overflow-x-auto p-4 text-xs font-mono leading-relaxed bg-black/30 border border-white/[0.07]">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-indigo-500/50 pl-4 my-3 text-white/60 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-white/10" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-white/70 border border-white/10 bg-white/[0.04]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-white/65 border border-white/[0.07]">{children}</td>
  ),
};

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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
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