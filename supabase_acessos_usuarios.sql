-- ==============================================================================
-- THERMOLINK - TABELA E POLÍTICAS DE MONITORAMENTO DE ACESSO DOS USUÁRIOS
-- ==============================================================================

-- 1. Garante que a tabela ceramicas tenha coluna de total de acessos
ALTER TABLE IF EXISTS public.ceramicas ADD COLUMN IF NOT EXISTS total_acessos INT DEFAULT 0;

-- Remove qualquer trava de chave estrangeira antiga que bloqueie inserções
ALTER TABLE IF EXISTS public.acessos_usuarios DROP CONSTRAINT IF EXISTS acessos_usuarios_ceramica_id_fkey;

-- Garante existência da Cerâmica Paulista (cli_3) caso ainda não cadastrada
INSERT INTO public.ceramicas (id, nome, responsavel, cidade, plano, valor_mensal, fornos_count, status, username, senha)
VALUES ('cli_3', 'Cerâmica Paulista', 'Roberto Almeida', 'Itu - SP', 'Básico', 149.00, 2, 'Ativo', 'paulista', 'cer3910')
ON CONFLICT (id) DO NOTHING;

-- 2. Criação da Tabela de Acessos dos Usuários (Sessões e Auditoria)
-- NOTA: Sem restrição de chave estrangeira rígida para evitar falhas com usuários admin ou sem cerâmica
CREATE TABLE IF NOT EXISTS public.acessos_usuarios (
    id                  BIGSERIAL PRIMARY KEY,
    session_token       TEXT,
    usuario             TEXT NOT NULL,
    nome                TEXT,
    ceramica_id         TEXT,
    role                TEXT DEFAULT 'client',
    login_em            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ultimo_acesso       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    quantidade_acessos  INT DEFAULT 1,
    dispositivo         TEXT DEFAULT 'Dispositivo Móvel',
    navegador           TEXT DEFAULT 'Navegador Web',
    sistema_operacional TEXT DEFAULT 'Indefinido',
    ip_acesso           TEXT DEFAULT 'Não identificado',
    user_agent          TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Índices para Otimização de Consultas e Gráficos
CREATE INDEX IF NOT EXISTS idx_acessos_usuario ON public.acessos_usuarios(usuario);
CREATE INDEX IF NOT EXISTS idx_acessos_ceramica_id ON public.acessos_usuarios(ceramica_id);
CREATE INDEX IF NOT EXISTS idx_acessos_ultimo_acesso ON public.acessos_usuarios(ultimo_acesso DESC);
CREATE INDEX IF NOT EXISTS idx_acessos_login_em ON public.acessos_usuarios(login_em DESC);
CREATE INDEX IF NOT EXISTS idx_acessos_created_at ON public.acessos_usuarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_acessos_session_token ON public.acessos_usuarios(session_token);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.acessos_usuarios ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança (RLS):
-- Permite que usuários e o app registrem e atualizem suas próprias sessões
DROP POLICY IF EXISTS "permitir_inserir_acessos" ON public.acessos_usuarios;
CREATE POLICY "permitir_inserir_acessos" ON public.acessos_usuarios
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "permitir_atualizar_acessos" ON public.acessos_usuarios;
CREATE POLICY "permitir_atualizar_acessos" ON public.acessos_usuarios
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Leitura de acessos para painel administrativo
DROP POLICY IF EXISTS "permitir_leitura_acessos" ON public.acessos_usuarios;
CREATE POLICY "permitir_leitura_acessos" ON public.acessos_usuarios
    FOR SELECT TO anon, authenticated
    USING (true);

-- 6. Registros Iniciais de Exemplo (para visualização imediata no painel)
INSERT INTO public.acessos_usuarios (
    session_token, usuario, nome, ceramica_id, role, 
    login_em, ultimo_acesso, quantidade_acessos, 
    dispositivo, navegador, sistema_operacional, ip_acesso
)
VALUES
    ('sess_demo_1', 'luis', 'Nossa Senhora Aparecida', 'cli_1788920539236', 'client', 
     NOW() - INTERVAL '12 minutes', NOW() - INTERVAL '2 minutes', 24, 
     'Smartphone', 'Chrome Mobile 128', 'Android 14', '177.136.241.85'),

    ('sess_demo_2', 'ceramica', 'Cerâmica São José', 'cli_1', 'client', 
     NOW() - INTERVAL '3 hours', NOW() - INTERVAL '45 minutes', 58, 
     'Computador Desktop', 'Google Chrome 129', 'Windows 11', '189.40.112.204'),

    ('sess_demo_3', 'santarita', 'Cerâmica Santa Rita', 'cli_2', 'client', 
     NOW() - INTERVAL '1 day 2 hours', NOW() - INTERVAL '1 day 1 hour', 12, 
     'Tablet', 'Safari 17.5', 'iOS / iPadOS', '201.86.77.19'),

    ('sess_demo_4', 'paulista', 'Cerâmica Paulista', 'cli_3', 'client', 
     NOW() - INTERVAL '2 days 4 hours', NOW() - INTERVAL '2 days 3 hours', 9, 
     'Smartphone', 'Samsung Browser 25', 'Android 13', '179.182.90.110'),

    ('sess_demo_5', 'admin', 'Administrador ThermoLink', NULL, 'admin', 
     NOW() - INTERVAL '5 minutes', NOW(), 114, 
     'Notebook Corporativo', 'Edge 128', 'Windows 11', '187.64.200.15')
ON CONFLICT DO NOTHING;
