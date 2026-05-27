# Fenix Frontend

Interface administrativa para o sistema de gestão de reservas de quadras esportivas.

**Stack:** Angular 21 · Angular Material 21 · FullCalendar · TypeScript · SCSS

> Repositório companion (backend): https://github.com/guth-dev/fenix-backend

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- Backend Fenix rodando em `http://localhost:8080`

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

### 3. Configure o ambiente

O arquivo `src/environments/environment.ts` aponta para a URL do backend:

```ts
export const environment = {
  apiUrl: 'http://localhost:8080'
};
```

Altere `apiUrl` caso o backend esteja em outro endereço.

### 4. Inicie o servidor de desenvolvimento

```bash
npm start
```

A aplicação estará disponível em: `http://localhost:4200`

### 5. Rode os testes

```bash
npm test
```

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação do administrador com aceite obrigatório dos Termos de Uso |
| `/dashboard` | KPIs (clientes ativos, quadras, reservas confirmadas) + últimas reservas com filtros de período e status |
| `/clients` | Listagem, cadastro e edição de clientes |
| `/courts` | Listagem, cadastro e edição de quadras |
| `/bookings` | Listagem de reservas com filtros de período, status e quadra; visualização em tabela e calendário |

> Todas as rotas exceto `/login` são protegidas por `authGuard` e exigem autenticação.

---

## Autenticação

O token JWT retornado pelo login é armazenado no `localStorage` sob a chave `fenix_token`.  
O `authInterceptor` o anexa automaticamente como `Authorization: Bearer <token>` em todas as requisições.  
Qualquer resposta `401` do backend dispara o logout automático e redireciona para `/login`.

---

## Ordem de execução

1. Inicie o MySQL
2. Inicie o **backend** (`fenix-backend`)
3. Inicie o **frontend** (`fenix-frontend`)
4. Acesse `http://localhost:4200`

---

## Credenciais padrão

| Campo | Valor |
|-------|-------|
| Email | `admin@fenix.com` |
| Senha | `admin123` |

> As credenciais são criadas automaticamente pelo backend na primeira execução.
