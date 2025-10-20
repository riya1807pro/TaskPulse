import React, { useEffect, useState } from "react";

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
    <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4Z" />
  </svg>
);

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
    <path fill="currentColor" d="M17 8V7a5 5 0 1 0-10 0v1H5v12h14V8h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Z" />
  </svg>
);

const IconEye = ({ open }: { open: boolean }) => (
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 5c4 0 7.5 2.7 9 7-1.5 4.3-5 7-9 7s-7.5-2.7-9-7c1.5-4.3 5-7 9-7m0-2C6 3 1.7 7 0 12c1.7 5 6 9 12 9s10.3-4 12-9c-1.7-5-6-9-12-9z"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 6a9.77 9.77 0 0 1 8.92 5A14.91 14.91 0 0 1 12 18a14.91 14.91 0 0 1-8.92-7 9.77 9.77 0 0 1 8.92-5m0-2C6 4 1.7 8 0 13c1.7 5 6 9 12 9s10.3-4 12-9c-1.7-5-6-9-12-9z"/>
    </svg>
  )
);

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // optional: restore identifier from storage
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setSubmitting(true);
    try {
      // replace with real auth call
      await new Promise((r) => setTimeout(r, 600));
      console.log("login", { identifier });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-stretch gap-8">
        <main className="w-full md:w-1/2 max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
          <div className="flex justify-center -mt-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl font-semibold border-4 border-white shadow-md">
              ⟳
            </div>
          </div>

          <header className="text-center px-8 pt-2 pb-1">
            <h1 className="text-xl font-bold text-slate-900">PROJECT FLOW</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your projects efficiently</p>
          </header>

          <form className="px-8 pb-6 pt-2 space-y-4" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="text-sm text-slate-600">Email address or username</span>
              <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                <span className="text-slate-400"><IconUser /></span>
                <input
                  className="flex-1 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                  type="text"
                  name="identifier"
                  placeholder="your@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Password</span>
              <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                <span className="text-slate-400"><IconLock /></span>
                <input
                  className="flex-1 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="text-slate-400 p-1 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">Forgot?</a>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 rounded-md text-sm shadow-md disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "LOGIN"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Don't have an account? <a href="/signUp" className="text-blue-600 font-medium hover:underline">Sign up</a>
            </p>
          </form>

          <footer className="border-t border-slate-100 text-center text-xs text-slate-400 py-3">
            © {new Date().getFullYear()} Project Flow — Privacy first
          </footer>
        </main>

        {/* decorative image column - hidden on small screens, vertically centered on md+ */}
        <aside className="hidden md:flex md:w-1/2 items-center justify-center">
          <img
            src="/taskmanager_icon.avif"
            alt="Project illustration"
            className="w-60 h-auto object-cover rounded-lg shadow-xl"
            aria-hidden="false"
          />
        </aside>
      </div>
    </div>
  );
};

export default Login;
