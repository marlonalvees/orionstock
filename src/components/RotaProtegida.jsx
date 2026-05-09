import { Navigate } from 'react-router-dom'
import { getSessao } from '../services/api'

export default function RotaProtegida({ children }) {
  const sessao = getSessao()
  if (!sessao) return <Navigate to="/login" replace />
  return children
}
