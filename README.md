# better-auth 🔐

<p align="center">
    <img src="./web/public/img/logo-dark.svg" width="80" alt="ai logo" />
</p>

<h3 align="center">
    Authentication platform built with Better Auth, Elysia and Angular.
</h3>

<p align="center">
    Modern authentication boilerplate with email/password, OAuth, session management and organization support.
</p>

<p align="center">
    <img src="./preview.png" width="800" alt="preview" />
</p>

---

## 📚 Conteúdo

- [Visão geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Docker](#-rodando-com-docker-)
- [Configurações](#️-configurações)
- [Licença](#-licença)

---

## 🔎 Visão geral

`better-auth` é um boilerplate de autenticação full-stack pronto para uso, combinando **Bun + Elysia** no backend e **Angular** no frontend, com [Better Auth](https://www.better-auth.com/) cuidando de todo o fluxo de autenticação (e-mail/senha, OAuth, sessões e organizações).

O objetivo é servir como ponto de partida para novos projetos que precisem de autenticação robusta sem reescrever essa camada do zero.

---

## ✨ Funcionalidades

- ✅ Login com e-mail e senha
- ✅ Cadastro de usuário
- ✅ Recuperação de senha
- ✅ Verificação de e-mail
- ✅ Login com Google
- ✅ Sessões persistentes
- ✅ Backend OpenAPI
- ✅ Docker Ready

---

## ✨ Tecnologias

### Backend (`api`)

- [Bun](https://bun.sh/) — runtime
- [Elysia](https://elysiajs.com/) — framework HTTP
- [Better Auth](https://www.better-auth.com/) — autenticação
- [Drizzle ORM](https://orm.drizzle.team/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — banco de dados
- [Redis](https://redis.io/) — cache / sessão (secondary storage do Better Auth)
- [Resend](https://resend.com/) — envio de e-mails (verificação de conta e reset de senha)
- [Zod](https://zod.dev/) — validação de schemas
- [Biome](https://biomejs.dev/) — lint/format

### Frontend (`web`)

- [Angular](https://angular.io/)
- [AiUi Design](https://ai-ui.aiandralves.com.br/)
- [NGXS](https://www.ngxs.io/) — gerenciamento de estado
- [Better Auth](https://www.better-auth.com/) (client)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)

---

## 📁 Estrutura do projeto

```
.
better-auth
│
├── api
│   ├── src
│   ├── drizzle
│   └── Dockerfile
│
├── web
│   ├── src
│   ├── public
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## ✅ Pré-requisitos

- [Bun](https://bun.sh/) `>= 1.x`
- [Node.js](https://nodejs.org/) `>= 20` e [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) e Docker Compose (para banco/redis ou para rodar tudo containerizado)
- Uma conta no [Resend](https://resend.com/) (envio de e-mail)
- Um projeto no [Google Cloud Console](https://console.cloud.google.com/) (login social com Google)

---

## 🚀 Instalação

Você pode rodar o projeto de duas formas: **manualmente** (Bun/Node local) ou **via Docker** (projeto completo). Em ambos os casos, comece configurando as variáveis de ambiente da API.

### 1. Configurar variáveis de ambiente

Copie o arquivo de exemplo da API:

```bash
cd api
cp .env.example .env
```

Preencha o `.env` conforme a seção [⚙️ Configurações](#️-configurações) abaixo.

### 2. Instalação manual

#### Backend (`api`)

```bash
cd api

# instalar dependências
bun install

# subir Postgres e Redis (via docker-compose já existente na pasta api)
docker compose up -d

# rodar as migrations do banco
bun run db:migrate

# subir a API em modo dev (com watch)
bun run dev
```

A API sobe por padrão em `http://localhost:3000`.

Outros scripts úteis:

```bash
bun run db:generate    # gera novas migrations a partir do schema (src/db/schema)
bun run studio         # abre o Drizzle Studio para visualizar o banco
bun run format         # formata o código com Biome
```

#### Frontend (`web`)

```bash
cd web

# instalar dependências
npm install

# subir o frontend em modo dev
npm run dev
```

O frontend sobe por padrão em `http://localhost:4201`.

Outros scripts úteis:

```bash
npm run build        # build de produção (dist/project/browser)
npm run lint         # lint
npm run lint:fix     # lint + fix + prettier
```

### 3. Rodando tudo com Docker 🐳

Na raiz do projeto existe um `docker-compose.yml` que sobe **API + Web + Postgres + Redis + RedisInsight** de uma vez, sem precisar instalar Bun ou Node localmente.

> Antes de subir, certifique-se de que `api/.env` está preenchido (veja a seção [⚙️ Configurações](#️-configurações)). O `DATABASE_URL` e as variáveis de Redis são sobrescritas automaticamente pelo compose para apontar para os containers `postgres` e `redis`.

```bash
# na raiz do repositório
docker compose up -d --build
```

Serviços disponíveis:

| Serviço        | URL                           |
| -------------- | ----------------------------- |
| Web (frontend) | http://localhost:4201         |
| API (backend)  | http://localhost:3000         |
| OpenAPI docs   | http://localhost:3000/openapi |
| Postgres       | localhost:65432               |
| Redis          | localhost:6379                |
| RedisInsight   | http://localhost:5540         |

Depois de subir os containers pela primeira vez, rode as migrations dentro do container da API:

```bash
docker compose exec api bun run db:migrate
```

Para derrubar tudo:

```bash
docker compose down
```

---

## ⚙️ Configurações

Todas as variáveis abaixo ficam em `api/.env` (veja `api/.env.example`).

### 1. Banco de dados (PostgreSQL)

```env
DATABASE_URL="postgresql://docker:docker@localhost:65432/ai_auth"
```

- Se estiver usando o `docker-compose.yml` (da raiz ou o de `api/`), o usuário/senha/banco padrão já são `docker` / `docker` / `ai_auth`, e a porta exposta é `65432`.
- Se for usar um Postgres próprio, ajuste a string de conexão conforme seu ambiente.
- Após configurar, rode as migrations:

```bash
bun run db:migrate
```

### 2. Better Auth

```env
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL=""
```

- `BETTER_AUTH_SECRET`: uma string aleatória e secreta usada para assinar sessões/tokens. Gere uma com:

```bash
openssl rand -hex 32
```

- `BETTER_AUTH_URL`: URL pública onde a API roda (ex.: `http://localhost:3000` em desenvolvimento).

### 3. Login social com Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ou selecione um existente).
3. Vá em **APIs e Serviços → Tela de consentimento OAuth** e configure o app (nome, e-mail de suporte, escopos básicos `email` e `profile`).
4. Vá em **APIs e Serviços → Credenciais → Criar credenciais → ID do cliente OAuth**.
5. Tipo de aplicativo: **Aplicativo da Web**.
6. Em **Origens JavaScript autorizadas**, adicione:
   - `http://localhost:3000`
   - `http://localhost:4201`
7. Em **URIs de redirecionamento autorizados**, adicione:
   - `http://localhost:3000/auth/callback/google`
8. Copie o **Client ID** e o **Client Secret** gerados e preencha:

```env
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

> Em produção, repita o processo adicionando a URL real do domínio nas origens e no redirecionamento (`https://sua-api.com/auth/callback/google`).

### 4. Envio de e-mail (Resend)

O envio de e-mails (verificação de conta e redefinição de senha) usa a [Resend](https://resend.com/).

1. Crie uma conta em [resend.com](https://resend.com/).
2. Cadastre e verifique um domínio em **Domains** (ou use o domínio de testes fornecido pela Resend enquanto desenvolve).
3. Gere uma API Key em **API Keys → Create API Key**.
4. Preencha no `.env`:

```env
DEFAULT_MAIL_FROM="Nome do App <naoresponda@seudominio.com>"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

> `DEFAULT_MAIL_FROM` precisa ser um remetente de um domínio verificado na Resend.

### 5. Redis

```env
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

Usado como `secondaryStorage` do Better Auth (cache de sessão). Se estiver usando o `docker-compose.yml`, os valores padrão já funcionam.

### 6. Demais variáveis

```env
NODE_ENV=development
PORT=3000
FRONT_URLS="http://localhost:4201,http://localhost:4202"

SESSION_EXPIRES_IN=3600           # duração da sessão, em segundos
SESSION_COOKIE_CACHE_MAX_AGE=300  # cache do cookie de sessão, em segundos
```

- `FRONT_URLS`: lista (separada por vírgula) das origens do frontend permitidas no CORS e como `trustedOrigins` do Better Auth.

### 7. Frontend (`web`)

A URL da API consumida pelo frontend fica em `web/src/environments/environment.development.ts` (dev) e `web/src/environments/environment.ts` (produção):

```ts
export const environment = {
  production: false,
  baseUrl: "http://localhost:4201",
  apiUrl: "http://localhost:3000",
};
```

Ajuste `apiUrl`/`baseUrl` conforme o ambiente antes de buildar para produção.

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT.

---

<p align="center">
    Built with ❤️ using Angular, Better Auth and Elysia.
</p>

<p align="center">
    Made by <a href="https://github.com/aiandralves">Aiandra Alves</a>
</p>
