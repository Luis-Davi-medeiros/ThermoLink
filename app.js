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
    landscapeChart: null,
    isLandscapeOpen: false,
    landscapeChannelFilter: "all",
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

// ==========================================================================
// MONITORAMENTO & TELEMETRIA DE ACESSO DO USUÁRIO
// ==========================================================================
const AccessTelemetry = {
    heartbeatTimer: null,
    currentSessionToken: null,

    detectarDispositivo() {
        const ua = navigator.userAgent || "";
        const isTouch = navigator.maxTouchPoints > 0;
        const width = window.screen?.width || window.innerWidth;

        if (/iPad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
            return "Tablet (iPad)";
        }
        if (/Tablet|Android/i.test(ua) && !/Mobile/i.test(ua)) {
            return "Tablet";
        }
        if (/iPhone/i.test(ua)) {
            return "Smartphone (iPhone)";
        }
        if (/Android/i.test(ua) && /Mobile/i.test(ua)) {
            return "Smartphone (Android)";
        }
        if (/Mobile|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (isTouch && width <= 768)) {
            return "Dispositivo Móvel";
        }
        if (width <= 1024 && isTouch) {
            return "Tablet / Touch";
        }
        return "Computador / Desktop";
    },

    detectarNavegador() {
        const ua = navigator.userAgent || "";
        let browser = "Navegador Web";
        let version = "";

        if (/Edg\/([0-9\.]+)/i.test(ua)) {
            browser = "Microsoft Edge";
            version = RegExp.$1.split(".")[0];
        } else if (/OPR\/([0-9\.]+)/i.test(ua) || /Opera/i.test(ua)) {
            browser = "Opera";
            version = RegExp.$1.split(".")[0];
        } else if (/SamsungBrowser\/([0-9\.]+)/i.test(ua)) {
            browser = "Samsung Internet";
            version = RegExp.$1.split(".")[0];
        } else if (/Chrome\/([0-9\.]+)/i.test(ua)) {
            browser = "Google Chrome";
            version = RegExp.$1.split(".")[0];
        } else if (/Version\/([0-9\.]+).*Safari/i.test(ua)) {
            browser = "Safari";
            version = RegExp.$1.split(".")[0];
        } else if (/Firefox\/([0-9\.]+)/i.test(ua)) {
            browser = "Mozilla Firefox";
            version = RegExp.$1.split(".")[0];
        }
        return version ? `${browser} ${version}` : browser;
    },

    detectarSO() {
        const ua = navigator.userAgent || "";
        if (/Windows NT 10.0|Windows NT 11.0/i.test(ua)) return "Windows 10/11";
        if (/Windows NT 6.3/i.test(ua)) return "Windows 8.1";
        if (/Windows NT 6.1/i.test(ua)) return "Windows 7";
        if (/Windows/i.test(ua)) return "Windows";
        if (/Android/i.test(ua)) {
            const m = ua.match(/Android\s([0-9\.]+)/i);
            return m ? `Android ${m[1].split(".")[0]}` : "Android";
        }
        if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
            return "iOS / iPadOS";
        }
        if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";
        return "Outro SO";
    },

    async obterIpAcesso() {
        const cached = sessionStorage.getItem("thermolink_cached_ip");
        if (cached && cached !== "Não identificado") return cached;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const resp = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
            clearTimeout(timeoutId);
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.ip) {
                    sessionStorage.setItem("thermolink_cached_ip", data.ip);
                    return data.ip;
                }
            }
        } catch (e) {
            try {
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
                const resp2 = await fetch("https://ipapi.co/json/", { signal: controller2.signal });
                clearTimeout(timeoutId2);
                if (resp2.ok) {
                    const data2 = await resp2.json();
                    if (data2 && data2.ip) {
                        sessionStorage.setItem("thermolink_cached_ip", data2.ip);
                        return data2.ip;
                    }
                }
            } catch (e2) {}
        }
        return "Não identificado";
    },

    async registrarAcesso(user, isNovoLogin = false) {
        if (!user || !user.username) return;
        if (user.isImpersonateMode) return;

        let token = sessionStorage.getItem("thermolink_session_token");
        if (!token || isNovoLogin) {
            token = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem("thermolink_session_token", token);
        }
        this.currentSessionToken = token;

        const dev = this.detectarDispositivo();
        const nav = this.detectarNavegador();
        const so = this.detectarSO();
        const ip = await this.obterIpAcesso();
        const agoraIso = new Date().toISOString();

        // Incrementa contagem de acessos
        let totalAcessos = 1;
        const accessMap = JSON.parse(localStorage.getItem("thermolink_user_access_count") || "{}");
        const uKey = user.username.toLowerCase();
        accessMap[uKey] = (accessMap[uKey] || 0) + 1;
        totalAcessos = accessMap[uKey];
        localStorage.setItem("thermolink_user_access_count", JSON.stringify(accessMap));

        // Registro local para auditoria instantânea / fallback
        const localAudit = JSON.parse(localStorage.getItem("thermolink_audit_logs") || "[]");
        localAudit.unshift({
            session_token: token,
            usuario: user.username,
            nome: user.name || user.username,
            ceramica_id: user.ceramicaId || null,
            role: user.role || "client",
            login_em: agoraIso,
            ultimo_acesso: agoraIso,
            quantidade_acessos: totalAcessos,
            dispositivo: dev,
            navegador: nav,
            sistema_operacional: so,
            ip_acesso: ip,
            user_agent: navigator.userAgent
        });
        if (localAudit.length > 200) localAudit.length = 200;
        localStorage.setItem("thermolink_audit_logs", JSON.stringify(localAudit));

        // Sincronização com o Supabase
        try {
            const { data: sessaoExistente } = await sb
                .from("acessos_usuarios")
                .select("id, quantidade_acessos")
                .eq("session_token", token)
                .maybeSingle();

            if (sessaoExistente) {
                await sb
                    .from("acessos_usuarios")
                    .update({
                        ultimo_acesso: agoraIso,
                        ip_acesso: ip !== "Não identificado" ? ip : undefined
                    })
                    .eq("id", sessaoExistente.id);
            } else {
                await sb
                    .from("acessos_usuarios")
                    .insert([{
                        session_token: token,
                        usuario: user.username,
                        nome: user.name || user.username,
                        ceramica_id: user.ceramicaId || null,
                        role: user.role || "client",
                        login_em: agoraIso,
                        ultimo_acesso: agoraIso,
                        quantidade_acessos: totalAcessos,
                        dispositivo: dev,
                        navegador: nav,
                        sistema_operacional: so,
                        ip_acesso: ip,
                        user_agent: navigator.userAgent
                    }]);
            }

            if (user.ceramicaId) {
                await sb
                    .from("ceramicas")
                    .update({
                        ultimo_acesso: agoraIso,
                        total_acessos: totalAcessos
                    })
                    .eq("id", user.ceramicaId);
            }
        } catch (err) {
            console.warn("[AccessTelemetry] Sincronização offline/cache:", err);
        }

        this.iniciarHeartbeat(user, token);
    },

    iniciarHeartbeat(user, token) {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

        this.heartbeatTimer = setInterval(async () => {
            if (!state.currentUser || document.visibilityState === "hidden") return;

            const agora = new Date().toISOString();
            try {
                if (token) {
                    await sb
                        .from("acessos_usuarios")
                        .update({ ultimo_acesso: agora })
                        .eq("session_token", token);
                }

                if (user.ceramicaId) {
                    await sb
                        .from("ceramicas")
                        .update({ ultimo_acesso: agora })
                        .eq("id", user.ceramicaId);
                }
            } catch (e) {}
        }, 90000);
    },

    encerrarSessao() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        const token = sessionStorage.getItem("thermolink_session_token");
        if (token) {
            try {
                sb.from("acessos_usuarios")
                    .update({ ultimo_acesso: new Date().toISOString() })
                    .eq("session_token", token)
                    .then(() => {});
            } catch (e) {}
        }
        sessionStorage.removeItem("thermolink_session_token");
        sessionStorage.removeItem("thermolink_session_recorded");
        this.currentSessionToken = null;
    }
};

async function realizarLogin(e) {
    e.preventDefault();
    const userVal = $("loginUser").value.trim().toLowerCase();
    const passVal = $("loginPassword").value.trim();

    // 1. Usuários locais/pré-definidos
    const users = getRegisteredUsers();
    let found = users.find(u => u.username.toLowerCase() === userVal && u.password === passVal);

    // 2. Se não encontrou, autentica com o Supabase de forma segura (RPC com hash ou consulta direta)
    if (!found) {
        try {
            // Tenta primeiro via função RPC segura com hash bcrypt
            const { data: rpcData, error: rpcError } = await sb.rpc("fn_login_ceramica", {
                p_username: userVal,
                p_senha: passVal
            });

            let ceramicaData = Array.isArray(rpcData) && rpcData.length > 0 ? rpcData[0] : null;

            // Fallback transitório caso a procedure ainda não tenha sido rodada no Supabase
            if (!ceramicaData && rpcError) {
                const { data } = await sb
                    .from("ceramicas")
                    .select("id, nome, username, status, motivo_bloqueio")
                    .ilike("username", userVal)
                    .eq("senha", passVal)
                    .maybeSingle();
                ceramicaData = data;
            }

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
            console.warn("[Login] Erro ao autenticar no Supabase:", err);
        }
    }

    if (found) {
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

        const sessao = {
            username: found.username,
            name: found.name,
            role: found.role,
            status: found.status || "Ativo",
            motivoBloqueio: found.motivoBloqueio || null,
            ceramicaId: found.ceramicaId || null,
            loginAt: new Date().toISOString()
        };

        if ($("rememberMe").checked) {
            localStorage.setItem("thermolink_active_session", JSON.stringify(sessao));
        }

        iniciarPainelUsuario(sessao, false);
        AccessTelemetry.registrarAcesso(sessao, true);
    } else {
        $("loginError").textContent = "Usuário ou senha incorretos.";
        $("loginError").classList.remove("hidden");
    }
}

function iniciarPainelUsuario(user, usarSplash = false) {
    state.currentUser = user;

    // Registra sessão ativa e telemetria de acesso
    if (sessionStorage.getItem("thermolink_session_recorded") !== user.username) {
        sessionStorage.setItem("thermolink_session_recorded", user.username);
        AccessTelemetry.registrarAcesso(user, false);
    }

    // Sincroniza status de bloqueio e motivo mais recente
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

    const abrirApp = () => {
        $("splashScreen").classList.add("hidden");
        $("mainApp").classList.remove("hidden");

        voltarListaFornos();

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
            if (window.ThermoSetpoints) window.ThermoSetpoints.init();
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

    const impBanner = $("impersonateBanner");
    if (impBanner) {
        if (user.isImpersonateMode) {
            $("impClientName").textContent = user.name || user.username;
            impBanner.classList.remove("hidden");
        } else {
            impBanner.classList.add("hidden");
        }
    }

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
    AccessTelemetry.encerrarSessao();
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

            // Busca no Supabase todos os dispositivos vinculados a esta cerâmica
            // (aceita status "Vinculado" ou "Online", caso o ESP8266 tenha reportado telemetria sobrescrevendo status)
            try {
                const { data: devs, error: errDevs } = await sb
                    .from("dispositivos")
                    .select("id, serial, numero_serie, modelo, modulo_num, forno_id, status, ceramica_id")
                    .eq("ceramica_id", cid);

                if (!errDevs && devs && devs.length > 0) {
                    clientDevices = devs.filter(d => d.status !== "Disponível" && d.status !== "Manutenção");

                    // Auto-reparo: se algum aparelho vinculado estiver com status "Online" no banco, restaura para "Vinculado"
                    devs.forEach(d => {
                        if (d.ceramica_id && d.status === "Online" && d.id) {
                            d.status = "Vinculado";
                            sb.from("dispositivos").update({ status: "Vinculado" }).eq("id", d.id).then(() => {});
                        }
                    });
                }
            } catch (errDev) {
                console.warn("[ThermoLink] Falha ao consultar dispositivos no Supabase:", errDev);
            }

            // Fallback no localStorage
            if (!clientDevices.length) {
                const localDevs = JSON.parse(localStorage.getItem("thermolink_devices_admin") || "[]");
                clientDevices = localDevs.filter(d => (d.ceramicaId === cid || d.ceramica_id === cid) && d.status !== "Disponível" && d.status !== "Manutenção");
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

        // 2. CARREGA APENAS AS LEITURAS DESTE(S) APARELHO(S) VINCULADO(S)
        let leiturasQuery = sb
            .from("leituras")
            .select("id, dispositivo_id, forno_id, modulo_alutal, canal_1, canal_2, numero_serie, ceramica_id, created_at, data_hora");

        if (state.currentUser && state.currentUser.role !== "admin") {
            const devFilters = [];
            if (allowedSerials.length > 0) {
                devFilters.push(`numero_serie.in.(${allowedSerials.join(',')})`);
            }
            if (allowedDeviceIds.length > 0) {
                devFilters.push(`dispositivo_id.in.(${allowedDeviceIds.join(',')})`);
            }

            // Puxa ESTRITAMENTE as leituras geradas pelo dispositivo vinculado (ex: THX-00002)
            if (devFilters.length > 0) {
                leiturasQuery = leiturasQuery.or(devFilters.join(','));
            } else {
                state.ovens = [];
                state.readings = new Map();
                updateLivePill(true);
                renderListaFornos();
                return;
            }
        }

        const { data: rawLeiturasData, error } = await leiturasQuery
            .order("created_at", { ascending: false })
            .limit(1000);

        if (error) {
            console.error("[ThermoLink] Erro nas leituras:", error);
            updateLivePill(false);
            return;
        }

        // Filtro estrito em memória: garante que apenas leituras do hardware vinculado entrem
        const leiturasData = (rawLeiturasData || []).filter(r => {
            if (state.currentUser && state.currentUser.role !== "admin") {
                const sOk = r.numero_serie && allowedSerials.includes(r.numero_serie);
                const idOk = r.dispositivo_id && allowedDeviceIds.includes(Number(r.dispositivo_id));
                return sOk || idOk;
            }
            return true;
        });

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
                // Caso o aparelho esteja recém-vinculado sem envio ainda, exibe o forno configurado no aparelho
                const configuredMods = clientDevices
                    .map(d => Number(d.modulo_num || d.forno_id || 1))
                    .filter(n => Number.isFinite(n) && n > 0);
                mods = configuredMods.length > 0 ? Array.from(new Set(configuredMods)).sort((a, b) => a - b) : [1];
            }

            state.ovens = mods.map(m => {
                const devMatched = clientDevices.find(d => Number(d.modulo_num || d.forno_id) === Number(m)) || primaryDev;
                return {
                    id: m,
                    numero: m,
                    nome: `Forno ${String(m).padStart(2, '0')}`,
                    dispositivo_serial: devMatched ? (devMatched.serial || devMatched.numero_serie) : serialLabel,
                    modelo: devMatched?.modelo || primaryDev?.modelo || "TLK-ESP8266-ALUTAL",
                    ativo: true
                };
            });
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

        // Hook: sincronização de setpoints
        if (window.ThermoSetpoints) window.ThermoSetpoints.sincronizarComFornos();
        if (typeof sincronizarPainelSetpointsAnalise === "function") sincronizarPainelSetpointsAnalise(state.selectedModule);

        // Renderiza telas
        if (state.selectedModule === null) {
            renderListaFornos();
        } else {
            if (state.analysisModule) atualizarFaixaResumoAnalise(state.analysisModule);
            // IMPORTANTE: NÃO chamamos carregarDadosAnalise() em segundo plano!
            // Isso evita que o gráfico sofra refresh periódico e perca o zoom ou a navegação do usuário.
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
            const devFilters = [];
            if (state.allowedSerials && state.allowedSerials.length > 0) {
                devFilters.push(`numero_serie.in.(${state.allowedSerials.join(',')})`);
            }
            if (state.allowedDeviceIds && state.allowedDeviceIds.length > 0) {
                devFilters.push(`dispositivo_id.in.(${state.allowedDeviceIds.join(',')})`);
            }

            if (devFilters.length > 0) {
                q = q.or(devFilters.join(','));
            } else {
                return [];
            }
        }

        const { data, error } = await q
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) return [];

        const filtered = (data || []).filter(r => {
            if (state.currentUser && state.currentUser.role !== "admin") {
                const sOk = r.numero_serie && state.allowedSerials?.includes(r.numero_serie);
                const idOk = r.dispositivo_id && state.allowedDeviceIds?.includes(Number(r.dispositivo_id));
                return sOk || idOk;
            }
            return true;
        });

        return filtered.reverse();
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

    // Ordenação estrita sequencial de 1 até N (conforme solicitado pelo cliente)
    const sortedOvens = [...state.ovens].sort((a, b) => Number(a.numero) - Number(b.numero));

    const onlineOvens = sortedOvens.filter(o => isFornoOnline(state.readings.get(Number(o.numero))));
    $("statOnlineCount").textContent = `${onlineOvens.length} de ${sortedOvens.length} ${sortedOvens.length === 1 ? 'Forno' : 'Fornos'}`;

    container.innerHTML = sortedOvens.map(o => {
        const mod = Number(o.numero);
        const r = state.readings.get(mod);
        const online = isFornoOnline(r);
        const c1Val = numVal(r?.canal_1);
        const c2Val = numVal(r?.canal_2);
        const relTime = r ? formatRelativo(r.created_at) : "Sem leituras";
        const horaLeitura = r ? formatHora(r.created_at) : "--:--:--";
        const delta = (c1Val !== null && c2Val !== null) ? Math.abs(c1Val - c2Val) : null;
        const nomeForno = o.nome || `Forno ${String(mod).padStart(2, '0')}`;

        return `
            <article class="kiln-3d-card kiln-card-interactive" onclick="abrirDetalheForno(${mod}, 'grafico')" title="Toque para ver gráficos do ${escapeHtml(nomeForno)}">
                <div class="kiln-top-meta">
                    <div class="kiln-card-title-box">
                        <h3 class="kiln-card-title">${escapeHtml(nomeForno)}</h3>
                        ${o.dispositivo_serial ? `<span class="kiln-card-serial"><i class="fa-solid fa-microchip"></i> ${escapeHtml(o.dispositivo_serial)}</span>` : ''}
                    </div>
                    <span class="status-indicator-badge ${online ? 'is-online' : 'is-standby'}">
                        <span class="pulse-dot"></span>
                        <span class="status-text">${online ? 'ONLINE' : 'STANDBY'}</span>
                    </span>
                </div>

                <!-- IMAGEM DO FORNO 3D COM OVERLAYS DE TEMPERATURA FLUTUANTES -->
                <div class="kiln-3d-visual-container">
                    <img src="nova imagen de um forno.png" alt="${escapeHtml(nomeForno)}" class="kiln-3d-image">
                    
                    <!-- SENSOR SUPERIOR (CANAL 1) -->
                    <div class="sensor-overlay-tag overlay-top">
                        <div class="overlay-tag-header">
                            <span class="sensor-dot c1"></span>
                            <span>CANAL 1 (SUPERIOR)</span>
                        </div>
                        <div class="overlay-tag-temp text-orange">
                            ${c1Val !== null ? Math.round(c1Val) + ' °C' : '-- °C'}
                        </div>
                    </div>

                    <!-- SENSOR INFERIOR (CANAL 2) -->
                    <div class="sensor-overlay-tag overlay-bottom">
                        <div class="overlay-tag-header">
                            <span class="sensor-dot c2"></span>
                            <span>CANAL 2 (INFERIOR)</span>
                        </div>
                        <div class="overlay-tag-temp text-blue">
                            ${c2Val !== null ? Math.round(c2Val) + ' °C' : '-- °C'}
                        </div>
                    </div>
                </div>

                <div class="gauge-footer-meta">
                    <div class="gauge-meta-item">
                        <span>ÚLTIMA LEITURA</span>
                        <strong><i class="fa-regular fa-clock"></i> ${horaLeitura} <small class="meta-reltime">(${relTime})</small></strong>
                    </div>
                    <div class="gauge-meta-item text-right">
                        <span>DIFERENCIAL (ΔT)</span>
                        <strong class="text-orange">${delta !== null ? Math.round(delta) + ' °C' : '-- °C'}</strong>
                    </div>
                </div>

                <div class="kiln-cta-banner">
                    <div class="cta-left">
                        <i class="fa-solid fa-chart-line text-orange"></i>
                        <span>Ver Análise do Forno</span>
                    </div>
                    <i class="fa-solid fa-chevron-right cta-arrow"></i>
                </div>
            </article>
        `;
    }).join("");
}

