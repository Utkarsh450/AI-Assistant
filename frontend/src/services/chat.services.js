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
    throw new Error(
      `Stream failed ${response.status}`
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      console.log("STREAM CLOSED");
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    console.log("BUFFER:", buffer);

    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      if (!line.startsWith("data:")) {
        continue;
      }

      let token = line.replace(/^data:\s?/, "");
      token = token.replace(/\r$/, ""); // remove trailing \r

      if (token === "[DONE]") {
        return;
      }

      onToken(token);
    }
  }

  // Handle any remaining content in the buffer
  if (buffer) {
    const lines = buffer.split("\n");
    for (const line of lines) {
      if (line.startsWith("data:")) {
        let token = line.replace(/^data:\s?/, "");
        token = token.replace(/\r$/, ""); // remove trailing \r
        if (token === "[DONE]") {
          return;
        }
        onToken(token);
      }
    }
  }
};