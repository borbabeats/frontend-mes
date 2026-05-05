# Documentação do Projeto MES Frontend

## Visão Geral do Projeto

O **MES Frontend** é uma aplicação web moderna e completa para **Sistema de Execução Manufatureira (Manufacturing Execution System - MES)**, desenvolvida para gerenciar e otimizar processos produtivos em ambientes industriais. O sistema oferece controle total sobre a produção, desde o planejamento até a execução e monitoramento em tempo real.

### Propósito Principal

- **Gerenciamento de Produção**: Controlar ordens de produção, apontamentos e eficiência operacional
- **Monitoramento em Tempo Real**: Dashboard com KPIs e indicadores críticos de produção
- **Controle de Qualidade**: Acompanhamento de defeitos e conformidade
- **Gestão de Recursos**: Monitoramento de máquinas, setores e operadores
- **Tomada de Decisão**: Dados analíticos para suporte à gestão

---

## Arquitetura do Sistema

### Arquitetura Geral

O projeto segue uma **arquitetura moderna baseada em componentes** com separação clara de responsabilidades:

```
Frontend (Next.js + Refine)
    ↓ API REST
Backend (Node.js/Express)
    ↓
Banco de Dados
```

### Estrutura de Pastas

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── dashboard/         # Dashboard principal com KPIs
│   ├── apontamentos/      # Sistema de apontamentos de produção
│   ├── ordens-producao/   # Gestão de Ordens de Produção (OPs)
│   ├── maquinas/          # Cadastro e gestão de máquinas
│   ├── setores/           # Gestão de setores produtivos
│   ├── manutencoes/       # Controle de manutenções
│   └── usuarios/          # Gestão de usuários e permissões
├── components/
│   └── dashboard/         # Componentes especializados do dashboard
├── services/              # Camada de serviços de API
├── providers/             # Providers do Refine e contexto
├── utils/                 # Utilitários e funções auxiliares
├── validations/           # Esquemas de validação
├── types/                 # Definições de tipos TypeScript
└── interfaces/            # Interfaces e contratos
```

### Padrões Arquitetônicos

- **Component-Based**: Interface construída com componentes reutilizáveis
- **Service Layer**: Abstração das chamadas de API através de serviços
- **Type Safety**: TypeScript para tipagem forte e segurança
- **State Management**: Gerenciamento de estado via Refine e hooks React
- **Error Boundaries**: Tratamento robusto de erros na UI

---

## Stack Tecnológico

### Frameworks Principais

- **Next.js 15.2.4**: Framework React com App Router
- **React 19.1.0**: Biblioteca principal para construção de UI
- **Refine 5.0.8**: Framework headless para aplicações enterprise

### UI e Design

- **Material-UI (MUI) 6.1.7**: Biblioteca de componentes de design
- **Emotion**: Engine de CSS-in-JS para estilização
- **Sass 1.97.2**: Pré-processador CSS para estilos avançados

### Autenticação e Segurança

- **NextAuth.js 4.24.13**: Gerenciamento de autenticação
- **@auth/core**: Core de autenticação
- **js-cookie**: Gerenciamento de cookies

### Validação e Forms

- **React Hook Form 7.55.0**: Gerenciamento de formulários
- **Zod 4.3.5**: Validação de esquemas TypeScript-first
- **@hookform/resolvers**: Integração entre React Hook Form e Zod

### Comunicação e Dados

- **Axios 1.13.2**: Cliente HTTP para chamadas de API
- **Recharts 3.8.1**: Biblioteca para gráficos e visualizações

### Desenvolvimento

- **TypeScript 5.8.3**: Superset tipado do JavaScript
- **ESLint**: Linting e qualidade de código
- **Cross-env**: Variáveis de ambiente cross-platform

---

## Funcionalidades Principais

### 1. Dashboard Interativo

**Visão Geral**: Painel central com indicadores em tempo real

- **KPIs de Produção**: OPs ativas, produção do dia, eficiência global, taxa de defeitos
- **KPIs de Qualidade**: Índice de qualidade, rejeições, conformidade
- **KPIs de Recursos**: Máquinas ativas, OEE, disponibilidade
- **KPIs de Prazos**: OPs em atraso, cumprimento de prazos, tempo médio de ciclo

**Gráficos e Visualizações**:
- Produção diária (planejado vs realizado)
- Produção por setor
- Status das OPs
- Tendência de qualidade
- OEE em tempo real
- Top produtos
- Produção por turno

**Alertas e Metas**:
- Alertas críticos em tempo real
- Metas do dia com progresso
- Eficiência por operador

### 2. Sistema de Apontamentos

**Conceito**: Registro detalhado de eventos de produção

**Regras de Negócio**:
- **Vinculação Obrigatória**: Todo apontamento deve estar vinculado a uma Ordem de Produção
- **Registro de Operador**: Apontamento automaticamente associado ao usuário logado
- **Controle de Tempo**: Registro obrigatório de data/hora de início
- **Quantidades**: Controle de produção e defeitos
- **Status Automático**: Apontamentos podem ser "EM ANDAMENTO" ou "CONCLUÍDOS"

**Campos Essenciais**:
- Ordem de Produção (OP) - Obrigatório
- Máquina - Obrigatório  
- Operador - Automático (usuário logado)
- Data/Hora Início - Obrigatório
- Data/Hora Fim - Opcional
- Quantidade Produzida - Padrão 0
- Quantidade com Defeito - Padrão 0

**Fluxo de Trabalho**:
1. Operador seleciona a OP e máquina
2. Sistema registra data/hora de início automaticamente
3. Durante a produção, quantidades são atualizadas
4. Ao finalizar, apontamento é marcado como concluído

### 3. Gestão de Ordens de Produção (OPs)

**Ciclo de Vida**:
- **RASCUNHO** → **PLANEJADA** → **EM_ANDAMENTO** → **PAUSADA** → **FINALIZADA**/**CANCELADA**

**Regras de Status**:
- **Transições Controladas**: Mudanças de status seguem máquina de estados
- **Permissões por Role**: Cada role pode realizar transições específicas
- **Status ATRASADA**: Calculado automaticamente baseado no prazo
- **Finalização**: Requer quantidade produzida ≥ quantidade planejada

**Controles**:
- Progresso de produção em tempo real
- Controle de prazos planejados vs reais
- Priorização por nível de urgência
- Vinculação com apontamentos

### 4. Gestão de Máquinas e Setores

**Cadastro de Máquinas**:
- Nome e identificação
- Setor de pertencimento
- Status operacional (Disponível, Em Uso, Manutenção, Inativa, Parada, Desativada)
- Histórico de utilização

**Gestão de Setores**:
- Organização por áreas produtivas
- Vinculação com máquinas
- Análise de eficiência por setor

### 5. Controle de Usuários e Permissões

**Roles do Sistema**:
- **ADMIN**: Controle total do sistema
- **GERENTE**: Gestão operacional e aprovações
- **OPERADOR**: Execução de apontamentos e produção
- **PLANEJAMENTO**: Criação e planejamento de OPs

**Controle de Acesso**:
- Autenticação via NextAuth
- Sessão gerenciada por cookies
- Permissões granulares por funcionalidade

---

## Regras de Negócio Detalhadas

### Sistema de Apontamentos

**1. Criação de Apontamento**
- Todo apontamento deve ter uma OP válida
- Máquina deve estar disponível/ativa
- Operador é o usuário logado (não pode ser alterado)
- Data/hora início é obrigatória
- Quantidades não podem ser negativas

**2. Finalização de Apontamento**
- Apenas apontamentos "EM ANDAMENTO" podem ser finalizados
- Data/hora fim é registrada automaticamente
- Quantidades finais são consolidadas
- Apontamento passa para status "CONCLUÍDO"

**3. Validações de Negócio**
- Máquina não pode ter múltiplos apontamentos simultâneos
- OP deve estar em status "EM_ANDAMENTO" para receber apontamentos
- Quantidade de defeitos não pode exceder quantidade produzida

### Máquina de Estados das OPs

**Transições Permitidas**:
```
RASCUNHO → PLANEJADA (Admin, Gerente, Planejamento)
RASCUNHO → CANCELADA (Admin, Gerente)

