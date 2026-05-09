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

// Liberando o CORS para evitar bloqueios do React/Vite na nuvem
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.post("/login-teste", (req, res) => {
  console.log("Corpo recebido no teste:", req.body);
  res.json({ msg: "Rota de teste funcionando!" });
});
app.use("/produtos", produtosRoutes);

app.get("/", (_, res) => res.json({ status: "VetStock API rodando ✓" }));

iniciarDB()
  .then(() => {
    // Adicionando o host '0.0.0.0' para o Railway enxergar a aplicação
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
      console.log(
        `   Login: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_SENHA}\n`,
      );
    });
  })
  .catch((err) => {
    console.error("Erro ao iniciar banco de dados:", err);
    process.exit(1);
  });
