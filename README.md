# 🐾 VetStock — Sistema de Gerenciamento de Estoque Veterinário

Projeto acadêmico (PEX) com React + Node.js + SQLite e autenticação por login e senha.

---

## 📁 Estrutura do projeto

```
vetstock/
├── backend/                 ← Servidor Node.js
│   ├── server.js            ← Ponto de entrada do servidor
│   ├── db.js                ← Banco de dados SQLite
│   ├── .env                 ← Configurações (email/senha admin, chave JWT)
│   ├── .env.example         ← Modelo do .env
│   ├── middleware/
│   │   └── autenticar.js    ← Proteção de rotas via JWT
│   └── routes/
│       ├── auth.js          ← POST /auth/login, GET /auth/me
│       └── produtos.js      ← CRUD completo de produtos
└── src/                     ← Aplicação React
    ├── App.jsx              ← Rotas (com proteção de login)
    ├── index.css            ← Estilos globais + dark mode
    ├── services/
    │   └── api.js           ← Chamadas HTTP + gerenciamento de sessão
    ├── components/
    │   ├── Sidebar.jsx      ← Menu + botão sair + modo escuro
    │   ├── RotaProtegida.jsx← Redireciona para login se não autenticado
    │   ├── FormProduto.jsx  ← Formulário reutilizável
    │   └── StatusBadge.jsx  ← Badge de status do produto
    └── pages/
        ├── Login.jsx        ← Tela de login
        ├── Dashboard.jsx    ← Indicadores e alertas
        ├── Produtos.jsx     ← Lista com busca e filtros
        ├── Cadastro.jsx     ← Cadastro de produto
        └── Editar.jsx       ← Edição de produto
```

---

## ⚙️ Como instalar e rodar

### Pré-requisitos
- Node.js 18 ou superior (https://nodejs.org)

### Passo a passo

1. Abra o terminal na pasta do projeto:
```
cd vetstock
```

2. Instale as dependências do front-end:
```
npm install
```

3. Instale as dependências do backend:
```
cd backend
npm install
cd ..
```

4. Abra DOIS terminais:

Terminal 1 — Backend (servidor + banco de dados):
```
cd backend
node server.js
```
Roda em: http://localhost:3001

Terminal 2 — Front-end React:
```
npm run dev
```
Roda em: http://localhost:5173

5. Acesse no navegador: http://localhost:5173

6. Faça login com:
   - E-mail: admin@clinica.com
   - Senha:  admin123

---

## 🔐 Como funciona o login

### Fluxo completo

1. Usuário digita e-mail e senha na tela de Login
2. React envia POST /auth/login para o backend
3. Backend busca o usuário no banco, compara a senha com bcrypt
4. Se correto, gera um token JWT válido por 8 horas e retorna
5. React salva o token no localStorage
6. Todas as próximas requisições enviam o token no header Authorization
7. O backend valida o token antes de responder qualquer rota de produtos
8. Se o token expirar ou for inválido, redireciona para o login automaticamente

### Segurança
- Senhas armazenadas com hash bcrypt (nunca em texto puro)
- Token JWT assinado com chave secreta definida no .env
- Todas as rotas de produtos são protegidas — sem token, retorna 401

### Alterar e-mail ou senha do admin
Edite o arquivo backend/.env:

  ADMIN_EMAIL=novo@email.com
  ADMIN_SENHA=novaSenha123
  JWT_SECRET=chave_longa_e_aleatoria_aqui

Depois apague o arquivo backend/vetstock.db.bin e reinicie o servidor.
O admin será recriado com as novas credenciais.

---

## 🗄️ Como funciona o banco de dados

O banco é SQLite, gerenciado pela biblioteca sql.js (SQLite em JavaScript puro).
Os dados ficam salvos no arquivo backend/vetstock.db.bin criado automaticamente.

Tabelas criadas automaticamente:
  - usuarios  → id, email, senha (hash), nome
  - produtos  → id, nome, categoria, quantidade, validade, fornecedor

Rotas da API:

  POST   /auth/login       → Faz login, retorna token JWT
  GET    /auth/me          → Verifica token (requer login)

  GET    /produtos         → Lista todos (requer login)
  GET    /produtos/:id     → Busca por ID (requer login)
  POST   /produtos         → Cria produto (requer login)
  PUT    /produtos/:id     → Atualiza produto (requer login)
  DELETE /produtos/:id     → Remove produto (requer login)

---

## 🌐 Como hospedar online

### Front-end → Vercel (gratuito)

1. Crie conta em vercel.com
2. Suba a pasta vetstock (sem a pasta backend) no GitHub
3. Conecte o repositório na Vercel
4. Ela detecta o Vite automaticamente e faz o deploy

Atenção: antes do deploy, altere a baseURL no arquivo src/services/api.js
para apontar para o endereço real do seu backend hospedado.

### Backend → Railway (gratuito com limitações)

1. Crie conta em railway.app
2. Crie um novo projeto e suba apenas a pasta backend no GitHub
3. Configure as variáveis de ambiente no painel do Railway:
   JWT_SECRET, ADMIN_EMAIL, ADMIN_SENHA, PORT
4. Railway detecta o Node.js e inicia com: node server.js

---

## 💡 Dicas para a apresentação

- Mostre a tela de login e explique o fluxo de autenticação
- Abra o DevTools (F12 → Network) e mostre o token JWT sendo enviado
  nos headers de cada requisição
- Mostre o arquivo backend/vetstock.db.bin sendo criado/atualizado
- Acesse http://localhost:3001/produtos sem token para mostrar o 401
- Demonstre o modo escuro e o menu mobile

---

## 🚀 Melhorias futuras sugeridas

- Múltiplos usuários com diferentes níveis de acesso
- Histórico de movimentações (entradas e saídas)
- Relatório em PDF do estoque
- Notificações por e-mail para produtos vencendo
- Deploy completo na nuvem
