// ==========================================================================
// THERMOLINK MOBILE - CONTROLE DE ACESSO & TELEMETRIA TÉRMICA
// ==========================================================================

const SUPABASE_URL = "https://zawnluboujbovpgrgdcx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gJiVQXVjiuSPY3vHt2f8OA_CiES-4Ak";

// Supabase Client
const { createClient } = window.supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const DEFAULT_USERS = [
    { username: "admin", password: "thermolink2026", name: "Administrador ThermoLink", role: "admin" },
    { username: "ceramica", password: "forno2026", name: "Cerâmica São José", role: "client", ceramicaId: "cli_1" },
    { username: "santarita", password: "cer8492", name: "Cerâmica Santa Rita", role: "client", ceramicaId: "cli_2" },
    { username: "paulista", password: "cer3910", name: "Cerâmica Paulista", role: "client", ceramicaId: "cli_3" },
    { username: "demo", password: "123456", name: "Cerâmica Modelo Demo", role: "client", ceramicaId: "cli_demo" }
];

function getRegisteredUsers() {
    const saved = localStorage.getItem("thermolink_users");
    if (!saved) {
        localStorage.setItem("thermolink_users", JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
    }
    try {
        return JSON.parse(saved);
    } catch {
        return DEFAULT_USERS;
    }
}

// ==========================================================================
// ESTADO GLOBAL DO APLICATIVO
// ==========================================================================
const state = {
    currentUser: null,
    activeTab: "fornos",
    activeSubTab: "tempoReal",
    selectedModule: null,
    analysisModule: null,
    analysisTimeRange: "all", // 'all', 6, 24, 48, 72
    analysisSampleSize: 1000, // 100, 250, 500, 1000
    analysisTableRowLimit: 25, // 25, 50, 100, 'all'
    ovens: [],
    readings: new Map(),
    mainChart: null,
    analysisChart: null,
    miniCharts: new Map(),
    chartChannelFilter: "all",
    analysisChannelFilter: "all",
    currentDetailHistory: [],
    currentAnalysisRawHistory: [],
    currentAnalysisFilteredHistory: [],
    isPolling: false
};

const $ = (id) => document.getElementById(id);

// ==========================================================================
// 1. FLUXO DE LOGIN & SESSÃO DO CLIENTE
// ==========================================================================

function verificarSessaoSalva() {
    const session = localStorage.getItem("thermolink_active_session");
    if (!session) return null;
    try {
        const dados = JSON.parse(session);
        if (!dados || !dados.username) throw new Error("Sessão inválida");
        // Migração de segurança: sessões antigas podiam conter a senha — remove
        if (dados.password !== undefined) {
            delete dados.password;
            localStorage.setItem("thermolink_active_session", JSON.stringify(dados));
        }
        return dados;
    } catch {
        localStorage.removeItem("thermolink_active_session");
        return null;
    }
}

function preencherLogin(user, pass) {
    $("loginUser").value = user;
    $("loginPassword").value = pass;
    $("loginError").classList.add("hidden");
}

function toggleSenha(inputId) {
    const input = $(inputId);
    const icon = $("toggleIcon");
    if (input.type === "password") {
        input.type = "text";
        icon.className = "fa-regular fa-eye-slash";
    } else {
        input.type = "password";
        icon.className = "fa-regular fa-eye";
    }
}

async function realizarLogin(e) {
    e.preventDefault();
    const userVal = $("loginUser").value.trim().toLowerCase();
    const passVal = $("loginPassword").value.trim();

    // 1. Usuários locais/pré-definidos
    const users = getRegisteredUsers();
    let found = users.find(u => u.username.toLowerCase() === userVal && u.password === passVal);

    // 2. Se não encontrou, busca diretamente no Supabase na tabela 'ceramicas'
    if (!found) {
        try {
            const { data: ceramicaData } = await sb
                .from("ceramicas")
                .select("id, nome, username, status, motivo_bloqueio")
                .ilike("username", userVal)
                .eq("senha", passVal)
                .maybeSingle();

            if (ceramicaData) {
                found = {
                    username: ceramicaData.username,
                    name: ceramicaData.nome,
                    role: "client",
                    status: ceramicaData.status || "Ativo",
                    motivoBloqueio: ceramicaData.motivo_bloqueio || null,
                    ceramicaId: ceramicaData.id
                };
            }
        } catch (err) {
            console.warn("[Login] Erro ao consultar ceramicas no Supabase:", err);
        }
    }

    if (found) {
        // Garante o ID da Cerâmica vinculada ao usuário e status atualizado
        if (found.role === "client") {
            try {
                let query = sb.from("ceramicas").select("id, nome, status, motivo_bloqueio");
                if (found.ceramicaId && !String(found.ceramicaId).startsWith("cli_")) {
                    query = query.eq("id", found.ceramicaId);
                } else {
                    query = query.ilike("username", found.username);
                }
                const { data: cData } = await query.maybeSingle();
                if (cData) {
                    if (!found.ceramicaId) found.ceramicaId = cData.id;
                    if (cData.nome) found.name = cData.nome;
                    if (cData.status) found.status = cData.status;
                    if (cData.motivo_bloqueio) found.motivoBloqueio = cData.motivo_bloqueio;
                }
            } catch (e) {}

            // Fallback de status e motivo no localStorage administrativo
            const localClients = JSON.parse(localStorage.getItem("thermolink_clients_admin") || "[]");
            const matched = localClients.find(c => 
                (found.ceramicaId && c.id === found.ceramicaId) || 
                (c.username && c.username.toLowerCase() === found.username?.toLowerCase())
            );
            if (matched) {
                if (!found.ceramicaId) found.ceramicaId = matched.id;
                if (!found.name || found.name === found.username) found.name = matched.nome;
                if (matched.status) found.status = matched.status;
                if (matched.motivoBloqueio) found.motivoBloqueio = matched.motivoBloqueio;
            }

            const motivosMap = JSON.parse(localStorage.getItem("thermolink_motivos_bloqueio") || "{}");
            if (found.ceramicaId && motivosMap[found.ceramicaId]) {
                found.motivoBloqueio = motivosMap[found.ceramicaId];
            } else if (found.username && motivosMap[found.username.toLowerCase()]) {
                found.motivoBloqueio = motivosMap[found.username.toLowerCase()];
            }

            if (!found.ceramicaId && found.username === "ceramica") {
                found.ceramicaId = "cli_1";
            }
        }

        $("loginError").classList.add("hidden");

        // Sessão persistida com dados de identificação e status de bloqueio
        const sessao = {
            username: found.username,
            name: found.name,
            role: found.role,
            status: found.status || "Ativo",
            motivoBloqueio: found.motivoBloqueio || null,
            ceramicaId: found.ceramicaId || null,
            loginAt: new Date().toISOString()
        };

        // Só persiste se "Lembrar neste celular" estiver marcado
        if ($("rememberMe").checked) {
            localStorage.setItem("thermolink_active_session", JSON.stringify(sessao));
        }

        iniciarPainelUsuario(sessao, false);
    } else {
        $("loginError").textContent = "Usuário ou senha incorretos.";
        $("loginError").classList.remove("hidden");
    }
}

function iniciarPainelUsuario(user, usarSplash = false) {
    state.currentUser = user;

    // Sincroniza status de bloqueio e motivo mais recente do armazenamento administrativo
    if (user.role !== "admin" && !user.isImpersonateMode) {
        const clientsAdmin = JSON.parse(localStorage.getItem("thermolink_clients_admin") || "[]");
        const clientRecord = clientsAdmin.find(c => 
            (user.ceramicaId && c.id === user.ceramicaId) || 
            (c.username && c.username.toLowerCase() === user.username?.toLowerCase())
        );
        if (clientRecord) {
            if (clientRecord.status) user.status = clientRecord.status;
            if (clientRecord.motivoBloqueio) user.motivoBloqueio = clientRecord.motivoBloqueio;
        }

        const motivosMap = JSON.parse(localStorage.getItem("thermolink_motivos_bloqueio") || "{}");
        if (user.ceramicaId && motivosMap[user.ceramicaId]) {
            user.motivoBloqueio = motivosMap[user.ceramicaId];
        } else if (user.username && motivosMap[user.username.toLowerCase()]) {
            user.motivoBloqueio = motivosMap[user.username.toLowerCase()];
        }
    }

    $("loginScreen").classList.add("hidden");

    // Entrada: splash com a logo (2,5s + fade suave) ou direto após o login
    const abrirApp = () => {
        $("splashScreen").classList.add("hidden");
        $("mainApp").classList.remove("hidden");

        // Se a conta do cliente estiver BLOQUEADA, exibe a notificação na frente e oculta dados
        if (user.role !== "admin" && !user.isImpersonateMode && user.status === "Bloqueado") {
            const overlay = $("clientBlockedOverlay");
            if (overlay) {
                if ($("clientBlockedCeramicaNome")) {
                    $("clientBlockedCeramicaNome").textContent = user.name || user.username || "Cerâmica Cliente";
                }
                if ($("clientBlockedReasonText")) {
                    const msg = user.motivoBloqueio || "Acesso temporariamente suspenso pela administração do sistema. Entre em contato com o suporte da ThermoLink para regularização.";
                    $("clientBlockedReasonText").textContent = msg;
                }
                overlay.classList.remove("hidden");
            }
            limparPainelBloqueado();
            return;
        } else {
            $("clientBlockedOverlay")?.classList.add("hidden");
            carregarFornosELeituras();
        }
    };

    if (usarSplash) {
        $("splashScreen").classList.remove("hidden");
        $("splashScreen").classList.remove("splash-out");
        setTimeout(() => {
            $("splashScreen").classList.add("splash-out");
            setTimeout(abrirApp, 500);
        }, 2500);
    } else {
        abrirApp();
    }

    // Banner de Impersonation (Modo Suporte do Administrador)
    const impBanner = $("impersonateBanner");
    if (impBanner) {
        if (user.isImpersonateMode) {
            $("impClientName").textContent = user.name || user.username;
            impBanner.classList.remove("hidden");
        } else {
            impBanner.classList.add("hidden");
        }
    }

    // Atualiza cabeçalho e perfil
    $("currentUserDisplay").textContent = user.name || user.username;
    $("profileName").textContent = user.name || user.username;
    $("profileRole").textContent = user.role === "admin" ? "Administrador Master" : "Acesso Cliente Cerâmica";

    // Hook: sincroniza o painel de notificações push com o usuário autenticado
    if (window.ThermoPush) window.ThermoPush.onAuthChanged();
}

function limparPainelBloqueado() {
    state.readings = new Map();
    const grid = $("ovensGrid");
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(15, 23, 42, 0.6); border: 1px dashed rgba(244, 63, 94, 0.3); border-radius: 16px; color: #94a3b8;">
                <i class="fa-solid fa-lock" style="font-size: 32px; color: #f43f5e; margin-bottom: 12px; display: block;"></i>
                <h3 style="color: #ffffff; font-size: 16px; margin-bottom: 6px;">Visualização de Telemetria Oculta</h3>
                <p style="font-size: 13px; max-width: 420px; margin: 0 auto; line-height: 1.5;">O acesso em tempo real aos módulos e canais térmicos está suspenso temporariamente pela administração.</p>
            </div>
        `;
    }
}

async function verificarDesbloqueio() {
    const btn = $("btnVerificarDesbloqueio");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Verificando regularização...</span>`;
    }

    try {
        let isLiberado = false;
        const cid = state.currentUser?.ceramicaId;
        const username = state.currentUser?.username;

        // 1. Consulta no Supabase
        if (cid || username) {
            try {
                let query = sb.from("ceramicas").select("status, motivo_bloqueio");
                if (cid && !String(cid).startsWith("cli_")) {
                    query = query.eq("id", cid);
                } else if (username) {
                    query = query.ilike("username", username);
                }
                const { data, error } = await query.maybeSingle();
                if (!error && data) {
                    if (data.status === "Ativo") {
                        isLiberado = true;
                    } else if (data.motivo_bloqueio) {
                        state.currentUser.motivoBloqueio = data.motivo_bloqueio;
                        if ($("clientBlockedReasonText")) {
                            $("clientBlockedReasonText").textContent = data.motivo_bloqueio;
                        }
                    }
                }
            } catch (e) {
                console.warn("[ThermoLink] Erro ao verificar status no Supabase:", e);
            }
        }

        // 2. Consulta no armazenamento local do Master Admin
        if (!isLiberado) {
            const localClients = JSON.parse(localStorage.getItem("thermolink_clients_admin") || "[]");
            const matched = localClients.find(c => 
                (cid && c.id === cid) || 
                (username && c.username?.toLowerCase() === username?.toLowerCase())
            );
            if (matched && matched.status === "Ativo") {
                isLiberado = true;
            }
        }

        if (isLiberado) {
            if (state.currentUser) {
                state.currentUser.status = "Ativo";
                state.currentUser.motivoBloqueio = null;
                const saved = localStorage.getItem("thermolink_active_session");
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        parsed.status = "Ativo";
                        parsed.motivoBloqueio = null;
                        localStorage.setItem("thermolink_active_session", JSON.stringify(parsed));
                    } catch (e) {}
                }
            }
            $("clientBlockedOverlay")?.classList.add("hidden");
            alert("Acesso liberado! Seus fornos e telemetria estão sendo carregados.");
            await carregarFornosELeituras();
        } else {
            alert("Seu acesso ainda consta como suspenso pela administração.\nCaso já tenha efetuado a regularização, aguarde a liberação pelo administrador.");
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-rotate"></i> <span>Verificar Regularização</span>`;
        }
    }
}