// ==========================================================================
// 4. ANÁLISE DO FORNO SELECIONADO (ABERTA AO CLICAR NO FORNO)
// ==========================================================================

async function abrirDetalheForno(modulo) {
    const mod = Number(modulo);
    state.selectedModule = mod;
    state.analysisModule = mod;

    $("headerTitle").textContent = getNomeForno(mod);
    $("headerBackBtn").classList.remove("hidden");

    $("screenFornos").classList.add("hidden");
    $("screenConfig").classList.add("hidden");
    $("screenHistoricoQueimas").classList.add("hidden");
    $("screenAnaliseForno").classList.remove("hidden");

    // Mantém aba Fornos ativa no rodapé pois a análise fica dentro do forno
    document.querySelectorAll(".bottom-tab-bar .tab-item").forEach(b => b.classList.remove("active"));
    $("tabNavFornos").classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });

    atualizarFaixaResumoAnalise(mod);
    if (window.ThermoSetpoints) window.ThermoSetpoints.atualizarResumoForno(mod);
    if (typeof sincronizarPainelSetpointsAnalise === "function") sincronizarPainelSetpointsAnalise(mod);
    await carregarDadosAnalise();
}

function voltarListaFornos() {
    state.selectedModule = null;

    $("headerTitle").textContent = "ThermoLink";
    $("headerBackBtn").classList.add("hidden");

    $("screenAnaliseForno").classList.add("hidden");
    $("screenHistoricoQueimas").classList.add("hidden");
    $("screenConfig").classList.add("hidden");
    $("screenFornos").classList.remove("hidden");

    document.querySelectorAll(".bottom-tab-bar .tab-item").forEach(b => b.classList.remove("active"));
    $("tabNavFornos").classList.add("active");
    state.activeTab = "fornos";

    renderListaFornos();
}

function atualizarFaixaResumoAnalise(modulo) {
    const mod = Number(modulo);
    const reading = state.readings.get(mod);
    const online = isFornoOnline(reading);
    const c1 = numVal(reading?.canal_1);
    const c2 = numVal(reading?.canal_2);
    const delta = (c1 !== null && c2 !== null) ? Math.abs(c1 - c2) : null;

    if ($("anLiveTitle")) $("anLiveTitle").textContent = getNomeForno(mod);
    if ($("anLiveStatus")) {
        $("anLiveStatus").className = `status-indicator-badge ${online ? 'is-online' : 'is-standby'}`;
    }
    if ($("anLiveStatusText")) {
        $("anLiveStatusText").textContent = online ? 'ONLINE' : 'STANDBY';
    }
    if ($("anLiveC1")) $("anLiveC1").textContent = c1 !== null ? Math.round(c1) + ' °C' : '-- °C';
    if ($("anLiveC2")) $("anLiveC2").textContent = c2 !== null ? Math.round(c2) + ' °C' : '-- °C';
    if ($("anLiveDelta")) $("anLiveDelta").textContent = delta !== null ? Math.round(delta) + ' °C' : '-- °C';
}

// ==========================================================================
// 5. ABA DE ANÁLISE DETALHADA (EXCLUSIVA DO FORNO ABERTO)
// ==========================================================================

async function carregarDadosAnalise() {
    const mod = state.analysisModule || state.selectedModule;
    if (!mod) return;

    atualizarFaixaResumoAnalise(mod);

    // Carrega leituras históricas do forno selecionado (amostragem máxima de até 1000 leituras)
    const rows = await getHistoricoModulo(mod, 1000);
    state.currentAnalysisRawHistory = rows;

    aplicarFiltrosEAtualizarAnalise();
}

// FILTRO DE PERÍODO / TEMPO (HORAS)
function filtrarTempoAnalise(horas, btn) {
    state.analysisTimeRange = horas;
    document.querySelectorAll("#anTimeFilter .pill-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    aplicarFiltrosEAtualizarAnalise();
}

// FILTRO DE CANAIS (AMBOS, C1, C2)
function filtrarCanaisAnalise(canal, btn) {
    state.analysisChannelFilter = canal;
    document.querySelectorAll("#anChannelFilter .pill-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    if (state.currentAnalysisFilteredHistory.length) {
        renderGraficoAnalise(state.currentAnalysisFilteredHistory);
    }
}

// FILTRO DE QUANTIDADE DE LINHAS NA TABELA
function trocarLimiteTabela(limite) {
    state.analysisTableRowLimit = limite === "all" ? "all" : Number(limite);
    renderTabelaAnalise(state.currentAnalysisFilteredHistory);
}

// EXPANDIR / RECOLHER TABELA DE LEITURAS
function toggleTabelaAnalise() {
    const wrapper = $("anTableScrollWrapper");
    const chevron = $("anTableChevron");
    if (!wrapper) return;
    wrapper.classList.toggle("collapsed");
    if (chevron) chevron.classList.toggle("collapsed");
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
    if ($("anStatMax")) $("anStatMax").textContent = "-- °C";
    if ($("anStatMin")) $("anStatMin").textContent = "-- °C";
    if ($("anStatAvg")) $("anStatAvg").textContent = "-- °C";
    if ($("anStatCount")) $("anStatCount").textContent = "--";
    if ($("anStatCountPill")) $("anStatCountPill").textContent = "0 leituras";
    if ($("anTableBody")) $("anTableBody").innerHTML = `<tr><td colspan="4" class="table-empty-msg">Nenhum dado disponível.</td></tr>`;
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

        if ($("anStatMax")) $("anStatMax").textContent = `${Math.round(max)} °C`;
        if ($("anStatMin")) $("anStatMin").textContent = `${Math.round(min)} °C`;
        if ($("anStatAvg")) $("anStatAvg").textContent = `${Math.round(avg)} °C`;
        if ($("anStatCount")) $("anStatCount").textContent = `${rows.length} pts`;
        if ($("anStatCountPill")) $("anStatCountPill").textContent = `${rows.length} leituras`;
        if ($("anChartSub")) $("anChartSub").textContent = `Curva detalhada de ${rows.length} leituras`;
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
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    const item = rows[idx];
                    if (item) {
                        atualizarInspectorAnalise(item);
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(7, 27, 43, 0.95)",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + " °C" : "--"}`
                    },
                    external: (context) => {
                        const tooltip = context.tooltip;
                        if (!tooltip || !tooltip.dataPoints || !tooltip.dataPoints.length) return;
                        const idx = tooltip.dataPoints[0].dataIndex;
                        const item = rows[idx];
                        if (item) {
                            atualizarInspectorAnalise(item);
                        }
                    }
                },
                zoom: {
                    pan: { enabled: false },
                    zoom: { wheel: { enabled: false }, pinch: { enabled: false } }
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

    // Inicializa inspector com a leitura mais recente
    atualizarInspectorAnalise(rows[rows.length - 1]);

    // Toque no gráfico em pé abre imediatamente o modo horizontal de lado
    canvas.onclick = () => abrirGraficoLandscape();

    // Habilita gestos fluidos multi-touch (pinch-zoom + pan)
    habilitarGestosGrafico("analysisChartCanvas", () => state.analysisChart, () => state.currentAnalysisFilteredHistory, false);

    if (state.isLandscapeOpen) {
        renderGraficoLandscape(rows);
    }
}

// ==========================================================================
// 5.1 GRÁFICO FULLSCREEN LANDSCAPE (VISUALIZAÇÃO DE LADO NO CELULAR)
// ==========================================================================

function aoClicarCanvasAnalise(event) {
    // Ao clicar no gráfico em pé, abre imediatamente o modo horizontal de lado
    abrirGraficoLandscape();
}

async function abrirGraficoLandscape() {
    const modal = $("modalGraficoLandscape");
    if (!modal) return;

    state.isLandscapeOpen = true;
    modal.classList.remove("hidden");

    // Atualiza cabeçalho do modal landscape
    const mod = state.analysisModule || state.selectedModule || 1;
    const r = state.readings.get(Number(mod));
    const online = isFornoOnline(r);

    if ($("landFornoTitle")) $("landFornoTitle").textContent = getNomeForno(mod);
    if ($("landStatusBadge")) {
        $("landStatusBadge").className = `status-indicator-badge ${online ? 'is-online' : 'is-standby'}`;
    }
    if ($("landStatusText")) {
        $("landStatusText").textContent = online ? 'ONLINE' : 'STANDBY';
    }

    // Tenta solicitar tela cheia e travamento horizontal nativo se suportado
    try {
        if (modal.requestFullscreen) {
            await modal.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape");
        }
    } catch (e) {
        // Fallback garantido via CSS rotate(90deg)
    }

    // Renderiza dados no canvas landscape
    const rows = state.currentAnalysisFilteredHistory || [];
    renderGraficoLandscape(rows);
}

function fecharGraficoLandscape() {
    const modal = $("modalGraficoLandscape");
    if (!modal) return;

    state.isLandscapeOpen = false;
    modal.classList.add("hidden");

    // Destrói gráfico landscape
    if (state.landscapeChart) {
        state.landscapeChart.destroy();
        state.landscapeChart = null;
    }

    // Restaura orientação da tela e sai de tela cheia se ativo
    try {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
        }
    } catch (e) {}

    // Garante que o gráfico padrão continue perfeitamente dimensionado
    if (state.analysisChart) {
        state.analysisChart.resize();
    }
}

function renderGraficoLandscape(rows) {
    const canvas = $("landscapeChartCanvas");
    if (!canvas || !rows.length) return;

    if (state.landscapeChart) {
        state.landscapeChart.destroy();
        state.landscapeChart = null;
    }

    // Atualiza estatísticas do rodapé landscape
    const c1Vals = rows.map(r => numVal(r.canal_1)).filter(v => v !== null);
    if (c1Vals.length) {
        const max = Math.max(...c1Vals);
        const min = Math.min(...c1Vals);
        const avg = c1Vals.reduce((a, b) => a + b, 0) / c1Vals.length;
        if ($("landStatPico")) $("landStatPico").textContent = `${Math.round(max)} °C`;
        if ($("landStatMin")) $("landStatMin").textContent = `${Math.round(min)} °C`;
        if ($("landStatAvg")) $("landStatAvg").textContent = `${Math.round(avg)} °C`;
        if ($("landStatCount")) $("landStatCount").textContent = `${rows.length} leituras`;
    }

    const labels = rows.map(r => {
        const d = new Date(r.created_at);
        return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    });

    const c1Data = rows.map(r => numVal(r.canal_1));
    const c2Data = rows.map(r => numVal(r.canal_2));

    const ctx = canvas.getContext("2d");
    const h = canvas.clientHeight || 360;

    const gradC1 = ctx.createLinearGradient(0, 0, 0, h);
    gradC1.addColorStop(0, "rgba(244, 123, 32, 0.45)");
    gradC1.addColorStop(1, "rgba(244, 123, 32, 0.0)");

    const gradC2 = ctx.createLinearGradient(0, 0, 0, h);
    gradC2.addColorStop(0, "rgba(59, 130, 182, 0.35)");
    gradC2.addColorStop(1, "rgba(59, 130, 182, 0.0)");

    const datasets = [];

    if (state.landscapeChannelFilter === "all" || state.landscapeChannelFilter === "c1") {
        datasets.push({
            label: "Canal 1 (Superior)",
            data: c1Data,
            borderColor: "#f47b20",
            backgroundColor: gradC1,
            borderWidth: 2.2,
            pointRadius: 2,
            pointHoverRadius: 7,
            pointBackgroundColor: "#f47b20",
            pointHoverBackgroundColor: "#ffffff",
            tension: 0.28,
            fill: true
        });
    }

    if (state.landscapeChannelFilter === "all" || state.landscapeChannelFilter === "c2") {
        datasets.push({
            label: "Canal 2 (Inferior)",
            data: c2Data,
            borderColor: "#5ba6d5",
            backgroundColor: gradC2,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 7,
            pointBackgroundColor: "#5ba6d5",
            pointHoverBackgroundColor: "#ffffff",
            tension: 0.28,
            fill: true
        });
    }

    state.landscapeChart = new Chart(canvas, {
        type: "line",
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    const item = rows[idx];
                    if (item) {
                        atualizarPillLeituraLandscape(item);
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(7, 27, 43, 0.95)",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + " °C" : "--"}`
                    },
                    external: (context) => {
                        const tooltip = context.tooltip;
                        if (!tooltip || !tooltip.dataPoints || !tooltip.dataPoints.length) return;
                        const idx = tooltip.dataPoints[0].dataIndex;
                        const item = rows[idx];
                        if (item) {
                            atualizarPillLeituraLandscape(item);
                        }
                    }
                },
                zoom: {
                    pan: { enabled: false },
                    zoom: { wheel: { enabled: false }, pinch: { enabled: false } }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#94a3b8", maxTicksLimit: 14, font: { size: 11, weight: "bold" } },
                    grid: { color: "rgba(255, 255, 255, 0.05)" }
                },
                y: {
                    ticks: { color: "#94a3b8", font: { size: 11 }, callback: (v) => `${v}°` },
                    grid: { color: "rgba(255, 255, 255, 0.06)" }
                }
            }
        }
    });

    atualizarPillLeituraLandscape(rows[rows.length - 1]);
    habilitarGestosGrafico("landscapeChartCanvas", () => state.landscapeChart, () => state.currentAnalysisFilteredHistory, true);
}

function atualizarPillLeituraLandscape(item) {
    if (!item) return;
    const c1 = numVal(item.canal_1);
    const c2 = numVal(item.canal_2);
    const delta = (c1 !== null && c2 !== null) ? Math.abs(c1 - c2) : null;
    const d = new Date(item.created_at);
    const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    if ($("landReadoutTime")) $("landReadoutTime").textContent = hora;
    if ($("landReadoutC1")) $("landReadoutC1").textContent = `C1: ${c1 !== null ? Math.round(c1) + ' °C' : '--'}`;
    if ($("landReadoutC2")) $("landReadoutC2").textContent = `C2: ${c2 !== null ? Math.round(c2) + ' °C' : '--'}`;
    if ($("landReadoutDelta")) $("landReadoutDelta").textContent = `ΔT: ${delta !== null ? Math.round(delta) + ' °C' : '--'}`;
}

function filtrarCanaisLandscape(canal, btn) {
    state.landscapeChannelFilter = canal;
    document.querySelectorAll("#landChannelFilter .pill-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    if (state.currentAnalysisFilteredHistory.length) {
        renderGraficoLandscape(state.currentAnalysisFilteredHistory);
    }
}

// ==========================================================================
// 5.2 FERRAMENTAS INTERATIVAS DE NAVEGAÇÃO, INSPEÇÃO, ARRASTO E ZOOM
// ==========================================================================

function atualizarInspectorAnalise(item) {
    if (!item) return;
    const c1 = numVal(item.canal_1);
    const c2 = numVal(item.canal_2);
    const delta = (c1 !== null && c2 !== null) ? Math.abs(c1 - c2) : null;
    const d = new Date(item.created_at);
    const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    if ($("anReadoutTime")) $("anReadoutTime").textContent = hora;
    if ($("anReadoutC1")) $("anReadoutC1").textContent = c1 !== null ? `${Math.round(c1)} °C` : '-- °C';
    if ($("anReadoutC2")) $("anReadoutC2").textContent = c2 !== null ? `${Math.round(c2)} °C` : '-- °C';
    if ($("anReadoutDelta")) $("anReadoutDelta").textContent = delta !== null ? `${Math.round(delta)} °C` : '--';
}

function getActiveChart() {
    return state.isLandscapeOpen ? state.landscapeChart : state.analysisChart;
}

// NAVEGAÇÃO HORIZONTAL IMEDIATA (PAN)
function panGrafico(direcao) {
    const chart = getActiveChart();
    if (!chart || !chart.data || !chart.data.labels || !chart.data.labels.length) return;

    const scale = chart.scales.x;
    if (!scale) return;
    const total = chart.data.labels.length;
    if (total <= 1) return;

    let min = (typeof scale.min === 'number') ? scale.min : 0;
    let max = (typeof scale.max === 'number') ? scale.max : (total - 1);
    let span = max - min;

    // Se estiver em visão 100% ampla (sem zoom):
    // Ao clicar em anterior ou posterior, foca imediatamente em uma janela confortável (~35% dos dados)
    // para responder INSTANTANEAMENTE ao toque do usuário sem ficar travado!
    if (span >= total - 1) {
        const initialWindow = Math.max(4, Math.min(35, Math.round(total * 0.35)));
        if (direcao === 'left') {
            min = 0;
            max = min + initialWindow;
        } else {
            max = total - 1;
            min = Math.max(0, max - initialWindow);
        }
        scale.options.min = min;
        scale.options.max = max;
        chart.update('none');
        return;
    }

    // Passo de navegação ágil proporcional à janela visível (25% do span visível)
    const step = Math.max(2, Math.round(span * 0.25));

    if (direcao === 'left') {
        if (min <= 0) return;
        const newMin = Math.max(0, min - step);
        const newMax = newMin + span;
        scale.options.min = newMin;
        scale.options.max = Math.min(total - 1, newMax);
    } else {
        if (max >= total - 1) return;
        const newMax = Math.min(total - 1, max + step);
        const newMin = newMax - span;
        scale.options.min = Math.max(0, newMin);
        scale.options.max = newMax;
    }

    chart.update('none');
}

// ZOOM PRECISO E ÁGIL (+ / -)
function zoomGrafico(fator) {
    const chart = getActiveChart();
    if (!chart || !chart.data || !chart.data.labels || !chart.data.labels.length) return;

    const scale = chart.scales.x;
    if (!scale) return;
    const total = chart.data.labels.length;
    if (total <= 1) return;

    let min = (typeof scale.min === 'number') ? scale.min : 0;
    let max = (typeof scale.max === 'number') ? scale.max : (total - 1);
    let span = max - min;
    const center = (min + max) / 2;

    if (fator > 1) {
        // APROXIMAR ZOOM (+)
        const newSpan = Math.max(4, Math.round(span / 1.35));
        const half = newSpan / 2;
        let newMin = Math.max(0, Math.round(center - half));
        let newMax = newMin + newSpan;
        if (newMax >= total) {
            newMax = total - 1;
            newMin = Math.max(0, newMax - newSpan);
        }
        scale.options.min = newMin;
        scale.options.max = newMax;
        chart.update('none');
    } else {
        // AFASTAR ZOOM (-)
        const newSpan = Math.round(span * 1.35);
        if (newSpan >= total - 1) {
            resetZoomGrafico();
            return;
        }
        const half = newSpan / 2;
        let newMin = Math.max(0, Math.round(center - half));
        let newMax = newMin + newSpan;
        if (newMax >= total) {
            newMax = total - 1;
            newMin = Math.max(0, newMax - newSpan);
        }
        scale.options.min = newMin;
        scale.options.max = newMax;
        chart.update('none');
    }
}

// RESTAURAR ZOOM ORIGINAL (100% VISÃO COMPLETA)
function resetZoomGrafico() {
    const chart = getActiveChart();
    if (!chart) return;

    if (chart.scales && chart.scales.x) {
        delete chart.scales.x.options.min;
        delete chart.scales.x.options.max;
        delete chart.scales.x.min;
        delete chart.scales.x.max;
    }

    if (typeof chart.resetZoom === 'function') {
        try { chart.resetZoom('none'); } catch (e) {}
    }

    chart.update('none');
}

// MOTOR DE GESTOS MULTI-TOUCH FLUIDO (PINCH-TO-ZOOM COM 2 DEDOS + PAN COM 1 DEDO)
const _canvasGesturesBound = new Set();

