import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(username, password);
      navigate(user.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stamp">Roll Call</p>
          <h1 className="font-display text-3xl font-bold text-ink">Attendance Register</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
          <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink/60">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mb-4 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
          />

          <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink/60">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mb-6 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-stamp py-2.5 font-display font-semibold text-white transition hover:bg-stamp/90 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          {error && <p className="mt-4 text-center text-sm text-alert">{error}</p>}
        </form>
      </div>
    </div>
  );
}
