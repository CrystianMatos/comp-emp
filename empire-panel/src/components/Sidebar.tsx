import { NavLink } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Ticket,
  Settings,
  LifeBuoy,
  FileText,
  ScrollText,
} from "lucide-react";

type Props = {
  collapsed: boolean;
};

type Item = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
};

const items: Item[] = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/buy-normal", label: "Buy bot", Icon: ShoppingCart },
  { to: "/free-trial", label: "Free trial", Icon: Ticket },
  { to: "/subscriptions", label: "Subscriptions", Icon: ScrollText },
  { to: "/settings", label: "Settings", Icon: Settings },
  { to: "/support", label: "Support", Icon: LifeBuoy },
  { to: "/changelog", label: "Changelog", Icon: FileText },
];

export default function Sidebar({ collapsed }: Props) {
  const width = collapsed ? 72 : 260;

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "flex",
    alignItems: "center",
    gap: collapsed ? 0 : 12,
    justifyContent: collapsed ? "center" : "flex-start",
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: isActive ? "#fff" : "#cbd5e1",
    background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
    fontWeight: 600 as const,
  });

  return (
    <aside
      style={{
        width,
        background: "#0f172a",
        color: "#fff",
        padding: 12,
        transition: "width 180ms ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: "0 8px",
          marginBottom: 12,
          fontWeight: 800,
          fontSize: 22,
        }}
      >
        {collapsed ? "MP" : "MP Panel"}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={linkStyle}
            title={collapsed ? label : undefined}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
