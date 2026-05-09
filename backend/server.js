import dotenv from "dotenv";
dotenv.config();
import process from "process";
import express from "express";
import cors from "cors";
import { iniciarDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import produtosRoutes from "./routes/produtos.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.post("/login-teste", (req, res) => {
  console.log("Corpo recebido no teste:", req.body);
  res.json({ msg: "Rota de teste funcionando!" });
});
app.use("/produtos", produtosRoutes);

// Health check
app.get("/", (_, res) => res.json({ status: "VetStock API rodando ✓" }));

// Inicia o banco e depois sobe o servidor
iniciarDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(
        `   Login: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_SENHA}\n`,
      );
    });
  })
  .catch((err) => {
    console.error("Erro ao iniciar banco de dados:", err);
    process.exit(1);
  });
