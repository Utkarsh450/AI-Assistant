export const streamChat = async ({
  conversationId,
  message,
  onToken,
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Stream request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Accumulate into buffer to handle chunks that split across SSE lines
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();

      // Only process "data:" lines
      if (!trimmed.startsWith("data:")) continue;

      const payload = trimmed.slice(5).trim(); // Remove "data:" prefix

      // Skip stream-end signals
      if (!payload || payload === "done" || payload === "[DONE]") continue;

      onToken(payload);
    }
  }

  // Flush remaining buffer
  if (buffer.trim().startsWith("data:")) {
    const payload = buffer.trim().slice(5).trim();
    if (payload && payload !== "done" && payload !== "[DONE]") {
      onToken(payload);
    }
  }
};