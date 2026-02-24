# PulseBoard Backend (PostgreSQL)

Backend com:
- login por email/senha
- cadastro publico desabilitado
- estado do app salvo por usuario
- Jarvis com IA usando contexto real do usuario
- banco PostgreSQL

## 1) Instalacao

```bash
cd backend
npm install
```

## 2) Ambientes (`producao` e `local`)

O backend carrega `.env` por padrao.
Se quiser alternar sem trocar arquivo, use `ENV_FILE`.

- Producao (Render): mantenha variaveis no painel da plataforma.
- Local (teste): use um arquivo separado, por exemplo `.env.local`.

Crie o arquivo local:

```powershell
Copy-Item .env.local.example .env.local
```

## 3) Rodar local para desenvolvimento

```powershell
$env:ENV_FILE=".env.local"
npm run dev
```

Servidor local: `http://localhost:8787`

No frontend, abrindo por `localhost` ou `127.0.0.1`, ele ja usa o backend local automaticamente.

## 4) CORS

`ALLOWED_ORIGIN` aceita:
- origem unica: `http://127.0.0.1:5500`
- varias origens separadas por virgula:
  `http://127.0.0.1:5500,http://localhost:5500,http://localhost:5173`
- `*` (ou vazio) para liberar geral

## 5) Endpoints

### Auth
- `POST /api/auth/register` -> `403` (desabilitado)
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

### Estado do app
- `GET /api/state` (Bearer token)
- `PUT /api/state` (Bearer token)

### Jarvis
- `POST /api/jarvis` (Bearer token)

## 6) Criar usuario manual no PostgreSQL

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

## 7) Observacao importante

As tabelas `users` e `app_states` sao criadas automaticamente ao iniciar o backend.