function habilitarGestosGrafico(canvasId, getChartFn, getRowsFn, isLandscape) {
    const canvas = $(canvasId);
    if (!canvas || _canvasGesturesBound.has(canvasId)) return;
    _canvasGesturesBound.add(canvasId);

    let touchMode = "none"; // "none" | "pan" | "pinch"
    let startX = 0;
    let initialMin = 0;
    let initialMax = 0;
    let initialSpan = 0;
    let initialDist = 0;
    let centerIndex = 0;
    let centerRatio = 0.5;
    let hasMoved = false;

    const getScale = () => {
        const chart = getChartFn();
        if (!chart || !chart.data || !chart.data.labels || !chart.data.labels.length) return null;
        const total = chart.data.labels.length;
        if (total <= 1) return null;
        const scale = chart.scales.x;
        if (!scale) return null;
        const min = (typeof scale.min === "number") ? scale.min : 0;
        const max = (typeof scale.max === "number") ? scale.max : (total - 1);
        return { chart, scale, total, min, max, span: Math.max(1, max - min) };
    };

    // TOUCH START
    canvas.addEventListener("touchstart", (e) => {
        const s = getScale();
        if (!s) return;

        hasMoved = false;

        if (e.touches.length === 1) {
            // 1 Dedo: prepara arrasto
            touchMode = "pan";
            startX = e.touches[0].clientX;
            initialMin = s.min;
            initialMax = s.max;
            initialSpan = s.span;
        } else if (e.touches.length >= 2) {
            // 2 Dedos: prepara PINCH-TO-ZOOM
            touchMode = "pinch";
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            initialDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY) || 10;

            const rect = canvas.getBoundingClientRect();
            const centerClientX = (t1.clientX + t2.clientX) / 2;
            centerRatio = Math.max(0, Math.min(1, (centerClientX - rect.left) / Math.max(1, rect.width)));

            initialMin = s.min;
            initialMax = s.max;
            initialSpan = s.span;
            centerIndex = initialMin + (initialSpan * centerRatio);
        }
    }, { passive: false });

    // TOUCH MOVE
    canvas.addEventListener("touchmove", (e) => {
        const s = getScale();
        if (!s) return;

        if (touchMode === "pan" && e.touches.length === 1) {
            const currentX = e.touches[0].clientX;
            const dx = currentX - startX;

            // Só ativa arrasto se o usuário realmente moveu o dedo (> 6px)
            if (Math.abs(dx) > 6) {
                hasMoved = true;
                e.preventDefault();

                // Se estiver em 100% da visualização, dá um foco de 40% inicial para começar a navegar
                if (initialSpan >= s.total - 1) {
                    const rect = canvas.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (startX - rect.left) / Math.max(1, rect.width)));
                    initialSpan = Math.max(4, Math.min(40, Math.round(s.total * 0.4)));
                    initialMin = Math.max(0, Math.min(s.total - 1 - initialSpan, Math.round(ratio * s.total - initialSpan / 2)));
                    initialMax = initialMin + initialSpan;
                    startX = currentX;
                    s.scale.options.min = initialMin;
                    s.scale.options.max = initialMax;
                    s.chart.update("none");
                    return;
                }

                const rect = canvas.getBoundingClientRect();
                const unitsPerPixel = initialSpan / Math.max(1, rect.width);
                const shiftUnits = dx * unitsPerPixel;

                let newMin = Math.round(initialMin - shiftUnits);
                let newMax = Math.round(newMin + initialSpan);

                if (newMin < 0) {
                    newMin = 0;
                    newMax = Math.min(s.total - 1, initialSpan);
                } else if (newMax > s.total - 1) {
                    newMax = s.total - 1;
                    newMin = Math.max(0, s.total - 1 - initialSpan);
                }

                s.scale.options.min = newMin;
                s.scale.options.max = newMax;
                s.chart.update("none");
            }
        } else if (touchMode === "pinch" && e.touches.length >= 2) {
            e.preventDefault();
            hasMoved = true;

            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY) || 10;
            const pinchRatio = currDist / Math.max(1, initialDist);

            // pinchRatio > 1 => dedos se afastando => ZOOM IN (span menor)
            // pinchRatio < 1 => dedos se aproximando => ZOOM OUT (span maior)
            let targetSpan = Math.round(initialSpan / pinchRatio);
            targetSpan = Math.max(3, Math.min(s.total - 1, targetSpan));

            if (targetSpan >= s.total - 1) {
                // Afastou totalmente -> visão 100% sem travar
                delete s.scale.options.min;
                delete s.scale.options.max;
                s.chart.update("none");
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const currCenterClientX = (t1.clientX + t2.clientX) / 2;
            const currCenterRatio = Math.max(0, Math.min(1, (currCenterClientX - rect.left) / Math.max(1, rect.width)));

            let newMin = Math.round(centerIndex - (targetSpan * currCenterRatio));
            let newMax = Math.round(newMin + targetSpan);

            if (newMin < 0) {
                newMin = 0;
                newMax = Math.min(s.total - 1, targetSpan);
            }
            if (newMax > s.total - 1) {
                newMax = s.total - 1;
                newMin = Math.max(0, s.total - 1 - targetSpan);
            }

            s.scale.options.min = newMin;
            s.scale.options.max = newMax;
            s.chart.update("none");
        }
    }, { passive: false });

    // TOUCH END
    const onTouchEnd = (e) => {
        if (!hasMoved && touchMode === "pan" && e.changedTouches && e.changedTouches.length === 1) {
            // Toque simples (sem arrastar)
            if (isLandscape) {
                const rect = canvas.getBoundingClientRect();
                const clickX = e.changedTouches[0].clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / Math.max(1, rect.width)));
                const s = getScale();
                if (s) {
                    const idx = Math.max(0, Math.min(s.total - 1, Math.round(s.min + (s.span * ratio))));
                    const rows = getRowsFn ? getRowsFn() : [];
                    if (rows && rows[idx]) {
                        atualizarPillLeituraLandscape(rows[idx]);
                    }
                }
            } else {
                abrirGraficoLandscape();
            }
        }

        if (e.touches.length === 0) {
            touchMode = "none";
            hasMoved = false;
        } else if (e.touches.length === 1) {
            // Tirou um dedo do pinch: continua em pan suave sem saltar
            touchMode = "pan";
            startX = e.touches[0].clientX;
            const s = getScale();
            if (s) {
                initialMin = s.min;
                initialMax = s.max;
                initialSpan = s.span;
            }
        }
    };

    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);

    // MOUSE DRAG (DESKTOP)
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseInitialMin = 0;
    let mouseInitialSpan = 0;

    canvas.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        const s = getScale();
        if (!s) return;
        isMouseDown = true;
        mouseStartX = e.clientX;
        mouseInitialMin = s.min;
        mouseInitialSpan = s.span;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;
        const s = getScale();
        if (!s) return;

        const dx = e.clientX - mouseStartX;
        if (Math.abs(dx) < 3) return;

        const rect = canvas.getBoundingClientRect();
        const unitsPerPixel = mouseInitialSpan / Math.max(1, rect.width);
        const shiftUnits = dx * unitsPerPixel;

        let newMin = Math.round(mouseInitialMin - shiftUnits);
        let newMax = Math.round(newMin + mouseInitialSpan);

        if (newMin < 0) {
            newMin = 0;
            newMax = Math.min(s.total - 1, mouseInitialSpan);
        } else if (newMax > s.total - 1) {
            newMax = s.total - 1;
            newMin = Math.max(0, s.total - 1 - mouseInitialSpan);
        }

        s.scale.options.min = newMin;
        s.scale.options.max = newMax;
        s.chart.update("none");
    });

    window.addEventListener("mouseup", () => {
        isMouseDown = false;
    });

    // MOUSE WHEEL ZOOM (DESKTOP)
    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const s = getScale();
        if (!s) return;

        const rect = canvas.getBoundingClientRect();
        const cursorRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
        const centerIndex = s.min + (s.span * cursorRatio);

        const zoomFactor = e.deltaY < 0 ? 0.8 : 1.25;
        const targetSpan = Math.max(4, Math.min(s.total - 1, Math.round(s.span * zoomFactor)));

        if (targetSpan >= s.total - 1) {
            delete s.scale.options.min;
            delete s.scale.options.max;
            s.chart.update("none");
            return;
        }

        let newMin = Math.round(centerIndex - (targetSpan * cursorRatio));
        let newMax = Math.round(newMin + targetSpan);

        if (newMin < 0) {
            newMin = 0;
            newMax = Math.min(s.total - 1, targetSpan);
        }
        if (newMax > s.total - 1) {
            newMax = s.total - 1;
            newMin = Math.max(0, s.total - 1 - targetSpan);
        }

        s.scale.options.min = newMin;
        s.scale.options.max = newMax;
        s.chart.update("none");
    }, { passive: false });
}

// PRESSIONAMENTO CONTÍNUO DOS BOTÕES DE NAVEGAÇÃO (SEGURAR O BOTÃO NAVEGA CONTINUAMENTE)
function configurarBotoesNavegacaoContinuo() {
    const bindBtn = (id, action) => {
        const btn = $(id);
        if (!btn || btn._continuousBound) return;
        btn._continuousBound = true;

        let timer = null;
        let interval = null;

        const start = (e) => {
            e.preventDefault();
            action();
            timer = setTimeout(() => {
                interval = setInterval(action, 85);
            }, 300);
        };

        const stop = () => {
            if (timer) { clearTimeout(timer); timer = null; }
            if (interval) { clearInterval(interval); interval = null; }
        };

        btn.addEventListener("pointerdown", start);
        btn.addEventListener("pointerup", stop);
        btn.addEventListener("pointercancel", stop);
        btn.addEventListener("pointerleave", stop);
    };

    bindBtn("btnPanLeft", () => panGrafico('left'));
    bindBtn("btnPanRight", () => panGrafico('right'));
    bindBtn("btnZoomIn", () => zoomGrafico(1.35));
    bindBtn("btnZoomOut", () => zoomGrafico(0.75));

    bindBtn("btnLandPanLeft", () => panGrafico('left'));
    bindBtn("btnLandPanRight", () => panGrafico('right'));
    bindBtn("btnLandZoomIn", () => zoomGrafico(1.35));
    bindBtn("btnLandZoomOut", () => zoomGrafico(0.75));
}

// ==========================================================================
// 6. NAVEGAÇÃO ENTRE ABAS DO MENU INFERIOR
// ==========================================================================

function navegarAba(aba) {
    state.activeTab = aba;

    if (aba === "fornos") {
        voltarListaFornos();
    } else if (aba === "historico") {
        state.selectedModule = null;
        state.historicoFornoSelecionado = null;
        $("headerTitle").textContent = "Histórico de Queimas";
        $("headerBackBtn").classList.add("hidden");

        $("screenFornos").classList.add("hidden");
        $("screenAnaliseForno").classList.add("hidden");
        $("screenConfig").classList.add("hidden");
        $("screenHistoricoQueimas").classList.remove("hidden");

        document.querySelectorAll(".bottom-tab-bar .tab-item").forEach(b => b.classList.remove("active"));
        $("tabNavHistorico").classList.add("active");

        carregarHistoricoQueimas();
    } else if (aba === "config") {
        state.selectedModule = null;
        $("headerTitle").textContent = "Configurações";
        $("headerBackBtn").classList.add("hidden");

        $("screenFornos").classList.add("hidden");
        $("screenAnaliseForno").classList.add("hidden");
        $("screenHistoricoQueimas").classList.add("hidden");
        $("screenConfig").classList.remove("hidden");
        if (window.ThermoSetpoints) window.ThermoSetpoints.renderizar();

        document.querySelectorAll(".bottom-tab-bar .tab-item").forEach(b => b.classList.remove("active"));
        $("tabNavConfig").classList.add("active");
    }
}

// ==========================================================================
// 5.1 HISTÓRICO DE QUEIMA DINÂMICO (POR FORNO & FILTRO TEMPORAL NO SUPABASE)
// ==========================================================================

state.historicoFornoSelecionado = null;
state.historicoPeriodoDias = "7";
state.historicoDateStart = null;
state.historicoDateEnd = null;
state.historicoModoVisao = "cycles"; // "cycles" | "table"
state.historicoModoEscalaTempo = "period"; // "period" | "data"
state.historicoWindowStartMs = null;
state.historicoWindowEndMs = null;
state.historicoLeiturasAtuais = [];
state.historicoGruposPorDia = new Map();
state.historicoPaginaTabela = 1;
let historicoFornoChartInstance = null;
let historicoDiaChartInstance = null;
let historicoActiveRequestId = 0;
const historicoCachePorModulo = new Map(); // mod -> { minStartMs, rows: [] }

/**
 * PASSO 1: Identifica dinamicamente todos os fornos cadastrados/ativos da cerâmica no banco
 * e renderiza os cards de seleção de forno.
 */
async function carregarHistoricoQueimas(forcarRecarga = false) {
    const ovensGrid = $("histOvensSelectorGrid");
    const refreshIcon = $("iconRefreshHistorico");
    if (forcarRecarga) {
        historicoCachePorModulo.clear();
        if (refreshIcon) refreshIcon.classList.add("fa-spin");
    }

    try {
        // Se state.ovens ainda não foi populado, garante o carregamento inicial
        if (!state.ovens || state.ovens.length === 0 || forcarRecarga) {
            await loadData();
        }

        // Consulta complementar à tabela 'fornos' do Supabase para a cerâmica logada
        let dbFornos = [];
        const cid = state.currentUser ? state.currentUser.ceramicaId : null;
        if (typeof sb !== "undefined" && sb && cid && state.currentUser?.role !== "admin") {
            const { data: fData, error: fErr } = await sb
                .from("fornos")
                .select("id, numero, modulo_alutal, nome, ativo, ceramica_id, dispositivo_id")
                .eq("ceramica_id", cid)
                .order("numero", { ascending: true });
            if (!fErr && fData && fData.length > 0) {
                dbFornos = fData;
            }
        }

        // Exibe ESTRITAMENTE os fornos que possuem alguma leitura registrada no banco de dados (state.readings)
        const ovensMap = new Map();
        (state.ovens || []).forEach(o => {
            const num = Number(o.numero || o.id || 1);
            const temLeituraNoBanco = state.readings && state.readings.has(num);
            if (Number.isFinite(num) && num > 0 && temLeituraNoBanco) {
                ovensMap.set(num, {
                    id: o.id || num,
                    numero: num,
                    modulo: num,
                    nome: o.nome || `Forno ${String(num).padStart(2, "0")}`,
                    serial: o.dispositivo_serial || (state.allowedSerials && state.allowedSerials[0]) || "THX"
                });
            }
        });

        dbFornos.forEach(f => {
            const num = Number(f.modulo_alutal || f.numero || 1);
            const temLeituraNoBanco = state.readings && state.readings.has(num);
            if (Number.isFinite(num) && num > 0 && temLeituraNoBanco && !ovensMap.has(num)) {
                ovensMap.set(num, {
                    id: f.id || num,
                    numero: num,
                    modulo: num,
                    nome: f.nome || `Forno ${String(num).padStart(2, "0")}`,
                    serial: (state.allowedSerials && state.allowedSerials[0]) || "THX"
                });
            }
        });

        const availableOvens = Array.from(ovensMap.values()).sort((a, b) => a.numero - b.numero);

        if ($("statHistoricoCount")) {
            $("statHistoricoCount").textContent = `${availableOvens.length} ${availableOvens.length === 1 ? "Forno com Histórico" : "Fornos com Histórico"}`;
        }

        // Caso a cerâmica não possua nenhum forno/aparelho vinculado
        if (availableOvens.length === 0) {
            if ($("histStep1Card")) $("histStep1Card").classList.remove("hidden");
            if (ovensGrid) {
                ovensGrid.innerHTML = `
                    <div class="loading-box" style="grid-column: 1 / -1; padding: 28px 16px; text-align: center;">
                        <i class="fa-solid fa-microchip" style="font-size: 34px; color: #f97316; margin-bottom: 10px;"></i>
                        <h4 style="color: #ffffff; margin: 0 0 6px; font-size: 15px;">Nenhum Forno Identificado</h4>
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                            Esta cerâmica ainda não possui fornos ou aparelhos ThermoX vinculados com leituras no banco de dados.
                        </p>
                    </div>
                `;
            }
            if ($("histSelectedOvenPanel")) $("histSelectedOvenPanel").classList.add("hidden");
            return;
        }

        // Renderiza os Cards Dinâmicos de cada Forno (Passo 1)
        if (ovensGrid) {
            ovensGrid.innerHTML = availableOvens.map(o => {
                const mod = Number(o.numero);
                const isSelected = Number(state.historicoFornoSelecionado) === mod;
                const ultimaLeitura = state.readings ? state.readings.get(mod) : null;
                const c1 = ultimaLeitura ? numVal(ultimaLeitura.canal_1) : null;
                const c2 = ultimaLeitura ? numVal(ultimaLeitura.canal_2) : null;
                const ts = ultimaLeitura ? new Date(ultimaLeitura.created_at || ultimaLeitura.data_hora).getTime() : 0;
                const isOnline = ts > 0 && (Date.now() - ts) <= 15 * 60 * 1000;

                return `
                    <button type="button" class="hist-oven-select-card ${isSelected ? 'active' : ''}" onclick="selecionarFornoHistorico(${mod})">
                        <div class="hist-oven-card-top">
                            <span class="hist-oven-icon-box">
                                <i class="fa-solid fa-fire-flame-curved"></i>
                            </span>
                            <span class="hist-oven-status-dot ${isOnline ? 'online' : 'standby'}">
                                <i class="fa-solid fa-circle" style="font-size: 6px;"></i>
                                ${isOnline ? 'Ativo' : 'Standby'}
                            </span>
                        </div>
                        <div>
                            <h4 class="hist-oven-card-title">${escapeHtml(o.nome)}</h4>
                            <div class="hist-oven-card-meta">
                                <span>Módulo RS485 #${String(mod).padStart(2, '0')}</span>
                                <span>${escapeHtml(o.serial || 'THX')}</span>
                            </div>
                        </div>
                        <div class="hist-oven-card-temps">
                            <span class="text-orange">C1: ${c1 !== null ? `${c1}°C` : '--'}</span>
                            <span style="color: rgba(255,255,255,0.2);">|</span>
                            <span class="text-blue">C2: ${c2 !== null ? `${c2}°C` : '--'}</span>
                        </div>
                    </button>
                `;
            }).join("");
        }

        // Se nenhum forno foi clicado ainda, exibe APENAS a tela de seleção de fornos (Passo 1)
        const selectedMod = Number(state.historicoFornoSelecionado);
        const existsSelected = selectedMod > 0 && availableOvens.some(o => Number(o.numero) === selectedMod);

        if (!existsSelected) {
            state.historicoFornoSelecionado = null;
            if ($("histStep1Card")) $("histStep1Card").classList.remove("hidden");
            if ($("histSelectedOvenPanel")) $("histSelectedOvenPanel").classList.add("hidden");
            return;
        }

        // Quando um forno específico está selecionado, oculta a grade de seleção e abre a aba interna do forno
        if ($("histStep1Card")) $("histStep1Card").classList.add("hidden");
        if ($("histSelectedOvenPanel")) $("histSelectedOvenPanel").classList.remove("hidden");

        // Carrega os dados históricos do forno selecionado e período ativo (Passos 2 e 3)
        await carregarDadosHistoricoFornoSelecionado();
    } finally {
        if (refreshIcon) {
            setTimeout(() => refreshIcon.classList.remove("fa-spin"), 300);
        }
    }
}

/**
 * PASSO 2: Ação ao clicar no Card de um Forno específico -> abre a aba de histórico daquele forno
 */
async function selecionarFornoHistorico(modulo) {
    state.historicoFornoSelecionado = Number(modulo);
    state.historicoPaginaTabela = 1;

    if ($("histStep1Card")) $("histStep1Card").classList.add("hidden");
    if ($("histSelectedOvenPanel")) $("histSelectedOvenPanel").classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
    await carregarDadosHistoricoFornoSelecionado();
}

/**
 * Volta da aba de histórico do forno selecionado para a lista de Fornos Identificados da Cerâmica
 */
