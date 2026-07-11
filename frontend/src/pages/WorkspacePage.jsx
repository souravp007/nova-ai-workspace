import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu, Moon, Sparkles, Sun } from "lucide-react";
import { logout } from "../features/auth/authSlice.js";
import ChatSidebar from "../features/chat/ChatSidebar.jsx";
import ChatWindow from "../features/chat/ChatWindow.jsx";
import { fetchConversations } from "../features/chat/chatSlice.js";

export default function WorkspacePage({ isDarkMode, onToggleTheme }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const search = useSelector((state) => state.chat.search);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations({ search }));
  }, [dispatch, search]);

  useEffect(() => {
    const setInitialSidebar = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    setInitialSidebar();

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-[linear-gradient(135deg,#f5f7fb_0%,#eef9ff_55%,#fff6ed_100%)] text-ink dark:bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)] dark:text-slate-100">
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <section
        className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden ${
          sidebarOpen ? "lg:pl-[320px]" : ""
        }`}
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white/75 px-4 backdrop-blur-xl lg:px-6 dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink dark:text-slate-100">
                Nova AI Workspace
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.name
                  ? `Signed in as ${user.name}`
                  : "Connected to your AI backend"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-brand-300"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-coral hover:text-coral dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <ChatWindow />
      </section>
    </main>
  );
}