PLANEJADA → EM_ANDAMENTO (Admin, Gerente, Operador)
PLANEJADA → CANCELADA (Admin, Gerente)

EM_ANDAMENTO → PAUSADA (Admin, Gerente, Operador)
EM_ANDAMENTO → FINALIZADA (Admin, Gerente, Operador*)¹
EM_ANDAMENTO → CANCELADA (Admin, Gerente)

PAUSADA → EM_ANDAMENTO (Admin, Gerente, Operador)
PAUSADA → FINALIZADA (Admin, Gerente*)¹
PAUSADA → CANCELADA (Admin, Gerente)

FINALIZADA → CANCELADA (Admin apenas)
```

¹ *Regra especial: Quantidade produzida deve ser ≥ quantidade planejada*

**Status ATRASADA**:
- É um estado calculado, não pode ser manualmente alterado
- Verifica automaticamente se data fim planejada < data atual
- Aplica-se apenas a OPs não finalizadas/canceladas

### Cálculos e KPIs

**1. OEE (Overall Equipment Effectiveness)**
```
OEE = Disponibilidade × Performance × Qualidade

Disponibilidade = Tempo Produção / Tempo Programado
Performance = Tempo Real Ciclo / Tempo Ideal Ciclo  
Qualidade = Unidades Boas / Unidades Totais
```

**2. Eficiência Global**
```
Eficiência = (Quantidade Produzida / Quantidade Planejada) × 100
```

**3. Taxa de Defeitos**
```
Taxa Defeitos = (Quantidade Defeitos / Quantidade Produzida) × 100
```

**4. Progresso da OP**
```
Progresso = (Quantidade Produzida / Quantidade Planejada) × 100
```

---

## Integrações e APIs

### Endpoints Principais

**Dashboard**:
- `GET /dashboard/kpis/producao` - KPIs de produção
- `GET /dashboard/kpis/qualidade` - KPIs de qualidade
- `GET /dashboard/kpis/recursos` - KPIs de recursos
- `GET /dashboard/kpis/prazos` - KPIs de prazos
- `GET /dashboard/graficos/producao-diaria` - Gráfico produção
- `GET /dashboard/graficos/status-ops` - Status das OPs
- `GET /dashboard/alertas/criticos` - Alertas em tempo real
- `GET /dashboard/metas/dia` - Metas do dia

**Recursos**:
- `GET /apontamentos` - Lista de apontamentos
- `POST /apontamentos` - Criar apontamento
- `POST /apontamentos/:id/finalize` - Finalizar apontamento
- `GET /ordens-producao` - Ordens de produção
- `POST /ordens-producao` - Criar OP
- `PATCH /ordens-producao/:id/status` - Alterar status OP
- `GET /maquinas` - Máquinas
- `GET /setores` - Setores
- `GET /usuarios` - Usuários

### Autenticação

**NextAuth Configuration**:
- Provider customizado para integração com backend
- Tokens JWT para sessão
- Refresh automático de tokens
- Logout e expiração gerenciados

---

## Deployment e Produção

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Segredo do NextAuth | obrigatório |
| `NEXTAUTH_URL` | URL da aplicação | `http://localhost:3000` |

