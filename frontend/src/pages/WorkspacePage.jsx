import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu, Sparkles } from "lucide-react";
import { logout } from "../features/auth/authSlice.js";
import ChatSidebar from "../features/chat/ChatSidebar.jsx";
import ChatWindow from "../features/chat/ChatWindow.jsx";
import { fetchConversations } from "../features/chat/chatSlice.js";

export default function WorkspacePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const search = useSelector((state) => state.chat.search);

  useEffect(() => {
    dispatch(fetchConversations({ search }));
  }, [dispatch, search]);

  return (
    <main className="grid h-screen overflow-hidden bg-[linear-gradient(135deg,#f5f7fb_0%,#eef9ff_55%,#fff6ed_100%)] text-ink lg:grid-cols-[320px_1fr]">
      <ChatSidebar />
      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white/75 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-slate-600 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">Nova AI Workspace</p>
              <p className="truncate text-xs text-slate-500">
                {user?.name ? `Signed in as ${user.name}` : "Connected to your AI backend"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-coral hover:text-coral lg:hidden"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        <ChatWindow />
      </section>
    </main>
  );
}
