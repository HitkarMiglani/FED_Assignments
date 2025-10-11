import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("academy_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.debug("localStorage read failed", err);
    }
    function onAuthChange() {
      try {
        const raw = localStorage.getItem("academy_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (err) {
        console.debug("authChange handler failed", err);
      }
    }

    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  function handleLogout() {
    localStorage.removeItem("academy_user");
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="app-root">
      <header>
        <div className="header-inner">
          <h1>Academy Gatekeeper</h1>
          <nav>
            {!user ? (
              <>
                <Link to="/login" className="btn-link">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Signup
                </Link>
              </>
            ) : (
              <>
                <span className="user-badge">{user.name}</span>
                <button className="btn-ghost" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
