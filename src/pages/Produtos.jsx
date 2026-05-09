import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProdutos, deletarProduto, getStatus, formatarData } from '../services/api'
import StatusBadge from '../components/StatusBadge'

const CATEGORIAS = ['', 'Medicamento', 'Ração', 'Higiene', 'Material', 'Vacina', 'Outro']
const STATUS_OPTS = [
  { value: '', label: 'Todos os status' },
  { value: 'ok',      label: '🟢 Normal' },
  { value: 'baixo',   label: '🟡 Estoque baixo' },
  { value: 'vencido', label: '🔴 Vencidos' },
]

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca]       = useState('')
  const [catFiltro, setCatFiltro]   = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')
  const navigate = useNavigate()

  const carregar = () =>
    getProdutos().then((r) => setProdutos(r.data))

  useEffect(() => { carregar() }, [])

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Remover "${nome}" do estoque?`)) return
    await deletarProduto(id)
    carregar()
  }

  const filtrados = produtos.filter((p) => {
    if (busca && !p.nome.toLowerCase().includes(busca.toLowerCase())) return false
    if (catFiltro && p.categoria !== catFiltro) return false
    if (statusFiltro && getStatus(p) !== statusFiltro) return false
    return true
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Estoque</h1>
          <p className="page-sub">{produtos.length} produto(s) cadastrado(s)</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastro')}>
          + Novo produto
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="input-search"
            type="text"
            placeholder="🔍  Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            className="input-select"
            value={catFiltro}
            onChange={(e) => setCatFiltro(e.target.value)}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c || 'Todas as categorias'}</option>
            ))}
          </select>
          <select
            className="input-select"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            {STATUS_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Tabela */}
        <div className="table-wrap">
          {filtrados.length === 0 ? (
            <p className="empty">Nenhum produto encontrado.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Qtd</th>
                  <th>Validade</th>
                  <th>Fornecedor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => {
                  const st = getStatus(p)
                  return (
                    <tr key={p.id}>
                      <td>
                        <span className={`dot ${st}`} />
                      </td>
                      <td style={{ fontWeight: 500 }}>{p.nome}</td>
                      <td>
                        <span className="badge cat">{p.categoria}</span>
                      </td>
                      <td style={{ color: st === 'baixo' ? 'var(--amarelo)' : undefined, fontWeight: st === 'baixo' ? 600 : undefined }}>
                        {p.quantidade}
                      </td>
                      <td style={{ color: st === 'vencido' ? 'var(--vermelho)' : undefined, fontWeight: st === 'vencido' ? 600 : undefined }}>
                        {formatarData(p.validade)}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{p.fornecedor || '—'}</td>
                      <td><StatusBadge produto={p} /></td>
                      <td>
                        <div className="btn-row">
                          <button
                            className="btn btn-sm"
                            onClick={() => navigate(`/editar/${p.id}`)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p.id, p.nome)}
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
