import { AlertCircle, ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";

export default function AuthForm({
  mode,
  values,
  error,
  loading,
  onChange,
  onSubmit,
  footer,
}) {
  const isRegister = mode === "register";

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md animate-floatIn rounded-lg border border-line bg-white p-6 shadow-soft sm:p-8"
    >
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
        {isRegister ? "Create account" : "Welcome back"}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-normal text-ink">
        {isRegister ? "Start your workspace" : "Sign in to Nova"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isRegister
          ? "Use a strong password so your AI threads stay protected."
          : "Continue your conversations exactly where you left them."}
      </p>

      {error ? (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                required
                minLength={3}
                name="name"
                value={values.name}
                onChange={onChange}
                className="focus-ring h-12 w-full rounded-lg border border-line bg-white pl-10 pr-3 text-sm text-ink"
                placeholder="Your name"
              />
            </div>
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="email"
              name="email"
              value={values.email}
              onChange={onChange}
              className="focus-ring h-12 w-full rounded-lg border border-line bg-white pl-10 pr-3 text-sm text-ink"
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="password"
              name="password"
              minLength={isRegister ? 8 : 1}
              value={values.password}
              onChange={onChange}
              className="focus-ring h-12 w-full rounded-lg border border-line bg-white pl-10 pr-3 text-sm text-ink"
              placeholder={isRegister ? "Uppercase, number, special char" : "Your password"}
            />
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {isRegister ? "Create workspace" : "Enter workspace"}
      </button>

      <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
    </form>
  );
}
