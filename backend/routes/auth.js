import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "node:process";
import supabase from "../supabase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erro: "E-mail e senha são obrigatórios.",
    });
  }

  try {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
    }

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);

    return res.status(500).json({
      erro: "Erro interno do servidor.",
    });
  }
});

export default router;