function voltarListaFornosHistorico() {
    state.historicoFornoSelecionado = null;
    if ($("histSelectedOvenPanel")) $("histSelectedOvenPanel").classList.add("hidden");
    if ($("histStep1Card")) $("histStep1Card").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * PASSO 3: Ação ao trocar o Filtro Temporal (7d, 15d, 30d, 60d, 90d ou Personalizado)
 */
async function selecionarPeriodoHistorico(diasOuCustom, btn) {
    state.historicoPeriodoDias = String(diasOuCustom);
    state.historicoPaginaTabela = 1;

    document.querySelectorAll("#histPeriodTabs .pill-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    const customBox = $("histCustomDateBox");
    if (diasOuCustom === "custom") {
        if (customBox) customBox.classList.remove("hidden");
        const endInput = $("histDateEnd");
        const startInput = $("histDateStart");
        if (endInput && !endInput.value) {
            const hoje = new Date();
            endInput.value = hoje.toISOString().split("T")[0];
        }
        if (startInput && !startInput.value) {
            const seteDiasAtras = new Date(Date.now() - 7 * 86400000);
            startInput.value = seteDiasAtras.toISOString().split("T")[0];
        }
        return;
    } else {
        if (customBox) customBox.classList.add("hidden");
    }

    await carregarDadosHistoricoFornoSelecionado();
}

async function aplicarFiltroDataCustomHistorico() {
    const startVal = $("histDateStart")?.value;
    const endVal = $("histDateEnd")?.value;
    if (!startVal || !endVal) {
        alert("Selecione a Data Inicial e a Data Final para filtrar.");
        return;
    }
    state.historicoDateStart = new Date(`${startVal}T00:00:00`);
    state.historicoDateEnd = new Date(`${endVal}T23:59:59`);
    state.historicoPaginaTabela = 1;
    await carregarDadosHistoricoFornoSelecionado();
}

function alternarModoVisualizacaoHistorico(modo) {
    state.historicoModoVisao = modo;
    const btnCycles = $("btnHistViewCycles");
    const btnTable = $("btnHistViewTable");
    const dailyBoxWrapper = $("histDailyBoxWrapper");
    const singleDayBox = $("histSingleDayDetailBox");
    const cyclesContainer = $("listaQueimasHistorico");
    const tableWrapper = $("histRawTableWrapper");

    if (modo === "table") {
        btnCycles?.classList.remove("active");
        btnTable?.classList.add("active");
        dailyBoxWrapper?.classList.add("hidden");
        singleDayBox?.classList.add("hidden");
        tableWrapper?.classList.remove("hidden");
        renderizarTabelaLeiturasHistorico();
    } else {
        btnTable?.classList.remove("active");
        btnCycles?.classList.add("active");
        tableWrapper?.classList.add("hidden");
        singleDayBox?.classList.add("hidden");
        dailyBoxWrapper?.classList.remove("hidden");
        cyclesContainer?.classList.remove("hidden");
    }
}

function alternarEscalaTempoGraficoHistorico(modoEscala) {
    state.historicoModoEscalaTempo = modoEscala === "data" ? "data" : "period";
    $("btnHistScalePeriod")?.classList.toggle("active", state.historicoModoEscalaTempo === "period");
    $("btnHistScaleData")?.classList.toggle("active", state.historicoModoEscalaTempo === "data");

    const mod = Number(state.historicoFornoSelecionado || 1);
    const ovenObj = (state.ovens || []).find(o => Number(o.numero) === mod);
    const ovenName = ovenObj ? ovenObj.nome : `Forno ${String(mod).padStart(2, "0")}`;
    renderizarGraficoHistoricoForno(state.historicoLeiturasAtuais || [], ovenName);
}

/**
 * Consulta ultra-rápida (com Cache Inteligente + Requisições Paralelas + Renderização Progressiva)
 * para o Forno selecionado e intervalo de datas ativo
 */
async function carregarDadosHistoricoFornoSelecionado() {
    const reqId = ++historicoActiveRequestId;
    const mod = Number(state.historicoFornoSelecionado || 1);
    const ovenObj = (state.ovens || []).find(o => Number(o.numero) === mod);
    const ovenName = ovenObj ? ovenObj.nome : `Forno ${String(mod).padStart(2, "0")}`;

    if ($("histActiveOvenName")) $("histActiveOvenName").textContent = `${ovenName} (Módulo ${mod})`;
    if ($("histChartOvenTitle")) $("histChartOvenTitle").textContent = ovenName;

    // Calcula janela de datas (dataInicio -> dataFim)
    let dataFim = new Date();
    let dataInicio = new Date(Date.now() - 7 * 86400000);
    let labelPeriodo = "Última semana (7 dias)";

    if (state.historicoPeriodoDias === "custom" && state.historicoDateStart && state.historicoDateEnd) {
        dataInicio = state.historicoDateStart;
        dataFim = state.historicoDateEnd;
        labelPeriodo = "Período personalizado";
    } else {
        const dias = parseInt(state.historicoPeriodoDias, 10) || 7;
        dataInicio = new Date(Date.now() - dias * 86400000);
        if (dias === 7) labelPeriodo = "Última semana (7 dias)";
        else if (dias === 15) labelPeriodo = "Últimos 15 dias";
        else if (dias === 30) labelPeriodo = "Último mês (30 dias)";
        else if (dias === 60) labelPeriodo = "Últimos 2 meses (60 dias)";
        else if (dias === 90) labelPeriodo = "Últimos 3 meses (90 dias)";
        else labelPeriodo = `Últimos ${dias} dias`;
    }

    const startMs = dataInicio.getTime();
    const endMs = dataFim.getTime();
    state.historicoWindowStartMs = startMs;
    state.historicoWindowEndMs = endMs;

    const fmtDateShort = (d) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    if ($("histPeriodRangeLabel")) {
        $("histPeriodRangeLabel").textContent = `${fmtDateShort(dataInicio)} até ${fmtDateShort(dataFim)}`;
    }
    if ($("histChartSubtitle")) {
        $("histChartSubtitle").textContent = `Temperatura (°C) × Tempo • ${labelPeriodo}: ${fmtDateShort(dataInicio)} a ${fmtDateShort(dataFim)}`;
    }

    // 1. VERIFICA CACHE EM MEMÓRIA PARA RESPOSTA INSTANTÂNEA (< 2ms)
    const cacheEntry = historicoCachePorModulo.get(mod);
    if (cacheEntry && cacheEntry.rows.length > 0 && state.historicoPeriodoDias !== "custom") {
        const cachedInWindow = cacheEntry.rows.filter(r => r._ts >= startMs && r._ts <= endMs);
        // Se o cache já cobre todo o período solicitado, renderiza instantaneamente sem ir à rede!
        if (cacheEntry.minStartMs <= startMs + 60000) {
            state.historicoLeiturasAtuais = cachedInWindow;
            atualizarKPIsHistoricoForno(cachedInWindow, mod);
            renderizarGraficoHistoricoForno(cachedInWindow, ovenName);
            renderizarCiclosDiariosHistorico(cachedInWindow, mod, ovenName);
            renderizarTabelaLeiturasHistorico();
            return;
        }
        // Se o cache cobre parte (ex: já tem 7d e pediu 15d), mostra os dados existentes na hora enquanto busca o restante!
        if (cachedInWindow.length > 0) {
            state.historicoLeiturasAtuais = cachedInWindow;
            atualizarKPIsHistoricoForno(cachedInWindow, mod);
            renderizarGraficoHistoricoForno(cachedInWindow, ovenName);
        }
    } else {
        const container = $("listaQueimasHistorico");
        if (container && state.historicoModoVisao === "cycles") {
            container.innerHTML = `
                <div class="loading-box" style="padding: 22px; text-align: center;">
                    <div class="app-spinner"></div>
                    <p>Carregando histórico do ${escapeHtml(ovenName)} (${escapeHtml(labelPeriodo)})...</p>
                </div>
            `;
        }
    }

    // 2. BUSCA EM ONDAS PARALELAS (5 páginas simultâneas = 5.000 linhas por rodada de rede!)
    try {
        const pageSize = 1000;
        const parallelPages = 5; // 5 requisições simultâneas por onda
        let waveIndex = 0;
        let acumulado = (cacheEntry && state.historicoPeriodoDias !== "custom") ? [...cacheEntry.rows] : [];

        // Se já tínhamos dados até cacheEntry.minStartMs, buscamos apenas o complemento anterior a minStartMs!
        const fetchEndIso = (cacheEntry && cacheEntry.rows.length > 0 && state.historicoPeriodoDias !== "custom")
            ? new Date(cacheEntry.minStartMs - 1).toISOString()
            : dataFim.toISOString();

        const buildPageQuery = (fromIdx, toIdx) => {
            let q = sb
                .from("leituras")
                .select("canal_1,canal_2,modulo_alutal,numero_serie,dispositivo_id,created_at")
                .eq("modulo_alutal", mod)
                .gte("created_at", dataInicio.toISOString())
                .lte("created_at", fetchEndIso)
                .order("created_at", { ascending: false })
                .range(fromIdx, toIdx);

            if (state.currentUser && state.currentUser.role !== "admin") {
                const devFilters = [];
                if (state.allowedSerials && state.allowedSerials.length > 0) {
                    devFilters.push(`numero_serie.in.(${state.allowedSerials.join(",")})`);
                }
                if (state.allowedDeviceIds && state.allowedDeviceIds.length > 0) {
                    devFilters.push(`dispositivo_id.in.(${state.allowedDeviceIds.join(",")})`);
                }
                if (devFilters.length > 0) {
                    q = q.or(devFilters.join(","));
                }
            }
            return q;
        };

        let renderizouPrimeiraOnda = false;

        while (true) {
            if (reqId !== historicoActiveRequestId) return; // Cancelado por novo clique do usuário

            const promessas = [];
            for (let i = 0; i < parallelPages; i++) {
                const pageNum = waveIndex * parallelPages + i;
                const fromIdx = pageNum * pageSize;
                const toIdx = fromIdx + pageSize - 1;
                promessas.push(buildPageQuery(fromIdx, toIdx));
            }

            const resultados = await Promise.all(promessas);
            if (reqId !== historicoActiveRequestId) return;

            let atingiuFim = false;
            let novosRegistrosOnda = 0;

            for (const res of resultados) {
                if (res.error || !res.data || res.data.length === 0) {
                    atingiuFim = true;
                    break;
                }
                for (let j = 0; j < res.data.length; j++) {
                    const row = res.data[j];
                    if (state.currentUser && state.currentUser.role !== "admin") {
                        const sOk = row.numero_serie && (state.allowedSerials || []).includes(row.numero_serie);
                        const idOk = row.dispositivo_id && (state.allowedDeviceIds || []).includes(Number(row.dispositivo_id));
                        if (!sOk && !idOk) continue;
                    }
                    row._ts = Date.parse(row.created_at);
                    acumulado.push(row);
                    novosRegistrosOnda++;
                }
                if (res.data.length < pageSize) {
                    atingiuFim = true;
                    break;
                }
            }

            if ($("kpiTotalQueimas")) {
                $("kpiTotalQueimas").textContent = acumulado.length.toLocaleString("pt-BR");
            }

            // Renderiza a tela imediatamente após a 1ª onda paralela para sensação instantânea!
            if (!renderizouPrimeiraOnda && acumulado.length > 0) {
                renderizouPrimeiraOnda = true;
                state.historicoLeiturasAtuais = acumulado;
                atualizarKPIsHistoricoForno(acumulado, mod);
                renderizarGraficoHistoricoForno(acumulado, ovenName);
                renderizarCiclosDiariosHistorico(acumulado, mod, ovenName);
                renderizarTabelaLeiturasHistorico();
            }

            if (atingiuFim || novosRegistrosOnda === 0) {
                break;
            }
            waveIndex++;
        }

        if (reqId !== historicoActiveRequestId) return;

        // Salva no cache do módulo para que próximas trocas de período sejam instantâneas
        if (state.historicoPeriodoDias !== "custom") {
            const prevMin = cacheEntry ? cacheEntry.minStartMs : Infinity;
            historicoCachePorModulo.set(mod, {
                minStartMs: Math.min(prevMin, startMs),
                rows: acumulado
            });
        }

        const leiturasFiltradas = acumulado.filter(r => r._ts >= startMs && r._ts <= endMs);
        state.historicoLeiturasAtuais = leiturasFiltradas;

        // Atualização final consolidada
        atualizarKPIsHistoricoForno(leiturasFiltradas, mod);
        renderizarGraficoHistoricoForno(leiturasFiltradas, ovenName);
        renderizarCiclosDiariosHistorico(leiturasFiltradas, mod, ovenName);
        renderizarTabelaLeiturasHistorico();
    } catch (err) {
        console.error("[Histórico] Erro ao consultar leituras do forno:", err);
    }
}

function atualizarKPIsHistoricoForno(leituras, mod) {
    const total = leituras.length;
    if ($("kpiTotalQueimas")) $("kpiTotalQueimas").textContent = total.toLocaleString("pt-BR");

    if (total === 0) {
        if ($("kpiSubTotalLeituras")) $("kpiSubTotalLeituras").textContent = "Sem registros no período";
        if ($("kpiPicoMedio")) $("kpiPicoMedio").textContent = "-- °C";
        if ($("kpiSubPicoHora")) $("kpiSubPicoHora").textContent = "Sem leituras";
        if ($("kpiTempoMedio")) $("kpiTempoMedio").textContent = "-- °C";
        if ($("kpiSubMediaC2")) $("kpiSubMediaC2").textContent = "C2 Médio: -- °C";
        if ($("kpiTaxaSucesso")) {
            $("kpiTaxaSucesso").textContent = "Sem Dados";
            $("kpiTaxaSucesso").className = "kpi-val text-muted";
        }
        if ($("histActiveModuleStatus")) $("histActiveModuleStatus").textContent = `Módulo #${mod} • Sem leituras no período`;
        return;
    }

    let maxC1 = -Infinity;
    let maxC1Date = null;
    let somaC1 = 0, countC1 = 0;
    let somaC2 = 0, countC2 = 0;

    leituras.forEach(r => {
        const c1 = numVal(r.canal_1);
        const c2 = numVal(r.canal_2);
        if (c1 !== null) {
            somaC1 += c1;
            countC1++;
            if (c1 > maxC1) {
                maxC1 = c1;
                maxC1Date = r.created_at || r.data_hora;
            }
        }
        if (c2 !== null) {
            somaC2 += c2;
            countC2++;
        }
    });

    const mediaC1 = countC1 > 0 ? Math.round(somaC1 / countC1) : 0;
    const mediaC2 = countC2 > 0 ? Math.round(somaC2 / countC2) : 0;

    if ($("kpiPicoMedio")) $("kpiPicoMedio").textContent = maxC1 > -Infinity ? `${maxC1} °C` : "-- °C";
    if ($("kpiSubPicoHora") && maxC1Date) {
        const dt = new Date(maxC1Date);
        $("kpiSubPicoHora").textContent = `Em ${dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if ($("kpiTempoMedio")) $("kpiTempoMedio").textContent = `${mediaC1} °C`;
    if ($("kpiSubMediaC2")) $("kpiSubMediaC2").textContent = `Média C2 (Inf.): ${mediaC2} °C`;

    // Verifica status da última transmissão do módulo
    const ultima = leituras[0];
    const ultTs = new Date(ultima.created_at || ultima.data_hora).getTime();
    const diffMin = Math.round((Date.now() - ultTs) / 60000);
    const online = diffMin <= 15;

    if ($("kpiTaxaSucesso")) {
        $("kpiTaxaSucesso").textContent = online ? "Operando" : "Em Espera";
        $("kpiTaxaSucesso").className = `kpi-val ${online ? "text-green" : "text-orange"}`;
    }
    if ($("kpiSubStatusMod")) {
        $("kpiSubStatusMod").textContent = online ? `Transmitindo (há ${Math.max(0, diffMin)}m)` : `Último envio em ${new Date(ultTs).toLocaleDateString("pt-BR")}`;
    }
    if ($("histActiveModuleStatus")) {
        $("histActiveModuleStatus").textContent = `Módulo RS485 #${String(mod).padStart(2, "0")} • ${total} leituras`;
    }
}

function atualizarReadoutGraficoHistorico(leitura) {
    if (!leitura) {
        if ($("histReadoutTime")) $("histReadoutTime").textContent = "Sem leituras";
        if ($("histReadoutC1")) $("histReadoutC1").textContent = "-- °C";
        if ($("histReadoutC2")) $("histReadoutC2").textContent = "-- °C";
        if ($("histReadoutDelta")) $("histReadoutDelta").textContent = "-- °C";
        return;
    }
    const dt = new Date(leitura.created_at || leitura.data_hora || leitura._ts);
    const strDataHora = !isNaN(dt.getTime())
        ? `${dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
        : "--";
    const c1 = numVal(leitura.canal_1);
    const c2 = numVal(leitura.canal_2);
    const delta = (c1 !== null && c2 !== null) ? Math.round(Math.abs(c1 - c2)) : null;

    if ($("histReadoutTime")) $("histReadoutTime").textContent = strDataHora;
    if ($("histReadoutC1")) $("histReadoutC1").textContent = c1 !== null ? `${Math.round(c1)} °C` : "-- °C";
    if ($("histReadoutC2")) $("histReadoutC2").textContent = c2 !== null ? `${Math.round(c2)} °C` : "-- °C";
    if ($("histReadoutDelta")) $("histReadoutDelta").textContent = delta !== null ? `${delta} °C` : "-- °C";
}

function renderizarGraficoHistoricoForno(leituras, ovenName) {
    const canvas = $("historicoFornoChartCanvas");
    if (!canvas || typeof Chart === "undefined") return;

    if (historicoFornoChartInstance) {
        historicoFornoChartInstance.destroy();
        historicoFornoChartInstance = null;
    }

    // Amostragem O(K) direta sobre o array sem clonar nem reordenar dezenas de milhares de objetos
    const total = leituras.length;
    const maxPoints = 320;
    const step = total > maxPoints ? Math.ceil(total / maxPoints) : 1;
    const amostradas = [];

    for (let i = total - 1; i >= 0; i -= step) {
        const r = leituras[i];
        const ts = r._ts || Date.parse(r.created_at || r.data_hora);
        if (Number.isFinite(ts) && ts > 0) {
            r._ts = ts;
            amostradas.push(r);
        }
    }
    if (total > 0 && amostradas.length > 0 && amostradas[amostradas.length - 1] !== leituras[0]) {
        const ultimo = leituras[0];
        ultimo._ts = ultimo._ts || Date.parse(ultimo.created_at || ultimo.data_hora);
        if (Number.isFinite(ultimo._ts)) amostradas.push(ultimo);
    }

    // Atualiza o painel de inspeção inicial com a leitura mais recente do período
    atualizarReadoutGraficoHistorico(amostradas.length > 0 ? amostradas[amostradas.length - 1] : null);

    // Pontos (x = tempo em ms, y = temperatura em °C) para gráfico real Temperatura × Tempo
    const pontosC1 = new Array(amostradas.length);
    const pontosC2 = new Array(amostradas.length);
    for (let i = 0; i < amostradas.length; i++) {
        const r = amostradas[i];
        pontosC1[i] = { x: r._ts, y: numVal(r.canal_1) };
        pontosC2[i] = { x: r._ts, y: numVal(r.canal_2) };
    }

    // Calcula limites do eixo X (Tempo) conforme o período selecionado (7d, 15d, 30d, 60d, 90d, Custom) ou foco nas leituras
    let minTimeMs = state.historicoWindowStartMs || (Date.now() - 7 * 86400000);
    let maxTimeMs = state.historicoWindowEndMs || Date.now();

    if (state.historicoModoEscalaTempo === "data" && amostradas.length > 0) {
        minTimeMs = amostradas[0]._ts;
        maxTimeMs = amostradas[amostradas.length - 1]._ts;
        if (maxTimeMs - minTimeMs < 600000) {
            minTimeMs -= 300000;
            maxTimeMs += 300000;
        }
    }

    const spanMs = Math.max(1, maxTimeMs - minTimeMs);
    const spanDias = spanMs / 86400000;

    const ctx = canvas.getContext("2d");
    const gradC1 = ctx.createLinearGradient(0, 0, 0, 260);
    gradC1.addColorStop(0, "rgba(249, 115, 22, 0.38)");
    gradC1.addColorStop(1, "rgba(249, 115, 22, 0.0)");

    const gradC2 = ctx.createLinearGradient(0, 0, 0, 260);
    gradC2.addColorStop(0, "rgba(56, 189, 248, 0.28)");
    gradC2.addColorStop(1, "rgba(56, 189, 248, 0.0)");

    historicoFornoChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Canal 1 (Superior °C)",
                    data: pontosC1,
                    borderColor: "#f97316",
                    backgroundColor: gradC1,
                    borderWidth: 2.2,
                    pointRadius: amostradas.length > 80 ? 0 : 2.5,
                    pointHoverRadius: 5,
                    tension: 0.22,
                    fill: true
                },
                {
                    label: "Canal 2 (Inferior °C)",
                    data: pontosC2,
                    borderColor: "#38bdf8",
                    backgroundColor: gradC2,
                    borderWidth: 2,
                    pointRadius: amostradas.length > 80 ? 0 : 2.5,
                    pointHoverRadius: 5,
                    tension: 0.22,
                    fill: true
                }
            ]
        },
        options: {
            parsing: false,
            normalized: true,
            animation: {
                duration: 140
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false
            },
            onClick: (evt, elements) => {
                if (elements && elements.length > 0) {
                    const idx = elements[0].index;
                    if (amostradas[idx]) atualizarReadoutGraficoHistorico(amostradas[idx]);
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#cbd5e1",
                        font: { size: 11, weight: "600" },
                        boxWidth: 12
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(7, 27, 43, 0.95)",
                    borderColor: "rgba(249, 115, 22, 0.45)",
                    borderWidth: 1,
                    titleColor: "#ffffff",
                    bodyColor: "#e2e8f0",
                    callbacks: {
                        title: (items) => {
                            if (!items || !items.length) return "";
                            const ts = items[0].parsed.x;
                            const d = new Date(ts);
                            return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
                        },
                        label: (item) => {
                            const val = item.parsed.y;
                            return `${item.dataset.label}: ${val !== null && val !== undefined ? Math.round(val) + " °C" : "--"}`;
                        }
                    },
                    external: (context) => {
                        const tp = context.tooltip;
                        if (tp && tp.dataPoints && tp.dataPoints.length > 0) {
                            const idx = tp.dataPoints[0].dataIndex;
                            if (amostradas[idx]) atualizarReadoutGraficoHistorico(amostradas[idx]);
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: "linear",
                    min: minTimeMs,
                    max: maxTimeMs,
                    title: {
                        display: true,
                        text: "Tempo (Data / Horário)",
                        color: "#94a3b8",
                        font: { size: 10, weight: "700" }
                    },
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 10 },
                        maxTicksLimit: 8,
                        callback: (value) => {
                            const d = new Date(Number(value));
                            if (isNaN(d.getTime())) return "";
                            const dia = String(d.getDate()).padStart(2, "0");
                            const mes = String(d.getMonth() + 1).padStart(2, "0");
                            if (spanDias <= 2) {
                                const h = String(d.getHours()).padStart(2, "0");
                                const m = String(d.getMinutes()).padStart(2, "0");
                                return `${dia}/${mes} ${h}:${m}`;
                            }
                            if (spanDias <= 16) {
                                return `${dia}/${mes} ${d.getHours()}h`;
                            }
                            return `${dia}/${mes}`;
                        }
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.05)"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Temperatura (°C)",
                        color: "#94a3b8",
                        font: { size: 10, weight: "700" }
                    },
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 10 },
                        callback: (v) => `${v}°C`
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.06)"
                    }
                }
            }
        }
    });
}

function formatarHoraCurtaTs(ts) {
    if (!Number.isFinite(ts) || ts <= 0) return "--:--";
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Agrupa as leituras do forno selecionado por Dia/Ciclo em passo único O(N) ultra-rápido
 * e popula a Caixa de Registros Diários interativa
 */
function renderizarCiclosDiariosHistorico(leituras, mod, ovenName) {
    const container = $("listaQueimasHistorico");
    if (!container) return;

    // Garante que a caixa de dias apareça e a visão de dia individual feche ao recarregar o forno/período
    if (state.historicoModoVisao !== "table") {
        $("histDailyBoxWrapper")?.classList.remove("hidden");
        $("histSingleDayDetailBox")?.classList.add("hidden");
    }

    if ($("histTableCounterText")) {
        $("histTableCounterText").textContent = `${leituras.length.toLocaleString("pt-BR")} leituras coletadas do ${ovenName} no período`;
    }

    if (!leituras || leituras.length === 0) {
        state.historicoGruposPorDia = new Map();
        if ($("histDailyCountBadge")) $("histDailyCountBadge").textContent = "0 dias registrados";
        container.innerHTML = `
            <div class="loading-box" style="padding: 30px; text-align: center;">
                <i class="fa-solid fa-clock-rotate-left" style="font-size: 32px; color: #f97316; margin-bottom: 10px;"></i>
                <p style="color: #94a3b8; font-size: 13px;">Nenhuma leitura encontrada para o <b>${escapeHtml(ovenName)}</b> neste período.</p>
            </div>
        `;
        return;
    }

    // Agregação direta em passo único O(N) capturando Pico Máx, Pico Mín, Média e respectivos horários exatos
    const gruposPorDia = new Map();
    for (let i = 0; i < leituras.length; i++) {
        const r = leituras[i];
        const ts = r._ts || Date.parse(r.created_at || r.data_hora);
        if (!Number.isFinite(ts) || ts <= 0) continue;
        r._ts = ts;

        const dt = new Date(ts);
        const dia = String(dt.getDate()).padStart(2, "0");
        const mes = String(dt.getMonth() + 1).padStart(2, "0");
        const ano = dt.getFullYear();
        const chaveDia = `${dia}/${mes}/${ano}`;

        let g = gruposPorDia.get(chaveDia);
        if (!g) {
            g = {
                count: 0,
                picoC1: -Infinity,
                picoC1Ts: ts,
                minC1: Infinity,
                minC1Ts: ts,
                picoC2: -Infinity,
                picoC2Ts: ts,
                somaC1: 0,
                countC1: 0,
                mediaC1: 0,
                mediaC1Ts: ts,
                minTs: ts,
                maxTs: ts,
                rows: []
            };
            gruposPorDia.set(chaveDia, g);
        }
        g.count++;
        g.rows.push(r);
        if (ts < g.minTs) g.minTs = ts;
        if (ts > g.maxTs) g.maxTs = ts;

        const c1 = numVal(r.canal_1);
        const c2 = numVal(r.canal_2);
        if (c1 !== null) {
            if (c1 > g.picoC1) {
                g.picoC1 = c1;
                g.picoC1Ts = ts;
            }
            if (c1 < g.minC1) {
                g.minC1 = c1;
                g.minC1Ts = ts;
            }
            g.somaC1 += c1;
            g.countC1++;
        }
        if (c2 !== null && c2 > g.picoC2) {
            g.picoC2 = c2;
            g.picoC2Ts = ts;
        }
    }

    state.historicoGruposPorDia = gruposPorDia;

    if ($("histDailyCountBadge")) {
        const totalDias = gruposPorDia.size;
        $("histDailyCountBadge").textContent = `${totalDias} ${totalDias === 1 ? "dia registrado" : "dias registrados"}`;
    }

    const cardsHtml = [];
    let indiceCiclo = gruposPorDia.size;

    gruposPorDia.forEach((g, dataStr) => {
        if (g.picoC1 === -Infinity) g.picoC1 = 0;
        if (g.minC1 === Infinity) g.minC1 = 0;
        if (g.picoC2 === -Infinity) g.picoC2 = 0;

        const mediaC1 = g.countC1 > 0 ? Math.round(g.somaC1 / g.countC1) : 0;
        g.mediaC1 = mediaC1;

        // Identifica o horário exato em que a temperatura do dia esteve mais próxima da Média Térmica
        let menorDiffMedia = Infinity;
        let tsMedia = g.minTs;
        for (let k = 0; k < g.rows.length; k++) {
            const rk = g.rows[k];
            const valC1 = numVal(rk.canal_1);
            if (valC1 !== null) {
                const diff = Math.abs(valC1 - mediaC1);
                if (diff < menorDiffMedia) {
                    menorDiffMedia = diff;
                    tsMedia = rk._ts;
                }
            }
        }
        g.mediaC1Ts = tsMedia;
        g.indiceCiclo = indiceCiclo;
        g.mod = mod;
        g.ovenName = ovenName;

        const diffHoras = Math.max(0.05, (g.maxTs - g.minTs) / 3600000);
        const hInt = Math.floor(diffHoras);
        const mInt = Math.round((diffHoras - hInt) * 60);
        const duracaoMonitorada = hInt > 0 ? `${hInt}h ${mInt}m` : `${Math.max(1, mInt)} min`;

        const horaInicio = formatarHoraCurtaTs(g.minTs);
        const horaFim = formatarHoraCurtaTs(g.maxTs);
        const horaPicoMax = formatarHoraCurtaTs(g.picoC1Ts);
        const horaMedia = formatarHoraCurtaTs(g.mediaC1Ts);
        const horaPicoMin = formatarHoraCurtaTs(g.minC1Ts);

        const statusCiclo = g.picoC1 >= 500 ? "Queima Ativa / Alta Temp." : (g.picoC1 >= 150 ? "Aquecimento / Resfriamento" : "Monitoramento Contínuo");

        cardsHtml.push(`
            <article class="queima-card clickable-day-card" onclick="inspecionarDiaHistorico('${dataStr}', ${indiceCiclo})">
                <div class="queima-card-top">
                    <div class="queima-card-title-group">
                        <span class="queima-id-tag">REGISTRO DIÁRIO #${indiceCiclo} • MÓDULO ${String(mod).padStart(2, "0")}</span>
                        <h3 class="queima-forno-nome">${escapeHtml(ovenName)} — ${escapeHtml(dataStr)}</h3>
                    </div>
                    <span class="queima-status-badge">
                        <i class="fa-solid fa-circle-check"></i>
                        ${escapeHtml(statusCiclo)}
                    </span>
                </div>

                <div class="queima-metrics-grid" style="grid-template-columns: repeat(4, minmax(0, 1fr));">
                    <div class="queima-metric-item">
                        <span class="queima-metric-lbl">Leituras no Dia</span>
                        <strong class="queima-metric-val">${g.count.toLocaleString("pt-BR")} envios</strong>
                    </div>
                    <div class="queima-metric-item">
                        <span class="queima-metric-lbl">Pico Máximo (C1)</span>
                        <strong class="queima-metric-val text-orange">${g.picoC1} °C <small style="color:#fdba74;font-weight:600;">às ${horaPicoMax}</small></strong>
                    </div>
                    <div class="queima-metric-item">
                        <span class="queima-metric-lbl">Média Térmica</span>
                        <strong class="queima-metric-val text-blue">${mediaC1} °C <small style="color:#7dd3fc;font-weight:600;">às ${horaMedia}</small></strong>
                    </div>
                    <div class="queima-metric-item">
                        <span class="queima-metric-lbl">Pico Mínimo (C1)</span>
                        <strong class="queima-metric-val" style="color:#34d399;">${g.minC1} °C <small style="color:#6ee7b7;font-weight:600;">às ${horaPicoMin}</small></strong>
                    </div>
                </div>

                <div class="queima-cycle-bar">
                    <div class="queima-cycle-fill" style="width: ${Math.min(100, Math.max(15, Math.round((g.picoC1 / 1100) * 100)))}%;"></div>
                </div>

                <div class="queima-card-foot">
                    <span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${horaInicio} às ${horaFim} (Janela: ${duracaoMonitorada})</span>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <button type="button" class="queima-btn-action" onclick="event.stopPropagation(); inspecionarDiaHistorico('${dataStr}', ${indiceCiclo})">
                            <i class="fa-solid fa-magnifying-glass-chart"></i>
                            <span>Ver Gráfico & Resumo do Dia</span>
                        </button>
                        <button type="button" class="queima-btn-action" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); color: #cbd5e1;" onclick="event.stopPropagation(); abrirDetalheForno(${mod})">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            <span>Abrir Tela do Forno</span>
                        </button>
                    </div>
                </div>
            </article>
        `);
        indiceCiclo--;
    });

    container.innerHTML = cardsHtml.join("");
}

/**
 * Abre a visão detalhada de UM DIA ESPECÍFICO selecionado na Caixa de Registros Diários:
 * Exibe o Gráfico exclusivo do dia + Cards de Pico Máximo, Média e Pico Mínimo com horários + Lista Resumida do Dia
 */
function inspecionarDiaHistorico(dataStr, indiceCiclo) {
    const grupos = state.historicoGruposPorDia;
    if (!grupos || !grupos.has(dataStr)) return;

    state.historicoDiaAtivoStr = dataStr;
    state.historicoPaginaDia = 1;

    const g = grupos.get(dataStr);
    const mod = g.mod || Number(state.historicoFornoSelecionado || 1);
    const ovenName = g.ovenName || `Forno ${String(mod).padStart(2, "0")}`;

    $("histDailyBoxWrapper")?.classList.add("hidden");
    const detailBox = $("histSingleDayDetailBox");
    if (detailBox) {
        detailBox.classList.remove("hidden");
    }

    const diffHoras = Math.max(0.05, (g.maxTs - g.minTs) / 3600000);
    const hInt = Math.floor(diffHoras);
    const mInt = Math.round((diffHoras - hInt) * 60);
    const duracaoMonitorada = hInt > 0 ? `${hInt}h ${mInt}m` : `${Math.max(1, mInt)} min`;

    const horaInicio = formatarHoraCurtaTs(g.minTs);
    const horaFim = formatarHoraCurtaTs(g.maxTs);
    const horaPicoMax = formatarHoraCurtaTs(g.picoC1Ts);
    const horaMedia = formatarHoraCurtaTs(g.mediaC1Ts);
    const horaPicoMin = formatarHoraCurtaTs(g.minC1Ts);

    const tagText = `REGISTRO DIÁRIO #${indiceCiclo || g.indiceCiclo || 1} • MÓDULO ${String(mod).padStart(2, "0")}`;
    if ($("histDayDetailBadge")) $("histDayDetailBadge").textContent = tagText;
    if ($("histDayDetailTag")) $("histDayDetailTag").textContent = tagText;

    if ($("histDayDetailTitle")) {
        $("histDayDetailTitle").textContent = `${ovenName} — ${dataStr}`;
    }
    if ($("histDayDetailSub")) {
        $("histDayDetailSub").textContent = `${g.count.toLocaleString("pt-BR")} leituras no dia • Janela monitorada: ${horaInicio} às ${horaFim} (${duracaoMonitorada})`;
    }
    if ($("histDayDetailStatus")) {
        const statusCiclo = g.picoC1 >= 500 ? "Queima Ativa / Alta Temp." : (g.picoC1 >= 150 ? "Aquecimento / Resfriamento" : "Monitoramento Contínuo");
        $("histDayDetailStatus").innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(statusCiclo)}`;
    }
    if ($("histDaySummaryCount")) {
        $("histDaySummaryCount").textContent = `${g.count.toLocaleString("pt-BR")} leituras no dia (${horaInicio} às ${horaFim})`;
    }

    // Preenche os 3 Cards de Destaques do Dia (Pico Máximo, Média Térmica, Pico Mínimo) com Horários Exatos
    if ($("histDayMaxVal")) $("histDayMaxVal").textContent = `${g.picoC1} °C`;
    if ($("histDayMaxTime")) $("histDayMaxTime").textContent = `às ${horaPicoMax}`;

    if ($("histDayAvgVal")) $("histDayAvgVal").textContent = `${g.mediaC1} °C`;
    if ($("histDayAvgTime")) $("histDayAvgTime").textContent = `às ${horaMedia}`;

    if ($("histDayMinVal")) $("histDayMinVal").textContent = `${g.minC1} °C`;
    if ($("histDayMinTime")) $("histDayMinTime").textContent = `às ${horaPicoMin}`;

    // Renderiza o Gráfico exclusivo daquele dia
    renderizarGraficoDiaEspecifico(g, dataStr, ovenName);

    // Popula a Lista Resumida de Leituras do Dia no formato Tabela (Data & Horário | Módulo | Canal 1 | Canal 2)
    renderizarTabelaResumoDiaHistorico();

    detailBox?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderizarTabelaResumoDiaHistorico() {
    const tbody = $("histDaySummaryList");
    const paginationBar = $("histDayPaginationBar");
    if (!tbody) return;

    const dataStr = state.historicoDiaAtivoStr;
    const grupos = state.historicoGruposPorDia;
    const g = (grupos && dataStr) ? grupos.get(dataStr) : null;
    const leiturasDia = g && g.rows ? g.rows : [];
    const modPadrao = g?.mod || Number(state.historicoFornoSelecionado || 1);

    const pageSize = 50;
    const totalPages = Math.max(1, Math.ceil(leiturasDia.length / pageSize));
    if (!state.historicoPaginaDia || state.historicoPaginaDia > totalPages) {
        state.historicoPaginaDia = 1;
    }

    const startIdx = (state.historicoPaginaDia - 1) * pageSize;
    const paginaAtual = leiturasDia.slice(startIdx, startIdx + pageSize);

    if (paginaAtual.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8;">
                    Nenhuma leitura encontrada neste dia.
                </td>
            </tr>
        `;
        if (paginationBar) paginationBar.innerHTML = "";
        return;
    }

    tbody.innerHTML = paginaAtual.map(r => {
        const dt = new Date(r._ts || r.created_at || r.data_hora);
        const dataHoraStr = !isNaN(dt.getTime())
            ? `${dt.toLocaleDateString("pt-BR")} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : "--";
        const mod = Number(r.modulo_alutal || r.forno_id || modPadrao);
        const c1 = numVal(r.canal_1);
        const c2 = numVal(r.canal_2);

        return `
            <tr>
                <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(dataHoraStr)}</td>
                <td><span class="badge-mod" style="color:#38bdf8; font-weight:700;">Mód. ${String(mod).padStart(2, "0")}</span></td>
                <td class="text-orange" style="font-weight: 800;">${c1 !== null ? `${c1} °C` : "--"}</td>
                <td class="text-blue" style="font-weight: 800;">${c2 !== null ? `${c2} °C` : "--"}</td>
            </tr>
        `;
    }).join("");

    if (paginationBar) {
        paginationBar.innerHTML = `
            <span>Mostrando ${startIdx + 1}–${Math.min(startIdx + pageSize, leiturasDia.length)} de ${leiturasDia.length.toLocaleString("pt-BR")} leituras em ${escapeHtml(dataStr || "")}</span>
            <div style="display: flex; gap: 6px;">
                <button type="button" class="hist-page-btn" ${state.historicoPaginaDia <= 1 ? "disabled" : ""} onclick="mudarPaginaDiaHistorico(-1)">
                    <i class="fa-solid fa-chevron-left"></i> Anterior
                </button>
                <span style="padding: 5px 8px; color: #ffffff; font-weight: 700;">Pág. ${state.historicoPaginaDia} / ${totalPages}</span>
                <button type="button" class="hist-page-btn" ${state.historicoPaginaDia >= totalPages ? "disabled" : ""} onclick="mudarPaginaDiaHistorico(1)">
                    Próxima <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;
    }
}

