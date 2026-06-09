import React, { useState, useRef, useEffect } from "react";

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.5 1.5L7 9M14.5 1.5L10 14.5l-3-5.5-5.5-3 13-4.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="shrink-0 px-4 pb-5 pt-3">
      <div
        className="max-w-3xl mx-auto rounded-2xl border transition-all duration-200 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: hasValue
            ? "rgba(99,102,241,0.45)"
            : "rgba(255,255,255,0.08)",
          boxShadow: hasValue
            ? "0 0 0 3px rgba(99,102,241,0.08), 0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Ask me anything…"
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-white/85 placeholder-white/25 outline-none leading-relaxed disabled:opacity-60"
          style={{ maxHeight: "200px" }}
        />
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          <span className="text-[11px] text-white/20 select-none">
            {disabled
              ? "Generating response…"
              : "Enter ↵ to send · Shift+Enter for newline"}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!hasValue || disabled}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background:
                hasValue && !disabled
                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                  : "rgba(255,255,255,0.06)",
              boxShadow:
                hasValue && !disabled
                  ? "0 2px 12px rgba(99,102,241,0.4)"
                  : "none",
            }}
          >
            {disabled ? (
              <span className="w-3 h-3 rounded-full border-2 border-white/50 border-t-transparent animate-spin" />
            ) : (
              <span className="text-white">
                <SendIcon />
              </span>
            )}
          </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-white/15 mt-2 select-none">
        AI responses may contain errors. Always verify important information.
      </p>
    </div>
  );
}