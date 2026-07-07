import { Bot } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-mist">
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-5 py-4 shadow-soft">
        <Bot className="h-5 w-5 animate-pulse text-brand-600" />
        <span className="text-sm font-semibold text-ink">Preparing workspace</span>
      </div>
    </div>
  );
}