function mudarPaginaDiaHistorico(delta) {
    state.historicoPaginaDia = Math.max(1, (state.historicoPaginaDia || 1) + delta);
    renderizarTabelaResumoDiaHistorico();
}

function fecharDetalheDiaHistorico() {
    $("histSingleDayDetailBox")?.classList.add("hidden");
    $("histDailyBoxWrapper")?.classList.remove("hidden");
}

/**
 * Renderiza o gráfico linear Temperatura (°C) x Horário do Dia (HH:mm) exclusivo para o dia selecionado
 */
function renderizarGraficoDiaEspecifico(g, dataStr, ovenName) {
    const canvas = $("historicoDiaChartCanvas");
    if (!canvas || typeof Chart === "undefined") return;

    if (historicoDiaChartInstance) {
        historicoDiaChartInstance.destroy();
        historicoDiaChartInstance = null;
    }

    const ordenadas = (g.rows || []).slice().sort((a, b) => a._ts - b._ts);
    if (ordenadas.length === 0) return;

    const maxPoints = 350;
    const step = Math.max(1, Math.ceil(ordenadas.length / maxPoints));
    const amostradas = [];

    for (let i = 0; i < ordenadas.length; i += step) {
        amostradas.push(ordenadas[i]);
    }
    if (amostradas[amostradas.length - 1] !== ordenadas[ordenadas.length - 1]) {
        amostradas.push(ordenadas[ordenadas.length - 1]);
    }

    const ptsC1 = [];
    const ptsC2 = [];
    for (let i = 0; i < amostradas.length; i++) {
        const r = amostradas[i];
        const ts = r._ts;
        ptsC1.push({ x: ts, y: numVal(r.canal_1) ?? 0 });
        ptsC2.push({ x: ts, y: numVal(r.canal_2) ?? 0 });
    }

    const readoutEl = $("histDayChartReadout");
    if (readoutEl) {
        readoutEl.innerHTML = `<i class="fa-solid fa-fire-flame-curved"></i> <span><b>${escapeHtml(dataStr)}</b> • Pico Máx: <b style="color:#fb923c">${g.picoC1}°C às ${formatarHoraCurtaTs(g.picoC1Ts)}</b> | Média: <b style="color:#38bdf8">${g.mediaC1}°C às ${formatarHoraCurtaTs(g.mediaC1Ts)}</b> | Mín: <b style="color:#34d399">${g.minC1}°C às ${formatarHoraCurtaTs(g.minC1Ts)}</b></span>`;
    }

    const ctx = canvas.getContext("2d");
    const gradC1 = ctx.createLinearGradient(0, 0, 0, 250);
    gradC1.addColorStop(0, "rgba(249, 115, 22, 0.36)");
    gradC1.addColorStop(1, "rgba(249, 115, 22, 0.0)");

    const gradC2 = ctx.createLinearGradient(0, 0, 0, 250);
    gradC2.addColorStop(0, "rgba(56, 189, 248, 0.24)");
    gradC2.addColorStop(1, "rgba(56, 189, 248, 0.0)");

    historicoDiaChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: `${ovenName} — Canal 1 (Superior °C)`,
                    data: ptsC1,
                    borderColor: "#f97316",
                    backgroundColor: gradC1,
                    borderWidth: 2.5,
                    pointRadius: amostradas.length <= 50 ? 3 : 0,
                    pointHoverRadius: 6,
                    tension: 0.25,
                    fill: true
                },
                {
                    label: `${ovenName} — Canal 2 (Inferior °C)`,
                    data: ptsC2,
                    borderColor: "#38bdf8",
                    backgroundColor: gradC2,
                    borderWidth: 2,
                    pointRadius: amostradas.length <= 50 ? 2.5 : 0,
                    pointHoverRadius: 5,
                    tension: 0.25,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 220 },
            interaction: {
                mode: "index",
                intersect: false
            },
            onHover: (event, activeElements) => {
                if (!readoutEl || !activeElements || activeElements.length === 0) return;
                const idx = activeElements[0].index;
                const p1 = ptsC1[idx];
                const p2 = ptsC2[idx];
                if (!p1) return;
                const hStr = formatarHoraCurtaTs(p1.x);
                const c1Val = p1.y ?? "--";
                const c2Val = p2 ? (p2.y ?? "--") : "--";
                readoutEl.innerHTML = `<i class="fa-regular fa-clock"></i> <span><b>${escapeHtml(dataStr)} às ${hStr}</b> &nbsp;•&nbsp; C1: <b style="color:#fb923c">${c1Val} °C</b> &nbsp;|&nbsp; C2: <b style="color:#38bdf8">${c2Val} °C</b></span>`;
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#cbd5e1",
                        font: { size: 11, weight: "600" }
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.96)",
                    titleColor: "#ffffff",
                    bodyColor: "#e2e8f0",
                    borderColor: "rgba(249, 115, 22, 0.45)",
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        title: (items) => {
                            if (!items || !items.length) return "";
                            const ts = Number(items[0].parsed.x);
                            return `${dataStr} — Horário: ${formatarHoraCurtaTs(ts)}`;
                        },
                        label: (ctxItem) => `${ctxItem.dataset.label}: ${ctxItem.parsed.y} °C`
                    }
                }
            },
            scales: {
                x: {
                    type: "linear",
                    min: g.minTs,
                    max: g.maxTs > g.minTs ? g.maxTs : g.minTs + 60000,
                    title: {
                        display: true,
                        text: `Horário do Dia (${dataStr})`,
                        color: "#94a3b8",
                        font: { size: 10, weight: "700" }
                    },
                    ticks: {
                        color: "#94a3b8",
                        maxTicksLimit: 10,
                        font: { size: 10 },
                        callback: (val) => formatarHoraCurtaTs(Number(val))
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.04)"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Temperatura (°C)",
                        color: "#94a3b8",
                        font: { size: 10, weight: "700" }
                    },
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 10 },
                        callback: (v) => `${v}°C`
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.06)"
                    }
                }
            }
        }
    });
}

