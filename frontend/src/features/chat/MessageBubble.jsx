import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memo, useState } from "react";
import { Bot, Check, Copy, UserRound } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ className = "", children }) {
  const [copied, setCopied] = useState(false);
  const language = /language-(\w+)/.exec(className)?.[1] || "code";
  const code = String(children).replace(/\n$/, "");

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="group/code relative my-4 overflow-hidden rounded-[22px] bg-[#f1f3f4] shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700/70">
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-100">
          {language}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex h-8 items-center gap-2 rounded-md px-2 text-xs font-semibold text-slate-500 opacity-0 transition hover:bg-white hover:text-slate-950 group-hover/code:opacity-100"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "24px 26px 26px",
          background: "#f1f3f4",
          color: "#001d35",
          fontSize: "20px",
          lineHeight: "1.65",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          overflowX: "auto",
        }}
        codeTagProps={{
          className: "scrollbar-thin",
          style: {
            background: "transparent",
            fontFamily: "inherit",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function MessageBubble({ message, isStreaming = false }) {
  const isAssistant = message.role === "assistant";
  const showStreamingText = isAssistant && isStreaming;

  return (
    <article
      className={`flex gap-3 ${isStreaming ? "" : "animate-floatIn"} ${isAssistant ? "" : "justify-end"}`}
    >
      {isAssistant ? (
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/90 dark:text-brand-100">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={`max-w-[min(760px,88%)] rounded-lg border px-4 py-3 shadow-sm ${
          isAssistant
            ? "border-line bg-white text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            : "border-ink bg-ink text-white"
        }`}
      >
        {showStreamingText ? (
          <div className="whitespace-pre-wrap break-words text-sm leading-7 text-ink dark:text-slate-100">
            {message.content || ""}
            <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-brand-500" />
          </div>
        ) : isAssistant ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm max-w-none prose-slate prose-headings:text-ink prose-a:text-brand-700 prose-p:leading-7 prose-li:leading-7 prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none dark:prose-headings:text-slate-100 dark:prose-a:text-brand-200"
            components={{
              code({ inline, className, children, ...props }) {
                if (!inline) {
                  return (
                    <CodeBlock className={className}>{children}</CodeBlock>
                  );
                }

                return (
                  <code
                    className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.85em] font-semibold text-coral"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content || ""}
          </ReactMarkdown>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-6">
            {message.content}
          </p>
        )}
        {message.attachment?.length ? (
          <div className="mt-3 space-y-2">
            {message.attachment.map((attachment, index) => (
              <a
                key={`${attachment.originalName}-${index}`}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <span>{attachment.originalName}</span>
                <span className="text-xs text-slate-500">
                  {attachment.type === "image" ? "Image" : "Document"}
                </span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
      {!isAssistant ? (
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100">
          <UserRound className="h-5 w-5" />
        </div>
      ) : null}
    </article>
  );
}

export default memo(MessageBubble);
