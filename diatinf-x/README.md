# DIATINF X

Réplica simplificada do X para a disciplina de Programação Orientada a Serviços.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Banco: PostgreSQL
- Autenticação: JWT
- Comunicação: API RESTful
- Frontend em `/web`
- Backend em `/api`

## Interface

Paleta definida para o projeto:

- `#CE701B`
- `#F1881D`
- `#FDC616`
- `#F9EBC2`
- `#A4BCCC`
- `#0C3453`

O frontend segue a abordagem Mobile First e implementa feed, criação de publicação, detalhes/comentários, perfil e pesquisa.

## Requisitos

- Node.js 20+
- PostgreSQL 15+

## 1. Banco de dados

Crie um banco PostgreSQL, por exemplo:

```sql
CREATE DATABASE diatinf_x;
```

Depois configure `api/.env` a partir de `api/.env.example`.

Execute:

```bash
cd api
npm install
npm run db:init
npm run db:seed
```

## 2. Backend

```bash
cd api
npm install
npm run dev
```

A API ficará em `http://localhost:3333`.

## 3. Frontend

Em outro terminal:

```bash
cd web
npm install
npm run dev
```

O frontend ficará em `http://localhost:5173`.

## Usuário de demonstração

Após o seed:

- usuário: `joaosilva`
- senha: `123456`

Para a versão final, a criação de usuários deve ser integrada ao SUAP conforme a proposta da atividade.

## Principais endpoints

- `POST /api/auth/login`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts/:id/comments`
- `POST /api/posts/:id/rating`
- `GET /api/users/:username`
- `GET /api/search?q=...`

## Estrutura

```text
diatinf-x/
├── api/
│   ├── src/
│   │   ├── db.ts
│   │   ├── server.ts
│   │   ├── middleware/auth.ts
│   │   └── routes/
│   ├── sql/
│   │   └── schema.sql
│   └── .env.example
└── web/
    ├── src/
    │   ├── api.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── styles.css
    └── vite.config.ts
```