/**
 * Renderiza a tabela paginada com todas as leituras coletadas do forno selecionado
 */
function renderizarTabelaLeiturasHistorico() {
    const tbody = $("histRawTableBody");
    const paginationBar = $("histPaginationBar");
    if (!tbody) return;

    const leituras = state.historicoLeiturasAtuais || [];
    const pageSize = 50;
    const totalPages = Math.max(1, Math.ceil(leituras.length / pageSize));
    if (state.historicoPaginaTabela > totalPages) state.historicoPaginaTabela = totalPages;

    const startIdx = (state.historicoPaginaTabela - 1) * pageSize;
    const paginaAtual = leituras.slice(startIdx, startIdx + pageSize);

    if (paginaAtual.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">
                    Nenhuma leitura encontrada para o período selecionado.
                </td>
            </tr>
        `;
        if (paginationBar) paginationBar.innerHTML = "";
        return;
    }

    tbody.innerHTML = paginaAtual.map(r => {
        const dt = new Date(r.created_at || r.data_hora);
        const dataHoraStr = !isNaN(dt.getTime())
            ? `${dt.toLocaleDateString("pt-BR")} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : "--";
        const mod = Number(r.modulo_alutal || r.forno_id || state.historicoFornoSelecionado || 1);
        const c1 = numVal(r.canal_1);
        const c2 = numVal(r.canal_2);

        return `
            <tr>
                <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(dataHoraStr)}</td>
                <td><span class="badge-mod" style="color:#38bdf8; font-weight:700;">Mód. ${String(mod).padStart(2, "0")}</span></td>
                <td class="text-orange" style="font-weight: 800;">${c1 !== null ? `${c1} °C` : "--"}</td>
                <td class="text-blue" style="font-weight: 800;">${c2 !== null ? `${c2} °C` : "--"}</td>
            </tr>
        `;
    }).join("");

    if (paginationBar) {
        paginationBar.innerHTML = `
            <span>Mostrando ${startIdx + 1}–${Math.min(startIdx + pageSize, leituras.length)} de ${leituras.length} leituras</span>
            <div style="display: flex; gap: 6px;">
                <button type="button" class="hist-page-btn" ${state.historicoPaginaTabela <= 1 ? "disabled" : ""} onclick="mudarPaginaTabelaHistorico(-1)">
                    <i class="fa-solid fa-chevron-left"></i> Anterior
                </button>
                <span style="padding: 5px 8px; color: #ffffff; font-weight: 700;">Pág. ${state.historicoPaginaTabela} / ${totalPages}</span>
                <button type="button" class="hist-page-btn" ${state.historicoPaginaTabela >= totalPages ? "disabled" : ""} onclick="mudarPaginaTabelaHistorico(1)">
                    Próxima <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;
    }
}

function mudarPaginaTabelaHistorico(delta) {
    state.historicoPaginaTabela = Math.max(1, (state.historicoPaginaTabela || 1) + delta);
    renderizarTabelaLeiturasHistorico();
}

function exportarCSVHistoricoForno() {
    const leituras = state.historicoLeiturasAtuais || [];
    if (!leituras.length) {
        alert("Não há leituras carregadas neste período para exportar.");
        return;
    }
    const mod = state.historicoFornoSelecionado || 1;
    const linhas = ["Data_Hora;Modulo_RS485;Serial;Canal_1_Superior_C;Canal_2_Inferior_C;Delta_C"];
    leituras.forEach(r => {
        const dt = new Date(r.created_at || r.data_hora);
        const dtStr = !isNaN(dt.getTime()) ? dt.toLocaleString("pt-BR") : "";
        const c1 = numVal(r.canal_1) ?? "";
        const c2 = numVal(r.canal_2) ?? "";
        const delta = (c1 !== "" && c2 !== "") ? Math.abs(c1 - c2) : "";
        linhas.push(`${dtStr};${r.modulo_alutal || r.forno_id || mod};${r.numero_serie || ""};${c1};${c2};${delta}`);
    });

    const blob = new Blob(["\uFEFF" + linhas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historico_forno_${String(mod).padStart(2, "0")}_${state.historicoPeriodoDias}d.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    if (state.selectedModule !== null) {
        await carregarDadosAnalise();
    }
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

    // Configura botões de navegação contínua e gestos táteis do gráfico
    configurarBotoesNavegacaoContinuo();
    atualizarBotaoAlarme();

    // Redimensionamento fluido em rotação de tela e resize de janela
    window.addEventListener("resize", () => {
        if (state.analysisChart) {
            state.analysisChart.resize();
        }
        if (state.landscapeChart) {
            state.landscapeChart.resize();
        }
    });
});

// ==========================================================================
// 9. RECURSOS INDUSTRIAIS: ALARME SONORO, MODO TV/FULLSCREEN E RELATÓRIO
// ==========================================================================

let audioCtx = null;
let alarmMuted = localStorage.getItem("thermolink_alarm_muted") === "true";

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

function playAlarmBeep(isCritical = false) {
    if (alarmMuted) return;
    try {
        initAudioContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = isCritical ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(isCritical ? 880 : 587.33, audioCtx.currentTime);
        if (isCritical) {
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
        }

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);

        const btn = $("btnToggleAlarm");
        if (btn) {
            btn.classList.add("alarm-firing");
            setTimeout(() => btn.classList.remove("alarm-firing"), 1200);
        }
    } catch (e) {
        console.warn("[Alarme Sonoro] Erro ao reproduzir áudio:", e);
    }
}

function toggleAudioAlarm() {
    initAudioContext();
    alarmMuted = !alarmMuted;
    localStorage.setItem("thermolink_alarm_muted", alarmMuted ? "true" : "false");
    atualizarBotaoAlarme();

    if (!alarmMuted) {
        playAlarmBeep(false);
    }
}

function atualizarBotaoAlarme() {
    const btn = $("btnToggleAlarm");
    const icon = $("alarmIcon");
    if (!btn || !icon) return;

    if (alarmMuted) {
        btn.classList.remove("alarm-enabled");
        icon.className = "fa-solid fa-bell-slash";
        btn.title = "Alarme Sonoro Silenciado (Toque para Ativar)";
    } else {
        btn.classList.add("alarm-enabled");
        icon.className = "fa-solid fa-bell";
        btn.title = "Alarme Sonoro Ativo (Toque para Silenciar)";
    }
}

function checarAlarmesSonoros() {
    if (alarmMuted || !state.readings) return;
    for (const [mod, r] of state.readings.entries()) {
        const c1 = numVal(r?.canal_1);
        const c2 = numVal(r?.canal_2);
        if ((c1 !== null && c1 >= 950) || (c2 !== null && c2 >= 950)) {
            playAlarmBeep(true);
            break;
        }
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        $("fullscreenIcon")?.classList.replace("fa-expand", "fa-compress");
    } else {
        document.exitFullscreen().catch(() => {});
        $("fullscreenIcon")?.classList.replace("fa-compress", "fa-expand");
    }
}

document.addEventListener("fullscreenchange", () => {
    const isFull = !!document.fullscreenElement;
    const icon = $("fullscreenIcon");
    if (icon) {
        if (isFull) {
            icon.classList.replace("fa-expand", "fa-compress");
        } else {
            icon.classList.replace("fa-compress", "fa-expand");
        }
    }
});

function imprimirRelatorioQueima() {
    window.print();
}

// ==========================================================================
// 8. GERENCIADOR DE SETPOINTS RS485 (SETSP / GETSP - ALUTAL IS4000D / CERATERM)
// ==========================================================================
window.ThermoSetpoints = {
    currentModule: 1,
    cache: new Map(),
    isInitialized: false,
    realtimeChannel: null,

    // Calcula os bytes hexadecimais brutos oficiais do protocolo Alutal IS4000D
    // (12 bits empacotados em blocos de 6 bits com bits 0 e 1 em 11)
    // Formula exata documentada em DOCUMENTACAO_THERMOX.md:
    // byteH = ((((tempC >> 6) & 0x3F) << 2) | 0x03)
    // byteL = (((tempC & 0x3F) << 2) | 0x03)
    calcularHexAlutal(tempC) {
        const val = Math.max(0, Math.min(4095, Math.round(Number(tempC) || 0)));
        const byteH = ((((val >> 6) & 0x3F) << 2) | 0x03);
        const byteL = (((val & 0x3F) << 2) | 0x03);
        return {
            hHex: byteH.toString(16).toUpperCase().padStart(2, "0"),
            lHex: byteL.toString(16).toUpperCase().padStart(2, "0"),
            hVal: byteH,
            lVal: byteL
        };
    },

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Carrega cache salvo no localStorage para persistência offline
        try {
            const salvo = localStorage.getItem("thermolink_setpoints_cache");
            if (salvo) {
                const parsed = JSON.parse(salvo);
                Object.keys(parsed).forEach(k => {
                    this.cache.set(Number(k), parsed[k]);
                });
            }
        } catch (e) {
            console.warn("[Setpoints] Falha ao ler cache local:", e);
        }

        // Se o cache ainda estiver vazio, define Módulo 1 com o padrão solicitado (650°C / 900°C)
        if (!this.cache.has(1)) {
            this.cache.set(1, {
                modulo: 1,
                sp1: 650,
                sp2: 900,
                novoSp1: 650,
                novoSp2: 900,
                pendenteGravacao: false,
                pendenteLeitura: false,
                updatedAt: "Padrão Oficial"
            });
        }

        this.sincronizarComFornos();
        this.carregarDoSupabase();
        this.iniciarRealtime();
        this.renderizar();
    },

    async carregarDoSupabase() {
        try {
            let query = sb
                .from("fornos")
                .select("id, modulo_alutal, numero, nome, ceramica_id, dispositivo_id, setpoint_1, setpoint_2, novo_setpoint_1, novo_setpoint_2, setpoint_pendente, comando_setpoint, setpoint_atualizado_em");

            const cid = state.currentUser?.ceramicaId || null;
            if (cid) {
                query = query.eq("ceramica_id", cid);
            } else if (state.allowedDeviceIds && state.allowedDeviceIds.length > 0) {
                query = query.in("dispositivo_id", state.allowedDeviceIds);
            }

            const { data, error } = await query;

            if (!error && Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const mod = Number(item.modulo_alutal || item.numero || 1);
                    const sp1 = item.setpoint_1 !== null && item.setpoint_1 !== undefined ? Number(item.setpoint_1) : 650;
                    const sp2 = item.setpoint_2 !== null && item.setpoint_2 !== undefined ? Number(item.setpoint_2) : 900;
                    const dt = item.setpoint_atualizado_em ? new Date(item.setpoint_atualizado_em).toLocaleTimeString("pt-BR") : "Sincronizado";

                    this.cache.set(mod, {
                        fornoId: item.id,
                        modulo: mod,
                        sp1: sp1,
                        sp2: sp2,
                        novoSp1: item.novo_setpoint_1 !== null ? Number(item.novo_setpoint_1) : sp1,
                        novoSp2: item.novo_setpoint_2 !== null ? Number(item.novo_setpoint_2) : sp2,
                        pendenteGravacao: !!item.setpoint_pendente,
                        pendenteLeitura: item.comando_setpoint === "GETSP",
                        updatedAt: dt
                    });
                });
                this.salvarCacheLocal();
                this.renderizar();
            }
        } catch (err) {
            console.warn("[Setpoints] Falha ao carregar setpoints do Supabase:", err);
        }
    },

    iniciarRealtime() {
        if (this.realtimeChannel) return;
        try {
            this.realtimeChannel = sb.channel("thermolink_setpoints_sync")
                .on("postgres_changes", { event: "*", schema: "public", table: "fornos" }, payload => {
                    const rec = payload.new || payload.record;
                    if (rec && rec.modulo_alutal) {
                        const mod = Number(rec.modulo_alutal);
                        const prev = this.cache.get(mod) || {};
                        const sp1 = rec.setpoint_1 !== null ? Number(rec.setpoint_1) : (prev.sp1 || 650);
                        const sp2 = rec.setpoint_2 !== null ? Number(rec.setpoint_2) : (prev.sp2 || 900);
                        const pendenteGravacao = !!rec.setpoint_pendente;
                        const pendenteLeitura = rec.comando_setpoint === "GETSP";

                        this.cache.set(mod, {
                            ...prev,
                            fornoId: rec.id,
                            modulo: mod,
                            sp1: sp1,
                            sp2: sp2,
                            pendenteGravacao: pendenteGravacao,
                            pendenteLeitura: pendenteLeitura,
                            updatedAt: rec.setpoint_atualizado_em ? new Date(rec.setpoint_atualizado_em).toLocaleTimeString("pt-BR") : "Atualizado"
                        });
                        this.salvarCacheLocal();

                        // Se a gravação concluiu e estávamos aguardando
                        if (!pendenteGravacao && prev.pendenteGravacao) {
                            this.adicionarLog(`<< [SETSP] Módulo ${mod} confirmou gravação na EEPROM! SP1 = ${sp1} °C | SP2 = ${sp2} °C`, "cmd-rx");
                        }
                        if (!pendenteLeitura && prev.pendenteLeitura) {
                            this.adicionarLog(`<< [GETSP] Módulo ${mod} leitura confirmada! SP1 = ${sp1} °C | SP2 = ${sp2} °C`, "cmd-rx");
                        }

                        this.renderizar();
                    }
                })
                .subscribe();
        } catch (e) {
            console.warn("[Setpoints] Realtime não suportado ou falhou:", e);
        }
    },

    salvarCacheLocal() {
        try {
            const obj = {};
            this.cache.forEach((v, k) => { obj[k] = v; });
            localStorage.setItem("thermolink_setpoints_cache", JSON.stringify(obj));
        } catch (e) {}
    },

    sincronizarComFornos() {
        const select = $("selModuloSetpoints");
        if (!select) return;

        let mods = [];
        if (state.ovens && state.ovens.length > 0) {
            mods = state.ovens.map(o => Number(o.numero)).filter(n => Number.isFinite(n) && n > 0);
        }
        if (mods.length === 0) {
            mods = [1, 2, 3, 4, 5, 6];
        }

        const modsUnicos = Array.from(new Set(mods)).sort((a, b) => a - b);
        const valorAtual = select.value ? Number(select.value) : this.currentModule;

        select.innerHTML = modsUnicos.map(m => {
            const nome = getNomeForno(m);
            return `<option value="${m}">Módulo ${String(m).padStart(2, "0")} (${escapeHtml(nome)})</option>`;
        }).join("");

        if (modsUnicos.includes(valorAtual)) {
            select.value = String(valorAtual);
            this.currentModule = valorAtual;
        } else {
            this.currentModule = modsUnicos[0] || 1;
            select.value = String(this.currentModule);
        }
    },

    selecionarModulo(mod) {
        this.currentModule = Number(mod) || 1;
        this.renderizar();

        const data = this.obterDadosModulo(this.currentModule);
        this.adicionarLog(`>> Selecionado Módulo ${this.currentModule} (${getNomeForno(this.currentModule)}). SP1 = ${data.sp1} °C | SP2 = ${data.sp2} °C.`, "cmd-info");
    },

    obterDadosModulo(mod) {
        const m = Number(mod) || 1;
        if (!this.cache.has(m)) {
            this.cache.set(m, {
                modulo: m,
                sp1: 650,
                sp2: 900,
                novoSp1: 650,
                novoSp2: 900,
                pendenteGravacao: false,
                pendenteLeitura: false,
                updatedAt: "--:--:--"
            });
        }
        return this.cache.get(m);
    },

    renderizar() {
        const mod = this.currentModule || 1;
        const data = this.obterDadosModulo(mod);

        // Atualiza selects nos diferentes painéis
        const sel1 = $("selModuloSetpoints");
        if (sel1 && sel1.value !== String(mod)) sel1.value = String(mod);
        const sel2 = $("selModuloSetpoint");
        if (sel2 && sel2.value !== String(mod)) sel2.value = String(mod);

        // Header e Tags do Painel em Configurações
        if ($("lblGetspHeader")) $("lblGetspHeader").textContent = `Leitura Atual no Módulo (GETSP ${mod})`;
        if ($("lblGetspTime")) $("lblGetspTime").textContent = data.updatedAt || "--:--:--";
        if ($("lblBtnGetsp")) $("lblBtnGetsp").textContent = `Consultar Módulo (GETSP ${mod})`;

        // Valores de exibição do GETSP (Painel Config)
        if ($("dispGetSp1")) $("dispGetSp1").textContent = `${data.sp1} °C`;
        if ($("dispGetSp2")) $("dispGetSp2").textContent = `${data.sp2} °C`;

        // Valores de exibição destacados (Painel Análise do Forno)
        if ($("lblSetpoint1Atual")) $("lblSetpoint1Atual").textContent = `${data.sp1} °C`;
        if ($("lblSetpoint2Atual")) $("lblSetpoint2Atual").textContent = `${data.sp2} °C`;
        if ($("lblSetpointUltimaLeitura")) $("lblSetpointUltimaLeitura").textContent = data.updatedAt || "--";
        if ($("lblSetpointTituloGetsp")) $("lblSetpointTituloGetsp").textContent = `Leitura Atual no Módulo ${mod} (GETSP)`;
        if ($("lblBtnSolicitarLeitura")) $("lblBtnSolicitarLeitura").textContent = `Ler do Aparelho (GETSP ${mod})`;

        // Inputs de edição (não sobrescreve se o usuário estiver digitando ativamente)
        const inp1 = $("inpSetSp1");
        const inp2 = $("inpSetSp2");
        if (inp1 && document.activeElement !== inp1) inp1.value = data.novoSp1 || data.sp1 || 650;
        if (inp2 && document.activeElement !== inp2) inp2.value = data.novoSp2 || data.sp2 || 900;

        const inpA1 = $("inpNovoSetpoint1");
        const inpA2 = $("inpNovoSetpoint2");
        if (inpA1 && document.activeElement !== inpA1) inpA1.value = data.novoSp1 || data.sp1 || 650;
        if (inpA2 && document.activeElement !== inpA2) inpA2.value = data.novoSp2 || data.sp2 || 900;

        // Status Badges
        const badgeCfg = $("cfgSpBadgeStatus");
        const badgeAna = $("badgeStatusSetpoint");
        const pendente = data.pendenteGravacao || data.pendenteLeitura;

        [badgeCfg, badgeAna].forEach(b => {
            if (!b) return;
            if (data.pendenteGravacao) {
                b.className = "setpoints-badge-status is-pending";
                b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Gravando SETSP...`;
            } else if (data.pendenteLeitura) {
                b.className = "setpoints-badge-status is-querying";
                b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Lendo GETSP...`;
            } else {
                b.className = "setpoints-badge-status";
                b.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pronto`;
            }
        });

        // Rótulos dos botões de gravação
        this.atualizarTextoBotaoGravar();
        if (typeof atualizarLabelBotaoGravar === "function") atualizarLabelBotaoGravar();

        // Resumo no topo do forno atual se estiver na tela de análise
        if (state.analysisModule) {
            this.atualizarResumoForno(state.analysisModule);
        }

        // Espelha no modal se estiver aberto
        this.sincronizarModalSeAberto();
    },

    atualizarTextoBotaoGravar() {
        const mod = this.currentModule || 1;
        const sp1 = $("inpSetSp1")?.value || $("inpNovoSetpoint1")?.value || 650;
        const sp2 = $("inpSetSp2")?.value || $("inpNovoSetpoint2")?.value || 900;
        const btnLbl = $("lblBtnSetspGravar");
        if (btnLbl) {
            btnLbl.textContent = `Gravar no Módulo (SETSP ${mod} ${sp1} ${sp2})`;
        }
    },

    aplicarPreset(sp1, sp2, btnEl) {
        const inp1 = $("inpSetSp1");
        const inp2 = $("inpSetSp2");
        if (inp1) inp1.value = sp1;
        if (inp2) inp2.value = sp2;

        const inpA1 = $("inpNovoSetpoint1");
        const inpA2 = $("inpNovoSetpoint2");
        if (inpA1) inpA1.value = sp1;
        if (inpA2) inpA2.value = sp2;

        document.querySelectorAll(".setsp-preset-chip").forEach(c => c.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");

        this.atualizarTextoBotaoGravar();
        if (typeof atualizarLabelBotaoGravar === "function") atualizarLabelBotaoGravar();
        this.adicionarLog(`Preset aplicado: SP1=${sp1}°C | SP2=${sp2}°C para o Módulo ${this.currentModule}`, "cmd-info");
    },

    async consultarGetsp() {
        return solicitarLeituraSetpoint();
    },

    async gravarSetsp() {
        return enviarNovoSetpoint();
    },

    atualizarResumoForno(modulo) {
        const mod = Number(modulo) || 1;
        const data = this.obterDadosModulo(mod);
        const disp = $("quickSpDisplay");
        if (disp) {
            disp.textContent = `SP1: ${data.sp1}°C | SP2: ${data.sp2}°C`;
        }
    },

    adicionarLog(msg, tipo = "cmd-info") {
        const terminal = $("setpointsTerminal");
        if (!terminal) return;

        const agora = new Date().toLocaleTimeString("pt-BR");
        const span = document.createElement("span");
        span.className = `terminal-line ${tipo}`;
        span.textContent = `[${agora}] ${msg}`;

        terminal.appendChild(span);
        terminal.scrollTop = terminal.scrollHeight;

        while (terminal.children.length > 50) {
            terminal.removeChild(terminal.firstChild);
        }

        const modalTerm = $("modalSetpointsTerminal");
        if (modalTerm) {
            const clone = span.cloneNode(true);
            modalTerm.appendChild(clone);
            modalTerm.scrollTop = modalTerm.scrollHeight;
            while (modalTerm.children.length > 50) {
                modalTerm.removeChild(modalTerm.firstChild);
            }
        }
    },

    abrirModalParaFornoAtual() {
        const mod = state.analysisModule || state.selectedModule || 1;
        this.currentModule = mod;

        const modal = $("modalSetpoints");
        const content = $("modalSpContentArea");
        const title = $("modalSpTitle");

        if (title) title.textContent = `Setpoints do ${getNomeForno(mod)} (Módulo ${mod})`;

        if (content) {
            content.innerHTML = `
                <div class="setpoints-card" style="margin-bottom: 0; box-shadow: none; padding: 10px; background: transparent; border: none;">
                    <div class="getsp-display-box" style="margin-bottom: 12px;">
                        <div class="getsp-header">
                            <span class="getsp-header-tag"><i class="fa-solid fa-satellite-dish"></i> GETSP ${mod} Atual</span>
                            <span id="modalSpTime">--:--:--</span>
                        </div>
                        <div class="getsp-grid">
                            <div class="getsp-item sp1">
                                <span class="getsp-lbl">Setpoint 1 (SP1)</span>
                                <div class="getsp-val" id="modalDispGetSp1">-- °C</div>
                            </div>
                            <div class="getsp-item sp2">
                                <span class="getsp-lbl">Setpoint 2 (SP2)</span>
                                <div class="getsp-val" id="modalDispGetSp2">-- °C</div>
                            </div>
                        </div>
                        <button type="button" class="btn-query-getsp" id="modalBtnQueryGetsp" onclick="solicitarLeituraSetpoint(${mod})">
                            <i class="fa-solid fa-rotate" id="modalIconGetspSpin"></i> <span id="modalLblBtnGetsp">Consultar Módulo (GETSP ${mod})</span>
                        </button>
                    </div>

                    <div class="setsp-editor-box" style="margin-bottom: 12px;">
                        <div class="setsp-inputs-grid">
                            <div class="setsp-field-group">
                                <label>Novo SP1 (°C):</label>
                                <div class="setsp-input-container">
                                    <input type="number" id="modalInpSetSp1" class="setsp-input" value="650" oninput="ThermoSetpoints.sincronizarModalInputs(1, this.value)">
                                    <span class="setsp-input-unit">°C</span>
                                </div>
                            </div>
                            <div class="setsp-field-group">
                                <label>Novo SP2 (°C):</label>
                                <div class="setsp-input-container">
                                    <input type="number" id="modalInpSetSp2" class="setsp-input" value="900" oninput="ThermoSetpoints.sincronizarModalInputs(2, this.value)">
                                    <span class="setsp-input-unit">°C</span>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn-save-setsp" id="modalBtnGravar" onclick="ThermoSetpoints.gravarSetspModal()">
                            <i class="fa-solid fa-bolt"></i>
                            <span id="modalBtnGravarLbl">Gravar no Módulo (SETSP ${mod} 650 900)</span>
                        </button>
                    </div>
                </div>
            `;
        }

        if (modal) modal.classList.remove("hidden");
        window._modalSpEditadoPeloUsuario = false;
        window._setpointEnvioEmAndamento = false;
        this.sincronizarModalSeAberto();
        solicitarLeituraSetpoint(mod);
    },

    fecharModal() {
        $("modalSetpoints")?.classList.add("hidden");
        window._modalSpEditadoPeloUsuario = false;
    },

    sincronizarModalSeAberto() {
        const modal = $("modalSetpoints");
        if (!modal || modal.classList.contains("hidden")) return;

        const mod = this.currentModule || 1;
        const data = this.obterDadosModulo(mod);

        if ($("modalDispGetSp1")) $("modalDispGetSp1").textContent = `${data.sp1} °C`;
        if ($("modalDispGetSp2")) $("modalDispGetSp2").textContent = `${data.sp2} °C`;
        if ($("modalSpTime")) $("modalSpTime").textContent = data.updatedAt || "--:--:--";

        const mInp1 = $("modalInpSetSp1");
        const mInp2 = $("modalInpSetSp2");
        if (!window._modalSpEditadoPeloUsuario && !window._setpointEnvioEmAndamento) {
            if (mInp1 && document.activeElement !== mInp1) mInp1.value = data.novoSp1 || data.sp1 || 650;
            if (mInp2 && document.activeElement !== mInp2) mInp2.value = data.novoSp2 || data.sp2 || 900;
        }

        const btnLbl = $("modalBtnGravarLbl");
        if (btnLbl && !window._setpointEnvioEmAndamento) {
            const v1 = mInp1?.value || 650;
            const v2 = mInp2?.value || 900;
            btnLbl.textContent = `Gravar no Módulo (SETSP ${mod} ${v1} ${v2})`;
        }
    },

    sincronizarModalInputs(canal, val) {
        window._modalSpEditadoPeloUsuario = true;
        if (canal === 1) {
            if ($("inpSetSp1")) $("inpSetSp1").value = val;
            if ($("inpNovoSetpoint1")) $("inpNovoSetpoint1").value = val;
        } else {
            if ($("inpSetSp2")) $("inpSetSp2").value = val;
            if ($("inpNovoSetpoint2")) $("inpNovoSetpoint2").value = val;
        }
        this.atualizarTextoBotaoGravar();
        if (typeof atualizarLabelBotaoGravar === "function") atualizarLabelBotaoGravar();

        const mod = this.currentModule || 1;
        const v1 = $("modalInpSetSp1")?.value || 650;
        const v2 = $("modalInpSetSp2")?.value || 900;
        if ($("modalBtnGravarLbl")) {
            $("modalBtnGravarLbl").textContent = `Gravar no Módulo (SETSP ${mod} ${v1} ${v2})`;
        }
    },

    aplicarPresetModal(sp1, sp2) {
        if ($("modalInpSetSp1")) $("modalInpSetSp1").value = sp1;
        if ($("modalInpSetSp2")) $("modalInpSetSp2").value = sp2;
        this.aplicarPreset(sp1, sp2, null);
        const mod = this.currentModule || 1;
        if ($("modalBtnGravarLbl")) {
            $("modalBtnGravarLbl").textContent = `Gravar no Módulo (SETSP ${mod} ${sp1} ${sp2})`;
        }
    },

    async gravarSetspModal() {
        const mInp1 = $("modalInpSetSp1");
        const mInp2 = $("modalInpSetSp2");
        if (mInp1 && $("inpSetSp1")) $("inpSetSp1").value = mInp1.value;
        if (mInp2 && $("inpSetSp2")) $("inpSetSp2").value = mInp2.value;
        if (mInp1 && $("inpNovoSetpoint1")) $("inpNovoSetpoint1").value = mInp1.value;
        if (mInp2 && $("inpNovoSetpoint2")) $("inpNovoSetpoint2").value = mInp2.value;
        await enviarNovoSetpoint();
        this.sincronizarModalSeAberto();
    }
};

