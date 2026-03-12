import { useState, useEffect } from "react";
import { get, post } from "../services/api";

// Interface para as props
interface MissoesAutoProps {
  botId: string;
}

// Interface para as missões
interface Missao {
  id: string;
  nome: string;
  completada: boolean;
  recompensa?: {
    xp: number;
    ouro: number;
    itens?: string[];
  };
}

// Interface para resposta da API de missões
interface MissionsResponse {
  missions: Missao[];
}

// Interface para resposta de completar missão
interface CompleteMissionResponse {
  success: boolean;
  rewards: {
    xp: number;
    gold: number;
    itens?: string[];
  };
}

// Interface para os logs
interface LogEntry {
  timestamp: string;
  mensagem: string;
}

export default function MissoesAuto({ botId }: MissoesAutoProps) {
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [missoesAtivas, setMissoesAtivas] = useState<Record<string, boolean>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filtro, setFiltro] = useState<string>("todas");

  const carregarMissoes = async (): Promise<void> => {
    try {
      const data = await get<MissionsResponse>("/game/missions");
      setMissoes(data.missions);
    } catch (error) {
      adicionarLog(
        `❌ Erro ao carregar missões: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  };

  useEffect(() => {
    carregarMissoes();
  }, []);

  const adicionarLog = (mensagem: string): void => {
    setLogs((prev) =>
      [
        {
          timestamp: new Date().toLocaleTimeString(),
          mensagem,
        },
        ...prev,
      ].slice(0, 100),
    );
  };

  const executarMissao = async (missaoId: string): Promise<void> => {
    if (!missoesAtivas[missaoId]) return;

    try {
      setLoading(true);
      const data = await post<CompleteMissionResponse>(
        `/game/mission/${missaoId}/complete`,
        { botId },
      );

      if (data.success) {
        const rewards = data.rewards;
        adicionarLog(
          `✅ ${missaoId}: +${rewards.xp} XP, +${rewards.gold} ouro`,
        );

        if (rewards.itens?.length > 0) {
          adicionarLog(`🎁 Itens: ${rewards.itens.join(", ")}`);
        }

        carregarMissoes();
      }
    } catch (error) {
      adicionarLog(
        `❌ Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    } finally {
      setLoading(false);

      if (missoesAtivas[missaoId]) {
        setTimeout(() => executarMissao(missaoId), 30000);
      }
    }
  };

  const toggleMissao = (missaoId: string): void => {
    if (missoesAtivas[missaoId]) {
      setMissoesAtivas((prev) => {
        const newState = { ...prev };
        delete newState[missaoId];
        return newState;
      });
      adicionarLog(`⏹️ Missão ${missaoId} parada`);
    } else {
      setMissoesAtivas((prev) => ({ ...prev, [missaoId]: true }));
      adicionarLog(`▶️ Missão ${missaoId} iniciada`);
      executarMissao(missaoId);
    }
  };

  const executarTodas = async (): Promise<void> => {
    const pendentes = missoes.filter((m) => !m.completada);
    adicionarLog(
      `🚀 Iniciando todas as ${pendentes.length} missões pendentes...`,
    );

    for (const missao of pendentes) {
      setMissoesAtivas((prev) => ({ ...prev, [missao.id]: true }));
      await executarMissao(missao.id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  const pararTodas = (): void => {
    setMissoesAtivas({});
    adicionarLog("⏹️ Todas as missões paradas");
  };

  const missoesFiltradas = missoes.filter((m) => {
    if (filtro === "pendentes") return !m.completada;
    if (filtro === "completas") return m.completada;
    return true;
  });

  const missoesPorTipo = missoesFiltradas.reduce(
    (acc, missao) => {
      const tipo = missao.id.split("_")[0];
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(missao);
      return acc;
    },
    {} as Record<string, Missao[]>,
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Controles */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <button
            onClick={executarTodas}
            style={{
              padding: "8px 16px",
              background: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            🚀 Executar Todas
          </button>
          <button
            onClick={pararTodas}
            style={{
              padding: "8px 16px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ⏹️ Parar Todas
          </button>
        </div>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <option value="todas">Todas missões</option>
          <option value="pendentes">Pendentes</option>
          <option value="completas">Completas</option>
        </select>
      </div>

      {/* Lista de missões */}
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        {Object.entries(missoesPorTipo).map(([tipo, lista]) => (
          <div
            key={tipo}
            style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "15px",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0", color: "#2196f3" }}>{tipo}</h3>

            {lista.map((missao) => (
              <div
                key={missao.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  margin: "5px 0",
                  background: missao.completada ? "#e8f5e8" : "#f8f9fa",
                  borderRadius: "4px",
                  opacity: missao.completada ? 0.7 : 1,
                }}
              >
                <div>
                  <strong>{missao.nome}</strong>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {missao.recompensa?.xp || 0} XP |{" "}
                    {missao.recompensa?.ouro || 0} ouro
                  </div>
                </div>

                <button
                  onClick={() => toggleMissao(missao.id)}
                  disabled={loading && missoesAtivas[missao.id]}
                  style={{
                    padding: "4px 12px",
                    background: missoesAtivas[missao.id]
                      ? "#ff4444"
                      : missao.completada
                        ? "#ccc"
                        : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: missao.completada ? "default" : "pointer",
                    fontSize: "12px",
                  }}
                >
                  {missao.completada
                    ? "✅"
                    : missoesAtivas[missao.id]
                      ? "⏹️"
                      : "▶️"}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Logs */}
      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid #eee",
          paddingTop: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h4 style={{ margin: 0 }}>📋 Logs</h4>
          <button
            onClick={() => setLogs([])}
            style={{
              padding: "4px 8px",
              background: "#f0f0f0",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Limpar
          </button>
        </div>
        <div
          style={{
            background: "#1e1e1e",
            color: "#fff",
            padding: "15px",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: "#666", textAlign: "center" }}>
              Nenhum log ainda
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                style={{
                  padding: "2px 0",
                  color: log.mensagem.includes("❌")
                    ? "#ff6b6b"
                    : log.mensagem.includes("✅")
                      ? "#51cf66"
                      : "#fff",
                }}
              >
                [{log.timestamp}] {log.mensagem}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
