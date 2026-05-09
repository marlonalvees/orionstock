import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProdutos,
  getStatus,
  venceEm7Dias,
  formatarData,
} from "../services/api";

export default function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProdutos()
      .then((r) => setProdutos(r.data))
      .catch(() => setErro(true));
  }, []);

  const total = produtos.length;
  const vencidos = produtos.filter((p) => getStatus(p) === "vencido");
  const baixo = produtos.filter((p) => getStatus(p) === "baixo");
  const normais = produtos.filter((p) => getStatus(p) === "ok");
  const expirando = produtos.filter((p) => venceEm7Dias(p));

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (erro) {
    return (
      <div className="card" style={{ marginTop: "1rem" }}>
        <p style={{ color: "var(--vermelho)", fontWeight: 500 }}>
          ⚠ Não foi possível conectar ao banco de dados.
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
          Verifique se o JSON Server está rodando: <code>npm run server</code>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-sub">{hoje}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/cadastro")}
        >
          + Novo produto
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total de produtos</div>
          <div className="stat-value info">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Status normal</div>
          <div className="stat-value ok">{normais.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Estoque baixo</div>
          <div className="stat-value warn">{baixo.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vencidos</div>
          <div className="stat-value danger">{vencidos.length}</div>
        </div>
      </div>

      <p className="section-title">Alertas</p>

      {vencidos.length > 0 && (
        <div className="alert danger">
          <span className="alert-icon">⚠</span>
          <span>
            <strong>{vencidos.length} produto(s) vencido(s)</strong> —{" "}
            {vencidos.map((p) => p.nome).join(", ")}. Retire do estoque
            imediatamente.
          </span>
        </div>
      )}

      {baixo.length > 0 && (
        <div className="alert warn">
          <span className="alert-icon">!</span>
          <span>
            <strong>{baixo.length} produto(s) com estoque baixo</strong> —{" "}
            {baixo.map((p) => p.nome).join(", ")}.
          </span>
        </div>
      )}

      {expirando.length > 0 && (
        <div className="alert warn">
          <span className="alert-icon">!</span>
          <span>
            <strong>
              {expirando.length} produto(s) vencem nos próximos 7 dias
            </strong>{" "}
            — verifique a validade.
          </span>
        </div>
      )}

      {vencidos.length === 0 &&
        baixo.length === 0 &&
        expirando.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            ✓ Nenhum alerta no momento. Tudo certo!
          </p>
        )}

      {/* vencendo em breve */}
      {expirando.length > 0 && (
        <>
          <p className="section-title" style={{ marginTop: "1.5rem" }}>
            Vencendo nos próximos 7 dias
          </p>
          <div className="card">
            {expirando.map((p) => (
              <div className="expiring-row" key={p.id}>
                <span style={{ fontWeight: 500 }}>{p.nome}</span>
                <span style={{ color: "var(--amarelo)", fontWeight: 600 }}>
                  {formatarData(p.validade)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="section-title" style={{ marginTop: "1.5rem" }}>
        Produtos por categoria
      </p>
      <div className="card">
        {["Medicamento", "Ração", "Higiene", "Material", "Vacina", "Outro"].map(
          (cat) => {
            const qtd = produtos.filter((p) => p.categoria === cat).length;
            if (qtd === 0) return null;
            return (
              <div className="expiring-row" key={cat}>
                <span>{cat}</span>
                <span style={{ fontWeight: 600 }}>{qtd}</span>
              </div>
            );
          },
        )}
        {total === 0 && (
          <p className="empty">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
