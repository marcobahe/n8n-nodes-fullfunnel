# n8n-nodes-fullfunnel-contacts

Este é um node personalizado para n8n que permite integração com a API da FullFunnel.

## Instalação

### Em instâncias self-hosted do n8n

Para instalar este node em sua instância self-hosted do n8n, execute:

```bash
npm install n8n-nodes-fullfunnel-contacts

Usando Docker
Se você está usando Docker, adicione o seguinte ao seu Dockerfile:

RUN npm install n8n-nodes-fullfunnel-contacts

Ou no docker-compose.yml:

environment:
  - N8N_CUSTOM_EXTENSIONS=n8n-nodes-fullfunnel-contacts

  Recursos
Este node permite:

Contatos

Criar novos contatos
Buscar contatos por ID, email ou telefone
Atualizar informações de contatos
Deletar contatos
Listar todos os contatos
Tags

Adicionar tags a contatos
Remover tags de contatos
Tarefas

Criar tarefas para contatos
Atualizar status de tarefas
Listar tarefas
Notas

Adicionar notas a contatos
Listar notas
Configuração
Obtenha sua API Key da FullFunnel
No n8n, adicione as credenciais "FullFunnel API"
Insira sua API Key
Comece a usar o node!
Suporte
Para reportar bugs ou sugerir melhorias, abra uma issue em: 

github.com

Licença
MIT
