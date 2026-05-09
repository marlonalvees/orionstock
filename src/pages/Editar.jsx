import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProdutoById, atualizarProduto } from '../services/api'
import FormProduto from '../components/FormProduto'

export default function Editar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [produto, setProduto]     = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]           = useState(false)

  useEffect(() => {
    getProdutoById(id)
      .then((r) => setProduto(r.data))
      .catch(() => setErro(true))
  }, [id])

  const salvar = async (dados) => {
    setCarregando(true)
    try {
      await atualizarProduto(id, dados)
      setTimeout(() => navigate('/produtos'), 1200)
      return { texto: '✓ Produto atualizado! Redirecionando...' }
    } catch {
      return { erro: 'Erro ao atualizar. Verifique se o servidor está rodando.' }
    } finally {
      setCarregando(false)
    }
  }

  if (erro) return <p style={{ color: 'var(--vermelho)', padding: '1rem' }}>Produto não encontrado.</p>
  if (!produto) return <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Carregando...</p>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Editar produto</h1>
          <p className="page-sub">{produto.nome}</p>
        </div>
        <button className="btn" onClick={() => navigate('/produtos')}>
          ← Voltar
        </button>
      </div>
      <FormProduto inicial={produto} onSalvar={salvar} carregando={carregando} />
    </div>
  )
}
