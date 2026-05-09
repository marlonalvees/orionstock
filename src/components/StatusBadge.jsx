import { getStatus } from '../services/api'

export default function StatusBadge({ produto }) {
  const status = getStatus(produto)
  const labels = { ok: 'Normal', baixo: 'Estoque baixo', vencido: 'Vencido' }

  return (
    <span className={`badge ${status}`}>
      <span className={`dot ${status}`} />
      {produto.quantidade === 0 && status === 'baixo' ? 'Sem estoque' : labels[status]}
    </span>
  )
}
