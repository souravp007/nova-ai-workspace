import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Bot, Check, Copy, UserRound } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    <div className="group/code relative my-4 overflow-hidden rounded-[22px] bg-[#f1f3f4] shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="text-2xl font-semibold tracking-normal text-slate-950">
          {language}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex h-8 items-center gap-2 rounded-md px-2 text-xs font-semibold text-slate-500 opacity-0 transition hover:bg-white hover:text-slate-950 group-hover/code:opacity-100"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
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

export default function MessageBubble({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <article className={`flex gap-3 animate-floatIn ${isAssistant ? "" : "justify-end"}`}>
      {isAssistant ? (
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={`max-w-[min(760px,88%)] rounded-lg border px-4 py-3 shadow-sm ${
          isAssistant
            ? "border-line bg-white"
            : "border-ink bg-ink text-white"
        }`}
      >
        {isAssistant ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm max-w-none prose-slate prose-headings:text-ink prose-a:text-brand-700 prose-p:leading-7 prose-li:leading-7 prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none"
            components={{
              code({ inline, className, children, ...props }) {
                if (!inline) {
                  return <CodeBlock className={className}>{children}</CodeBlock>;
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
          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        )}
      </div>
      {!isAssistant ? (
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-slate-700 shadow-sm">
          <UserRound className="h-5 w-5" />
        </div>
      ) : null}
    </article>
  );
}
