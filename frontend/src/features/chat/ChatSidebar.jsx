import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bot,
  Edit3,
  LogOut,
  Loader2,
  MessageSquarePlus,
  Pin,
  PinOff,
  Search,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { logout } from "../auth/authSlice.js";
import {
  deleteConversation,
  fetchMessages,
  renameConversation,
  setActiveConversation,
  setSearch,
  startNewChat,
  togglePin,
} from "./chatSlice.js";
import { formatDate } from "../../utils/date.js";

export default function ChatSidebar({ isOpen = false, onClose = () => {} }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { conversations, activeConversationId, conversationsStatus, search } =
    useSelector((state) => state.chat);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");

  const openConversation = (id) => {
    dispatch(setActiveConversation(id));
    dispatch(fetchMessages(id));
    onClose();
  };

  const submitRename = (event, id) => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch(renameConversation({ id, title: title.trim() }));
    setEditingId(null);
  };

  const removeConversation = (conversation) => {
    const confirmed = window.confirm(
      `Delete "${conversation.title || "New Chat"}"?`,
    );
    if (confirmed) {
      dispatch(deleteConversation(conversation._id));
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs transform border-r border-line bg-white lg:bg-white/78 backdrop-blur-xl shadow-xl transition duration-200 lg:w-[320px] flex h-full flex-col overflow-hidden dark:border-slate-700 dark:bg-slate-950 dark:lg:bg-slate-950/95 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white px-5 dark:border-slate-700 dark:bg-slate-950">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white dark:bg-slate-900">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black text-ink dark:text-slate-100">Nova</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">AI conversation hub</p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <button
          type="button"
          onClick={() => {
            dispatch(startNewChat());
            onClose();
          }}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-700"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => dispatch(setSearch(event.target.value))}
            className="focus-ring h-11 w-full rounded-lg border border-line bg-white pl-10 pr-3 text-sm text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Search threads"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {conversationsStatus === "loading" ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading conversations
          </div>
        ) : null}

        <div className="space-y-2">
          {conversations.map((conversation) => {
            const active = activeConversationId === conversation._id;
            return (
              <article
                key={conversation._id}
                className={`group rounded-lg border p-3 transition ${
                  active
                    ? "border-brand-200 bg-brand-50 shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    : "border-transparent hover:border-line hover:bg-white dark:border-transparent dark:hover:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-950 dark:text-slate-100"
                }`}
              >
                {editingId === conversation._id ? (
                  <form
                    onSubmit={(event) => submitRename(event, conversation._id)}
                  >
                    <input
                      autoFocus
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      onBlur={() => setEditingId(null)}
                      className="focus-ring h-9 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => openConversation(conversation._id)}
                    className="block w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-bold text-ink dark:text-slate-100">
                        {conversation.title || "New Chat"}
                      </h3>
                      {conversation.isPinned ? (
                        <Star className="mt-0.5 h-4 w-4 fill-amber text-amber" />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {conversation.lastMessage || "No response yet"}
                    </p>
                  </button>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                    {formatDate(conversation.updatedAt)}
                  </span>
                  <div
                    className={`flex gap-1 transition ${
                      active || conversation.isPinned
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => dispatch(togglePin(conversation._id))}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-white hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-900/80"
                      aria-label={
                        conversation.isPinned
                          ? "Unpin conversation"
                          : "Pin conversation"
                      }
                      title={conversation.isPinned ? "Unpin" : "Pin"}
                    >
                      {conversation.isPinned ? (
                        <PinOff className="h-4 w-4" />
                      ) : (
                        <Pin className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(conversation._id);
                        setTitle(conversation.title || "");
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-white hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-900/80"
                      aria-label="Rename conversation"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeConversation(conversation)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-coral dark:text-slate-300 dark:hover:bg-slate-900/80"
                      aria-label="Delete conversation"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="shrink-0 border-t border-line p-4 dark:border-slate-700">
        <div className="rounded-lg border border-line bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-slate-900 dark:text-slate-100">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "Profile"}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <UserRound className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink dark:text-slate-100">
                {user?.name || "Nova User"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "Workspace profile"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-bold text-slate-700 transition hover:border-coral hover:text-coral dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
