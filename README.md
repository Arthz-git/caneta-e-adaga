# Caneta & Adaga

## Backend

### Pré-requisitos

- Node.js 20+
- Um banco de dados MySQL/MariaDB acessível

### Setup

1. Entre na pasta do backend:

   ```bash
   cd backend
   ```

2. Instale as dependências (o `postinstall` já roda `prisma generate`):

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz de `backend/` com as seguintes variáveis:

   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=mysql://usuario:senha@localhost:3306/nome_do_banco
   JWT_SECRET=uma_string_com_pelo_menos_32_caracteres
   JWT_EXPIRES_IN=3600
   REFRESH_TOKEN_TTL_DAYS=7
   ```

4. Rode as migrations do Prisma:

   ```bash
   npm run prisma:migrate
   ```

5. Suba o servidor em modo desenvolvimento (hot reload):

   ```bash
   npm run dev
   ```

### Scripts disponíveis

| Script                    | Descrição                                   |
| -------------------------- | -------------------------------------------- |
| `npm run dev`               | Sobe o servidor em modo watch                |
| `npm run build`              | Compila o TypeScript (`tsc`)                 |
| `npm run start`              | Roda o build (`dist/index.js`)               |
| `npm run prisma:generate`    | Gera o client do Prisma                      |
| `npm run prisma:migrate`     | Aplica as migrations em ambiente de dev       |