function sairModoSuporte() {
    localStorage.removeItem("thermolink_active_session");
    window.location.href = "admin.html";
}

function realizarLogout() {
    localStorage.removeItem("thermolink_active_session");
    state.currentUser = null;
    $("mainApp").classList.add("hidden");
    $("splashScreen").classList.add("hidden");
    $("clientBlockedOverlay").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");
    $("loginUser").value = "";
    $("loginPassword").value = "";

    // Hook: atualiza o painel de notificações push após sair da conta
    if (window.ThermoPush) window.ThermoPush.onAuthChanged();
}

// ==========================================================================
// 2. CONSULTAS AO BANCO SUPABASE (ISOLAMENTO MULTI-TENANT POR CERÂMICA)
// ==========================================================================

async function carregarFornosELeituras() {
    if (state.currentUser && state.currentUser.status === "Bloqueado") {
        return;
    }
    if (state.isPolling) return;
    state.isPolling = true;

    try {
        let clientDevices = [];
        let allowedSerials = [];
        let allowedDeviceIds = [];

        // 1. IDENTIFICAÇÃO DOS APARELHOS VINCULADOS AO CLIENTE LOGADO
        if (state.currentUser && state.currentUser.role !== "admin") {
            const cid = state.currentUser.ceramicaId;

            // Busca no Supabase apenas os dispositivos vinculados a esta cerâmica
            try {
                const { data: devs, error: errDevs } = await sb
                    .from("dispositivos")
                    .select("id, serial, numero_serie, modelo, modulo_num, forno_id, status, ceramica_id")
                    .eq("ceramica_id", cid)
                    .eq("status", "Vinculado");

                if (!errDevs && devs && devs.length > 0) {
                    clientDevices = devs;
                }
            } catch (errDev) {
                console.warn("[ThermoLink] Falha ao consultar dispositivos no Supabase:", errDev);
            }

            // Fallback no localStorage
            if (!clientDevices.length) {
                const localDevs = JSON.parse(localStorage.getItem("thermolink_devices_admin") || "[]");
                clientDevices = localDevs.filter(d => (d.ceramicaId === cid || d.ceramica_id === cid) && d.status === "Vinculado");
            }

            allowedSerials = clientDevices.map(d => d.serial || d.numero_serie).filter(Boolean);
            allowedDeviceIds = clientDevices.map(d => Number(d.id)).filter(n => !isNaN(n) && n > 0);

            state.allowedSerials = allowedSerials;
            state.allowedDeviceIds = allowedDeviceIds;
            state.clientDevices = clientDevices;

            // SE A CERÂMICA NÃO POSSUI DISPOSITIVO VINCULADO:
            // Não carrega dados de outros aparelhos nem exibe fornos de terceiros!
            if (clientDevices.length === 0) {
                state.ovens = [];
                state.readings = new Map();
                updateLivePill(false);
                renderListaFornos();
                return;
            }
        }

        // 2. CARREGA APENAS AS LEITURAS DESTA CERÂMICA / APARELHOS
        let leiturasQuery = sb
            .from("leituras")
            .select("id, dispositivo_id, forno_id, modulo_alutal, canal_1, canal_2, numero_serie, ceramica_id, created_at, data_hora");

        if (state.currentUser && state.currentUser.role !== "admin") {
            const cid = state.currentUser.ceramicaId;
            const orFilters = [`ceramica_id.eq.${cid}`];
            if (allowedSerials.length > 0) {
                orFilters.push(`numero_serie.in.(${allowedSerials.join(',')})`);
            }
            if (allowedDeviceIds.length > 0) {
                orFilters.push(`dispositivo_id.in.(${allowedDeviceIds.join(',')})`);
            }
            leiturasQuery = leiturasQuery.or(orFilters.join(','));
        }

        const { data: leiturasData, error } = await leiturasQuery
            .order("created_at", { ascending: false })
            .limit(1000);

        if (error) {
            console.error("[ThermoLink] Erro nas leituras:", error);
            updateLivePill(false);
            return;
        }

        updateLivePill(true);

        // 3. MAPEIA AS LEITURAS RECENTES (MÓDULO = FORNO!)
        const latestMap = new Map();
        const detectedModules = new Set();

        for (const r of leiturasData || []) {
            const mod = Number(r.modulo_alutal || r.forno_id || 1);
            if (Number.isFinite(mod)) {
                detectedModules.add(mod);
                if (!latestMap.has(mod)) {
                    latestMap.set(mod, r);
                }
            }
        }

        state.readings = latestMap;

        // 4. CONSTRÓI A LISTA DE FORNOS PARA O CLIENTE
        if (state.currentUser && state.currentUser.role !== "admin") {
            const primaryDev = clientDevices[0];
            const serialLabel = primaryDev ? (primaryDev.serial || primaryDev.numero_serie) : "THX";

            // Se o ESP enviou leituras de módulos, usamos os módulos ativos
            let mods = Array.from(detectedModules).sort((a, b) => a - b);
            if (mods.length === 0) {
                // Caso o aparelho esteja recém-vinculado sem envio ainda, exibe fornos iniciais
                const defaultCount = primaryDev?.modulo_num ? Math.max(primaryDev.modulo_num, 4) : 4;
                mods = Array.from({ length: defaultCount }, (_, i) => i + 1);
            }

            state.ovens = mods.map(m => ({
                id: m,
                numero: m,
                nome: `Forno ${String(m).padStart(2, '0')}`,
                dispositivo_serial: serialLabel,
                modelo: primaryDev?.modelo || "TLK-ESP8266-ALUTAL",
                ativo: true
            }));
        } else {
            // Modo Master Admin: exibe os módulos detectados ou de 1 a 31
            const allMods = detectedModules.size > 0
                ? Array.from(detectedModules).sort((a, b) => a - b)
                : Array.from({ length: 31 }, (_, i) => i + 1);

            state.ovens = allMods.map(m => ({
                id: m,
                numero: m,
                nome: `Forno ${String(m).padStart(2, '0')}`,
                ativo: true
            }));
        }

        // Hook: motor de alertas em tempo real
        if (window.ThermoAlertas) window.ThermoAlertas.verificarLeituras();

        // Renderiza telas
        renderListaFornos();

        if (state.activeTab === "historico") {
            carregarDadosAnalise();
        }

        // Atualiza forno em detalhe se estiver aberto
        if (state.selectedModule !== null) {
            atualizarFornoDetalhe(state.selectedModule);
        }
    } catch (err) {
        console.error("[ThermoLink] Falha na sincronização:", err);
        updateLivePill(false);
    } finally {
        state.isPolling = false;
    }
}

