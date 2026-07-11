import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { sendMessage } from "./chatSlice.js";

export default function ChatComposer({ activeConversationId }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const sending = useSelector(
    (state) => state.chat.sendingStatus === "loading",
  );
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const submit = (event) => {
    event.preventDefault();
    if ((!message.trim() && files.length === 0) || sending) return;

    dispatch(
      sendMessage({
        conversationId: activeConversationId,
        message: message.trim(),
        files,
      }),
    );
    setMessage("");
    setFiles([]);
  };

  return (
    <form
      onSubmit={submit}
      className="sticky bottom-0 z-20 border-t border-line bg-white/95 px-4 py-4 backdrop-blur-xl sm:static dark:border-slate-700 dark:bg-slate-950/95"
    >
      <div className="mx-auto max-w-4xl">
        {files.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {files.map((file) => (
              <span
                key={`${file.name}-${file.size}`}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {file.name}
                <button
                  type="button"
                  onClick={() =>
                    setFiles((current) =>
                      current.filter((item) => item !== file),
                    )
                  }
                  className="text-slate-400 hover:text-coral"
                  aria-label="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className="glass-panel flex flex-col gap-3 rounded-lg p-2 shadow-soft sm:flex-row sm:items-end dark:bg-slate-950/85 dark:border-slate-700">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            hidden
            onChange={(event) =>
              setFiles(Array.from(event.target.files || []).slice(0, 5))
            }
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-900/80"
            aria-label="Attach files"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
          <textarea
            id="nova-message-input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                submit(event);
              }
            }}
            rows={1}
            className="w-full min-h-[3rem] flex-1 resize-none border-0 bg-transparent px-2 py-3 text-sm leading-6 text-ink outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Message Nova..."
          />
          <button
            type="submit"
            disabled={sending || (!message.trim() && files.length === 0)}
            className="grid h-11 w-full shrink-0 place-items-center rounded-lg bg-ink text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-11"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
