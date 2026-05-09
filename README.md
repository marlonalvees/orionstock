# 🐾 VetStock — Sistema de Gerenciamento de Estoque Veterinário

Projeto acadêmico (PEX) com React + Node.js + SQLite e autenticação por login e senha.

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


