import bcrypt from "bcryptjs";
import process from "process";
import supabase from "./supabase.js";

async function iniciarDB() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminSenha = process.env.ADMIN_SENHA;

  try {
    const { data: usuarioExistente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", adminEmail)
      .single();

    if (!usuarioExistente) {
      const hash = bcrypt.hashSync(adminSenha, 10);

      const { error: erroInsert } = await supabase.from("usuarios").insert([
        {
          email: adminEmail,
          senha: hash,
          nome: "Administrador",
        },
      ]);

      if (erroInsert) {
        console.error("Erro ao criar admin:", erroInsert);
      } else {
        console.log(`✓ Admin criado: ${adminEmail}`);
      }
    }

    const { data: produtos, error: erroProdutos } = await supabase
      .from("produtos")
      .select("*");

    if (erroProdutos) {
      console.error("Erro ao buscar produtos:", erroProdutos);
    }

    if (!produtos || produtos.length === 0) {
      const exemplos = [
        {
          nome: "Antibiótico Amoxicilina",
          categoria: "Medicamento",
          quantidade: 3,
          validade: "2026-05-10",
          fornecedor: "Vet Pharma",
        },
        {
          nome: "Ração Premium Adulto",
          categoria: "Ração",
          quantidade: 12,
          validade: "2026-12-01",
          fornecedor: "NutriPet",
        },
        {
          nome: "Shampoo Antifúngico",
          categoria: "Higiene",
          quantidade: 2,
          validade: "2025-11-20",
          fornecedor: "DermVet",
        },
        {
          nome: "Vacina V8",
          categoria: "Vacina",
          quantidade: 8,
          validade: "2026-04-18",
          fornecedor: "BioPet",
        },
      ];

      const { error: erroInsertProdutos } = await supabase
        .from("produtos")
        .insert(exemplos);

      if (erroInsertProdutos) {
        console.error("Erro ao inserir produtos:", erroInsertProdutos);
      } else {
        console.log("✓ Produtos iniciais criados");
      }
    }

    console.log("✓ Supabase conectado");
  } catch (error) {
    console.error("Erro geral no banco:", error);
  }
}

export { iniciarDB };
