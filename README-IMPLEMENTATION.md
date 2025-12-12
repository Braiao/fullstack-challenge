# Sistema de Gestão de Tarefas Colaborativo - Implementação

## Arquitetura

```
┌─────────────┐
│   Frontend  │ (React + TanStack Router + shadcn/ui)
│   :3000     │
└──────┬──────┘
       │
       ↓
┌─────────────┐       ┌──────────────┐
│ API Gateway │◄──────┤  RabbitMQ    │
│   :3001     │       │  :5672       │
└──────┬──────┘       └──────┬───────┘
       │                     │
       ├────────────────┬────┴──────┬──────────────┐
       ↓                ↓           ↓              ↓
┌─────────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐
│Auth Service │  │  Tasks   │  │Notifs  │  │  PostgreSQL  │
│   :3002     │  │ Service  │  │Service │  │    :5432     │
└─────────────┘  │  :3003   │  │ :3004  │  └──────────────┘
                 └──────────┘  └────────┘
                                    │
                                    ↓
                              WebSocket :3004
```

## Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **TanStack Router** para roteamento
- **TanStack Query** para gerenciamento de estado servidor
- **shadcn/ui** + **Tailwind CSS** para UI
- **Zustand** para estado global (autenticação)
- **React Hook Form** + **Zod** para validação
- **Socket.io Client** para WebSocket
- **Vite** como bundler

### Backend
- **Nest.js** com TypeScript
- **TypeORM** com PostgreSQL
- **RabbitMQ** para comunicação entre microserviços
- **JWT** + **Passport** para autenticação
- **Bcrypt** para hash de senhas
- **Swagger** para documentação da API
- **Rate Limiting** (10 req/s)

### Infraestrutura
- **Docker** + **Docker Compose**
- **Turborepo** para monorepo
- **PostgreSQL 17**
- **RabbitMQ 3.13**

## Como Executar

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- npm 10+

### Instalação

1. Clone o repositório
```bash
git clone <repo-url>
cd fullstack-challenge
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional, já há valores padrão)
```bash
# Cada app tem um .env.example que pode ser copiado para .env
cp apps/web/.env.example apps/web/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/tasks-service/.env.example apps/tasks-service/.env
cp apps/notifications-service/.env.example apps/notifications-service/.env
```

4. Inicie todos os serviços com Docker Compose
```bash
docker-compose up
```

5. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001
- **Swagger Documentation**: http://localhost:3001/api/docs
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

### Desenvolvimento Local (sem Docker)

1. Inicie o PostgreSQL e RabbitMQ
```bash
docker-compose up db rabbitmq
```

2. Em terminais separados:
```bash
# Terminal 1 - Auth Service
cd apps/auth-service
npm run dev

# Terminal 2 - Tasks Service
cd apps/tasks-service
npm run dev

# Terminal 3 - Notifications Service
cd apps/notifications-service
npm run dev

# Terminal 4 - API Gateway
cd apps/api-gateway
npm run dev

