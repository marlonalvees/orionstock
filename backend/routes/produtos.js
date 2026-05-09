import express from "express";
import autenticar from "../middleware/autenticar.js";
import supabase from "../supabase.js";

const router = express.Router();

router.use(autenticar);

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    return res.status(500).json({
      erro: error.message,
    });
  }

  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) {
    return res.status(404).json({
      erro: "Produto não encontrado.",
    });
  }

  res.json(data);
});

router.post("/", async (req, res) => {
  const { nome, categoria, quantidade, validade, fornecedor } = req.body;

  if (!nome || !categoria || quantidade === undefined) {
    return res.status(400).json({
      erro: "Campos obrigatórios: nome, categoria, quantidade.",
    });
  }

  const { data, error } = await supabase
    .from("produtos")
    .insert([
      {
        nome,
        categoria,
        quantidade: Number(quantidade),
        validade: validade || null,
        fornecedor: fornecedor || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      erro: error.message,
    });
  }

  res.status(201).json(data);
});

router.put("/:id", async (req, res) => {
  const { nome, categoria, quantidade, validade, fornecedor } = req.body;

  const { data, error } = await supabase
    .from("produtos")
    .update({
      nome,
      categoria,
      quantidade: Number(quantidade),
      validade: validade || null,
      fornecedor: fornecedor || null,
    })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error || !data) {
    return res.status(404).json({
      erro: "Produto não encontrado.",
    });
  }

  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    return res.status(404).json({
      erro: "Produto não encontrado.",
    });
  }

  res.json({
    mensagem: "Produto removido com sucesso.",
  });
});

export default router;
