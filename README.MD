# MES Frontend - Sistema de Execução Manufatureira

<div align="center" style="margin: 30px;">
    <img alt="MES Logo" src="https://img.icons8.com/color/96/000000/factory.png">
    <h3>Sistema de Execução Manufatureira (MES)</h3>
</div>
<br/>

Frontend moderno para Sistema de Execução Manufatureira (MES) construído com [Refine](https://github.com/refinedev/refine), Next.js e Material-UI.

## **Visão Geral**

O MES Frontend é uma aplicação web completa para gerenciamento de processos manufatureiros, incluindo:

- **Dashboard Interativo** com KPIs em tempo real
- **Monitoramento de Produção** e apontamentos
- **Gestão de Ordens de Produção** (OPs)
- **Controle de Máquinas e Equipamentos**
- **Gestão de Setores e Manutenções**
- **Controle de Usuários e Permissões**

## **Tecnologias**

- **Framework**: [Next.js 14](https://nextjs.org/) com App Router
- **UI Framework**: [Refine](https://refine.dev/) + [Material-UI](https://mui.com/)
- **Autenticação**: NextAuth.js
- **Gráficos**: Recharts
- **Linguagem**: TypeScript
- **Estilização**: Material-UI com modo claro/escuro

## **Funcionalidades Principais**

### **Dashboard Completo**
- KPIs de Produção, Qualidade, Recursos e Prazos
- Gráficos interativos (Produção Diária, Por Setor, Status OPs)
- Cards de status em tempo real (Alertas, Metas, Eficiência)
- Atualização automática de dados

### **Gestão de Produção**
- Apontamentos de produção em tempo real
- Ordens de Produção com status tracking
- Monitoramento de eficiência e OEE
- Controle de metas e prazos

## **Instalação**

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend API rodando (porta 3001 por padrão)

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/borbabeats/frontend-mes.git
   cd frontend-mes
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

Acesse: http://localhost:3000

## **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Linting do código
```

## **Variáveis de Ambiente**

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Segredo do NextAuth | obrigatório |
| `NEXTAUTH_URL` | URL da aplicação | `http://localhost:3000` |

## **Estrutura do Projeto**

```
src/
├── app/                    # Páginas Next.js
│   ├── dashboard/         # Dashboard com KPIs
│   ├── apontamentos/      # Monitoramento
│   ├── ordens-producao/   # OPs
│   ├── maquinas/          # Máquinas
│   ├── setores/           # Setores
│   ├── manutencoes/       # Manutenções
│   └── usuarios/          # Usuários
├── components/
│   └── dashboard/         # Componentes do dashboard
├── services/              # Serviços de API
└── providers/             # Providers Refine
```

## **Deploy**

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

### Produção
```bash
npm run build
npm start
```

## **Endpoints da API**

### Dashboard
- `GET /dashboard/kpis/producao` - KPIs de produção
- `GET /dashboard/kpis/qualidade` - KPIs de qualidade
- `GET /dashboard/kpis/recursos` - KPIs de recursos
- `GET /dashboard/kpis/prazos` - KPIs de prazos
- `GET /dashboard/graficos/producao-diaria` - Gráfico produção
- `GET /dashboard/graficos/status-ops` - Status das OPs
- `GET /dashboard/alertas/criticos` - Alertas em tempo real
- `GET /dashboard/metas/dia` - Metas do dia

### Recursos
- `GET /apontamentos` - Apontamentos
- `GET /ordens-producao` - Ordens de produção
- `GET /maquinas` - Máquinas
- `GET /setores` - Setores
- `GET /manutencoes` - Manutenções
- `GET /usuarios` - Usuários

## **Documentação Adicional**

- [Refine Docs](https://refine.dev/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Material-UI Docs](https://mui.com/material-ui/getting-started/)

## **Licença**

MIT
