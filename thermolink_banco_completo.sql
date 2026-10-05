-- ==============================================================================
-- THERMOLINK & THERMOX - BANCO DE DADOS OFICIAL REESTRUTURADO DO ZERO
-- ==============================================================================
-- Arquitetura Simplificada, Otimizada e 100% Compatível com os ESPs
--
-- Regras Essenciais:
-- 1. dispositivo_id é o próprio número do serial (ex: THX-00003 -> ID 3)
-- 2. modulo_alutal é o próprio Forno (Módulo 1 = Forno 01, Módulo 2 = Forno 02...)
-- 3. Cada dispositivo pertence a uma Cerâmica (ex: THX-00003 -> Nossa Senhora Aparecida)
-- 4. Sem travas ou chaves estrangeiras restritivas que bloqueiem o ESP de enviar leituras
-- ==============================================================================

-- Remove travas e restrições antigas caso existam
ALTER TABLE IF EXISTS public.leituras DROP CONSTRAINT IF EXISTS leituras_dispositivo_id_fkey;
ALTER TABLE IF EXISTS public.leituras DROP CONSTRAINT IF EXISTS leituras_forno_id_fkey;
ALTER TABLE IF EXISTS public.fornos DROP CONSTRAINT IF EXISTS fornos_dispositivo_id_fkey;

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABELA: CERAMICAS (EMPRESAS / CLIENTES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ceramicas (
    id              TEXT PRIMARY KEY,
    nome            TEXT NOT NULL,
    responsavel     TEXT,
    cidade          TEXT,
    plano           TEXT NOT NULL DEFAULT 'Profissional',
    valor_mensal    NUMERIC(10,2) NOT NULL DEFAULT 299.00,
    fornos_count    INT NOT NULL DEFAULT 6,
    status          TEXT NOT NULL DEFAULT 'Ativo',
    motivo_bloqueio TEXT,
    username        TEXT UNIQUE,
    senha           TEXT,
    ultimo_acesso   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ceramicas ADD COLUMN IF NOT EXISTS motivo_bloqueio TEXT;

-- ==============================================================================
-- 2. TABELA: DISPOSITIVOS (HARDWARE THERMOX ESP)
-- ==============================================================================
-- Se a tabela já existir com restrição de identity travada, ajustamos
DO $$
BEGIN
    -- Se a coluna id for 'generated always as identity', removemos a trava para permitir IDs manuais (1, 2, 3...)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'dispositivos' AND is_identity = 'YES'
    ) THEN
        ALTER TABLE public.dispositivos ALTER COLUMN id DROP IDENTITY IF EXISTS;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.dispositivos (
    id                  BIGINT PRIMARY KEY,
    numero_serie        TEXT NOT NULL UNIQUE,
    serial              TEXT,
    nome                TEXT DEFAULT 'ThermoX ESP',
    modelo              TEXT DEFAULT 'TLK-ESP8266-ALUTAL',
    ceramica_id         TEXT REFERENCES public.ceramicas(id) ON DELETE SET NULL,
    status              TEXT NOT NULL DEFAULT 'Disponível',
    modulo_num          INT,
    forno_id            INT,
    firmware_version    TEXT DEFAULT '4.5.1',
    voltage             NUMERIC(4,2) DEFAULT 5.05,
    rssi                NUMERIC DEFAULT -65,
    uptime              TEXT DEFAULT '0h',
    ultimo_acesso       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Garante que todas as colunas essenciais existam
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS numero_serie     TEXT;
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS serial           TEXT;
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS ceramica_id      TEXT;
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS status           TEXT DEFAULT 'Disponível';
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS modulo_num       INT;
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS forno_id         INT;
ALTER TABLE public.dispositivos ADD COLUMN IF NOT EXISTS ultimo_acesso    TIMESTAMPTZ;

-- Mantém 'serial' e 'numero_serie' sempre iguais
UPDATE public.dispositivos SET serial = numero_serie WHERE serial IS NULL AND numero_serie IS NOT NULL;
UPDATE public.dispositivos SET numero_serie = serial WHERE numero_serie IS NULL AND serial IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_dispositivos_ceramica ON public.dispositivos(ceramica_id);
CREATE INDEX IF NOT EXISTS idx_dispositivos_num_serie ON public.dispositivos(numero_serie);
CREATE INDEX IF NOT EXISTS idx_dispositivos_serial ON public.dispositivos(serial);

-- ==============================================================================
-- 3. TABELA: LEITURAS (TELEMETRIA ENVIADA PELOS ESPS - ULTRA OTIMIZADA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leituras (
    id              BIGSERIAL PRIMARY KEY,
    dispositivo_id  INT,
    forno_id        INT,
    modulo_alutal   INT NOT NULL DEFAULT 1,
    canal_1         NUMERIC(6,2) NOT NULL DEFAULT 0,
    canal_2         NUMERIC(6,2) NOT NULL DEFAULT 0,
    numero_serie    TEXT,
    ceramica_id     TEXT,
    data_hora       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Garante as colunas necessárias sem restrições que bloqueiem o envio
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS dispositivo_id  INT;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS forno_id        INT;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS modulo_alutal   INT NOT NULL DEFAULT 1;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS canal_1         NUMERIC(6,2) NOT NULL DEFAULT 0;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS canal_2         NUMERIC(6,2) NOT NULL DEFAULT 0;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS numero_serie    TEXT;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS ceramica_id     TEXT;
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS data_hora       TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.leituras ADD COLUMN IF NOT EXISTS created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Remove qualquer trava NOT NULL impeditiva em leituras
DO $$
DECLARE col RECORD;
BEGIN
    FOR col IN 
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'leituras' 
          AND is_nullable = 'NO' AND column_name NOT IN ('id')
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.leituras ALTER COLUMN %I DROP NOT NULL', col.column_name);
        EXCEPTION WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END $$;

-- ÍNDICES DE ALTA PERFORMANCE PARA CONSULTAS INSTANTÂNEAS
CREATE INDEX IF NOT EXISTS idx_leituras_created_at_desc ON public.leituras(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leituras_ceramica_id ON public.leituras(ceramica_id);
CREATE INDEX IF NOT EXISTS idx_leituras_disp_id ON public.leituras(dispositivo_id);
CREATE INDEX IF NOT EXISTS idx_leituras_num_serie ON public.leituras(numero_serie);
CREATE INDEX IF NOT EXISTS idx_leituras_modulo ON public.leituras(modulo_alutal);
CREATE INDEX IF NOT EXISTS idx_leituras_ceramica_created ON public.leituras(ceramica_id, created_at DESC);

-- ==============================================================================
-- 4. TRIGGER INTELIGENTE: AUTO-VÍNCULO DA LEITURA À CERÂMICA
-- ==============================================================================
-- Toda vez que um ESP envia uma leitura, o banco busca a qual Cerâmica
-- o dispositivo pertence (usando dispositivo_id, numero_serie ou serial)
-- e carimba ceramica_id e forno_id automaticamente!
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.fn_processar_nova_leitura()
RETURNS TRIGGER AS $$
DECLARE
    v_ceramica_id TEXT;
    v_serial TEXT;
    v_disp_id INT;
BEGIN
    -- 1. Normaliza timestamps
    IF NEW.created_at IS NULL THEN
        NEW.created_at := NOW();
    END IF;
    IF NEW.data_hora IS NULL THEN
        NEW.data_hora := NEW.created_at;
    END IF;

    -- 2. Módulo = Forno! Se forno_id estiver vazio, preenche com modulo_alutal
    IF NEW.forno_id IS NULL OR NEW.forno_id = 0 THEN
        NEW.forno_id := NEW.modulo_alutal;
    END IF;

    -- 3. Localiza a cerâmica dona do dispositivo
    SELECT d.ceramica_id, COALESCE(d.numero_serie, d.serial), d.id
    INTO v_ceramica_id, v_serial, v_disp_id
    FROM public.dispositivos d
    WHERE (NEW.dispositivo_id IS NOT NULL AND d.id = NEW.dispositivo_id)
       OR (NEW.numero_serie IS NOT NULL AND (d.numero_serie = NEW.numero_serie OR d.serial = NEW.numero_serie))
    LIMIT 1;

    -- 4. Aplica os dados encontrados
    IF v_ceramica_id IS NOT NULL THEN
        NEW.ceramica_id := v_ceramica_id;
    END IF;

    IF (NEW.numero_serie IS NULL OR NEW.numero_serie = '') AND v_serial IS NOT NULL THEN
        NEW.numero_serie := v_serial;
    END IF;

    IF (NEW.dispositivo_id IS NULL OR NEW.dispositivo_id = 0) AND v_disp_id IS NOT NULL THEN
        NEW.dispositivo_id := v_disp_id;
    END IF;

    -- 5. Atualiza o último contato do dispositivo físico
    IF v_disp_id IS NOT NULL OR NEW.numero_serie IS NOT NULL THEN
        UPDATE public.dispositivos
        SET ultimo_acesso = NEW.created_at,
            status = CASE WHEN ceramica_id IS NOT NULL THEN 'Vinculado' ELSE status END
        WHERE id = v_disp_id 
           OR numero_serie = NEW.numero_serie 
           OR serial = NEW.numero_serie;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_processar_nova_leitura ON public.leituras;
CREATE TRIGGER trg_processar_nova_leitura
    BEFORE INSERT ON public.leituras
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_processar_nova_leitura();

-- ==============================================================================
-- 5. POLÍTICAS DE ACESSO (ROW LEVEL SECURITY - LIVRE PARA O ESP E O SITE)
-- ==============================================================================
ALTER TABLE public.ceramicas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispositivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leituras     ENABLE ROW LEVEL SECURITY;

-- Permite leitura e escrita para o App, Admin e ESPs (chave anon / serviço)
DROP POLICY IF EXISTS "permitir_tudo_ceramicas" ON public.ceramicas;
CREATE POLICY "permitir_tudo_ceramicas" ON public.ceramicas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permitir_tudo_dispositivos" ON public.dispositivos;
CREATE POLICY "permitir_tudo_dispositivos" ON public.dispositivos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permitir_tudo_leituras" ON public.leituras;
CREATE POLICY "permitir_tudo_leituras" ON public.leituras FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 6. DADOS INICIAIS (SEED)
-- ==============================================================================

-- 1. Cerâmica Nossa Senhora Aparecida
INSERT INTO public.ceramicas (id, nome, responsavel, cidade, plano, valor_mensal, fornos_count, status, username, senha)
VALUES (
    'cli_1788920539236',
    'Nossa Senhora Aparecida',
    'Davi',
    'Russas - CE',
    'Profissional',
    299.00,
    6,
    'Ativo',
    'luis',
    'cer9837'
)
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    username = EXCLUDED.username,
    senha = EXCLUDED.senha,
    status = 'Ativo';

-- Cerâmicas complementares
INSERT INTO public.ceramicas (id, nome, responsavel, cidade, plano, valor_mensal, fornos_count, status, username, senha)
VALUES
    ('cli_1', 'Cerâmica São José', 'Carlos Eduardo', 'Tatuí - SP', 'Profissional', 299.00, 4, 'Ativo', 'ceramica', 'forno2026'),
    ('cli_2', 'Cerâmica Santa Rita', 'Marcos Silva', 'Itu - SP', 'Básico', 149.00, 2, 'Ativo', 'santarita', 'cer8492'),
    ('cli_3', 'Cerâmica Paulista', 'Roberto Almeida', 'Itu - SP', 'Básico', 149.00, 2, 'Ativo', 'paulista', 'cer3910')
ON CONFLICT (id) DO NOTHING;

-- 2. Dispositivos com ID numérico idêntico ao THX:
-- Remove registros legados com IDs automáticos antigos (ex: ID 11 ou 19) para liberar os seriais
DELETE FROM public.dispositivos 
WHERE (numero_serie IN ('THX-00001', 'THX-00002', 'THX-00003') OR serial IN ('THX-00001', 'THX-00002', 'THX-00003'))
  AND id NOT IN (1, 2, 3);

INSERT INTO public.dispositivos (id, numero_serie, serial, nome, ceramica_id, status, modulo_num, forno_id, firmware_version)
VALUES
    (2, 'THX-00002', 'THX-00002', 'ThermoX ESP (Aparecida)', 'cli_1788920539236', 'Vinculado', 1, 1, '4.5.1'),
    (1, 'THX-00001', 'THX-00001', 'ThermoX ESP (Disponível)', NULL, 'Disponível', 1, 1, '4.5.1'),
    (3, 'THX-00003', 'THX-00003', 'ThermoX ESP (Disponível)', NULL, 'Disponível', 1, 1, '4.5.1')
ON CONFLICT (numero_serie) DO UPDATE SET
    id = EXCLUDED.id,
    serial = EXCLUDED.serial,
    nome = EXCLUDED.nome,
    ceramica_id = EXCLUDED.ceramica_id,
    status = EXCLUDED.status,
    modulo_num = EXCLUDED.modulo_num,
    forno_id = EXCLUDED.forno_id;

-- 3. Atualiza leituras exclusivas do THX-00002 para a Cerâmica Nossa Senhora Aparecida e limpa outros aparelhos
UPDATE public.leituras
SET ceramica_id = 'cli_1788920539236'
WHERE (numero_serie = 'THX-00002' OR dispositivo_id = 2);

UPDATE public.leituras
SET ceramica_id = NULL
WHERE ceramica_id = 'cli_1788920539236'
  AND (numero_serie <> 'THX-00002' AND dispositivo_id <> 2);

-- ==============================================================================
-- 7. TABELA: ACESSOS DOS USUÁRIOS (SESSÕES, AUDITORIA & RLS)
-- ==============================================================================
ALTER TABLE IF EXISTS public.ceramicas ADD COLUMN IF NOT EXISTS total_acessos INT DEFAULT 0;

-- Remove trava de chave estrangeira caso já tenha sido criada
ALTER TABLE IF EXISTS public.acessos_usuarios DROP CONSTRAINT IF EXISTS acessos_usuarios_ceramica_id_fkey;

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

CREATE INDEX IF NOT EXISTS idx_acessos_usuario ON public.acessos_usuarios(usuario);
CREATE INDEX IF NOT EXISTS idx_acessos_ceramica_id ON public.acessos_usuarios(ceramica_id);
CREATE INDEX IF NOT EXISTS idx_acessos_ultimo_acesso ON public.acessos_usuarios(ultimo_acesso DESC);
CREATE INDEX IF NOT EXISTS idx_acessos_login_em ON public.acessos_usuarios(login_em DESC);
CREATE INDEX IF NOT EXISTS idx_acessos_created_at ON public.acessos_usuarios(created_at DESC);

ALTER TABLE public.acessos_usuarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "permitir_inserir_acessos" ON public.acessos_usuarios;
CREATE POLICY "permitir_inserir_acessos" ON public.acessos_usuarios
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "permitir_atualizar_acessos" ON public.acessos_usuarios;
CREATE POLICY "permitir_atualizar_acessos" ON public.acessos_usuarios
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "permitir_leitura_acessos" ON public.acessos_usuarios;
CREATE POLICY "permitir_leitura_acessos" ON public.acessos_usuarios
    FOR SELECT TO anon, authenticated
    USING (true);


