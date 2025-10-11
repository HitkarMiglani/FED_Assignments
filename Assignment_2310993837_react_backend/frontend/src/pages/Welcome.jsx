import { useLocation } from "react-router-dom";

export default function Welcome() {
  const { state } = useLocation();
  let user = state?.user;
  if (!user) {
    try {
      const raw = localStorage.getItem("academy_user");
      if (raw) user = JSON.parse(raw);
    } catch (err) {
      console.debug("localStorage read failed", err);
    }
  }

  return (
    <div className="welcome">
      <h2>Welcome</h2>
      {user ? (
        <p>Hi {user.name}, welcome to your dashboard.</p>
      ) : (
        <p>No user information available. You can login or signup.</p>
      )}
    </div>
  );
}