// ==========================================================================
// FUNÇÕES GLOBAIS DE CONTROLE DE SETPOINT (CONFORME ESPECIFICAÇÃO DE PROJETO)
// ==========================================================================

// Garante que o registro do forno/módulo exista no Supabase com upsert automático
// Garante que o registro do forno/módulo exista no Supabase com upsert automático
async function garantirFornoExiste(modulo, novoSp1 = 650, novoSp2 = 900, comando = 'IDLE', pendente = false) {
    const mod = Number(modulo) || 1;
    const cid = state.currentUser?.ceramicaId || null;

    let dispId = 1;
    if (state.allowedDeviceIds && state.allowedDeviceIds.length > 0) {
        dispId = Number(state.allowedDeviceIds[0]) || 1;
    } else if (state.clientDevices && state.clientDevices.length > 0) {
        dispId = Number(state.clientDevices[0].id) || 1;
    }

    try {
        // 1. Tenta buscar pelo vínculo da cerâmica e módulo/número
        let existente = null;
        if (cid) {
            const { data } = await sb
                .from("fornos")
                .select("id, modulo_alutal, numero, dispositivo_id, ceramica_id, setpoint_1, setpoint_2")
                .eq("ceramica_id", cid)
                .or(`modulo_alutal.eq.${mod},numero.eq.${mod}`)
                .maybeSingle();
            existente = data;
        }

        // 2. Se não achou por cerâmica, busca pelo dispositivo e módulo/número
        if (!existente && dispId) {
            const { data } = await sb
                .from("fornos")
                .select("id, modulo_alutal, numero, dispositivo_id, ceramica_id, setpoint_1, setpoint_2")
                .eq("dispositivo_id", dispId)
                .or(`modulo_alutal.eq.${mod},numero.eq.${mod}`)
                .maybeSingle();
            existente = data;
        }

        // 3. Fallback genérico por modulo_alutal
        if (!existente) {
            const { data } = await sb
                .from("fornos")
                .select("id, modulo_alutal, numero, dispositivo_id, ceramica_id, setpoint_1, setpoint_2")
                .eq("modulo_alutal", mod)
                .maybeSingle();
            existente = data;
        }

        if (existente) {
            // Garante que o registro tenha modulo_alutal e dispositivo_id preenchidos
            const patch = {};
            if (!existente.modulo_alutal || existente.modulo_alutal !== mod) patch.modulo_alutal = mod;
            if ((!existente.dispositivo_id || existente.dispositivo_id <= 0) && dispId) patch.dispositivo_id = dispId;
            if (!existente.ceramica_id && cid) patch.ceramica_id = cid;

            if (Object.keys(patch).length > 0) {
                await sb.from("fornos").update(patch).eq("id", existente.id);
                Object.assign(existente, patch);
            }
            return existente;
        }

        // 4. Criação de novo forno se não existir
        const nomeForno = getNomeForno(mod);
        const novoRegistro = {
            numero: mod,
            nome: nomeForno,
            modulo_alutal: mod,
            dispositivo_id: dispId,
            ceramica_id: cid,
            setpoint_1: 0,
            setpoint_2: 0,
            novo_setpoint_1: novoSp1,
            novo_setpoint_2: novoSp2,
            comando_setpoint: comando,
            setpoint_pendente: pendente,
            setpoint_atualizado_em: new Date().toISOString()
        };

        const { data: criado, error } = await sb
            .from("fornos")
            .insert([novoRegistro])
            .select()
            .maybeSingle();

        if (!error && criado) {
            return criado;
        }
    } catch (e) {
        console.warn("[Setpoints] Erro ao garantir forno no Supabase:", e);
    }
    return null;
}

