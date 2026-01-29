import { useState } from "react";
import { login, apiPost } from "../services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthed?: () => void;
};

export default function AuthModal({ open, onClose, onAuthed }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (mode === "register") {
        await apiPost("/api/register", { email, password });
      }
      await login(email, password); // salva token
      onAuthed?.();
      onClose();
    } catch {
      setError(mode === "login" ? "Login inválido" : "Falha ao registrar");
    }
  }

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h3>
          <button onClick={onClose} style={xBtn}>
            ✕
          </button>
        </div>

        <p style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>
          {mode === "login"
            ? "Entre para continuar."
            : "Crie uma conta para comprar planos."}
        </p>

        <form onSubmit={submit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={input}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            style={input}
          />

          {error && (
            <div style={{ color: "#ef4444", fontSize: 12 }}>{error}</div>
          )}

          <button style={primaryBtn} type="submit">
            {mode === "login" ? "Entrar" : "Registrar"}
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button style={linkBtn} onClick={() => setMode("register")}>
                Registrar
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button style={linkBtn} onClick={() => setMode("login")}>
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.55)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
};

const modal: React.CSSProperties = {
  width: 360,
  background: "#fff",
  borderRadius: 14,
  padding: 18,
  boxShadow: "0 20px 60px rgba(2,6,23,0.25)",
};

const input: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  marginTop: 12,
  height: 42,
  borderRadius: 10,
  border: "none",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const linkBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: 700,
  padding: 0,
};

const xBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};
