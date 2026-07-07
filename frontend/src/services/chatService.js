import { apiClient } from "./apiClient.js";

export const chatService = {
  getConversations(params = {}) {
    return apiClient.get("/conversation", { params: { limit: 50, ...params } });
  },
  getMessages(conversationId) {
    return apiClient.get(`/message/${conversationId}/chat`);
  },
  sendMessage({ conversationId, message, files = [] }) {
    const formData = new FormData();
    if (conversationId) formData.append("conversationId", conversationId);
    if (message) formData.append("message", message);
    files.forEach((file) => formData.append("files", file));

    return apiClient.post("/ai/chat", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  renameConversation(id, title) {
    return apiClient.delete(`/conversation/${id}`, { data: { title } });
  },
  togglePin(id) {
    return apiClient.patch(`/conversation/${id}/pin`);
  },
  deleteConversation(id) {
    return apiClient.delete(`/conversation/${id}`);
  },
};
