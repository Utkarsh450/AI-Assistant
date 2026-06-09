import { useState } from "react";
import { sendChatMessage } from "../services/chatApi";
import { DEFAULT_WELCOME_MESSAGE, FALLBACK_REPLY } from "../utils/constants";

let messageId = 0;

function createMessage(role, content) {
  messageId += 1;

  return {
    id: `${role}-${messageId}`,
    role,
    content,
  };
}

export default function useChat() {
  const [messages, setMessages] = useState([
    createMessage("assistant", DEFAULT_WELCOME_MESSAGE),
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(content) {
    const userMessage = createMessage("user", content);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(content);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", reply),
      ]);
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? `${FALLBACK_REPLY} ${error.message}` : FALLBACK_REPLY;

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", fallbackMessage),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    messages,
    sendMessage,
  };
}
