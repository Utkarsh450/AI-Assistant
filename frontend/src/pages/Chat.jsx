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
  const [sidebarOpen, setSidebarOpen] = useState(false);     // mobile responsive sidebar toggle

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
      if (streaming) return;

      setStreaming(true);

      let chatId = activeChatId;

      // If no conversation is active, dynamically create one
      if (!chatId) {
        try {
          const conversation = await createConversation();
          chatId = conversation.conversation_id;
          setActiveChatId(chatId);
          await loadConversations();
        } catch (error) {
          console.error("Failed to create conversation:", error);
          setStreaming(false);
          return;
        }
      }

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
          conversationId: chatId,
          message: text,
          onToken: (token) => {
            console.log(
              "TOKEN RECEIVED =",
              JSON.stringify(token)
            );

            accumulatedContent += token;
            console.log(
              "ACCUMULATED =",
              JSON.stringify(accumulatedContent)
            );
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
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  streaming: false,
                }
              : msg
          )
        );
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
    <div className="flex h-screen bg-[#0f1117] font-sans overflow-hidden relative">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        chats={conversations}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        loadingChats={loadingChats}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatWindow
        chat={currentChat}
        onSend={handleSendMessage}
        loading={loadingMessages}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

export default Chat;