// 1. SOLICITAR LEITURA DE SETPOINT DO APARELHO (GETSP)
async function solicitarLeituraSetpoint(moduloExplicito) {
    const sel = $("selModuloSetpoint") || $("selModuloSetpoints");
    const mod = Number(moduloExplicito) || Number(sel?.value) || window.ThermoSetpoints?.currentModule || state.analysisModule || state.selectedModule || 1;

    if (window.ThermoSetpoints) {
        window.ThermoSetpoints.currentModule = mod;
    }

    const btn = $("btnSolicitarLeitura") || $("btnConsultarGetsp") || $("modalBtnQueryGetsp");
    const icon = $("iconSpinLeitura") || $("iconGetspSpin") || $("modalIconGetspSpin");
    const lbl = $("lblBtnSolicitarLeitura") || $("lblBtnGetsp") || $("modalLblBtnGetsp");
    const badge = $("badgeStatusSetpoint") || $("cfgSpBadgeStatus");
    const feedback = $("setpointLiveFeedback");
    const feedbackText = $("setpointLiveFeedbackText");

    // UI: Spinner e Feedback
    if (btn) btn.disabled = true;
    if (icon) icon.classList.add("fa-spin");
    if (lbl) lbl.textContent = `Consultando módulo ${mod} via RS485...`;

    if (badge) {
        badge.className = "setpoints-badge-status is-querying";
        badge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Consultando GETSP ${mod}...`;
    }

    if (feedback && feedbackText) {
        feedback.className = "setpoint-live-feedback is-waiting";
        feedback.classList.remove("hidden");
        feedbackText.textContent = `Consultando módulo ${mod} via RS485... Aguardando resposta do aparelho...`;
    }

    if (window.ThermoSetpoints) {
        window.ThermoSetpoints.adicionarLog(`>> Solicitando GETSP ${mod} ao ESP8266...`, "cmd-tx");
    }

    let fornoId = null;
    try {
        const forno = await garantirFornoExiste(mod, 650, 900, 'GETSP', true);
        if (forno) {
            fornoId = forno.id;
            // Já exibe imediatamente o último valor registrado deste módulo específico no banco enquanto aguarda a leitura física
            if (window.ThermoSetpoints && (forno.setpoint_1 !== undefined || forno.setpoint_2 !== undefined)) {
                const c = window.ThermoSetpoints.obterDadosModulo(mod);
                if (forno.setpoint_1 !== null && forno.setpoint_1 !== undefined) c.sp1 = Number(forno.setpoint_1);
                if (forno.setpoint_2 !== null && forno.setpoint_2 !== undefined) c.sp2 = Number(forno.setpoint_2);
                c.novoSp1 = c.sp1;
                c.novoSp2 = c.sp2;
                window.ThermoSetpoints.salvarCacheLocal();
                window.ThermoSetpoints.sincronizarModalSeAberto();
                window.ThermoSetpoints.atualizarResumoForno(mod);
            }
        }

        const updateData = {
            comando_setpoint: "GETSP",
            setpoint_pendente: true,
            setpoint_atualizado_em: new Date().toISOString()
        };

        if (fornoId) {
            await sb.from("fornos").update(updateData).eq("id", fornoId);
        } else {
            await sb.from("fornos").update(updateData).eq("modulo_alutal", mod);
        }
    } catch (err) {
        console.warn("[Setpoints] Falha ao solicitar GETSP:", err);
    }

    // Polling a cada 2 segundos no Supabase
    let tentativas = 0;
    const maxTentativas = 15; // 30 segundos
    if (window._setpointPollingTimer) clearInterval(window._setpointPollingTimer);

    window._setpointPollingTimer = setInterval(async () => {
        tentativas++;
        try {
            let poll = sb
                .from("fornos")
                .select("id, modulo_alutal, setpoint_1, setpoint_2, novo_setpoint_1, novo_setpoint_2, setpoint_pendente, comando_setpoint, setpoint_atualizado_em");

            if (fornoId) {
                poll = poll.eq("id", fornoId);
            } else {
                poll = poll.eq("modulo_alutal", mod);
            }

            const { data, error } = await poll.maybeSingle();

            if (!error && data) {
                const pendente = !!data.setpoint_pendente;
                const cmd = data.comando_setpoint || "";

                // Finaliza com sucesso quando o ESP8266 responder e confirmar leitura
                if (cmd === "SUCESSO" && !pendente) {
                    clearInterval(window._setpointPollingTimer);
                    window._setpointPollingTimer = null;

                    const sp1 = data.setpoint_1 !== null ? Number(data.setpoint_1) : 0;
                    const sp2 = data.setpoint_2 !== null ? Number(data.setpoint_2) : 0;
                    const horaAtual = data.setpoint_atualizado_em
                        ? new Date(data.setpoint_atualizado_em).toLocaleTimeString("pt-BR")
                        : new Date().toLocaleTimeString("pt-BR");

                    // Atualiza displays destacados
                    if ($("lblSetpoint1Atual")) $("lblSetpoint1Atual").textContent = `${sp1} °C`;
                    if ($("lblSetpoint2Atual")) $("lblSetpoint2Atual").textContent = `${sp2} °C`;
                    if ($("lblSetpointUltimaLeitura")) $("lblSetpointUltimaLeitura").textContent = horaAtual;
                    if ($("dispGetSp1")) $("dispGetSp1").textContent = `${sp1} °C`;
                    if ($("dispGetSp2")) $("dispGetSp2").textContent = `${sp2} °C`;
                    if ($("modalDispGetSp1")) $("modalDispGetSp1").textContent = `${sp1} °C`;
                    if ($("modalDispGetSp2")) $("modalDispGetSp2").textContent = `${sp2} °C`;
                    if ($("modalSpTime")) $("modalSpTime").textContent = horaAtual;

                    // Preenche os inputs de edição com os valores reais lidos do aparelho (apenas se o usuário não estiver digitando um novo valor)
                    if (!window._modalSpEditadoPeloUsuario && !window._setpointEnvioEmAndamento) {
                        if ($("inpNovoSetpoint1")) $("inpNovoSetpoint1").value = sp1;
                        if ($("inpNovoSetpoint2")) $("inpNovoSetpoint2").value = sp2;
                        if ($("inpSetSp1")) $("inpSetSp1").value = sp1;
                        if ($("inpSetSp2")) $("inpSetSp2").value = sp2;
                        if ($("modalInpSetSp1") && document.activeElement !== $("modalInpSetSp1")) $("modalInpSetSp1").value = sp1;
                        if ($("modalInpSetSp2") && document.activeElement !== $("modalInpSetSp2")) $("modalInpSetSp2").value = sp2;
                        atualizarLabelBotaoGravar();
                    }

                    // Atualiza cache e logs
                    if (window.ThermoSetpoints) {
                        const c = window.ThermoSetpoints.obterDadosModulo(mod);
                        c.sp1 = sp1;
                        c.sp2 = sp2;
                        if (!window._modalSpEditadoPeloUsuario && !window._setpointEnvioEmAndamento) {
                            c.novoSp1 = sp1;
                            c.novoSp2 = sp2;
                        }
                        c.updatedAt = horaAtual;
                        c.pendenteLeitura = false;
                        window.ThermoSetpoints.salvarCacheLocal();
                        window.ThermoSetpoints.renderizar();
                        window.ThermoSetpoints.sincronizarModalSeAberto();
                        window.ThermoSetpoints.atualizarResumoForno(mod);
                        window.ThermoSetpoints.adicionarLog(`<< [GETSP] Módulo ${mod} confirmado no aparelho: SP1=${sp1}°C | SP2=${sp2}°C`, "cmd-rx");
                    }

                    if (badge) {
                        badge.className = "setpoints-badge-status";
                        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Leitura Confirmada!`;
                    }

                    if (feedback && feedbackText) {
                        feedback.className = "setpoint-live-feedback is-success";
                        feedbackText.textContent = `Setpoint atual do Módulo ${mod} lido com sucesso: SP1 = ${sp1} °C | SP2 = ${sp2} °C`;
                    }

                    if (btn) btn.disabled = false;
                    if (icon) icon.classList.remove("fa-spin");
                    if (lbl) lbl.textContent = `Consultar Módulo (GETSP ${mod})`;
                    return;
                } else if (cmd === "ERRO") {
                    clearInterval(window._setpointPollingTimer);
                    window._setpointPollingTimer = null;

                    if (badge) {
                        badge.className = "setpoints-badge-status is-error";
                        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Falha RS485`;
                    }

                    if (feedback && feedbackText) {
                        feedback.className = "setpoint-live-feedback is-error";
                        feedbackText.textContent = `Módulo ${mod} não respondeu à leitura via RS485. Verifique a fiação e o barramento.`;
                    }

                    if (btn) btn.disabled = false;
                    if (icon) icon.classList.remove("fa-spin");
                    if (lbl) lbl.textContent = `Consultar Módulo (GETSP ${mod})`;
                    return;
                }
            }
        } catch (e) {
            console.warn("[Setpoints] Erro no polling de leitura:", e);
        }

        if (tentativas >= maxTentativas) {
            clearInterval(window._setpointPollingTimer);
            window._setpointPollingTimer = null;

            if (btn) btn.disabled = false;
            if (icon) icon.classList.remove("fa-spin");
            if (lbl) lbl.textContent = `Consultar Módulo (GETSP ${mod})`;

            if (badge) {
                badge.className = "setpoints-badge-status";
                badge.innerHTML = `<i class="fa-solid fa-clock"></i> Sincronizando...`;
            }

            if (feedback && feedbackText) {
                feedback.className = "setpoint-live-feedback is-waiting";
                feedbackText.textContent = `Comando GETSP registrado. O aparelho atualizará a leitura assim que o ciclo de varredura RS485 concluir.`;
            }
        }
    }, 2000);
}

// 2. ENVIAR E GRAVAR NOVO SETPOINT NO APARELHO (SETSP)
async function enviarNovoSetpoint() {
    const sel = $("selModuloSetpoint") || $("selModuloSetpoints");
    const mod = Number(sel?.value) || window.ThermoSetpoints?.currentModule || state.selectedModule || 1;

    const inp1 = $("inpNovoSetpoint1") || $("inpSetSp1") || $("modalInpSetSp1");
    const inp2 = $("inpNovoSetpoint2") || $("inpSetSp2") || $("modalInpSetSp2");

    const sp1 = parseInt(inp1?.value, 10);
    const sp2 = parseInt(inp2?.value, 10);

    // Validação numérica (entre 0 e 1400 °C)
    if (isNaN(sp1) || isNaN(sp2) || sp1 < 0 || sp2 < 0 || sp1 > 1400 || sp2 > 1400) {
        alert("Por favor, informe valores válidos de setpoint entre 0 °C e 1400 °C.");
        return;
    }

    // Cancela qualquer polling de GETSP anterior para não conflitar com a gravação SETSP
    if (window._setpointPollingTimer) {
        clearInterval(window._setpointPollingTimer);
        window._setpointPollingTimer = null;
    }
    const btnGet = $("btnSolicitarLeitura") || $("btnConsultarGetsp") || $("modalBtnQueryGetsp");
    const iconGet = $("iconSpinLeitura") || $("iconGetspSpin") || $("modalIconGetspSpin");
    const lblGet = $("lblBtnSolicitarLeitura") || $("lblBtnGetsp") || $("modalLblBtnGetsp");
    if (btnGet) btnGet.disabled = false;
    if (iconGet) iconGet.classList.remove("fa-spin");
    if (lblGet) lblGet.textContent = `Consultar Módulo (GETSP ${mod})`;

    window._setpointEnvioEmAndamento = true;

    const btn = $("btnEnviarNovoSetpoint") || $("btnGravarSetsp") || $("modalBtnGravar");
    const icon = $("iconSpinGravar") || $("iconBtnSetsp");
    const lbl = $("lblBtnEnviarNovoSetpoint") || $("lblBtnSetspGravar") || $("modalBtnGravarLbl");
    const badge = $("badgeStatusSetpoint") || $("cfgSpBadgeStatus");
    const feedback = $("setpointLiveFeedback");
    const feedbackText = $("setpointLiveFeedbackText");

    // UI Feedback imediato:
    if (btn) btn.disabled = true;
    if (icon) icon.className = "fa-solid fa-spinner fa-spin";
    if (lbl) lbl.textContent = `Enviando comando SETSP ${mod} ${sp1} ${sp2}...`;

    if (badge) {
        badge.className = "setpoints-badge-status is-pending";
        badge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Aguardando ESP8266...`;
    }

    if (feedback && feedbackText) {
        feedback.className = "setpoint-live-feedback is-waiting";
        feedback.classList.remove("hidden");
        feedbackText.textContent = `🟡 Enviando comando SETSP ${mod} ${sp1} ${sp2} para o aparelho... Aguardando confirmação física...`;
    }

    // Registra log do protocolo RS485
    if (window.ThermoSetpoints) {
        const enc1 = window.ThermoSetpoints.calcularHexAlutal(sp1);
        const enc2 = window.ThermoSetpoints.calcularHexAlutal(sp2);
        const idHex = (0x30 + mod).toString(16).toUpperCase();
        window.ThermoSetpoints.adicionarLog(`>> SETSP ${mod} ${sp1} ${sp2}`, "cmd-tx");
        window.ThermoSetpoints.adicionarLog(`[TX RS485 19 bytes]: 3C 20 ${idHex} 20 31 20 34 20 53 20 ${enc1.hHex} 20 ${enc1.lHex} 20 ${enc2.hHex} 20 ${enc2.lHex} 20 3E`, "cmd-tx");
    }

    let fornoId = null;
    try {
        const forno = await garantirFornoExiste(mod, sp1, sp2, 'SETSP', true);
        if (forno) fornoId = forno.id;

        const updateData = {
            novo_setpoint_1: sp1,
            novo_setpoint_2: sp2,
            comando_setpoint: "SETSP",
            setpoint_pendente: true,
            setpoint_atualizado_em: new Date().toISOString()
        };

        if (fornoId) {
            await sb.from("fornos").update(updateData).eq("id", fornoId);
        } else {
            await sb.from("fornos").update(updateData).eq("modulo_alutal", mod);
        }
    } catch (err) {
        console.warn("[Setpoints] Falha ao enviar SETSP ao Supabase:", err);
    }

    // Polling a cada 2 segundos no Supabase até o ESP8266 confirmar
    let tentativas = 0;
    const maxTentativas = 15; // 30 segundos
    if (window._setpointPollingTimer) clearInterval(window._setpointPollingTimer);

    window._setpointPollingTimer = setInterval(async () => {
        tentativas++;
        try {
            let poll = sb
                .from("fornos")
                .select("id, modulo_alutal, setpoint_1, setpoint_2, novo_setpoint_1, novo_setpoint_2, setpoint_pendente, comando_setpoint, setpoint_atualizado_em");

            if (fornoId) {
                poll = poll.eq("id", fornoId);
            } else {
                poll = poll.eq("modulo_alutal", mod);
            }

            const { data, error } = await poll.maybeSingle();

            if (!error && data) {
                const pendente = !!data.setpoint_pendente;
                const cmd = data.comando_setpoint || "";

                if (cmd === "SUCESSO" && !pendente) {
                    const sp1Confirmado = data.setpoint_1 !== null ? Number(data.setpoint_1) : sp1;
                    const sp2Confirmado = data.setpoint_2 !== null ? Number(data.setpoint_2) : sp2;

                    // Se um GETSP antigo respondeu exatamente quando o usuário clicou em SETSP (valores diferentes dos solicitados nas primeiras tentativas), reenvia o SETSP
                    if ((sp1Confirmado !== sp1 || sp2Confirmado !== sp2) && tentativas <= 3) {
                        const retryData = {
                            novo_setpoint_1: sp1,
                            novo_setpoint_2: sp2,
                            comando_setpoint: "SETSP",
                            setpoint_pendente: true,
                            setpoint_atualizado_em: new Date().toISOString()
                        };
                        if (fornoId) {
                            await sb.from("fornos").update(retryData).eq("id", fornoId);
                        } else {
                            await sb.from("fornos").update(retryData).eq("modulo_alutal", mod);
                        }
                        return;
                    }

                    clearInterval(window._setpointPollingTimer);
                    window._setpointPollingTimer = null;
                    window._setpointEnvioEmAndamento = false;
                    window._modalSpEditadoPeloUsuario = false;

                    const horaAtual = data.setpoint_atualizado_em
                        ? new Date(data.setpoint_atualizado_em).toLocaleTimeString("pt-BR")
                        : new Date().toLocaleTimeString("pt-BR");

                    // Atualiza displays destacados
                    if ($("lblSetpoint1Atual")) $("lblSetpoint1Atual").textContent = `${sp1Confirmado} °C`;
                    if ($("lblSetpoint2Atual")) $("lblSetpoint2Atual").textContent = `${sp2Confirmado} °C`;
                    if ($("lblSetpointUltimaLeitura")) $("lblSetpointUltimaLeitura").textContent = horaAtual;
                    if ($("dispGetSp1")) $("dispGetSp1").textContent = `${sp1Confirmado} °C`;
                    if ($("dispGetSp2")) $("dispGetSp2").textContent = `${sp2Confirmado} °C`;
                    if ($("modalDispGetSp1")) $("modalDispGetSp1").textContent = `${sp1Confirmado} °C`;
                    if ($("modalDispGetSp2")) $("modalDispGetSp2").textContent = `${sp2Confirmado} °C`;
                    if ($("modalSpTime")) $("modalSpTime").textContent = horaAtual;

                    // Atualiza cache
                    if (window.ThermoSetpoints) {
                        const c = window.ThermoSetpoints.obterDadosModulo(mod);
                        c.sp1 = sp1Confirmado;
                        c.sp2 = sp2Confirmado;
                        c.novoSp1 = sp1Confirmado;
                        c.novoSp2 = sp2Confirmado;
                        c.updatedAt = horaAtual;
                        c.pendenteGravacao = false;
                        window.ThermoSetpoints.salvarCacheLocal();
                        window.ThermoSetpoints.renderizar();
                        window.ThermoSetpoints.sincronizarModalSeAberto();
                        window.ThermoSetpoints.atualizarResumoForno(mod);
                        window.ThermoSetpoints.adicionarLog(`<< [SETSP] Módulo ${mod} gravado e confirmado! SP1=${sp1Confirmado}°C | SP2=${sp2Confirmado}°C`, "cmd-rx");
                    }

                    if (badge) {
                        badge.className = "setpoints-badge-status";
                        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Confirmado no Aparelho!`;
                    }

                    if (feedback && feedbackText) {
                        feedback.className = "setpoint-live-feedback is-success";
                        feedbackText.textContent = `🟢 Setpoint gravado e confirmado pelo módulo Alutal! (SP1 = ${sp1Confirmado} °C | SP2 = ${sp2Confirmado} °C)`;
                    }

                    if (btn) btn.disabled = false;
                    if (icon) icon.className = "fa-solid fa-bolt";
                    atualizarLabelBotaoGravar();
                    return;
                } else if (cmd === "ERRO") {
                    clearInterval(window._setpointPollingTimer);
                    window._setpointPollingTimer = null;
                    window._setpointEnvioEmAndamento = false;

                    if (badge) {
                        badge.className = "setpoints-badge-status is-error";
                        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Erro na Gravação`;
                    }

                    if (feedback && feedbackText) {
                        feedback.className = "setpoint-live-feedback is-error";
                        feedbackText.textContent = `Módulo ${mod} não confirmou a gravação do setpoint via RS485. Tente novamente.`;
                    }

                    if (btn) btn.disabled = false;
                    if (icon) icon.className = "fa-solid fa-bolt";
                    atualizarLabelBotaoGravar();
                    return;
                }
            }
        } catch (e) {
            console.warn("[Setpoints] Erro no polling de gravação:", e);
        }

        if (tentativas >= maxTentativas) {
            clearInterval(window._setpointPollingTimer);
            window._setpointPollingTimer = null;
            window._setpointEnvioEmAndamento = false;

            if (btn) btn.disabled = false;
            if (icon) icon.className = "fa-solid fa-bolt";
            atualizarLabelBotaoGravar();

            if (badge) {
                badge.className = "setpoints-badge-status";
                badge.innerHTML = `<i class="fa-solid fa-clock"></i> Sincronizando...`;
            }

            if (feedback && feedbackText) {
                feedback.className = "setpoint-live-feedback is-waiting";
                feedbackText.textContent = `Comando SETSP registrado no banco. O ESP8266 aplicará assim que concluir o ciclo RS485.`;
            }
        }
    }, 2000);
}

// 3. AJUSTE DE PASSO (-10°C / +10°C)
function ajustarSetpointPasso(canal, delta) {
    const inpId = canal === 1 ? "inpNovoSetpoint1" : "inpNovoSetpoint2";
    const inp = $(inpId) || (canal === 1 ? $("inpSetSp1") : $("inpSetSp2"));
    if (!inp) return;

    let v = parseInt(inp.value, 10);
    if (isNaN(v)) v = (canal === 1 ? 650 : 900);
    v = Math.max(0, Math.min(1400, v + delta));
    inp.value = v;

    // Sincroniza campos equivalentes
    const outroInp = canal === 1 ? $("inpSetSp1") : $("inpSetSp2");
    if (outroInp && outroInp !== inp) outroInp.value = v;

    atualizarLabelBotaoGravar();
}

// 4. MUDANÇA DE MÓDULO NO SELECT
function aoMudarModuloSetpoint(modulo) {
    const mod = Number(modulo) || 1;
    if (window.ThermoSetpoints) {
        window.ThermoSetpoints.selecionarModulo(mod);
    }
    sincronizarPainelSetpointsAnalise(mod);
}

// 5. ATUALIZA RÓTULO DO BOTÃO DE GRAVAÇÃO
function atualizarLabelBotaoGravar() {
    const sel = $("selModuloSetpoint") || $("selModuloSetpoints");
    const mod = Number(sel?.value) || window.ThermoSetpoints?.currentModule || state.analysisModule || state.selectedModule || 1;
    const inp1 = $("inpNovoSetpoint1") || $("inpSetSp1") || $("modalInpSetSp1");
    const inp2 = $("inpNovoSetpoint2") || $("inpSetSp2") || $("modalInpSetSp2");

    const sp1 = inp1?.value || 650;
    const sp2 = inp2?.value || 900;

    const lbl = $("lblBtnEnviarNovoSetpoint");
    if (lbl) {
        lbl.textContent = `Gravar no Aparelho (SETSP ${mod} ${sp1} ${sp2})`;
    }

    const modalLbl = $("modalBtnGravarLbl");
    if (modalLbl) {
        modalLbl.textContent = `Gravar no Módulo (SETSP ${mod} ${sp1} ${sp2})`;
    }

    if (window.ThermoSetpoints) {
        window.ThermoSetpoints.atualizarTextoBotaoGravar();
    }
}

// 6. APLICA PRESET RÁPIDO
function aplicarPresetRapido(sp1, sp2, btnEl) {
    const inp1 = $("inpNovoSetpoint1");
    const inp2 = $("inpNovoSetpoint2");
    if (inp1) inp1.value = sp1;
    if (inp2) inp2.value = sp2;

    const inpAlt1 = $("inpSetSp1");
    const inpAlt2 = $("inpSetSp2");
    if (inpAlt1) inpAlt1.value = sp1;
    if (inpAlt2) inpAlt2.value = sp2;

    document.querySelectorAll(".setsp-preset-chip").forEach(c => c.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    atualizarLabelBotaoGravar();
}

// 7. SINCRONIZA O PAINEL DE SETPOINTS COM O FORNO ATIVO
function sincronizarPainelSetpointsAnalise(moduloDesejado) {
    const select = $("selModuloSetpoint");
    if (!select) return;

    let mods = [];
    if (state.ovens && state.ovens.length > 0) {
        mods = state.ovens.map(o => Number(o.numero)).filter(n => Number.isFinite(n) && n > 0);
    }
    if (mods.length === 0) {
        mods = [1, 2, 3, 4, 5, 6];
    }
    const modsUnicos = Array.from(new Set(mods)).sort((a, b) => a - b);

    const modAtual = moduloDesejado !== undefined ? Number(moduloDesejado) : (state.selectedModule || Number(select.value) || 1);

    select.innerHTML = modsUnicos.map(m => {
        const nome = getNomeForno(m);
        return `<option value="${m}">Módulo ${String(m).padStart(2, "0")} (${escapeHtml(nome)})</option>`;
    }).join("");

    if (modsUnicos.includes(modAtual)) {
        select.value = String(modAtual);
    } else {
        select.value = String(modsUnicos[0] || 1);
    }

    const mod = Number(select.value) || 1;

    // Atualiza tag do dispositivo
    const devTag = $("lblSetpointDispositivoNome");
    if (devTag) {
        const primaryDev = state.clientDevices?.[0];
        const serial = primaryDev ? (primaryDev.serial || primaryDev.numero_serie) : "THX-00003";
        devTag.textContent = `${serial} (Online)`;
    }

    // Carrega dados do cache do ThermoSetpoints
    let data = { sp1: 650, sp2: 900, novoSp1: 650, novoSp2: 900, updatedAt: "--" };
    if (window.ThermoSetpoints) {
        data = window.ThermoSetpoints.obterDadosModulo(mod);
    }

    if ($("lblSetpoint1Atual")) $("lblSetpoint1Atual").textContent = `${data.sp1} °C`;
    if ($("lblSetpoint2Atual")) $("lblSetpoint2Atual").textContent = `${data.sp2} °C`;
    if ($("lblSetpointUltimaLeitura")) $("lblSetpointUltimaLeitura").textContent = data.updatedAt || "--";

    const inp1 = $("inpNovoSetpoint1");
    const inp2 = $("inpNovoSetpoint2");
    if (inp1 && document.activeElement !== inp1) inp1.value = data.novoSp1 || data.sp1 || 650;
    if (inp2 && document.activeElement !== inp2) inp2.value = data.novoSp2 || data.sp2 || 900;

    atualizarLabelBotaoGravar();

    if ($("lblBtnSolicitarLeitura")) {
        $("lblBtnSolicitarLeitura").textContent = `Ler do Aparelho (GETSP ${mod})`;
    }
}

// Expõe globalmente
window.garantirFornoExiste = garantirFornoExiste;
window.solicitarLeituraSetpoint = solicitarLeituraSetpoint;
window.enviarNovoSetpoint = enviarNovoSetpoint;
window.ajustarSetpointPasso = ajustarSetpointPasso;
window.aoMudarModuloSetpoint = aoMudarModuloSetpoint;
window.atualizarLabelBotaoGravar = atualizarLabelBotaoGravar;
window.aplicarPresetRapido = aplicarPresetRapido;
window.sincronizarPainelSetpointsAnalise = sincronizarPainelSetpointsAnalise;
window.inspecionarDiaHistorico = inspecionarDiaHistorico;
window.fecharDetalheDiaHistorico = fecharDetalheDiaHistorico;
window.mudarPaginaDiaHistorico = mudarPaginaDiaHistorico;

// Inicialização automática após carregamento da página
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            window.ThermoSetpoints?.init();
        });
    } else {
        window.ThermoSetpoints?.init();
    }
}