### Build e Produção

```bash
# Build para produção
npm run build

# Servidor de produção
npm start

# Verificação de build
npm run lint
```

---

## Considerações Técnicas

### Performance

- **Server-Side Rendering**: Next.js com App Router
- **Code Splitting**: Automático por rota e componente
- **Lazy Loading**: Componentes e gráficos carregados sob demanda
- **Cache de API**: Implementação de cache inteligente

### Segurança

- **HTTPS**: Obrigatório em produção
- **CORS**: Configurado para API backend
- **Input Validation**: Zod para validação client-side
- **XSS Protection**: Proteções nativas do Next.js

### Escalabilidade

- **Componentização**: Reutilização máxima de componentes
- **Service Layer**: Facilidade para mudar de API
- **Type Safety**: TypeScript previne bugs em runtime
- **Error Boundaries**: Tratamento graceful de erros

---

## Próximos Passos e Evoluções

### Roadmap Futuro

1. **Real-time Updates**: WebSocket para atualizações em tempo real
2. **Mobile First**: Versão otimizada para dispositivos móveis
3. **Offline Support**: Service Workers para funcionamento offline
4. **Advanced Analytics**: Machine learning para previsões
5. **Integration Hub**: Conectores com ERP e outros sistemas

### Melhorias Técnicas

- **Micro-frontends**: Divisão por domínios de negócio
- **PWA**: Progressive Web App capabilities
- **Performance Monitoring**: Integração com APM tools
- **Testing Suite**: Testes E2E e unitários automatizados

---

## Conclusão

O MES Frontend representa uma solução moderna e robusta para gestão manufatureira, combinando as melhores práticas de desenvolvimento web com necessidades específicas do ambiente industrial. A arquitetura escalável, a interface intuitiva e as regras de negócio bem definidas fazem deste sistema uma ferramenta poderosa para otimização de processos produtivos.

A implementação com tecnologias atuais como Next.js, Refine e Material-UI garante não apenas a qualidade técnica, mas também a manutenibilidade e evolução futura do sistema, posicionando-o como uma solução enterprise-ready para o mercado manufatureiro.
