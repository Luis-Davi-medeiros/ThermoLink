# ThermoLink

## Integração com Supabase

Esta aplicação utiliza o Supabase como backend para armazenar e recuperar dados de fornos e leituras. A integração já está parcialmente implementada no código existente (`app.js`).

### Configuração

1. Crie um arquivo `.env` na raiz do projeto (ou copie o `.env.example` já fornecido):
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   ```
2. Substitua as constantes de conexão em **app.js** pelas variáveis de ambiente. Por exemplo:
   ```javascript
   const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "https://zawnluboujbovpgrgdcx.supabase.co";
   const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "sb_publishable_gJiVQXVjiuSPY3vHt2f8OA_CiES-4Ak";
   ```
   Se não estiver usando um bundler que suporte `import.meta.env`, você pode ler o arquivo `.env` em tempo de desenvolvimento ou substituir diretamente os valores.

### Passos para iniciar

1. Instale as dependências (por ex., Chart.js) se ainda não o fez.
2. Abra `index.html` no navegador.
3. A aplicação se conectará ao Supabase usando as credenciais definidas no `.env`.

## Evolução do Sistema

- **Supabase integrado**: A aplicação agora persiste fornos e leituras no banco de dados Supabase, substituindo o armazenamento local anterior.
- **Credenciais externas**: As chaves de acesso foram movidas para um arquivo `.env.example`, facilitando a gestão segura de credenciais.
- **Documentação**: O README foi atualizado com instruções detalhadas de configuração e uso da integração.