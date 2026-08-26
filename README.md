# ThermoLink

Monitor de fornos cerâmicos em tempo real (PWA + Supabase).

## Notificações Push — Guia de Implantação

O sistema de push está implementado e é composto por:

| Peça | Arquivo | Função |
|---|---|---|
| PWA | `manifest.webmanifest`, `icon-192.png`, `icon-512.png` | Instalável no celular (requisito para push) |
| Service Worker | `sw.js` | Recebe o push, exibe a notificação e trata o clique (abre direto no forno) |
| Cliente | `push-notifications.js` | Permissão, subscription, seção **Configurações → Notificações** |
| Backend | `supabase/functions/push-api/index.ts` | Armazena inscrições (service role), detecta eventos e envia pushes via VAPID |
| Banco | `supabase/migrations/push_notifications_setup.sql` | Tabelas com RLS travado + estado anti-duplicado |

### Passo 1 — Executar o SQL

No **SQL Editor** do Supabase, rode `supabase/migrations/push_notifications_setup.sql`.

Habilite as extensões **pg_cron** e **pg_net** (Database → Extensions).

### Passo 2 — Publicar a Edge Function

```bash
npm install -g supabase
supabase login
supabase link --project-ref zawnluboujbovpgrgdcx

# Secrets já gerados em .env.example
supabase secrets set --env-file .env.example

supabase functions deploy push-api --no-verify-jwt
```

> `--no-verify-jwt` é seguro aqui: as ações internas (`check`/`send`) exigem o
> header `x-push-secret`, e as públicas (`subscribe`/`unsubscribe`) são validadas.

### Passo 3 — Agendar a verificação (cron de 1 minuto)

Descomente o bloco final do SQL do Passo 1, preenchendo `<PUSH_SECRET>` (valor de `.env.example`) e `<SERVICE_ROLE_KEY>` (Dashboard → Settings → API). Alternativa: agendar pela Dashboard (Edge Functions → Schedules) chamando `push-api` com body `{"action":"check"}`.

### Eventos disparados

- 🔴 **Offline**: sem leitura há N minutos (padrão 5, configurável por forno em `push_alerta_config`) — enviado **1× por episódio**
- 🟢 **Voltou online**: quando sai da condição offline — enviado 1×
- 🔥 **Temperatura**: quando `canal_1 >= limite_temp_c` (defina por forno em `push_alerta_config`; nulo = desativado) — enviado 1× enquanto permanecer acima

Clique na notificação abre o ThermoLink diretamente no forno relacionado.

Cada alerta também é gravado na tabela `notificacoes` (outbox), que alimenta os **alertas dentro do app**.

### Alertas dentro do app (visual + som + vibração)

Independente do Web Push, o app faz *polling* na tabela `notificacoes` (30s) e dispara:

- banner visual colorido no topo (clique → abre o forno relacionado);
- alerta sonoro via WebAudio (sem arquivos externos);
- vibração via Vibration API;
- central com as últimas 24h em **Configurações → Notificações**.

Em **Configurações → Notificações** também é possível:

- **Configurar tipos e parâmetros dos alertas** por forno (offline em X minutos, limite de temperatura, volta online, empresa destinatária, "aplicar para todos");
- **Testar alerta** (banner + som + vibração na hora).

> O som só toca após o primeiro toque na tela (política dos navegadores). A vibração exige navegador/WebView com suporte à Vibration API.

### Uso no APK (Kodular.io)

O WebView do Kodular **não suporta Web Push** (Service Worker push). O ThermoLink funciona assim no APK:

1. **Dentro do app (funciona sem extensão):** carregue a URL do site num componente `WebView`. A central de alertas detecta o modo APK automaticamente (`pushStateBadge` mostra "Modo App") e dispara banner + som + vibração normalmente.
   - No Kodular, ative a permissão **Vibrate** nas configurações do projeto para a vibração funcionar.
2. **Barra de notificação do Android (com PWA fechada):** adicione a extensão **OneSignal** no seu projeto Kodular. Depois cadastre os secrets na função:
   ```bash
   supabase secrets set ONESIGNAL_APP_ID=xxxxxxxx ONESIGNAL_REST_KEY=yyyyyy
   ```
   Com isso, todo alerta gerado também é enviado pela OneSignal e chega na barra do sistema, mesmo com o app fechado.
3. Isolamento por empresa: preencha o campo **Empresa destinatária** ao configurar um forno — o alerta fica visível apenas para a sessão dessa cerâmica.

### Testes

1. Abrir o app logado → Configurações → **Ativar notificações** → aceitar permissão.
2. Enviar teste manual:
   ```bash
   curl -X POST https://zawnluboujbovpgrgdcx.supabase.co/functions/v1/push-api \
     -H "Content-Type: application/json" -H "x-push-secret: <PUSH_SECRET>" \
     -d '{"action":"send","title":"🔴 ThermoLink","body":"Forno 01 está sem comunicação há 5 minutos.","url":"index.html?forno=1&ntf=1","tag":"tlk-teste"}'
   ```
3. Validar: app aberto / em segundo plano / PWA fechada; clique navega ao forno; desativar; logout/login; isolamento entre empresas (RLS sem políticas públicas).
