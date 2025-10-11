import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!name.trim() || !password) {
      setError("Please enter both name and password (password min 6 chars)");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      // persist user
      try {
        localStorage.setItem("academy_user", JSON.stringify(data.user));
      } catch (_err) {
        console.debug("localStorage set failed", _err);
      }
      // notify other parts of the app
      try {
        window.dispatchEvent(new Event("authChange"));
      } catch (err) {
        console.debug("dispatch authChange failed", err);
      }
      // on success go to welcome
      navigate("/welcome", { state: { user: data.user } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
          <Link
            className="auth secondary"
            to="/login"
            style={{ alignSelf: "center", marginLeft: 8 }}
          >
            Back to login
          </Link>
        </div>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
