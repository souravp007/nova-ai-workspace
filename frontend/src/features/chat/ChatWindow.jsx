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
  const { messages, messagesStatus, sendingStatus, error, activeConversationId } = useSelector(
    (state) => state.chat
  );
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, sendingStatus]);

  useEffect(() => {
    if (sendingStatus === "succeeded") {
      dispatch(fetchConversations());
    }
  }, [dispatch, sendingStatus]);

  const empty = messages.length === 0 && messagesStatus !== "loading";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 scrollbar-thin sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {empty ? (
            <section className="grid min-h-[58vh] place-items-center text-center">
              <div className="max-w-2xl animate-floatIn">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-ink text-white shadow-glow">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-normal text-ink">
                  What are we building today?
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
                  Start a new AI conversation, attach images, and keep the thread saved in
                  your backend automatically.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-lg border border-line bg-white/80 p-4 text-left text-sm font-semibold leading-6 text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:text-brand-700"
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
            <div className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading messages
            </div>
          ) : null}

          {messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))}

          {sendingStatus === "loading" ? (
            <div className="flex items-center gap-3 rounded-lg border border-line bg-white/80 p-4 shadow-sm">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
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
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
