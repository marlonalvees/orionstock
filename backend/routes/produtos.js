import express from "express";
import autenticar from "../middleware/autenticar.js";
import { getDB, salvarDisco } from "../db.js";

const router = express.Router();

// Todas as rotas de produtos exigem login
router.use(autenticar);

// Helper: converte resultado sql.js em array de objetos
function linhasParaObjetos(resultado) {
  if (!resultado.length) return [];
  const colunas = resultado[0].columns;
  return resultado[0].values.map((linha) =>
    Object.fromEntries(colunas.map((col, i) => [col, linha[i]])),
  );
}

// GET /produtos
router.get("/", (req, res) => {
  const db = getDB();
  const resultado = db.exec("SELECT * FROM produtos ORDER BY nome ASC");
  res.json(linhasParaObjetos(resultado));
});

// GET /produtos/:id
router.get("/:id", (req, res) => {
  const db = getDB();
  const stmt = db.prepare("SELECT * FROM produtos WHERE id = ?");
  stmt.bind([Number(req.params.id)]);
  const resultado = [];
  while (stmt.step()) {
    resultado.push(stmt.getAsObject());
  }
  stmt.free();
  const produto = resultado[0];
  if (!produto)
    return res.status(404).json({ erro: "Produto não encontrado." });
  res.json(produto);
});

// POST /produtos
router.post("/", (req, res) => {
  const { nome, categoria, quantidade, validade, fornecedor } = req.body;

  if (!nome || !categoria || quantidade === undefined) {
    return res
      .status(400)
      .json({ erro: "Campos obrigatórios: nome, categoria, quantidade." });
  }

  const db = getDB();
  db.run(
    "INSERT INTO produtos (nome, categoria, quantidade, validade, fornecedor) VALUES (?,?,?,?,?)",
    [nome, categoria, Number(quantidade), validade || null, fornecedor || null],
  );

  const novo = db.exec("SELECT * FROM produtos WHERE id = last_insert_rowid()");
  salvarDisco();
  res.status(201).json(linhasParaObjetos(novo)[0]);
});

// PUT /produtos/:id
router.put("/:id", (req, res) => {
  const { nome, categoria, quantidade, validade, fornecedor } = req.body;
  const id = Number(req.params.id);

  const db = getDB();
  const stmt = db.prepare("SELECT id FROM produtos WHERE id = ?");
  stmt.bind([id]);
  const existe = stmt.step();
  stmt.free();

  if (!existe) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  db.run(
    `UPDATE produtos SET nome=?, categoria=?, quantidade=?, validade=?, fornecedor=? WHERE id=?`,
    [
      nome,
      categoria,
      Number(quantidade),
      validade || null,
      fornecedor || null,
      id,
    ],
  );

  const stmt2 = db.prepare("SELECT * FROM produtos WHERE id = ?");
  stmt2.bind([id]);
  const atualizado = [];
  while (stmt2.step()) {
    atualizado.push(stmt2.getAsObject());
  }
  stmt2.free();
  salvarDisco();
  res.json(atualizado[0]);
});

// DELETE /produtos/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const db = getDB();

  const stmt = db.prepare("SELECT id FROM produtos WHERE id = ?");
  stmt.bind([id]);
  const existe = stmt.step();
  stmt.free();

  if (!existe) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  db.run(`DELETE FROM produtos WHERE id = ?`, [id]);
  salvarDisco();
  res.json({ mensagem: "Produto removido com sucesso." });
});

export default router;