async function getHistoricoModulo(modulo, limit = 1000) {
    try {
        let q = sb
            .from("leituras")
            .select("canal_1, canal_2, modulo_alutal, created_at, data_hora, numero_serie, dispositivo_id, ceramica_id")
            .eq("modulo_alutal", modulo);

        if (state.currentUser && state.currentUser.role !== "admin") {
            const cid = state.currentUser.ceramicaId;
            const orList = [`ceramica_id.eq.${cid}`];
            if (state.allowedSerials && state.allowedSerials.length > 0) {
                orList.push(`numero_serie.in.(${state.allowedSerials.join(',')})`);
            }
            if (state.allowedDeviceIds && state.allowedDeviceIds.length > 0) {
                orList.push(`dispositivo_id.in.(${state.allowedDeviceIds.join(',')})`);
            }
            q = q.or(orList.join(','));
        }

        const { data, error } = await q
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) return [];
        return (data || []).reverse();
    } catch {
        return [];
    }
}

// ==========================================================================
// 3. TELA INICIAL (LISTAGEM DE FORNOS)
// ==========================================================================

function isFornoOnline(reading) {
    if (!reading || !reading.created_at) return false;
    const date = new Date(reading.created_at);
    if (Number.isNaN(date.getTime())) return false;
    return (Date.now() - date.getTime()) <= 3 * 60 * 1000;
}

