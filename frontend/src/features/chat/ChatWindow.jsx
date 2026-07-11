import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, Bot, Loader2, Sparkles } from "lucide-react";
import ChatComposer from "./ChatComposer.jsx";
import MessageBubble from "./MessageBubble.jsx";
import { fetchConversations } from "./chatSlice.js";

const suggestions = [
  "Design a clean landing page for my AI product",
  "Summarize this project architecture",
  "Write a professional README for the backend",
];

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { messages, messagesStatus, sendingStatus, streamingMessageId, error, activeConversationId } =
    useSelector((state) => state.chat);
  const listRef = useRef(null);
  const latestContent = messages.map((message) => message.content).join("");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, latestContent, sendingStatus]);

  useEffect(() => {
    if (sendingStatus === "succeeded") {
      dispatch(fetchConversations());
    }
  }, [dispatch, sendingStatus]);

  const empty = messages.length === 0 && messagesStatus !== "loading";

  const downloadConversation = () => {
    if (!messages.length) return;

    const serialized = messages
      .map((message) => {
        const header = message.role === "assistant" ? "Nova" : "You";
        const attachments = message.attachment?.length
          ? `\nAttachments:\n${message.attachment
              .map((attachment) => ` - ${attachment.originalName}: ${attachment.url}`)
              .join("\n")}`
          : "";

        return `${header}: ${message.content || ""}${attachments}`;
      })
      .join("\n\n----------------------------------------\n\n");

    const blob = new Blob([serialized], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nova-chat-${activeConversationId || "export"}-${new Date().toISOString().replace(/[:.]/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden dark:text-slate-100">
      <div className="border-b border-line px-4 py-3 sm:px-8 dark:border-slate-700 dark:bg-slate-950/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-200">
            {messages.length > 0
              ? `${messages.length} ${messages.length === 1 ? "message" : "messages"}`
              : "No chat selected"}
          </span>
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={downloadConversation}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Export chat
            </button>
          ) : null}
        </div>
      </div>
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-28 scrollbar-thin sm:px-8 dark:bg-slate-950">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {empty ? (
            <section className="grid min-h-[58vh] place-items-center text-center">
              <div className="max-w-2xl animate-floatIn">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-ink text-white shadow-glow">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-normal text-ink dark:text-slate-100">
                  What are we building today?
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                  Start a new AI conversation, attach images, and keep the thread saved in
                  your backend automatically.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-lg border border-line bg-white/80 p-4 text-left text-sm font-semibold leading-6 text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-600"
                      onClick={() => {
                        const input = document.querySelector("#nova-message-input");
                        if (input) {
                          input.value = item;
                          input.dispatchEvent(new Event("input", { bubbles: true }));
                          input.focus();
                        }
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {messagesStatus === "loading" ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading messages
            </div>
          ) : null}

          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isStreaming={message._id === streamingMessageId}
            />
          ))}

          {sendingStatus === "loading" && !streamingMessageId ? (
            <div className="flex items-center gap-3 rounded-lg border border-line bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-slate-900 dark:text-slate-100">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:240ms]" />
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400 dark:bg-red-950/60 dark:text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </div>
      </div>
      <ChatComposer activeConversationId={activeConversationId} />
    </div>
  );
}
