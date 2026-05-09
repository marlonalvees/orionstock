import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSessao, encerrarSessao } from "../services/api";

export default function Sidebar() {
  const [aberto, setAberto] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const salvo = localStorage.getItem("tema");
    if (salvo) return salvo === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const navigate = useNavigate();
  const sessao = getSessao();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
    localStorage.setItem("tema", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSair = () => {
    encerrarSessao();
    navigate("/login");
  };

  const links = [
    { to: "/", icon: "📊", label: "Dashboard" },
    { to: "/produtos", icon: "📦", label: "Estoque" },
    { to: "/cadastro", icon: "➕", label: "Cadastrar" },
  ];

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setAberto(!aberto)}
        aria-label="Abrir menu"
      >
        <span className={`ham-icon ${aberto ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>OrionStock</span>
      </button>

      {aberto && (
        <div className="sidebar-overlay" onClick={() => setAberto(false)} />
      )}

      <aside className={`sidebar ${aberto ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">🐾</div>
          <div>
            <div className="brand-name">OrionStock</div>
            <div className="brand-sub">Estoque clínica vet</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              <span className="nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Info do usuário logado */}
          {sessao && (
            <div className="usuario-info">
              <div className="usuario-avatar">
                {sessao.usuario.nome.charAt(0).toUpperCase()}
              </div>
              <div className="usuario-texto">
                <div className="usuario-nome">{sessao.usuario.nome}</div>
                <div className="usuario-email">{sessao.usuario.email}</div>
              </div>
            </div>
          )}

          <button
            className="nav-link tema-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            <span className="nav-icon">{darkMode ? "☀️" : "🌙"}</span>
            {darkMode ? "Modo claro" : "Modo escuro"}
          </button>

          <button className="nav-link sair-btn" onClick={handleSair}>
            <span className="nav-icon">🚪</span>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