function getNomeForno(modulo) {
    const oven = state.ovens.find(o => Number(o.numero) === Number(modulo));
    if (oven && oven.nome) {
        if (oven.dispositivo_serial) {
            return `${oven.nome} • ${oven.dispositivo_serial}`;
        }
        return oven.nome;
    }
    return `Forno ${String(modulo).padStart(2, "0")}`;
}

function renderListaFornos() {
    if (state.selectedModule !== null) return;

    state.miniCharts.forEach(c => c.destroy());
    state.miniCharts.clear();

    const container = $("listaFornos");

    // Se o cliente não tem nenhum aparelho vinculado ainda
    if (!state.ovens || !state.ovens.length) {
        $("statOnlineCount").textContent = "0 Fornos";
        container.innerHTML = `
            <div class="loading-box" style="padding: 40px 20px; text-align: center;">
                <i class="fa-solid fa-microchip" style="font-size: 40px; color: #f97316; margin-bottom: 14px;"></i>
                <h4 style="color: #ffffff; margin-bottom: 6px; font-size: 16px;">Nenhum Aparelho Vinculado</h4>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; max-width: 320px; margin: 0 auto;">
                    Sua cerâmica ainda não possui aparelhos ThermoX (ex: <b>THX-00003</b>) vinculados.<br>
                    Solicite ao administrador a vinculação do seu hardware para visualizar seus fornos.
                </p>
            </div>
        `;
        return;
    }

    const onlineOvens = state.ovens.filter(o => isFornoOnline(state.readings.get(Number(o.numero))));
    $("statOnlineCount").textContent = `${onlineOvens.length} de ${state.ovens.length} ${state.ovens.length === 1 ? 'Forno' : 'Fornos'}`;

    container.innerHTML = state.ovens.map(o => {
        const mod = Number(o.numero);
        const r = state.readings.get(mod);
        const online = isFornoOnline(r);
        const c1Val = numVal(r?.canal_1);
        const c2Val = numVal(r?.canal_2);
        const relTime = r ? formatRelativo(r.created_at) : "Sem leituras recentes";

        return `
            <article class="oven-item-card" onclick="abrirDetalheForno(${mod})">
                <div class="oven-card-head">
                    <div class="oven-card-title-group">
                        <span class="module-badge-mini">${escapeHtml(o.dispositivo_serial || `MÓDULO ${String(mod).padStart(2, "0")}`)}</span>
                        <div class="oven-card-name">${escapeHtml(o.nome || getNomeForno(mod))}</div>
                    </div>
                    <div class="oven-card-status" style="${online ? '' : 'color: #94a3b8; border-color: rgba(148,163,184,0.3); background: rgba(148,163,184,0.1);'}">
                        <span class="pulse-dot" style="${online ? '' : 'background: #94a3b8; box-shadow: none;'}"></span>
                        ${online ? 'ONLINE' : 'STANDBY'}
                    </div>
                </div>

                <div class="oven-card-main-grid">
                    <div class="oven-card-temp-box">
                        <span class="temp-c1-tag">Canal 1 (Superior)</span>
                        <div class="temp-c1-big">
                            ${c1Val !== null ? Math.round(c1Val) : "--"}<span class="unit">°C</span>
                        </div>
                    </div>
                    <div class="sparkline-container">
                        <canvas id="miniSpark-${mod}"></canvas>
                    </div>
                </div>

                <div class="oven-card-foot">
                    <span>Canal 2 (Inferior): <b class="foot-c2-val">${c2Val !== null ? Math.round(c2Val) + " °C" : "--"}</b></span>
                    <span class="foot-time-val"><i class="fa-regular fa-clock"></i> ${relTime}</span>
                </div>
            </article>
        `;
    }).join("");

    // Desenha sparklines apenas para fornos que possuem histórico recente
    state.ovens.forEach(o => {
        if (state.readings.has(Number(o.numero))) {
            desenharMiniSparkline(Number(o.numero));
        }
    });
}

