import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

export default function Home() {
  const [resultado, setResultado] = useState<string>("");
  const [missaoAtiva, setMissaoAtiva] = useState<boolean>(false);
  const [contador, setContador] = useState<number>(0);
  // ✅ Corrigido: sem 'any', usando ReturnType do setTimeout
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const executarMissao = useCallback(async () => {
    try {
      const loginResponse = await axios.post(
        "http://localhost:3000/api/game/login",
        {
          username: "gabriel22111997",
          password: "QAP@2611",
        },
      );

      if (loginResponse.data.success) {
        const missaoResponse = await axios.post(
          "http://localhost:3000/api/game/mission/EmpireEx_20/complete",
          {},
        );

        if (missaoResponse.data.success) {
          setContador((prev) => prev + 1);
          setResultado(
            `✅ Missão ${contador + 1} completada! +${missaoResponse.data.rewards.xp} XP`,
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setResultado(`❌ Erro: ${error.message}`);
      }
    }
  }, [contador]);

  // Atualiza o resultado quando ativa/desativa
  const handleToggle = () => {
    const novoEstado = !missaoAtiva;
    setMissaoAtiva(novoEstado);

    if (novoEstado) {
      setResultado("▶️ Auto missão ATIVADA - executando a cada 30 segundos...");
      setContador(0);
    } else {
      setResultado("⏹️ Auto missão DESATIVADA");
    }
  };

  // Controla o loop de execução
  useEffect(() => {
    if (missaoAtiva) {
      // Pequeno delay para não executar imediatamente
      setTimeout(() => {
        executarMissao();
      }, 100);

      intervalRef.current = setInterval(() => {
        executarMissao();
      }, 30000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [missaoAtiva, executarMissao]);

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "40px auto",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  };

  return (
    <div style={cardStyle}>
      <h1>🎮 Auto Missão EmpireEx_20</h1>

      <button
        onClick={handleToggle}
        style={{
          padding: "16px 32px",
          background: missaoAtiva ? "#ff4444" : "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "50px",
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: missaoAtiva
            ? "0 0 20px rgba(255,68,68,0.5)"
            : "0 0 20px rgba(76,175,80,0.3)",
          transition: "all 0.3s",
          margin: "20px 0",
          width: "200px",
        }}
      >
        {missaoAtiva ? "⏹️ DESATIVAR" : "▶️ ATIVAR"}
      </button>

      {missaoAtiva && (
        <div
          style={{
            background: "#e3f2fd",
            padding: "15px",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#2196f3" }}
          >
            {contador}
          </div>
          <div style={{ color: "#666" }}>Missões completadas</div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
            Executando a cada 30 segundos
          </div>
        </div>
      )}

      {resultado && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: resultado.includes("✅")
              ? "#e8f5e8"
              : resultado.includes("❌")
                ? "#ffebee"
                : resultado.includes("▶️")
                  ? "#e3f2fd"
                  : "#fff3e0",
            borderRadius: "4px",
            textAlign: "left",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap" as const,
          }}
        >
          {resultado}
        </div>
      )}

      <p
        style={{
          color: "#666",
          marginTop: "20px",
          fontSize: "12px",
          background: "#f5f5f5",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        ⏱️ Missão: EmpireEx_20 | Conta: gabriel22111997
        <br />
        {missaoAtiva ? "🟢 Ativo" : "🔴 Inativo"}
      </p>
    </div>
  );
}
