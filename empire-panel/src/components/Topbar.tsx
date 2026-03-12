import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      {token ? (
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <span style={{ color: "#64748b" }}>Not logged</span>
      )}
    </div>
  );
}
