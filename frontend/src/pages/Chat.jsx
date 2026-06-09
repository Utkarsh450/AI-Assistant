import React, { useState, useEffect, useCallback } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

import {
  createConversation,
  getConversations,
  getConversationMessages,
} from "../services/conversation.services";

import { streamChat } from "../services/chat.services";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Separate loading states for clarity
  const [loadingChats, setLoadingChats] = useState(true);   // sidebar skeleton
  const [loadingMessages, setLoadingMessages] = useState(false); // message area skeleton
  const [streaming, setStreaming] = useState(false);         // disable input while streaming

  // --------------------------------
  // Load Conversations
  // --------------------------------
  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChats(false);
    }
  }, [activeChatId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // --------------------------------
  // Load Messages
  // --------------------------------
  const loadMessages = useCallback(async (conversationId) => {
    setLoadingMessages(true);
    try {
      const data = await getConversationMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    loadMessages(activeChatId);
  }, [activeChatId, loadMessages]);

  // --------------------------------
  // New Chat
  // --------------------------------
  const handleNewChat = useCallback(async () => {
    try {
      const conversation = await createConversation();
      setLoadingChats(true);
      await loadConversations();
      setActiveChatId(conversation.conversation_id);
      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  }, [loadConversations]);

  // --------------------------------
  // Send Message
  // --------------------------------
  const handleSendMessage = useCallback(
    async (text) => {
      if (!activeChatId || streaming) return;

      setStreaming(true);

      const userMessage = {
        id: Date.now(),
        role: "user",
        content: text,
      };

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
        streaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      let accumulatedContent = "";

      try {
        await streamChat({
          conversationId: activeChatId,
          message: text,
          onToken: (token) => {
            accumulatedContent += token;
            requestAnimationFrame(() => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: accumulatedContent, streaming: true }
                    : msg
                )
              );
            });
          },
        });

        // Mark streaming done
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, streaming: false }
              : msg
          )
        );

        await loadConversations();
      } catch (error) {
        console.error(error);
        // Show error in the assistant bubble
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: "Sorry, something went wrong. Please try again.",
                  streaming: false,
                }
              : msg
          )
        );
      } finally {
        setStreaming(false);
      }
    },
    [activeChatId, streaming, loadConversations]
  );

  // --------------------------------
  // Derive current chat
  // --------------------------------
  const activeConversation = conversations.find((c) => c.id === activeChatId);

  const currentChat = {
    id: activeChatId,
    title: activeConversation?.title || "New Chat",
    messages,
  };

  return (
    <div className="flex h-screen bg-[#0f1117] font-sans overflow-hidden">
      <Sidebar
        chats={conversations}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        loadingChats={loadingChats}
      />

      <ChatWindow
        chat={currentChat}
        onSend={handleSendMessage}
        loading={loadingMessages}
      />
    </div>
  );
};

export default Chat;