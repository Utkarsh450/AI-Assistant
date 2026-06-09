import { api } from "./chatApi";

export const createConversation = async () => {
  const { data } = await api.post("/conversations");
  return data;
};

export const getConversations = async () => {
  const { data } = await api.get("/conversations");
  return data;
};

export const getConversationMessages = async (
  conversationId
) => {
  const { data } = await api.get(
    `/conversations/${conversationId}`
  );

  return data;
};