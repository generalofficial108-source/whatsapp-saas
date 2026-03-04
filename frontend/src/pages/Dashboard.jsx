import { useEffect, useState } from "react";
import { getStats } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard 🚀</h1>

      {loading && <p>Loading stats...</p>}

      {!loading && stats && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "15px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            <h3>Total Users</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {stats.totalUsers}
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            <h3>Total Messages</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {stats.totalMessages}
            </p>
          </div>
        </div>
      )}

      {!loading && !stats && (
        <p style={{ color: "red" }}>Failed to load stats</p>
      )}
    </div>
  );
}

export default Dashboard;