import { apiClient } from "./apiClient.js";
import { API_BASE_URL, STORAGE_KEYS } from "../config/api.js";

const parseStreamEvent = (rawEvent) => {
  const lines = rawEvent.split("\n");
  const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim() || "message";
  const data = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  return { event, data };
};

const readErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload?.message || payload?.error || "Nova could not answer";
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

export const chatService = {
  getConversations(params = {}) {
    return apiClient.get("/conversation", { params: { limit: 50, ...params } });
  },
  getMessages(conversationId) {
    return apiClient.get(`/message/${conversationId}/chat`);
  },
  async sendMessage({ conversationId, message, files = [], onStart, onChunk }) {
    const formData = new FormData();
    if (conversationId) formData.append("conversationId", conversationId);
    if (message) formData.append("message", message);
    files.forEach((file) => formData.append("files", file));

    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    if (!response.body) {
      throw new Error("Streaming is not supported in this browser");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let conversationIdFromStream = conversationId || null;
    let fullResponse = "";

    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const rawEvent of events) {
        if (!rawEvent.trim()) continue;

        const { event, data } = parseStreamEvent(rawEvent);
        if (event === "error") {
          const payload = JSON.parse(data || "{}");
          throw new Error(payload.message || "Stream failed");
        }

        if (!data || data === "done") continue;

        const payload = JSON.parse(data);
        if (payload.conversationId) {
          conversationIdFromStream = payload.conversationId;
          onStart?.(conversationIdFromStream);
        }

        if (payload.text) {
          fullResponse += payload.text;
          onChunk?.(payload.text);
        }
      }

      if (done) break;
    }

    return {
      data: {
        data: {
          conversationId: conversationIdFromStream,
          response: fullResponse,
        },
      },
    };
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
