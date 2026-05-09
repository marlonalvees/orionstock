import { useState } from 'react'
import { criarProduto } from '../services/api'
import FormProduto from '../components/FormProduto'

export default function Cadastro() {
  const [carregando, setCarregando] = useState(false)

  const salvar = async (dados) => {
    setCarregando(true)
    try {
      await criarProduto(dados)
      return { texto: '✓ Produto cadastrado com sucesso!' }
    } catch {
      return { erro: 'Erro ao cadastrar. Verifique se o servidor está rodando.' }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cadastrar produto</h1>
          <p className="page-sub">Adicione um novo item ao estoque da clínica</p>
        </div>
      </div>
      <FormProduto onSalvar={salvar} carregando={carregando} />
    </div>
  )
}
