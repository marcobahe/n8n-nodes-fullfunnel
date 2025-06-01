# n8n-nodes-fullfunnel

![FullFunnel](https://fullfunnel.io/logo.png)

Este é um node personalizado do n8n para integração com a plataforma FullFunnel (GoHighLevel), desenvolvido especialmente para agências que usam a versão white label.

## 🚀 Instalação

### Instalação via Community Nodes

1. No n8n, vá para **Settings** > **Community Nodes**
2. Procure por `n8n-nodes-fullfunnel`
3. Clique em **Install**

### Instalação Manual

```bash
# Para n8n self-hosted
npm install n8n-nodes-fullfunnel

# Ou com Docker
docker exec -it n8n npm install n8n-nodes-fullfunnel
```

## 🔑 Configuração

### 1. Criar Private Integration no FullFunnel/GoHighLevel

1. Acesse sua conta/subconta no FullFunnel
2. Vá para **Settings** > **Integrations** > **Private Integrations**
3. Clique em **Create New Private Integration**
4. Dê um nome e selecione os scopes necessários:
   - `contacts.readonly`
   - `contacts.write`
   - `opportunities.readonly`
   - `opportunities.write`
   - `locations.readonly` (para teste de conexão)
5. Copie o **Access Token** gerado

### 2. Obter Location ID

1. Na mesma tela de configurações
2. Procure por **Location ID** ou **Sub-account ID**
3. Copie este ID

### 3. Configurar Credenciais no n8n

1. No n8n, adicione novas credenciais **FullFunnel API**
2. Preencha:
   - **API Key**: Cole o Access Token do Private Integration
   - **Location ID**: Cole o ID da subconta
   - **API Version**: Mantenha `2021-07-28` (ou a versão mais recente)

## 📦 Nodes Disponíveis

### 1. FullFunnel Contacts

Gerencia contatos na plataforma.

**Operações:**
- ✅ **Create**: Criar novo contato
- 📝 **Update**: Atualizar contato existente
- 🔄 **Upsert**: Criar ou atualizar contato
- 🔍 **Get**: Buscar contato por ID
- 📋 **Get All**: Listar todos os contatos
- ❌ **Delete**: Deletar contato

**Campos Suportados:**
- Informações básicas: email, telefone, nome
- Endereço completo
- Tags
- Custom fields (campos personalizados)
- Source (origem do contato)

### 2. FullFunnel Tags

Gerencia tags dos contatos.

**Operações:**
- ➕ **Add Tags**: Adicionar tags a um contato
- ➖ **Remove Tags**: Remover tags de um contato
- 🔄 **Replace Tags**: Substituir todas as tags
- 📦 **Bulk Add**: Adicionar tags em vários contatos
- 📦 **Bulk Remove**: Remover tags de vários contatos

**Recursos:**
- Normalização automática de tags
- Processamento em lote
- Opções de case sensitivity

### 3. FullFunnel Opportunities

Gerencia oportunidades/negócios.

**Operações:**
- ✅ **Create**: Criar nova oportunidade
- 📝 **Update**: Atualizar oportunidade
- 🔄 **Update Status**: Atualizar apenas status
- 🔍 **Get**: Buscar oportunidade por ID
- 📋 **Get All**: Listar oportunidades
- 🔎 **Search**: Buscar oportunidades com filtros
- ❌ **Delete**: Deletar oportunidade

**Filtros Disponíveis:**
- Pipeline e estágio
- Status (open, won, lost, abandoned)
- Responsável (assignedTo)
- Período (hoje, últimos 7 dias, etc.)
- Contact ID

## 💡 Exemplos de Uso

### Exemplo 1: Criar Contato com Tags

```javascript
// Input
{
  "email": "cliente@exemplo.com",
  "phone": "+5511999999999",
  "additionalFields": {
    "firstName": "João",
    "lastName": "Silva",
    "tags": "lead-quente, webinar-2024",
    "source": "Landing Page"
  }
}
```

### Exemplo 2: Criar Oportunidade

```javascript
// Input
{
  "pipelineId": "abc123",
  "pipelineStageId": "stage456",
  "contactId": "contact789",
  "name": "Nova Venda - João Silva",
  "monetaryValue": 5000,
  "additionalFields": {
    "status": "open",
    "source": "Indicação",
    "tags": "prioridade-alta"
  }
}
```

### Exemplo 3: Buscar Contatos com Filtros

```javascript
// Configuração
{
  "operation": "getAll",
  "filters": {
    "query": "gmail.com",
    "tags": "cliente-ativo"
  },
  "limit": 50
}
```

## 🔧 Troubleshooting

### Erro 401 - Unauthorized
- Verifique se o token está correto
- Confirme se o Private Integration está ativo
- Verifique se os scopes necessários foram selecionados

### Erro 404 - Not Found
- Confirme se o Location ID está correto
- Verifique se o ID do recurso (contato/oportunidade) existe

### Erro 422 - Unprocessable Entity
- Verifique os campos obrigatórios
- Confirme o formato dos dados (especialmente telefone e email)

### Rate Limiting
- Limite: 100 requisições por 10 segundos
- Implemente delays entre requisições em massa

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
n8n-nodes-fullfunnel/
├── credentials/
│   └── FullFunnelApi.credentials.ts
├── nodes/
│   └── FullFunnel/
│       ├── FullFunnel.node.ts
│       ├── FullFunnelTags.node.ts
│       └── FullFunnelOpportunities.node.ts
├── package.json
└── README.md
```

### Adicionar Novos Endpoints

1. Crie um novo arquivo `.node.ts` em `nodes/FullFunnel/`
2. Implemente a interface `INodeType`
3. Adicione ao `n8n.nodes` no `package.json`
4. Rebuild: `pnpm build`

## 📞 Suporte

- **Documentação API**: [GoHighLevel API v2](https://highlevel.stoplight.io/docs/integrations)
- **Comunidade**: [n8n Community Forum](https://community.n8n.io)
- **Issues**: [GitHub Issues](https://github.com/fullfunnel/n8n-nodes-fullfunnel/issues)

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ pela equipe FullFunnel
