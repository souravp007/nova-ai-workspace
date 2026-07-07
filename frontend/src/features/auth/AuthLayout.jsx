import { Bot, Sparkles } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-mist lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden min-h-screen items-center px-12 lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f5f7fb_0%,#eef9ff_44%,#f9f2e8_100%)]" />
        <div className="absolute left-12 top-12 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white shadow-glow">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-normal text-ink">Nova AI Workspace</span>
        </div>
        <div className="relative max-w-2xl animate-floatIn">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI workspace for focused conversations
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight tracking-normal text-ink">
            Build, ask, refine, and keep every idea in one sharp workspace.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            A clean chat environment connected to your backend, with saved threads,
            markdown responses, images, account sessions, and quick context switching.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {["Fast sessions", "Saved memory", "Markdown ready"].map((item) => (
              <div key={item} className="rounded-lg border border-white/70 bg-white/60 p-4 shadow-sm">
                <p className="text-sm font-bold text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative grid min-h-screen place-items-center px-5 py-8">
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-brand-100">
          <div className="h-full w-1/2 animate-pulseBeam bg-brand-500" />
        </div>
        <div className="mb-7 flex items-center gap-3 lg:hidden">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-ink">Nova AI Workspace</span>
        </div>
        {children}
      </section>
    </main>
  );
}
