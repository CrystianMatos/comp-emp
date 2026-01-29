type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Topbar({ collapsed, onToggle }: Props) {
  return (
    <div
      style={{
        height: 64,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Abrir menu" : "Fechar menu"}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: "pointer",
          fontSize: 18,
        }}
      >
        ☰
      </button>

      <div style={{ fontWeight: 800 }}>Dashboard</div>
      <div style={{ color: "#02142c" }}>MP</div>
    </div>
  );
}
