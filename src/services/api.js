import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Injeta o token JWT em todas as requisições automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Se o token expirar, redireciona para o login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const login = (email, senha) =>
  api.post("/auth/login", { email, senha });
// export const login = (email, senha) =>
//   api.post("/login-teste", { email, senha });

export function salvarSessao(token, usuario) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function encerrarSessao() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

export function getSessao() {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");
  if (!token || !usuario) return null;
  return { token, usuario: JSON.parse(usuario) };
}

// ─── Produtos ─────────────────────────────────────────────────────────────────

export const getProdutos = () => api.get("/produtos");
export const getProdutoById = (id) => api.get(`/produtos/${id}`);
export const criarProduto = (dados) => api.post("/produtos", dados);
export const atualizarProduto = (id, dados) =>
  api.put(`/produtos/${id}`, dados);
export const deletarProduto = (id) => api.delete(`/produtos/${id}`);

// ─── Helpers de status ────────────────────────────────────────────────────────

export function getStatus(produto) {
  const hoje = new Date().toISOString().slice(0, 10);
  if (produto.validade && produto.validade <= hoje) return "vencido";
  if (produto.quantidade < 5) return "baixo";
  return "ok";
}

export function venceEm7Dias(produto) {
  const hoje = new Date();
  const em7 = new Date();
  em7.setDate(hoje.getDate() + 7);
  if (!produto.validade) return false;
  const val = new Date(produto.validade);
  return val > hoje && val <= em7;
}

export function formatarData(data) {
  if (!data) return "—";
  const [y, m, d] = data.split("-");
  return `${d}/${m}/${y}`;
}
