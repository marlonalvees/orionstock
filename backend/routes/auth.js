import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "node:process";
import { getDB } from "../db.js";

const router = express.Router();

// POST /auth/login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  // 1. Verificação prioritária pelo .env (seu acesso mestre)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminSenha = process.env.ADMIN_SENHA;

  if (email === adminEmail && senha === adminSenha) {
    const token = jwt.sign(
      { id: 0, email: adminEmail, nome: "Administrador" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "8h" },
    );
    return res.json({
      token,
      usuario: { id: 0, email: adminEmail, nome: "Administrador" },
    });
  }

  // 2. Se não for o admin, busca no SQLite (opcional, se você quiser manter os dois)
  try {
    const db = getDB();
    const resultado = db.exec(
      `SELECT id, email, senha, nome FROM usuarios WHERE email = ?`,
      [email.toLowerCase().trim()],
    );

    if (resultado.length > 0 && resultado[0].values.length > 0) {
      const [id, emailDB, hashSenha, nome] = resultado[0].values[0];
      const senhaCorreta = bcrypt.compareSync(senha, hashSenha);

      if (senhaCorreta) {
        const token = jwt.sign(
          { id, email: emailDB, nome },
          process.env.JWT_SECRET,
          { expiresIn: "8h" },
        );
        return res.json({ token, usuario: { id, email: emailDB, nome } });
      }
    }
  } catch (error) {
    console.error("Erro no banco:", error);
  }

  // Se nada der certo:
  return res.status(401).json({ erro: "E-mail ou senha incorretos." });
});

export default router;
