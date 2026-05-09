import { useState } from 'react'

const CATEGORIAS = ['Medicamento', 'Ração', 'Higiene', 'Material', 'Vacina', 'Outro']

const VAZIO = {
  nome: '',
  categoria: '',
  quantidade: '',
  validade: '',
  fornecedor: '',
}

export default function FormProduto({ inicial = VAZIO, onSalvar, carregando }) {
  const [dados, setDados] = useState(inicial)
  const [msg, setMsg]     = useState(null)

  const set = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value })

  const handleSubmit = async () => {
    if (!dados.nome.trim() || !dados.categoria || dados.quantidade === '') {
      setMsg({ tipo: 'err', texto: 'Preencha os campos obrigatórios: nome, categoria e quantidade.' })
      return
    }
    const payload = {
      ...dados,
      quantidade: Number(dados.quantidade),
    }
    const resultado = await onSalvar(payload)
    if (resultado?.erro) {
      setMsg({ tipo: 'err', texto: resultado.erro })
    } else {
      setMsg({ tipo: 'ok', texto: resultado?.texto || 'Salvo com sucesso!' })
      if (!inicial.id) setDados(VAZIO)
    }
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="card" style={{ maxWidth: 620 }}>
      <div className="form-grid">
        {/* Nome */}
        <div className="form-group full">
          <label>Nome do produto *</label>
          <input
            type="text"
            placeholder="Ex: Antibiótico Amoxicilina"
            value={dados.nome}
            onChange={set('nome')}
          />
        </div>

        {/* Categoria */}
        <div className="form-group">
          <label>Categoria *</label>
          <select value={dados.categoria} onChange={set('categoria')}>
            <option value="">Selecione...</option>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Quantidade */}
        <div className="form-group">
          <label>Quantidade em estoque *</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={dados.quantidade}
            onChange={set('quantidade')}
          />
        </div>

        {/* Validade */}
        <div className="form-group">
          <label>Data de validade</label>
          <input
            type="date"
            value={dados.validade}
            onChange={set('validade')}
          />
        </div>

        {/* Fornecedor */}
        <div className="form-group">
          <label>Fornecedor</label>
          <input
            type="text"
            placeholder="Opcional"
            value={dados.fornecedor}
            onChange={set('fornecedor')}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={carregando}
        >
          {carregando ? 'Salvando...' : '💾 Salvar produto'}
        </button>
      </div>

      {msg && (
        <p className={`form-msg ${msg.tipo}`}>{msg.texto}</p>
      )}
    </div>
  )
}
