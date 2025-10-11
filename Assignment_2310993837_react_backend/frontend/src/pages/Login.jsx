import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
      setError("Please enter both name and password");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      // persist user in localStorage so dashboard can read it
      try {
        localStorage.setItem("academy_user", JSON.stringify(data.user));
      } catch (err) {
        console.debug("localStorage set failed", err);
      }
      // notify other parts of the app in the same tab
      try {
        window.dispatchEvent(new Event("authChange"));
      } catch (err) {
        console.debug("dispatch authChange failed", err);
      }
      navigate("/welcome", { state: { user: data.user } });
    } catch (err) {
      console.debug("login failed", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <h2>Login</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
