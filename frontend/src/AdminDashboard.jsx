import { useState, useEffect } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  async function fetchRecords(date) {
    const params = date ? { target_date: date } : {};
    const res = await api.get("/admin/attendance", { params });
    setRecords(res.data);
  }

  useEffect(() => { fetchRecords(); }, []);

  function handleFilter(e) {
    e.preventDefault();
    fetchRecords(dateFilter || null);
  }

  function handleClear() {
    setDateFilter("");
    fetchRecords();
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-xl font-bold text-ink">{user?.username}</h1>
        </div>
        <button onClick={logout} className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink">
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <form onSubmit={handleFilter} className="mb-6 flex items-end gap-3">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-ink/50">Filter by date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-ink/15 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
            />
          </div>
          <button type="submit" className="rounded-lg bg-brass px-4 py-2 font-display text-sm font-semibold text-white hover:bg-brass/90">
            Filter
          </button>
          <button type="button" onClick={handleClear} className="font-mono text-xs uppercase tracking-wide text-ink/50 hover:text-ink">
            Clear
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ink/10 font-mono text-xs uppercase tracking-wide text-ink/50">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-5 py-8 text-center font-mono text-sm text-ink/40">
                    No records for this view.
                  </td>
                </tr>
              )}
              {records.map((rec) => (
                <tr key={rec.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 text-sm text-ink">{rec.student_username}</td>
                  <td className="px-5 py-3 font-mono text-sm text-ink">{rec.date}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex -rotate-2 select-none items-center rounded-full border-2 border-stamp px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-stamp">
                      {rec.status}
                    </span>
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
