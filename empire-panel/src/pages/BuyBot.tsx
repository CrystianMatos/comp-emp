import { useAuthModal } from "../auth/useAuthModal";
import AuthModal from "../auth/AuthModal";
// WIP: pricing page layout

type Plan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string; // "/mon"
  description: string;
  features: string[];
  accent: string; // cor do topo
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    currency: "€",
    period: "/mon",
    description: "Entrada para começar.",
    features: [
      "1 bot",
      "Suporte básico",
      "Atualizações inclusas",
      "Acesso ao painel",
    ],
    accent: "#22c55e",
  },
  {
    id: "standard",
    name: "Standard",
    price: 14.99,
    currency: "€",
    period: "/mon",
    description: "O melhor custo-benefício.",
    features: [
      "2 bots",
      "Recursos automáticos",
      "Filtros de alvo",
      "Suporte padrão",
    ],
    accent: "#06b6d4",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    currency: "€",
    period: "/mon",
    description: "Mais performance e controle.",
    features: [
      "3 bots",
      "Regras avançadas",
      "Prioridade de execução",
      "Logs detalhados",
    ],
    accent: "#6366f1",
  },
  {
    id: "legend",
    name: "Legend",
    price: 24.99,
    currency: "€",
    period: "/mon",
    description: "Tudo incluso.",
    features: [
      "5 bots",
      "Tudo do Pro",
      "Automação premium",
      "Suporte prioritário",
    ],
    accent: "#f59e0b",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 39.99,
    currency: "€",
    period: "/mon",
    description: "Para times / alto volume.",
    features: ["Bots ilimitados", "SLA", "Config custom", "Suporte dedicado"],
    accent: "#ef4444",
  },
];

function formatPrice(price: number) {
  const [intPart, decPart] = price.toFixed(2).split(".");
  return { intPart, decPart };
}

function PricingCard({
  plan,
  onBuy,
}: {
  plan: Plan;
  onBuy: (plan: Plan) => void;
}) {
  const { intPart, decPart } = formatPrice(plan.price);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: plan.highlight
          ? "2px solid rgba(99,102,241,0.35)"
          : "1px solid #e5e7eb",
        boxShadow: plan.highlight
          ? "0 10px 30px rgba(2,6,23,0.10)"
          : "0 6px 18px rgba(2,6,23,0.06)",
        overflow: "hidden",
        transform: plan.highlight ? "translateY(-2px)" : "none",
      }}
    >
      <div
        style={{
          background: plan.accent,
          padding: "16px 18px",
          color: "#fff",
          letterSpacing: 1,
          fontWeight: 800,
          textTransform: "uppercase",
          fontSize: 14,
        }}
      >
        {plan.name}
      </div>

      <div style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginTop: 6,
          }}
        >
          <span style={{ fontSize: 18, color: "#64748b" }}>
            {plan.currency}
          </span>

          <span
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1,
            }}
          >
            {intPart}
          </span>

          <span style={{ fontSize: 16, color: "#0f172a", fontWeight: 700 }}>
            .{decPart}
            <span style={{ fontSize: 14, color: "#64748b", fontWeight: 700 }}>
              {plan.period}
            </span>
          </span>
        </div>

        <div style={{ marginTop: 10, color: "#64748b", fontSize: 14 }}>
          {plan.description}
        </div>

        <div
          style={{
            marginTop: 16,
            borderTop: "1px solid #e5e7eb",
            paddingTop: 14,
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "#334155",
              fontSize: 14,
              lineHeight: 1.9,
            }}
          >
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <button
          style={{
            marginTop: 16,
            width: "100%",
            height: 42,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: plan.highlight ? plan.accent : "#0f172a",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
          onClick={() => onBuy(plan)}
        >
          BUY
        </button>

        {plan.highlight && (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#64748b",
              textAlign: "center",
            }}
          >
            Recomendado
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuyBot() {
  const { open, setOpen, requireAuth } = useAuthModal();

  function comprarPlano(plan: Plan) {
    // Aqui depois você troca para uma chamada real de compra (API)
    alert(`Comprar: ${plan.name}`);
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 26, color: "#0f172a" }}>Buy bot</h1>
        <p style={{ margin: "6px 0 0", color: "#64748b" }}>
          Escolha um plano e finalize a compra. Você pode trocar depois.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {plans.map((p) => (
          <PricingCard
            key={p.id}
            plan={p}
            onBuy={() => requireAuth(() => comprarPlano(p))}
          />
        ))}
      </div>

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
