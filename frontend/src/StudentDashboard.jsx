import { useState, useEffect } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function fetchHistory() {
    const res = await api.get("/attendance/me");
    setHistory(res.data);
  }

  useEffect(() => { fetchHistory(); }, []);

  async function handleMark() {
    setMarking(true);
    setMessage("");
    try {
      await api.post("/attendance/mark");
      setMessage("Marked present for today.");
      setIsError(false);
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not mark attendance.");
      setIsError(true);
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stamp">Student</p>
          <h1 className="font-display text-xl font-bold text-ink">{user?.username}</h1>
        </div>
        <button onClick={logout} className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink">
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-10 flex flex-col items-start gap-3 rounded-2xl border border-ink/10 bg-white p-6">
          <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
            {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <button
            onClick={handleMark}
            disabled={marking}
            className="rounded-lg bg-stamp px-6 py-3 font-display font-semibold text-white transition hover:bg-stamp/90 disabled:opacity-60"
          >
            {marking ? "Marking..." : "Mark Attendance"}
          </button>
          {message && <p className={`font-mono text-sm ${isError ? "text-alert" : "text-stamp"}`}>{message}</p>}
        </div>

        <h2 className="mb-3 font-display text-lg font-bold text-ink">History</h2>
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ink/10 font-mono text-xs uppercase tracking-wide text-ink/50">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Marked at</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-5 py-8 text-center font-mono text-sm text-ink/40">
                    No records yet — mark today's attendance to start your register.
                  </td>
                </tr>
              )}
              {history.map((rec) => (
                <tr key={rec.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 font-mono text-sm text-ink">{rec.date}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex -rotate-2 select-none items-center rounded-full border-2 border-stamp px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-stamp">
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-ink/50">
                    {new Date(rec.marked_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