async function desenharMiniSparkline(modulo) {
    const canvas = $(`miniSpark-${modulo}`);
    if (!canvas) return;

    const rows = await getHistoricoModulo(modulo, 20);
    const vals = rows.map(r => numVal(r.canal_1)).filter(v => v !== null);
    if (!vals.length) return;

    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 50);
    grad.addColorStop(0, "rgba(244, 123, 32, 0.35)");
    grad.addColorStop(1, "rgba(244, 123, 32, 0.0)");

    const chart = new Chart(canvas, {
        type: "line",
        data: {
            labels: vals.map(() => ""),
            datasets: [{
                data: vals,
                borderColor: "#f47b20",
                borderWidth: 2,
                tension: 0.35,
                pointRadius: 0,
                fill: true,
                backgroundColor: grad
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });

    state.miniCharts.set(modulo, chart);
}

// ==========================================================================
// 4. TELA DE DETALHE DO FORNO (FORNO 3D & SUB-ABAS)
// ==========================================================================

async function abrirDetalheForno(modulo) {
    state.selectedModule = modulo;

    $("headerTitle").textContent = getNomeForno(modulo);
    $("headerBackBtn").classList.remove("hidden");

    $("screenFornos").classList.add("hidden");
    $("screenHistorico").classList.add("hidden");
    $("screenConfig").classList.add("hidden");
    $("screenFornoDetalhe").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    $("gaugeModuleTag").textContent = `MÓDULO ${String(modulo).padStart(2, "0")}`;

    await atualizarFornoDetalhe(modulo);
}

function voltarListaFornos() {
    state.selectedModule = null;

    if (state.mainChart) {
        state.mainChart.destroy();
        state.mainChart = null;
    }

    $("headerTitle").textContent = "ThermoLink";
    $("headerBackBtn").classList.add("hidden");

    $("screenFornoDetalhe").classList.add("hidden");
    navegarAba(state.activeTab || "fornos");
    renderListaFornos();
}

async function atualizarFornoDetalhe(modulo) {
    const reading = state.readings.get(modulo);
    const c1 = numVal(reading?.canal_1);
    const c2 = numVal(reading?.canal_2);

    // Mostrador no Forno 3D
    $("gaugeMainTemp").textContent = c1 !== null ? `${Math.round(c1)} °C` : "-- °C";
    $("gaugeC2Sub").textContent = c2 !== null ? `${Math.round(c2)} °C` : "-- °C";
    $("gaugeLastTime").textContent = formatHora(reading?.created_at);

    if (c1 !== null && c2 !== null) {
        const delta = Math.abs(c1 - c2);
        $("gaugeDeltaT").textContent = `${Math.round(delta)} °C`;
    } else {
        $("gaugeDeltaT").textContent = "-- °C";
    }

    // Cards de Sensores
    $("cardValC1").textContent = c1 !== null ? `${Math.round(c1)} °C` : "-- °C";
    $("cardValC2").textContent = c2 !== null ? `${Math.round(c2)} °C` : "-- °C";

    // Histórico detalhado
    const rows = await getHistoricoModulo(modulo, 60);
    state.currentDetailHistory = rows;

    atualizarEstatisticasQueima(rows);
    renderTabelaLeituras(rows);
    renderGraficoPrincipal(rows);
}

function trocarSubAba(subAba) {
    state.activeSubTab = subAba;

    const botoes = document.querySelectorAll(".sub-tab-btn");
    botoes.forEach(b => b.classList.remove("active"));

    $("subAbaTempoReal").classList.add("hidden");
    $("subAbaGrafico").classList.add("hidden");
    $("subAbaLeituras").classList.add("hidden");

    if (subAba === "tempoReal") {
        botoes[0].classList.add("active");
        $("subAbaTempoReal").classList.remove("hidden");
    } else if (subAba === "grafico") {
        botoes[1].classList.add("active");
        $("subAbaGrafico").classList.remove("hidden");
        if (state.currentDetailHistory.length) {
            renderGraficoPrincipal(state.currentDetailHistory);
        }
    } else if (subAba === "leituras") {
        botoes[2].classList.add("active");
        $("subAbaLeituras").classList.remove("hidden");
    }
}

function atualizarEstatisticasQueima(rows) {
    if (!rows.length) return;

    const c1Vals = rows.map(r => numVal(r.canal_1)).filter(v => v !== null);
    const c2Vals = rows.map(r => numVal(r.canal_2)).filter(v => v !== null);

    if (c1Vals.length) {
        const max1 = Math.max(...c1Vals);
        const min1 = Math.min(...c1Vals);
        const avg1 = c1Vals.reduce((a, b) => a + b, 0) / c1Vals.length;

        $("subStatC1Max").textContent = `${Math.round(max1)}°C`;
        $("subStatC1Min").textContent = `${Math.round(min1)}°C`;
        $("quadMax").textContent = `${Math.round(max1)} °C`;
        $("quadMin").textContent = `${Math.round(min1)} °C`;
        $("quadAvg").textContent = `${Math.round(avg1)} °C`;
    }

    if (c2Vals.length) {
        $("subStatC2Max").textContent = `${Math.round(Math.max(...c2Vals))}°C`;
        $("subStatC2Min").textContent = `${Math.round(Math.min(...c2Vals))}°C`;
    }

    $("quadCount").textContent = `${rows.length} leituras`;
    $("chartPointCount").textContent = `${rows.length} pontos no gráfico`;
}

function renderTabelaLeituras(rows) {
    const tbody = $("detailTableBody");
    if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty-msg">Nenhuma leitura encontrada.</td></tr>`;
        return;
    }

    const ultimos = [...rows].reverse().slice(0, 25);
    tbody.innerHTML = ultimos.map(r => {
        const c1 = numVal(r.canal_1);
        const c2 = numVal(r.canal_2);
        const delta = (c1 !== null && c2 !== null) ? `${Math.round(Math.abs(c1 - c2))} °C` : "--";

        return `
            <tr>
                <td><b>${formatHora(r.created_at)}</b></td>
                <td class="text-orange"><b>${c1 !== null ? Math.round(c1) + " °C" : "--"}</b></td>
                <td class="text-blue"><b>${c2 !== null ? Math.round(c2) + " °C" : "--"}</b></td>
                <td>${delta}</td>
            </tr>
        `;
    }).join("");
}

function filtrarCanaisGrafico(canal) {
    state.chartChannelFilter = canal;
    const btns = document.querySelectorAll("#chartChannelFilter .pill-btn");
    btns.forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");

    if (state.currentDetailHistory.length) {
        renderGraficoPrincipal(state.currentDetailHistory);
    }
}

function renderGraficoPrincipal(rows) {
    const canvas = $("detailChartCanvas");
    if (!canvas || !rows.length) return;

    if (state.mainChart) {
        state.mainChart.destroy();
        state.mainChart = null;
    }

    const labels = rows.map(r => {
        const d = new Date(r.created_at);
        return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    });

    const c1Data = rows.map(r => numVal(r.canal_1));
    const c2Data = rows.map(r => numVal(r.canal_2));

    const ctx = canvas.getContext("2d");

    const gradC1 = ctx.createLinearGradient(0, 0, 0, 250);
    gradC1.addColorStop(0, "rgba(244, 123, 32, 0.35)");
    gradC1.addColorStop(1, "rgba(244, 123, 32, 0.0)");

    const gradC2 = ctx.createLinearGradient(0, 0, 0, 250);
    gradC2.addColorStop(0, "rgba(59, 130, 182, 0.25)");
    gradC2.addColorStop(1, "rgba(59, 130, 182, 0.0)");

    const datasets = [];

    if (state.chartChannelFilter === "all" || state.chartChannelFilter === "c1") {
        datasets.push({
            label: "Canal 1 (Superior)",
            data: c1Data,
            borderColor: "#f47b20",
            backgroundColor: gradC1,
            borderWidth: 2.5,
            pointRadius: 1,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: true
        });
    }

    if (state.chartChannelFilter === "all" || state.chartChannelFilter === "c2") {
        datasets.push({
            label: "Canal 2 (Inferior)",
            data: c2Data,
            borderColor: "#5ba6d5",
            backgroundColor: gradC2,
            borderWidth: 2,
            pointRadius: 1,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: true
        });
    }

    state.mainChart = new Chart(canvas, {
        type: "line",
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(7, 27, 43, 0.95)",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + " °C" : "--"}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#71899a", maxTicksLimit: 6, font: { size: 10 } },
                    grid: { color: "rgba(255, 255, 255, 0.04)" }
                },
                y: {
                    ticks: { color: "#71899a", font: { size: 10 }, callback: (v) => `${v}°` },
                    grid: { color: "rgba(255, 255, 255, 0.05)" }
                }
            }
        }
    });
}

