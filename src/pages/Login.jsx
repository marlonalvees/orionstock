import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, salvarSessao } from '../services/api'

export default function Login() {
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  const [erro, setErro]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await login(email, senha)
      salvarSessao(res.data.token, res.data.usuario)
      navigate('/')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon" style={{ width: 44, height: 44, fontSize: 22, marginBottom: '1rem' }}>🐾</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>OrionStock</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sistema de Controle de Estoque</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="admin@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <div className="alert danger" style={{ margin: '0.25rem 0' }}>
              <span className="alert-icon">⚠</span>
              <span>{erro}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: 'var(--text-hint)', textAlign: 'center', marginTop: '1.25rem' }}>
          Configure o acesso no arquivo <code>backend/.env</code>
        </p>
      </div>
    </div>
  )
}
