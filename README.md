# Fenix Frontend

Interface web para o sistema de gestão de reservas de quadras esportivas.

**Stack:** Angular 21 · Angular Material 21 · TypeScript · SCSS

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)

---

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/guth-dev/fenix-frontend.git
cd fenix-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute a aplicação

```bash
npx ng serve
```

A aplicação estará disponível em: `http://localhost:4200`

> O backend deve estar rodando em `http://localhost:8080` antes de abrir o frontend.

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação do admin |
| `/dashboard` | Visão geral — KPIs e últimas reservas |
| `/clients` | Gestão de clientes |
| `/courts` | Gestão de quadras |
| `/bookings` | Gestão de reservas |

---

## Ordem de execução

1. Inicie o MySQL
2. Inicie o **backend** (`fenix-backend`)
3. Inicie o **frontend** (`fenix-frontend`)
4. Acesse `http://localhost:4200`
