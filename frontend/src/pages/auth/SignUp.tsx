import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const IconCamera = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 9.5A3.5 3.5 0 1 0 12 16.5 3.5 3.5 0 0 0 12 9.5zM4 7h2.2l1.6-2h6.4l1.6 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
  </svg>
);

const IconUser = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4Z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12a2 2 0 0 0 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconLock = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17 8V7a5 5 0 1 0-10 0v1H5v12h14V8h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Z" />
  </svg>
);

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const onPick = () => fileRef.current?.click();
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    const url = URL.createObjectURL(f);
    setAvatarFile(f);
    setAvatarPreview(url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identifier || !password) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("identifier", identifier);
      form.append("password", password);
      if (avatarFile) form.append("avatar", avatarFile);
      // TODO: POST to backend
      await new Promise((r) => setTimeout(r, 800));
      console.log("signup", { name, identifier });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="w-full max-w-5xl rounded-lg overflow-hidden">
        <div className="md:flex bg-white rounded-xl shadow-xl overflow-hidden">
          {/* left side blue - info */}
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-600 text-white p-10">
            <div className="max-w-xs text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2C7 2 3 6 3 11c0 2.4 1 4.6 2.7 6.2L5 21l3.8-0.8C10.4 21.6 11.2 22 12 22c5 0 9-4 9-9s-4-11-9-11z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to Project Flow</h2>
              <p className="text-blue-100/90 mb-6">Collaborate, plan and ship — beautiful dashboards for teams.</p>
              <ul className="space-y-2 text-sm text-blue-100/80">
                <li>• Simple onboarding for teams</li>
                <li>• Secure by design</li>
                <li>• Works great on mobile</li>
              </ul>
            </div>
          </div>

          {/* right side form */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-md mb-6" />

            <div className="flex justify-center -mt-10 mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl font-semibold border-4 border-white shadow-sm">
                ⟳
              </div>
            </div>

            <h1 className="text-center text-xl font-bold text-slate-900 mb-1">CREATE YOUR ACCOUNT</h1>
            <p className="text-center text-sm text-slate-500 mb-6">Start managing your projects efficiently</p>

            <form onSubmit={submit} className="space-y-4" noValidate>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="text-slate-300"><IconCamera /></div>
                  )}

                  <button
                    type="button"
                    onClick={onPick}
                    className="absolute -right-2 -bottom-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700"
                    aria-label="Upload avatar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M5 20h14v-2H5v2zm7-16l-4 4h3v6h2v-6h3l-4-4z" />
                    </svg>
                  </button>

                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChangeFile} />
                </div>
                <p className="text-sm text-slate-500">Add a profile photo (optional)</p>
              </div>

              <label className="block">
                <span className="text-sm text-slate-600">Full name</span>
                <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                  <span className="text-slate-400"><IconUser /></span>
                  <input
                    type="text"
                    className="flex-1 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Email address</span>
                <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                  <span className="text-slate-400"><IconMail /></span>
                  <input
                    type="email"
                    className="flex-1 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                    placeholder="your@email.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Password</span>
                <div className="mt-2 flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 bg-white">
                  <span className="text-slate-400"><IconLock /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="flex-1 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-slate-400 p-1 rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">Password must be at least 6 characters.</p>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 rounded-md text-sm shadow-md disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create account"}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account? <Link to="/" className="text-blue-600 font-medium hover:underline">Log in</Link>
              </p>
            </form>

            <footer className="border-t border-slate-100 text-center text-xs text-slate-400 py-3 mt-6">
              © {new Date().getFullYear()} Project Flow — Privacy first
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