// ==========================================================================
// 5. ABA DE ANÁLISE DETALHADA (COM FILTROS DE TEMPO, AMOSTRAGEM E TABELA)
// ==========================================================================

async function carregarDadosAnalise() {
    const select = $("analysisKilnSelect");
    if (!select) return;

    const availableOvens = state.ovens && state.ovens.length > 0 ? state.ovens : [];

    if (!availableOvens.length) {
        select.innerHTML = `<option value="">Nenhum forno disponível</option>`;
        limparEstatisticasAnalise();
        return;
    }

    // Se o forno atualmente selecionado na análise não estiver na lista, seleciona o primeiro
    if (!state.analysisModule || !availableOvens.some(o => Number(o.numero) === Number(state.analysisModule))) {
        state.analysisModule = Number(availableOvens[0].numero);
    }

    // Popula o select com todos os fornos desta cerâmica
    select.innerHTML = availableOvens.map(o => {
        const mod = Number(o.numero);
        const r = state.readings.get(mod);
        const online = isFornoOnline(r);
        return `<option value="${mod}" ${mod === state.analysisModule ? "selected" : ""}>
            ${escapeHtml(o.nome || getNomeForno(mod))} ${online ? '🟢 (Ao vivo)' : '⚪ (Standby)'}
        </option>`;
    }).join("");

    // Carrega a quantidade de amostras selecionada (até 1000)
    const rows = await getHistoricoModulo(state.analysisModule, state.analysisSampleSize);
    state.currentAnalysisRawHistory = rows;

    aplicarFiltrosEAtualizarAnalise();
}

