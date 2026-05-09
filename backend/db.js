import path from "path";
import fs from "fs";
import initSqlJs from "sql.js";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "vetstock.db.bin");

let db = null;

// Salva o banco no disco (sql.js é in-memory, então salvamos manualmente)
function salvarDisco() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function iniciarDB() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    // Carrega banco existente do disco
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    // Cria banco novo
    db = new SQL.Database();
  }

  // Cria tabelas se não existirem
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      email   TEXT UNIQUE NOT NULL,
      senha   TEXT NOT NULL,
      nome    TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nome        TEXT NOT NULL,
      categoria   TEXT NOT NULL,
      quantidade  INTEGER NOT NULL DEFAULT 0,
      validade    TEXT,
      fornecedor  TEXT
    )
  `);

  // Cria admin se não existir
  const adminEmail = process.env.ADMIN_EMAIL || "admin@clinica.com";
  const adminSenha = process.env.ADMIN_SENHA || "admin123";

  const existe = db.exec(`SELECT id FROM usuarios WHERE email = ?`, [
    adminEmail,
  ]);
  if (!existe.length || !existe[0].values.length) {
    const hash = bcrypt.hashSync(adminSenha, 10);
    db.run(`INSERT INTO usuarios (email, senha, nome) VALUES (?, ?, ?)`, [
      adminEmail,
      hash,
      "Administrador",
    ]);
    console.log(`✓ Admin criado: ${adminEmail} / senha: ${adminSenha}`);
  }

  // Insere produtos de exemplo se o banco estiver vazio
  const prods = db.exec("SELECT COUNT(*) as total FROM produtos");
  const total = prods[0].values[0][0];
  if (total === 0) {
    const exemplos = [
      ["Antibiótico Amoxicilina", "Medicamento", 3, "2026-05-10", "Vet Pharma"],
      ["Ração Premium Adulto", "Ração", 12, "2026-12-01", "NutriPet"],
      ["Shampoo Antifúngico", "Higiene", 2, "2025-11-20", "DermVet"],
      ["Vacina V8", "Vacina", 8, "2026-04-18", "BioPet"],
      ["Soro Fisiológico 500ml", "Material", 0, "2027-03-15", "MedVet"],
      ["Ivermectina 1%", "Medicamento", 15, "2026-09-30", "Vet Pharma"],
      ["Ração Filhote", "Ração", 4, "2026-08-15", "NutriPet"],
      ["Luva Descartável cx100", "Material", 6, "2028-01-01", "MedVet"],
    ];
    for (const p of exemplos) {
      db.run(
        "INSERT INTO produtos (nome, categoria, quantidade, validade, fornecedor) VALUES (?,?,?,?,?)",
        p,
      );
    }
  }

  salvarDisco();
  console.log("✓ Banco de dados pronto");
  return db;
}

function getDB() {
  return db;
}

export { iniciarDB, getDB, salvarDisco };
