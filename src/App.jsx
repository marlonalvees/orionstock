import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar       from './components/Sidebar'
import RotaProtegida from './components/RotaProtegida'
import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import Produtos      from './pages/Produtos'
import Cadastro      from './pages/Cadastro'
import Editar        from './pages/Editar'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas — exigem login */}
        <Route
          path="/*"
          element={
            <RotaProtegida>
              <div className="layout">
                <Sidebar />
                <main className="main">
                  <Routes>
                    <Route path="/"           element={<Dashboard />} />
                    <Route path="/produtos"   element={<Produtos />}  />
                    <Route path="/cadastro"   element={<Cadastro />}  />
                    <Route path="/editar/:id" element={<Editar />}    />
                  </Routes>
                </main>
              </div>
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