function trocarFornoAnalise(modulo) {
    if (!modulo) return;
    state.analysisModule = Number(modulo);
    carregarDadosAnalise();
}

// FILTRO DE PERÍODO / TEMPO (HORAS)
function filtrarTempoAnalise(horas, btn) {
    state.analysisTimeRange = horas;
    document.querySelectorAll("#anTimeFilter .pill-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    aplicarFiltrosEAtualizarAnalise();
}

// FILTRO DE TAMANHO DA AMOSTRAGEM (NÚMERO DE LEITURAS)
function filtrarAmostragemAnalise(quantidade, btn) {
    state.analysisSampleSize = Number(quantidade);
    document.querySelectorAll("#anSampleFilter .pill-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    carregarDadosAnalise();
}

// FILTRO DE CANAIS (AMBOS, C1, C2)
function filtrarCanaisAnalise(canal) {
    state.analysisChannelFilter = canal;
    const btns = document.querySelectorAll("#anChannelFilter .pill-btn");
    btns.forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");

    if (state.currentAnalysisFilteredHistory.length) {
        renderGraficoAnalise(state.currentAnalysisFilteredHistory);
    }
}

// FILTRO DE QUANTIDADE DE LINHAS NA TABELA
function trocarLimiteTabela(limite) {
    state.analysisTableRowLimit = limite === "all" ? "all" : Number(limite);
    renderTabelaAnalise(state.currentAnalysisFilteredHistory);
}

function aplicarFiltrosEAtualizarAnalise() {
    let rows = [...state.currentAnalysisRawHistory];

    // Aplica filtro de tempo em horas
    if (state.analysisTimeRange !== "all") {
        const threshold = Date.now() - (Number(state.analysisTimeRange) * 60 * 60 * 1000);
        rows = rows.filter(r => {
            const time = new Date(r.created_at).getTime();
            return time >= threshold;
        });
    }

    state.currentAnalysisFilteredHistory = rows;
    atualizarPainelAnalise(rows);
}

function limparEstatisticasAnalise() {
    $("anStatMax").textContent = "-- °C";
    $("anStatMin").textContent = "-- °C";
    $("anStatAvg").textContent = "-- °C";
    $("anStatCount").textContent = "0 leituras";
    $("anTableBody").innerHTML = `<tr><td colspan="4" class="table-empty-msg">Nenhum dado disponível.</td></tr>`;
    if (state.analysisChart) {
        state.analysisChart.destroy();
        state.analysisChart = null;
    }
}

function atualizarPainelAnalise(rows) {
    if (!rows.length) {
        limparEstatisticasAnalise();
        return;
    }

    const c1Vals = rows.map(r => numVal(r.canal_1)).filter(v => v !== null);

    if (c1Vals.length) {
        const max = Math.max(...c1Vals);
        const min = Math.min(...c1Vals);
        const avg = c1Vals.reduce((a, b) => a + b, 0) / c1Vals.length;

        $("anStatMax").textContent = `${Math.round(max)} °C`;
        $("anStatMin").textContent = `${Math.round(min)} °C`;
        $("anStatAvg").textContent = `${Math.round(avg)} °C`;
        $("anStatCount").textContent = `${rows.length} leituras`;
        $("anChartSub").textContent = `Curva detalhada de ${rows.length} leituras`;
    }

    renderTabelaAnalise(rows);
    renderGraficoAnalise(rows);
}

function renderTabelaAnalise(rows) {
    const tbody = $("anTableBody");
    if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty-msg">Nenhum dado no período filtrado.</td></tr>`;
        return;
    }

    // Calcula pico máximo e mínimo do canal 1 (temperatura principal)
    const c1Vals = rows.map(r => numVal(r.canal_1)).filter(v => v !== null);
    const globalMax = c1Vals.length ? Math.max(...c1Vals) : null;
    const globalMin = c1Vals.length ? Math.min(...c1Vals) : null;

    // Índices das primeiras ocorrências de máx e mín
    const idxMax = globalMax !== null ? rows.findIndex(r => numVal(r.canal_1) === globalMax) : -1;
    const idxMin = globalMin !== null ? rows.findIndex(r => numVal(r.canal_1) === globalMin) : -1;

    let exibicao = [...rows].reverse();
    const totalRows = rows.length;

    // Converte índices do array original (não invertido) para o invertido
    const idxMaxInv = idxMax !== -1 ? totalRows - 1 - idxMax : -1;
    const idxMinInv = idxMin !== -1 ? totalRows - 1 - idxMin : -1;

    if (state.analysisTableRowLimit !== "all") {
        exibicao = exibicao.slice(0, state.analysisTableRowLimit);
    }

    tbody.innerHTML = exibicao.map((r, i) => {
        const c1 = numVal(r.canal_1);
        const c2 = numVal(r.canal_2);
        const delta = (c1 !== null && c2 !== null) ? `${Math.round(Math.abs(c1 - c2))} °C` : "--";

        const isMax = (i === idxMaxInv);
        const isMin = (i === idxMinInv);

        const rowClass = isMax ? "row-peak-max" : (isMin ? "row-peak-min" : "");
        const badgeMax = isMax ? `<span class="peak-badge peak-badge-max"><i class="fa-solid fa-arrow-up"></i> MÁX</span>` : "";
        const badgeMin = isMin ? `<span class="peak-badge peak-badge-min"><i class="fa-solid fa-arrow-down"></i> MÍN</span>` : "";

        return `
            <tr class="${rowClass}">
                <td><b>${formatHora(r.created_at)}</b>${badgeMax}${badgeMin}</td>
                <td class="text-orange"><b>${c1 !== null ? Math.round(c1) + " °C" : "--"}</b></td>
                <td class="text-blue"><b>${c2 !== null ? Math.round(c2) + " °C" : "--"}</b></td>
                <td>${delta}</td>
            </tr>
        `;
    }).join("");
}

function renderGraficoAnalise(rows) {
    const canvas = $("analysisChartCanvas");
    if (!canvas || !rows.length) return;

    if (state.analysisChart) {
        state.analysisChart.destroy();
        state.analysisChart = null;
    }

    const labels = rows.map(r => {
        const d = new Date(r.created_at);
        return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    });

    const c1Data = rows.map(r => numVal(r.canal_1));
    const c2Data = rows.map(r => numVal(r.canal_2));

    const ctx = canvas.getContext("2d");

    const gradC1 = ctx.createLinearGradient(0, 0, 0, 280);
    gradC1.addColorStop(0, "rgba(244, 123, 32, 0.40)");
    gradC1.addColorStop(1, "rgba(244, 123, 32, 0.0)");

    const gradC2 = ctx.createLinearGradient(0, 0, 0, 280);
    gradC2.addColorStop(0, "rgba(59, 130, 182, 0.30)");
    gradC2.addColorStop(1, "rgba(59, 130, 182, 0.0)");

    const datasets = [];

    if (state.analysisChannelFilter === "all" || state.analysisChannelFilter === "c1") {
        datasets.push({
            label: "Canal 1 (Superior)",
            data: c1Data,
            borderColor: "#f47b20",
            backgroundColor: gradC1,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: true
        });
    }

    if (state.analysisChannelFilter === "all" || state.analysisChannelFilter === "c2") {
        datasets.push({
            label: "Canal 2 (Inferior)",
            data: c2Data,
            borderColor: "#5ba6d5",
            backgroundColor: gradC2,
            borderWidth: 1.8,
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: true
        });
    }

    state.analysisChart = new Chart(canvas, {
        type: "line",
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(7, 27, 43, 0.95)",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + " °C" : "--"}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#71899a", maxTicksLimit: 8, font: { size: 10 } },
                    grid: { color: "rgba(255, 255, 255, 0.04)" }
                },
                y: {
                    ticks: { color: "#71899a", font: { size: 10 }, callback: (v) => `${v}°` },
                    grid: { color: "rgba(255, 255, 255, 0.05)" }
                }
            }
        }
    });
}

