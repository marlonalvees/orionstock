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

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.post("/login-teste", (req, res) => {
  console.log("Corpo recebido no teste:", req.body);
  res.json({ msg: "Rota de teste funcionando!" });
});
app.use("/produtos", produtosRoutes);

app.get("/", (_, res) => res.json({ status: "VetStock API rodando ✓" }));

iniciarDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao iniciar banco de dados:", err);
    process.exit(1);
  });