# Terminal 5 - Frontend
cd apps/web
npm run dev
```

## Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro de usuário (email, username, password)
- ✅ Login com JWT
- ✅ Access Token (15 min) e Refresh Token (7 dias)
- ✅ Endpoint de refresh token
- ✅ Hash de senha com bcrypt
- ✅ Proteção de rotas com Guards

### Tarefas
- ✅ CRUD completo de tarefas
- ✅ Campos: título, descrição, prazo, prioridade (LOW, MEDIUM, HIGH, URGENT), status (TODO, IN_PROGRESS, REVIEW, DONE)
- ✅ Atribuição a múltiplos usuários
- ✅ Paginação (página e tamanho configuráveis)
- ✅ Filtros de busca

### Comentários
- ✅ Criar comentários em tarefas
- ✅ Listar comentários com paginação
- ✅ Associação com usuário autor

### Histórico de Alterações
- ✅ Registro automático de todas as mudanças em tarefas
- ✅ Armazena: campo alterado, valor antigo, valor novo, quem alterou e quando
- ✅ Auditoria completa

### Notificações em Tempo Real
- ✅ WebSocket com Socket.io
- ✅ Eventos: task:created, task:updated, comment:new
- ✅ Notificações persistidas no banco
- ✅ Integração via RabbitMQ

### API Gateway
- ✅ Documentação Swagger completa
- ✅ Rate limiting (10 req/s)
- ✅ Proxy para microserviços
- ✅ Validação com DTOs

### Frontend
- ✅ Página de Login/Registro (modal)
- ✅ Lista de tarefas com paginação
- ✅ Criação de tarefas
- ✅ Detalhes da tarefa
- ✅ Edição e exclusão de tarefas
- ✅ Sistema de comentários
- ✅ Notificações toast em tempo real
- ✅ Loading states com skeletons
- ✅ Validação de formulários
- ✅ Design responsivo

## Decisões Técnicas

### Monorepo com Turborepo
Escolhi Turborepo pela simplicidade e performance no gerenciamento de múltiplos pacotes. Permite compartilhar código (types, utils) facilmente entre frontend e backend.

### Microserviços com RabbitMQ
Separei as responsabilidades em serviços independentes que se comunicam via mensageria, permitindo escalabilidade e manutenção independente de cada serviço.

### TanStack Router
Escolhido por ser type-safe e moderno, com suporte a code-splitting automático e melhor DX comparado ao React Router.

### shadcn/ui
Componentes copiáveis ao invés de biblioteca npm, permitindo total customização e sem dependência externa pesada.

### TypeORM
ORM maduro e bem integrado com Nest.js, com suporte a migrations e queries complexas.

## Trade-offs

### Synchronize: true em desenvolvimento
Para facilitar o desenvolvimento, usei `synchronize: true` no TypeORM. Em produção, seria necessário usar migrations adequadamente.

### Autenticação simplificada
Não implementei reset de senha, 2FA ou OAuth, focando nas funcionalidades core solicitadas.

### WebSocket sem autenticação JWT
O WebSocket usa um sistema simples de autenticação por userId. Em produção, seria necessário validar JWT no handshake.

### Sem testes
Por questão de tempo, não implementei testes unitários ou e2e, mas a arquitetura está preparada para isso.

## Problemas Conhecidos

1. **Validação de assigneeIds**: Não valida se os IDs dos usuários existem antes de atribuir
2. **Paginação no frontend**: Não persiste o estado da página ao navegar entre rotas
3. **Refresh token**: Não implementei renovação automática do access token quando expira
4. **Tratamento de erros**: Poderia ser mais granular e específico
5. **Logs**: Não implementei sistema de logging estruturado (Winston/Pino)
6. **Health checks**: Não implementei endpoints de health check para os serviços

## O que Melhoraria

1. **Testes**: Adicionar testes unitários e e2e com Jest e Playwright
2. **CI/CD**: Setup de pipeline com GitHub Actions
3. **Monitoring**: Adicionar Prometheus e Grafana para métricas
4. **Logging**: Implementar Winston ou Pino com agregação centralizada
5. **Validações**: Validações mais robustas de dados
6. **Performance**: Cache com Redis, otimização de queries
7. **Security**: CSP headers, CORS mais restritivo, rate limiting por usuário
8. **UX**: Loading states melhores, infinite scroll, drag & drop
9. **Migrations**: Criar migrations TypeORM adequadas
10. **Documentation**: JSDoc nos componentes e serviços

## Tempo Gasto

- Setup do monorepo e configuração: 1h
- Packages compartilhados: 30min
- Auth Service: 1h
- Tasks Service: 1.5h
- Notifications Service: 1h
- API Gateway: 1h
- Frontend (componentes UI): 2h
- Frontend (páginas e lógica): 2h
- Docker e docker-compose: 1h
- **Total: ~11 horas**

## Comandos Úteis

```bash
# Rodar tudo
docker-compose up

# Rodar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Limpar volumes (atenção: apaga dados)
docker-compose down -v

# Rebuild de imagens
docker-compose up --build

# Rodar apenas o frontend localmente
cd apps/web && npm run dev

# Acessar bash do container
docker exec -it api-gateway sh

# Ver filas do RabbitMQ
# Acesse http://localhost:15672 (admin/admin)
```

## Estrutura de Pastas

```
fullstack-challenge/
├── apps/
│   ├── web/                    # Frontend React
│   ├── api-gateway/            # Gateway HTTP
│   ├── auth-service/           # Microserviço de autenticação
│   ├── tasks-service/          # Microserviço de tarefas
│   └── notifications-service/  # Microserviço de notificações
├── packages/
│   ├── types/                  # Tipos compartilhados
│   ├── utils/                  # Utilitários compartilhados
│   ├── tsconfig/               # Configs TS compartilhadas
│   └── eslint-config/          # Configs ESLint compartilhadas
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Contato

Para dúvidas ou esclarecimentos sobre a implementação, entre em contato através do recrutador.
