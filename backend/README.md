# PulseBoard Backend (PostgreSQL)

Backend com:
- login por email/senha
- cadastro publico desabilitado
- estado do app salvo por usuario
- Jarvis com OpenAI usando contexto real do usuario
- banco PostgreSQL

## 1) Instalacao

```bash
cd backend
npm install
cp .env.example .env
```

## 2) Configuracao do `.env`

Preencha no minimo:
- `OPENAI_API_KEY=...`
- `JWT_SECRET=...`
- `ALLOWED_ORIGIN=http://127.0.0.1:5500`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pulseboard`

## 3) Rodar

```bash
npm run dev
```

Servidor: `http://localhost:8787`

## 4) Endpoints

### Auth
- `POST /api/auth/register` -> `403` (desabilitado)
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

### Estado do app
- `GET /api/state` (Bearer token)
- `PUT /api/state` (Bearer token)

### Jarvis
- `POST /api/jarvis` (Bearer token)

## 5) Criar usuario manual no PostgreSQL

1. Gere hash da senha:
```bash
node -e "console.log(require('bcryptjs').hashSync('12345',10))"
```

2. No DBeaver (ou psql), execute:
```sql
INSERT INTO users (name, email, password_hash)
VALUES ('Cliente', 'zaqviana@gmail.com', '$2a$10...hash...')
ON CONFLICT (email) DO NOTHING;
```

## 6) Observacao importante

As tabelas `users` e `app_states` sao criadas automaticamente ao iniciar o backend.