// ==========================================================================
// 6. NAVEGAÇÃO ENTRE ABAS DO MENU INFERIOR
// ==========================================================================

function navegarAba(aba) {
    state.activeTab = aba;
    state.selectedModule = null;

    if (state.mainChart) {
        state.mainChart.destroy();
        state.mainChart = null;
    }

    $("headerTitle").textContent = "ThermoLink";
    $("headerBackBtn").classList.add("hidden");

    // Desativa todas as telas
    $("screenFornos").classList.add("hidden");
    $("screenFornoDetalhe").classList.add("hidden");
    $("screenHistorico").classList.add("hidden");
    $("screenConfig").classList.add("hidden");

    // Desativa botões da bottom nav
    document.querySelectorAll(".bottom-tab-bar .tab-item").forEach(b => b.classList.remove("active"));

    if (aba === "fornos") {
        $("tabNavFornos").classList.add("active");
        $("screenFornos").classList.remove("hidden");
        renderListaFornos();
    } else if (aba === "historico") {
        $("tabNavHistorico").classList.add("active");
        $("screenHistorico").classList.remove("hidden");
        carregarDadosAnalise();
    } else if (aba === "config") {
        $("tabNavConfig").classList.add("active");
        $("screenConfig").classList.remove("hidden");
    }
}

// ==========================================================================
// 7. UTILITÁRIOS E HELPERS
// ==========================================================================

function numVal(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function formatHora(val) {
    if (!val) return "--:--:--";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return "--:--:--";
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatRelativo(val) {
    if (!val) return "--";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return "--";
    const sec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
    if (sec < 5) return "agora";
    if (sec < 60) return `há ${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `há ${min}m`;
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function updateLivePill(online) {
    const pill = $("liveSyncPill");
    if (!pill) return;
    if (online) {
        pill.innerHTML = `<span class="pulse-dot"></span><span class="live-label">ONLINE</span>`;
        pill.style.color = "var(--green)";
        pill.style.background = "var(--green-bg)";
    } else {
        pill.innerHTML = `<span class="pulse-dot" style="background: var(--red); box-shadow: none; animation: none;"></span><span class="live-label">RECONECTANDO</span>`;
        pill.style.color = "var(--red)";
        pill.style.background = "var(--red-bg)";
    }
}

async function atualizarManual() {
    const icon = $("refreshIcon");
    if (icon) icon.style.transform = "rotate(360deg)";
    await carregarFornosELeituras();
    setTimeout(() => { if (icon) icon.style.transform = "none"; }, 400);
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ==========================================================================
// 8. INICIALIZAÇÃO
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Sessão válida → Splash ThermoLink (2,5s) → app principal
    // Sem sessão / sessão inválida → tela de login direto
    const sessao = verificarSessaoSalva();
    if (sessao) {
        iniciarPainelUsuario(sessao, true);
    } else {
        $("splashScreen").classList.add("hidden");
        $("loginScreen").classList.remove("hidden");
    }

    // Sincronização automática a cada 8 segundos (apenas para clientes ativos)
    setInterval(() => {
        if (state.currentUser && state.currentUser.status !== "Bloqueado") {
            carregarFornosELeituras();
        }
    }, 8000);
});
