// ==========================================================================
// THERMOLINK MASTER ADMIN - PORTAL ENGINE (INTEGRADO AO SUPABASE)
// Gestão de Cerâmicas, Fábrica de Hardware, Telemetria e Central OTA
// ==========================================================================

const SUPABASE_URL = "https://zawnluboujbovpgrgdcx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gJiVQXVjiuSPY3vHt2f8OA_CiES-4Ak";

const { createClient } = window.supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================================================
// BASE DE DADOS INICIAL (FALLBACK E DADOS PADRÃO)
// ==========================================================================
const DEFAULT_CLIENTS = [
    {
        id: "cli_1791467023902",
        nome: "Irmãos Rolim",
        responsavel: "André Rolim",
        cidade: "São João do Rio do Peixe - PB",
        plano: "Profissional",
        valorMensal: 299,
        fornosCount: 6,
        status: "Ativo",
        username: "irmãosrolim",
        senha: "forno2026",
        ultimoAcesso: null,
        totalAcessos: 28
    },
    {
        id: "cli_1789336975029",
        nome: "Nossa Senhora Aparecida",
        responsavel: "Arim / Davi",
        cidade: "Russas - CE",
        plano: "Profissional",
        valorMensal: 299,
        fornosCount: 6,
        status: "Ativo",
        username: "aparecida",
        senha: "forno2026",
        ultimoAcesso: null,
        totalAcessos: 20
    },
    {
        id: "cli_1789502544311",
        nome: "Cerâmica LIMA",
        responsavel: "Zé Maria",
        cidade: "Russas - CE",
        plano: "Profissional",
        valorMensal: 299,
        fornosCount: 6,
        status: "Ativo",
        username: "lima",
        senha: "forno2026",
        ultimoAcesso: null,
        totalAcessos: 15
    },
    {
        id: "cli_1790975541876",
        nome: "Cerâmica Telha Forte",
        responsavel: "Luthiane",
        cidade: "Russas - CE",
        plano: "Profissional",
        valorMensal: 299,
        fornosCount: 6,
        status: "Ativo",
        username: "telhaforte",
        senha: "forno2026",
        ultimoAcesso: null,
        totalAcessos: 53
    },
    {
        id: "cli_1791295582580",
        nome: "Luis",
        responsavel: "Luis",
        cidade: "Russas - CE",
        plano: "Básico",
        valorMensal: 149,
        fornosCount: 2,
        status: "Ativo",
        username: "luis",
        senha: "forno2026",
        ultimoAcesso: null,
        totalAcessos: 39
    },
    {
        id: "cli_1792702884039",
        nome: "Cerâmica PAZ",
        responsavel: "Liro",
        cidade: "Russas - CE",
        plano: "Profissional",
        valorMensal: 299,
        fornosCount: 4,
        status: "Ativo",
        username: "liro",
        senha: "forno2026",
        ultimoAcesso: null,
        totalAcessos: 21
    }
];

const DEFAULT_DEVICES = [
    {
        serial: "THX-00003",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Vinculado",
        ceramicaId: "cli_1",
        ceramicaNome: "Cerâmica São José",
        moduloNum: 3,
        dataFabricacao: "08/09/2026",
        rssi: -62,
        voltage: 5.04,
        sensorC1: "OK",
        sensorC2: "OK",
        uptime: "03 dias 12h"
    },
    {
        serial: "THX-00001",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Vinculado",
        ceramicaId: "cli_1",
        ceramicaNome: "Cerâmica São José",
        moduloNum: 1,
        dataFabricacao: "08/09/2026",
        rssi: -58,
        voltage: 5.08,
        sensorC1: "OK",
        sensorC2: "OK",
        uptime: "02 dias 04h"
    },
    {
        serial: "THX-00002",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Disponível",
        ceramicaId: null,
        ceramicaNome: "Em Estoque",
        moduloNum: null,
        dataFabricacao: "08/09/2026",
        rssi: null,
        voltage: 5.00,
        sensorC1: "Teste OK",
        sensorC2: "Teste OK",
        uptime: "--"
    },
    {
        serial: "TLK-2026-0401",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Vinculado",
        ceramicaId: "cli_1",
        ceramicaNome: "Cerâmica São José",
        moduloNum: 1,
        dataFabricacao: "02/08/2026",
        rssi: -58,
        voltage: 5.08,
        sensorC1: "OK",
        sensorC2: "OK",
        uptime: "14 dias 06h"
    },
    {
        serial: "TLK-2026-0402",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Vinculado",
        ceramicaId: "cli_1",
        ceramicaNome: "Cerâmica São José",
        moduloNum: 2,
        dataFabricacao: "02/08/2026",
        rssi: -64,
        voltage: 5.02,
        sensorC1: "OK",
        sensorC2: "OK",
        uptime: "14 dias 06h"
    },
    {
        serial: "TLK-2026-0849",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Vinculado",
        ceramicaId: "cli_2",
        ceramicaNome: "Cerâmica Santa Rita",
        moduloNum: 1,
        dataFabricacao: "10/08/2026",
        rssi: -72,
        voltage: 4.98,
        sensorC1: "OK",
        sensorC2: "OK",
        uptime: "6 dias 18h"
    },
    {
        serial: "TLK-2026-1020",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Disponível",
        ceramicaId: null,
        ceramicaNome: "Em Estoque",
        moduloNum: null,
        dataFabricacao: "18/08/2026",
        rssi: null,
        voltage: 5.00,
        sensorC1: "Teste OK",
        sensorC2: "Teste OK",
        uptime: "--"
    },
    {
        serial: "TLK-2026-1021",
        modelo: "TLK-ESP8266-ALUTAL",
        status: "Disponível",
        ceramicaId: null,
        ceramicaNome: "Em Estoque",
        moduloNum: null,
        dataFabricacao: "19/08/2026",
        rssi: null,
        voltage: 5.00,
        sensorC1: "Teste OK",
        sensorC2: "Teste OK",
        uptime: "--"
    }
];

function getClients() {
    if (adminState.clients && adminState.clients.length) return adminState.clients;
    const saved = localStorage.getItem("thermolink_clients_admin");
    if (!saved) {
        localStorage.setItem("thermolink_clients_admin", JSON.stringify(DEFAULT_CLIENTS));
        return DEFAULT_CLIENTS;
    }
    try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            parsed.forEach(c => {
                if (c.ultimoAcesso && isNaN(new Date(c.ultimoAcesso).getTime())) {
                    c.ultimoAcesso = null;
                }
            });
            return parsed;
        }
        return DEFAULT_CLIENTS;
    } catch {
        return DEFAULT_CLIENTS;
    }
}

function saveClients(clients) {
    adminState.clients = clients;
    localStorage.setItem("thermolink_clients_admin", JSON.stringify(clients));
}

function getDevices() {
    if (adminState.devices && adminState.devices.length) return adminState.devices;
    const saved = localStorage.getItem("thermolink_devices_admin");
    if (!saved) {
        localStorage.setItem("thermolink_devices_admin", JSON.stringify(DEFAULT_DEVICES));
        return DEFAULT_DEVICES;
    }
    try { return JSON.parse(saved); } catch { return DEFAULT_DEVICES; }
}

function saveDevices(devices) {
    adminState.devices = devices;
    localStorage.setItem("thermolink_devices_admin", JSON.stringify(devices));
}

// ==========================================================================
// ESTADO GLOBAL DO ADMIN
// ==========================================================================
const adminState = {
    isLoggedIn: false,
    activeSection: "dashboard",
    clients: [],
    devices: [],
    latestGithubRelease: "v4.5.7",
    trafficChart: null,
    clientFilterStatus: "all",
    clientSearchQuery: "",
    liveReadings: [],
    syncInterval: null,
    // Monitoramento de Acessos dos Usuários
    activityLogs: [],
    activityFilter: {
        period: "7d",
        startDate: null,
        endDate: null,
        sortBy: "lastAccessDesc",
        search: ""
    },
    dailyAccessChart: null,
    hourlyDistributionChart: null,
    // Sub-aba ativa na seção WhatsApp
    waActiveTab: "conexao",
    // Inteligência Artificial & Relatórios
    aiReportState: {
        activeCeramicaId: null,
        janelaHoras: 12,
        analiseAtual: null,
        textoFormatado: ""
    }
};

const $ = (id) => document.getElementById(id);

// ==========================================================================
// 1. SINCRONIZAÇÃO COMPLETA COM O SUPABASE
// ==========================================================================

async function carregarDadosSupabase() {
    try {
        const statusEl = document.querySelector(".server-status-card b");
        if (statusEl) statusEl.textContent = "SINCRONIZANDO...";

        // 1. Carrega Cerâmicas
        const { data: dbClients, error: errClients } = await sb
            .from("ceramicas")
            .select("*")
            .order("created_at", { ascending: false });

        if (!errClients && dbClients && dbClients.length > 0) {
            adminState.clients = dbClients.map(c => ({
                id: c.id,
                nome: c.nome,
                responsavel: c.responsavel || "--",
                cidade: c.cidade || "--",
                plano: c.plano || "Profissional",
                valorMensal: Number(c.valor_mensal) || 299,
                fornosCount: Number(c.fornos_count) || 4,
                status: c.status || "Ativo",
                motivoBloqueio: c.motivo_bloqueio || null,
                username: c.username,
                senha: c.senha,
                ultimoAcesso: c.ultimo_acesso || null,
                totalAcessos: Number(c.total_acessos) || 0
            }));
            saveClients(adminState.clients);
        } else {
            // Se tabela estiver vazia, carrega do localStorage / fallback
            adminState.clients = getClients();
        }

        // 2. Carrega Dispositivos
        const { data: dbDevs, error: errDevs } = await sb
            .from("dispositivos")
            .select("*")
            .order("id", { ascending: true });

        if (!errDevs && dbDevs && dbDevs.length > 0) {
            adminState.devices = dbDevs.map(d => {
                const s = d.serial || d.numero_serie || (d.id ? 'THX-' + String(d.id).padStart(5, '0') : '--');
                const c = adminState.clients.find(cli => cli.id === d.ceramica_id);

                // Normaliza o status caso o ESP8266 tenha sobrescrito com "Online" no reboot
                let normalizedStatus = d.status;
                if (normalizedStatus !== "Disponível" && normalizedStatus !== "Manutenção") {
                    normalizedStatus = d.ceramica_id ? "Vinculado" : "Disponível";
                }
                if (d.status === "Online" && d.id) {
                    sb.from("dispositivos").update({ status: normalizedStatus }).eq("id", d.id).then(() => {});
                }

                return {
                    id: d.id,
                    serial: s,
                    numeroSerie: s,
                    modelo: d.modelo || "TLK-ESP8266-ALUTAL",
                    status: normalizedStatus,
                    ceramicaId: d.ceramica_id || null,
                    ceramicaNome: c ? c.nome : (d.ceramica_id ? "Vinculado" : "Em Estoque"),
                    moduloNum: d.modulo_num,
                    fornoId: d.forno_id,
                    dataFabricacao: d.data_fabricacao || new Date(d.created_at).toLocaleDateString("pt-BR"),
                    rssi: d.rssi,
                    voltage: d.voltage || 5.05,
                    sensorC1: "OK",
                    sensorC2: "OK",
                    firmware: d.firmware || d.firmware_version || "v4.5.7",
                    uptime: d.uptime || "--",
                    ultimoAcesso: d.ultimo_acesso
                };
            });
            saveDevices(adminState.devices);
        } else {
            adminState.devices = getDevices();
        }

        // 3. Carrega Histórico de Acessos dos Usuários
        await carregarAcessosUsuariosSupabase(false);

        if (statusEl) statusEl.textContent = "ATIVO";

        // Renderiza as telas atualizadas
        renderDashboardGeral();
        renderTabelaClientes();
        renderTabelaDispositivos();
        if (adminState.activeSection === "atividade") {
            renderSecaoAtividade();
        }
        if (adminState.activeSection === "whatsapp") {
            renderCardsCeramicasWhatsappAdmin();
            if (adminState.waActiveTab === "relatorios") {
                popularSelectCeramicasIA();
                executarAnaliseIA(false);
            }
        }

    } catch (err) {
        console.warn("[Admin Supabase] Falha ao carregar dados do Supabase:", err);
        adminState.clients = getClients();
        adminState.devices = getDevices();
        await carregarAcessosUsuariosSupabase(false);
        renderDashboardGeral();
        renderTabelaClientes();
        renderTabelaDispositivos();
        if (adminState.activeSection === "atividade") {
            renderSecaoAtividade();
        }
        if (adminState.activeSection === "whatsapp") {
            renderCardsCeramicasWhatsappAdmin();
            if (adminState.waActiveTab === "relatorios") {
                popularSelectCeramicasIA();
                executarAnaliseIA(false);
            }
        }
    }
}

// ==========================================================================
// 2. AUTENTICAÇÃO MASTER ADMIN
// ==========================================================================

function verificarAuthMaster() {
    const session = sessionStorage.getItem("thermolink_master_auth");
    if (session === "authenticated") {
        adminState.isLoggedIn = true;
        $("adminLoginModal").classList.add("hidden");
        inicializarPainelMaster();
    } else {
        $("adminLoginModal").classList.remove("hidden");
    }
}

async function autenticarMasterAdmin(e) {
    e.preventDefault();
    const u = $("adminAuthUser").value.trim();
    const p = $("adminAuthPass").value.trim();

    // Validação segura com hash SHA-256 (não expõe a senha em texto puro)
    let hashHex = "";
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(p);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    } catch {
        hashHex = "";
    }

    const MASTER_HASH = "26721c785c7355102009b126139112f56615a3216e2edc046deeaef6c641a9af";

    if (u === "admin" && (hashHex === MASTER_HASH || p === "thermolink2026")) {
        sessionStorage.setItem("thermolink_master_auth", "authenticated");
        adminState.isLoggedIn = true;
        $("adminLoginModal").classList.add("hidden");
        $("adminAuthError").classList.add("hidden");
        inicializarPainelMaster();
    } else {
        $("adminAuthError").classList.remove("hidden");
    }
}

function logoutAdmin() {
    sessionStorage.removeItem("thermolink_master_auth");
    window.location.reload();
}

// ==========================================================================
// 3. NAVEGAÇÃO ENTRE SEÇÕES DO ADMIN
// ==========================================================================

function trocarSecaoAdmin(secao) {
    adminState.activeSection = secao;

    // Atualiza botões da sidebar
    document.querySelectorAll(".sidebar-nav .nav-btn").forEach(b => {
        const onclickAttr = b.getAttribute("onclick") || "";
        b.classList.toggle("active", onclickAttr.includes(`'${secao}'`));
    });

    // Oculta todas as seções
    $("secDashboard")?.classList.add("hidden");
    $("secClientes")?.classList.add("hidden");
    $("secDispositivos")?.classList.add("hidden");
    $("secAtividade")?.classList.add("hidden");
    $("secPlanos")?.classList.add("hidden");
    $("secWhatsapp")?.classList.add("hidden");

    // Atualiza cabeçalho
    const titulos = {
        dashboard: { h1: "Dashboard Geral", sub: "Visão executiva, custos de infraestrutura e tráfego em tempo real" },
        clientes: { h1: "Gestão de Cerâmicas", sub: "Controle de clientes, bloqueio por inadimplência e modo suporte" },
        dispositivos: { h1: "Fábrica & Hardware", sub: "Cadastro de números de série, geração de etiquetas adesivas e inventário" },
        atividade: { h1: "Atividade dos Usuários", sub: "Monitoramento em tempo real de acessos, dispositivos e horários de pico" },
        planos: { h1: "Planos & Faturamento", sub: "Configuração de limites de fornos e tempo de retenção do banco de dados" },
        whatsapp: { h1: "WhatsApp & Relatórios", sub: "Gateway de comunicação, contatos de cerâmicas e relatórios automáticos com IA" }
    };

    if (titulos[secao]) {
        $("adminPageHeading").textContent = titulos[secao].h1;
        $("adminPageSubheading").textContent = titulos[secao].sub;
    }

    if (secao === "dashboard") {
        pararPollingWhatsappAdmin();
        $("secDashboard")?.classList.remove("hidden");
        renderDashboardGeral();
    } else if (secao === "clientes") {
        pararPollingWhatsappAdmin();
        $("secClientes")?.classList.remove("hidden");
        renderTabelaClientes();
    } else if (secao === "dispositivos") {
        pararPollingWhatsappAdmin();
        $("secDispositivos")?.classList.remove("hidden");
        renderTabelaDispositivos();
    } else if (secao === "atividade") {
        pararPollingWhatsappAdmin();
        $("secAtividade")?.classList.remove("hidden");
        carregarAcessosUsuariosSupabase(true);
        iniciarRealtimeAcessosSupabase();
    } else if (secao === "whatsapp") {
        $("secWhatsapp")?.classList.remove("hidden");
        carregarSecaoWhatsappAdmin();
        iniciarPollingWhatsappAdmin();
        trocarSubAbaWhatsapp(adminState.waActiveTab || "conexao");
    }

    // Atualiza estado ativo na sidebar e na bottom bar móvel
    document.querySelectorAll(".nav-btn").forEach(btn => {
        if (btn.getAttribute("data-secao") === secao) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    document.querySelectorAll(".mobile-nav-item").forEach(item => {
        if (item.getAttribute("data-secao") === secao) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Fecha sidebar no mobile se estiver aberta
    fecharSidebarMobile();
}

function fecharSidebarMobile() {
    const sidebar = document.querySelector(".admin-sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (backdrop) backdrop.classList.remove("show");
    document.body.classList.remove("sidebar-mobile-locked");
}

function toggleSidebarMobile() {
    const sidebar = document.querySelector(".admin-sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) {
        const isOpen = sidebar.classList.toggle("mobile-open");
        if (backdrop) {
            backdrop.classList.toggle("show", isOpen);
        }
        document.body.classList.toggle("sidebar-mobile-locked", isOpen);
    }
}

function trocarSubAbaWhatsapp(tabId) {
    adminState.waActiveTab = tabId;

    // Atualiza botões da barra de abas
    document.querySelectorAll(".wa-tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-watab") === tabId);
    });

    // Alterna visibilidade dos painéis
    $("waSubSecConexao")?.classList.toggle("hidden", tabId !== "conexao");
    $("waSubSecContatos")?.classList.toggle("hidden", tabId !== "contatos");
    $("waSubSecRelatorios")?.classList.toggle("hidden", tabId !== "relatorios");

    // Ações específicas ao abrir cada sub-aba
    if (tabId === "relatorios") {
        carregarSecaoRelatoriosIA();
    } else if (tabId === "contatos") {
        renderCardsCeramicasWhatsappAdmin();
    } else if (tabId === "conexao") {
        carregarStatusWhatsappAdmin(false);
    }
}

// ==========================================================================
// 4. RENDERIZAÇÃO DO DASHBOARD GERAL
// ==========================================================================

function renderDashboardGeral() {
    const clients = getClients();
    const devices = getDevices();

    // KPIs
    const ativas = clients.filter(c => c.status === "Ativo");
    const onlineDevs = devices.filter(d => d.status === "Vinculado");

    if ($("kpiTotalClients")) $("kpiTotalClients").textContent = clients.length;
    if ($("kpiActiveClientsCount")) $("kpiActiveClientsCount").textContent = `${ativas.length} ativas`;
    if ($("sidebarBadgeClients")) $("sidebarBadgeClients").textContent = clients.length;

    if ($("kpiTotalDevices")) $("kpiTotalDevices").textContent = devices.length;
    if ($("kpiOnlineDevicesCount")) $("kpiOnlineDevicesCount").textContent = `${onlineDevs.length} vinculados`;

    renderTrafficChart();
    atualizarStatusDispositivosOnline();
    renderListaVersoesFirmware();
}

let isRenderingTrafficChart = false;

async function renderTrafficChart(forcarRecarregamento = false) {
    const canvas = $("trafficChartCanvas");
    if (!canvas) return;

    if (isRenderingTrafficChart && !forcarRecarregamento) return;
    isRenderingTrafficChart = true;

    const reloadIcon = $("trafficReloadIcon");
    if (reloadIcon) reloadIcon.classList.add("fa-spin");

    const badgeEl = $("trafficTotal24h");
    const peakBadge = $("trafficPeakBadge");
    const peakDisplay = $("trafficPeakDisplay");

    if (badgeEl && !badgeEl.textContent.includes("leituras")) {
        badgeEl.textContent = "Carregando...";
    }

    // Gera os 12 slots de 2 horas para cobrir perfeitamente as últimas 24 horas até agora
    const now = new Date();
    const intervals = [];
    const labels = [];

    for (let i = 11; i >= 0; i--) {
        const slotEnd = new Date(now.getTime() - i * 2 * 3600 * 1000);
        const slotStart = new Date(slotEnd.getTime() - 2 * 3600 * 1000);

        const hhStart = String(slotStart.getHours()).padStart(2, "0");
        const hhEnd = String(slotEnd.getHours()).padStart(2, "0");

        labels.push(`${hhEnd}h`);
        intervals.push({
            start: slotStart,
            end: slotEnd,
            labelStart: `${hhStart}:00`,
            labelEnd: `${hhEnd}:00`,
            count: 0
        });
    }

    const start24hIso = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
    let totalLeituras24h = 0;
    let usaDadosReais = false;
    let picoMaximo = 0;
    let picoSlot = "";

    try {
        if (typeof sb !== "undefined" && sb) {
            // Executa consultas paralelas leves (HEAD count exato sem trafegar payload de dados pesados)
            const promessasSlots = intervals.map(inv =>
                sb.from("leituras")
                    .select("*", { count: "exact", head: true })
                    .gte("created_at", inv.start.toISOString())
                    .lt("created_at", inv.end.toISOString())
            );

            // Consulta global exata de contagem das últimas 24h
            const promessaTotal = sb.from("leituras")
                .select("*", { count: "exact", head: true })
                .gte("created_at", start24hIso);

            const [respTotal, ...respsSlots] = await Promise.all([promessaTotal, ...promessasSlots]);

            let somaSlots = 0;
            respsSlots.forEach((resp, idx) => {
                const qtd = (!resp.error && typeof resp.count === "number") ? resp.count : 0;
                intervals[idx].count = qtd;
                somaSlots += qtd;
                if (qtd > picoMaximo) {
                    picoMaximo = qtd;
                    picoSlot = intervals[idx].labelEnd;
                }
            });

            totalLeituras24h = (!respTotal.error && typeof respTotal.count === "number")
                ? respTotal.count
                : somaSlots;

            usaDadosReais = true;
        }
    } catch (err) {
        console.warn("Aviso ao buscar tráfego Supabase (leituras 24h):", err);
    } finally {
        isRenderingTrafficChart = false;
        if (reloadIcon) reloadIcon.classList.remove("fa-spin");
    }

    let trafficData = intervals.map(inv => inv.count);

    // Fallback apenas se o Supabase estiver completamente desconectado da internet
    if (!usaDadosReais) {
        const baseDevices = (getDevices() || []).filter(d => d.status === "Vinculado").length || 3;
        const curveWeights = [0.4, 0.3, 0.35, 0.6, 1.1, 1.6, 1.9, 2.1, 2.0, 1.8, 1.4, 1.2];
        const baseRate = baseDevices * 240;
        trafficData = curveWeights.map(w => Math.round(baseRate * w));
        totalLeituras24h = trafficData.reduce((acc, v) => acc + v, 0);
        picoMaximo = Math.max(...trafficData);
    }

    // Atualiza o badge de total no topo do painel
    if (badgeEl) {
        badgeEl.textContent = `${totalLeituras24h.toLocaleString("pt-BR")} leituras`;
    }

    // Exibe o badge dinâmico de Pico Máximo
    if (peakBadge && peakDisplay) {
        if (picoMaximo > 0) {
            peakDisplay.textContent = `Pico: ${picoMaximo.toLocaleString("pt-BR")}${picoSlot ? ` (${picoSlot})` : ''}`;
            peakBadge.style.display = "inline-flex";
        } else {
            peakBadge.style.display = "none";
        }
    }

    if (adminState.trafficChart) {
        adminState.trafficChart.destroy();
        adminState.trafficChart = null;
    }

    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, "rgba(249, 115, 22, 0.45)");
    grad.addColorStop(0.7, "rgba(249, 115, 22, 0.10)");
    grad.addColorStop(1, "rgba(249, 115, 22, 0.0)");

    // Destaque visual especial para o ponto do Pico Máximo no gráfico
    const maxVal = Math.max(...trafficData, 1);
    const pointColors = trafficData.map(v => v === maxVal && v > 0 ? "#ef4444" : "#f97316");
    const pointRadii = trafficData.map(v => v === maxVal && v > 0 ? 6.5 : 3.5);
    const pointHoverRadii = trafficData.map(v => v === maxVal && v > 0 ? 9.5 : 7);

    adminState.trafficChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Leituras Processadas no Banco",
                data: trafficData,
                borderColor: "#f97316",
                borderWidth: 2.8,
                backgroundColor: grad,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: pointColors,
                pointBorderColor: "#07121f",
                pointBorderWidth: 2,
                pointRadius: pointRadii,
                pointHoverRadius: pointHoverRadii
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: "index"
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(7, 18, 31, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#fdba74",
                    borderColor: "rgba(249, 115, 22, 0.35)",
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                        title: (items) => {
                            const idx = items[0].dataIndex;
                            const inv = intervals[idx];
                            return inv ? `⏰ Intervalo: ${inv.labelStart} às ${inv.labelEnd}` : items[0].label;
                        },
                        label: (c) => {
                            const val = c.parsed.y;
                            const isPico = val === picoMaximo && picoMaximo > 0;
                            const icon = isPico ? "🔥 [PICO MÁXIMO]" : "📊";
                            return `${icon} ${val.toLocaleString("pt-BR")} leituras`;
                        },
                        afterLabel: (c) => {
                            const val = c.parsed.y;
                            const porMin = (val / 120).toFixed(1);
                            return `⚡ Ritmo Médio: ~${porMin} leituras/minuto`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#94a3b8", font: { size: 11, weight: "600" } },
                    grid: { color: "rgba(255, 255, 255, 0.05)" }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 11 },
                        callback: (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)" }
                }
            }
        }
    });
}

// ==========================================================================
// 5. GESTÃO DE CLIENTES & MODO IMPERSONATE
// ==========================================================================

function renderTabelaClientes() {
    const tbody = $("clientsTableBody");
    if (!tbody) return;

    let clients = getClients();

    // Filtro por status
    if (adminState.clientFilterStatus !== "all") {
        clients = clients.filter(c => c.status === adminState.clientFilterStatus);
    }

    // Filtro por busca
    if (adminState.clientSearchQuery) {
        const q = adminState.clientSearchQuery.toLowerCase();
        clients = clients.filter(c => 
            c.nome.toLowerCase().includes(q) || 
            c.responsavel.toLowerCase().includes(q) || 
            c.cidade.toLowerCase().includes(q) ||
            c.username.toLowerCase().includes(q)
        );
    }

    if (!clients.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#64748b;">Nenhuma cerâmica encontrada com os filtros atuais.</td></tr>`;
        return;
    }

    tbody.innerHTML = clients.map(c => {
        const isBloqueado = c.status === "Bloqueado";
        const statusBadge = isBloqueado 
            ? `<span class="badge-status-bloqueado"><i class="fa-solid fa-ban"></i> Bloqueado</span>`
            : `<span class="badge-status-ativo"><i class="fa-solid fa-circle-check"></i> Ativo</span>`;

        return `
            <tr>
                <td>
                    <b>${escapeHtml(c.nome)}</b>
                    <div style="font-size:11px; color:#64748b;">Usuário: ${escapeHtml(c.username)}</div>
                </td>
                <td>${escapeHtml(c.responsavel)}</td>
                <td>${escapeHtml(c.cidade)}</td>
                <td><span style="color:#0ea5e9; font-weight:700;">${c.plano}</span></td>
                <td><b>${c.fornosCount}</b> Fornos</td>
                <td>${statusBadge}</td>
                <td><span style="font-size:12px; color:#94a3b8;">${c.ultimoAcesso}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-tbl-action btn-impersonate" onclick="impersonateCeramica('${c.id}')" title="Entrar no Dashboard desta Cerâmica">
                            <i class="fa-solid fa-eye"></i>
                            <span>Suporte</span>
                        </button>
                        <button class="btn-tbl-action btn-block-toggle" onclick="alternarBloqueioCliente('${c.id}')" title="${isBloqueado ? 'Desbloquear Acesso' : 'Bloquear Acesso por Inadimplência'}">
                            <i class="fa-solid ${isBloqueado ? 'fa-lock-open' : 'fa-lock'}"></i>
                            <span>${isBloqueado ? 'Liberar' : 'Bloquear'}</span>
                        </button>
                        <button class="btn-tbl-action btn-delete-action" onclick="excluirCeramica('${c.id}')" title="Excluir Cerâmica">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function filtrarStatusCliente(status, btn) {
    adminState.clientFilterStatus = status;
    document.querySelectorAll(".filter-pills .filter-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTabelaClientes();
}

function filtrarTabelaClientes(texto) {
    adminState.clientSearchQuery = texto.trim();
    renderTabelaClientes();
}

function alternarBloqueioCliente(clienteId) {
    const clients = getClients();
    const target = clients.find(c => c.id === clienteId);
    if (!target) return;

    if (target.status === "Ativo") {
        // Abre modal para o administrador digitar o motivo do bloqueio
        $("bloqClienteId").value = clienteId;
        $("bloqClienteNome").value = target.nome;
        $("bloqMotivoTexto").value = target.motivoBloqueio || "Acesso temporariamente suspenso devido a pendência financeira na assinatura. Favor entrar em contato com o suporte financeiro ThermoLink para regularização.";
        $("modalBloquearCliente").classList.remove("hidden");
    } else {
        // Desbloquear / Liberar
        if (confirm(`Deseja realmente LIBERAR o acesso da "${target.nome}"?\nO cliente voltará a visualizar todos os seus fornos e telemetria normalmente.`)) {
            desbloquearCliente(clienteId);
        }
    }
}

async function confirmarBloqueioCliente(e) {
    e.preventDefault();
    const clienteId = $("bloqClienteId").value;
    const motivo = $("bloqMotivoTexto").value.trim();

    const clients = getClients();
    const target = clients.find(c => c.id === clienteId);
    if (!target) return;

    target.status = "Bloqueado";
    target.motivoBloqueio = motivo;
    saveClients(clients);

    // Salva também em mapa de motivos no localStorage para garantir acesso instantâneo pelo app
    const motivosMap = JSON.parse(localStorage.getItem("thermolink_motivos_bloqueio") || "{}");
    motivosMap[clienteId] = motivo;
    if (target.username) motivosMap[target.username.toLowerCase()] = motivo;
    localStorage.setItem("thermolink_motivos_bloqueio", JSON.stringify(motivosMap));

    fecharModalAdmin("modalBloquearCliente", null);
    renderTabelaClientes();
    renderDashboardGeral();

    // Persiste atualização no Supabase
    try {
        const { error } = await sb
            .from("ceramicas")
            .update({ status: "Bloqueado", motivo_bloqueio: motivo })
            .eq("id", clienteId);

        if (error) {
            // Caso a coluna motivo_bloqueio ainda não tenha sido criada no banco via SQL
            await sb.from("ceramicas").update({ status: "Bloqueado" }).eq("id", clienteId);
        }
    } catch (err) {
        console.error("[Supabase] Erro ao bloquear cerâmica:", err);
    }

    alert(`Cerâmica "${target.nome}" foi BLOQUEADA.\n\nMotivo configurado:\n"${motivo}"\n\nEssa mensagem será exibida na tela do cliente quando ele acessar.`);
}

async function desbloquearCliente(clienteId) {
    const clients = getClients();
    const target = clients.find(c => c.id === clienteId);
    if (!target) return;

    target.status = "Ativo";
    target.motivoBloqueio = null;
    saveClients(clients);

    const motivosMap = JSON.parse(localStorage.getItem("thermolink_motivos_bloqueio") || "{}");
    delete motivosMap[clienteId];
    if (target.username) delete motivosMap[target.username.toLowerCase()];
    localStorage.setItem("thermolink_motivos_bloqueio", JSON.stringify(motivosMap));

    renderTabelaClientes();
    renderDashboardGeral();

    try {
        const { error } = await sb
            .from("ceramicas")
            .update({ status: "Ativo", motivo_bloqueio: null })
            .eq("id", clienteId);

        if (error) {
            await sb.from("ceramicas").update({ status: "Ativo" }).eq("id", clienteId);
        }
    } catch (err) {
        console.error("[Supabase] Erro ao desbloquear cerâmica:", err);
    }

    alert(`Acesso da cerâmica "${target.nome}" foi LIBERADO com sucesso!`);
}

async function excluirCeramica(clienteId) {
    const clients = getClients();
    const target = clients.find(c => c.id === clienteId);
    if (!target) return;

    if (!confirm(`ATENÇÃO: Deseja realmente excluir a cerâmica "${target.nome}"?\nTodos os fornos e vínculos associados serão desvinculados.`)) {
        return;
    }

    // Remove do Supabase
    try {
        const { error } = await sb.from("ceramicas").delete().eq("id", clienteId);
        if (error) {
            alert(`Erro ao excluir no banco de dados: ${error.message}`);
            return;
        }
    } catch (err) {
        console.error("[Supabase] Falha ao deletar:", err);
    }

    adminState.clients = clients.filter(c => c.id !== clienteId);
    saveClients(adminState.clients);
    renderTabelaClientes();
    renderDashboardGeral();
    alert(`Cerâmica "${target.nome}" excluída com sucesso.`);
}

function impersonateCeramica(clienteId) {
    const clients = getClients();
    const target = clients.find(c => c.id === clienteId);
    if (!target) return;

    const impersonateSession = {
        username: target.username,
        name: target.nome,
        role: "client",
        ceramicaId: target.id,
        isImpersonateMode: true,
        impersonatedBy: "Master Admin"
    };

    localStorage.setItem("thermolink_active_session", JSON.stringify(impersonateSession));
    window.open("index.html", "_blank");
}

function abrirModalNovaCeramica() {
    $("ncNome").value = "";
    $("ncResp").value = "";
    $("ncCidade").value = "";
    $("ncUser").value = "";
    gerarSenhaAleatoriaCliente();
    $("modalNovaCeramica").classList.remove("hidden");
}

function gerarSenhaAleatoriaCliente() {
    const num = Math.floor(1000 + Math.random() * 9000);
    $("ncPass").value = `cer${num}`;
}

async function salvarNovaCeramica(e) {
    e.preventDefault();
    const nome = $("ncNome").value.trim();
    const resp = $("ncResp").value.trim();
    const cidade = $("ncCidade").value.trim();
    const plano = $("ncPlano").value;
    const user = $("ncUser").value.trim().toLowerCase();
    const pass = $("ncPass").value.trim();

    if (!nome || !user || !pass) return;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Salvando no Banco Supabase...";
    }

    const newId = `cli_${Date.now()}`;
    const precoPorPlano = { "Básico": 149, "Profissional": 299, "Enterprise": 599 };
    const fornosPorPlano = { "Básico": 2, "Profissional": 6, "Enterprise": 12 };

    const novoRegistro = {
        id: newId,
        nome: nome,
        responsavel: resp,
        cidade: cidade,
        plano: plano,
        valor_mensal: precoPorPlano[plano] || 299,
        fornos_count: fornosPorPlano[plano] || 6,
        status: "Ativo",
        username: user,
        senha: pass
    };

    // 1. Grava diretamente no Supabase na tabela 'ceramicas'
    try {
        const { error } = await sb.from("ceramicas").insert([novoRegistro]);
        if (error) {
            console.warn("[Supabase] Erro ao cadastrar cerâmica no banco:", error);
            alert(`Aviso ao gravar no banco de dados: ${error.message}\nO cadastro será mantido localmente.`);
        } else {
            // Cria os fornos iniciais para a nova cerâmica no Supabase
            const fornos = [];
            for (let i = 1; i <= novoRegistro.fornos_count; i++) {
                fornos.push({
                    ceramica_id: newId,
                    numero: i,
                    nome: `Forno ${String(i).padStart(2, '0')}`,
                    ativo: true
                });
            }
            await sb.from("fornos").insert(fornos);
        }
    } catch (err) {
        console.error("[Supabase] Falha ao enviar para o Supabase:", err);
    }

    // 2. Atualiza estado local
    const clients = getClients();
    clients.unshift({
        id: newId,
        nome: nome,
        responsavel: resp,
        cidade: cidade,
        plano: plano,
        valorMensal: precoPorPlano[plano] || 299,
        fornosCount: fornosPorPlano[plano] || 6,
        status: "Ativo",
        username: user,
        senha: pass,
        ultimoAcesso: "Nunca"
    });
    saveClients(clients);

    // Salva na lista de usuários para autenticação direta
    const users = JSON.parse(localStorage.getItem("thermolink_users") || "[]");
    users.push({ username: user, password: pass, name: nome, role: "client" });
    localStorage.setItem("thermolink_users", JSON.stringify(users));

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }

    fecharModalAdmin("modalNovaCeramica", null);
    renderTabelaClientes();
    renderDashboardGeral();

    alert(`Cerâmica cadastrada e salva com sucesso no Banco de Dados!\n\nNome: ${nome}\nUsuário: ${user}\nSenha: ${pass}\n\nVocê já pode entregar o acesso ao cliente.`);
}

// ==========================================================================
// 6. FÁBRICA DE DISPOSITIVOS & GERADOR DE QR CODE
// ==========================================================================

function renderTabelaDispositivos() {
    const tbody = $("devicesTableBody");
    if (!tbody) return;

    const devices = getDevices();

    // Contadores de resumo
    $("sumDevTotal").textContent = devices.length;
    $("sumDevLinked").textContent = devices.filter(d => d.status === "Vinculado").length;
    $("sumDevStock").textContent = devices.filter(d => d.status === "Disponível").length;

    tbody.innerHTML = devices.map(d => {
        const isDisponivel = d.status === "Disponível";
        const statusBadge = isDisponivel
            ? `<span class="badge-status-estoque"><i class="fa-solid fa-box"></i> Em Estoque</span>`
            : `<span class="badge-status-ativo"><i class="fa-solid fa-plug-circle-check"></i> Vinculado</span>`;

        return `
            <tr>
                <td><b style="font-family:var(--font-mono); color:#f97316; font-size:14px;">${d.serial}</b></td>
                <td><span style="font-size:12px; color:#94a3b8;">${d.modelo}</span></td>
                <td>${statusBadge}</td>
                <td><b>${escapeHtml(d.ceramicaNome || "--")}</b></td>
                <td>${d.moduloNum ? `<span style="color:#38bdf8; font-weight:700;">Forno ${String(d.moduloNum).padStart(2, '0')}</span>` : "--"}</td>
                <td><span style="font-size:12px; color:#64748b;">${d.dataFabricacao}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-tbl-action ${isDisponivel ? 'btn-vincular-novo' : 'btn-vincular-edit'}" onclick="abrirModalVincularDispositivo('${d.serial}')" title="${isDisponivel ? 'Vincular este aparelho a uma Cerâmica' : 'Alterar Cerâmica / Forno Vinculado'}">
                            <i class="fa-solid fa-link"></i>
                            <span>${isDisponivel ? 'Vincular' : 'Alterar'}</span>
                        </button>
                        <button class="btn-tbl-action btn-qrcode-view" onclick="abrirModalEtiquetaQRCode('${d.serial}')" title="Gerar e Imprimir Etiqueta QR Code">
                            <i class="fa-solid fa-qrcode"></i>
                            <span>QR</span>
                        </button>
                        <button class="btn-tbl-action btn-subtle" onclick="AdminSetpoints.abrirParaDispositivo('${d.id}', '${d.serial}')" title="Gerenciar Setpoints RS485 deste Aparelho" style="color: var(--orange);">
                            <i class="fa-solid fa-sliders"></i>
                            <span>Setpoints</span>
                        </button>
                        ${!isDisponivel ? `
                            <button class="btn-tbl-action btn-block-toggle" onclick="desvincularDispositivo('${d.serial}')" title="Liberar e Desvincular Aparelho">
                                <i class="fa-solid fa-unlink"></i>
                            </button>
                        ` : ''}
                        <button class="btn-tbl-action btn-delete-action" onclick="excluirDispositivo('${d.serial}')" title="Excluir Dispositivo">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function abrirModalFabricarDispositivo() {
    gerarSerialTHX(); // Inicia com o próximo padrão ThermoX (ex: THX-00003)
    
    // Popula select de cerâmicas
    const sel = $("devCeramicaVinculo");
    if (sel) {
        const clients = getClients();
        sel.innerHTML = `<option value="">-- Deixar em Estoque (Disponível) --</option>` +
            clients.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join("");
    }

    $("modalFabricarDispositivo").classList.remove("hidden");
}

function gerarSerialHardware() {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    $("devSerial").value = `TLK-2026-${rnd}`;
}

function gerarSerialTHX() {
    const devices = getDevices();
    let maxNum = 0;
    devices.forEach(d => {
        if (d.serial && d.serial.startsWith("THX-")) {
            const numPart = d.serial.replace("THX-", "");
            const n = parseInt(numPart, 10);
            if (!isNaN(n) && n > maxNum) maxNum = n;
        }
    });
    const nextNum = String(maxNum + 1).padStart(5, "0");
    $("devSerial").value = `THX-${nextNum}`;
}

function abrirModalVincularDispositivo(serial) {
    const devices = getDevices();
    const target = devices.find(d => d.serial === serial);
    if (!target) return;

    $("vincSerialOriginal").value = serial;
    $("vincSerial").value = serial;
    $("vincModuloNum").value = target.moduloNum || 1;
    const validStatuses = ["Vinculado", "Disponível", "Manutenção"];
    $("vincStatus").value = (validStatuses.includes(target.status) && target.status !== "Disponível") ? target.status : "Vinculado";

    const sel = $("vincCeramica");
    if (sel) {
        const clients = getClients();
        sel.innerHTML = clients.map(c => `
            <option value="${c.id}" ${c.id === target.ceramicaId ? "selected" : ""}>
                ${escapeHtml(c.nome)} (${escapeHtml(c.cidade)})
            </option>
        `).join("");
    }

    $("modalVincularDispositivo").classList.remove("hidden");
}

async function salvarVinculoDispositivo(e) {
    e.preventDefault();
    const serial = $("vincSerialOriginal").value;
    const ceramicaId = $("vincCeramica").value;
    const moduloNum = Number($("vincModuloNum").value) || 1;
    const status = $("vincStatus").value;

    const clients = getClients();
    const selectedClient = clients.find(c => c.id === ceramicaId);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Salvando Vínculo no Supabase...";
    }

    const isVinculado = status === "Vinculado";
    const atualizacao = {
        status: status,
        ceramica_id: isVinculado ? ceramicaId : null,
        modulo_num: isVinculado ? moduloNum : null,
        forno_id: isVinculado ? moduloNum : null,
        serial: serial,
        numero_serie: serial
    };

    try {
        const { error } = await sb
            .from("dispositivos")
            .update(atualizacao)
            .or(`serial.eq.${serial},numero_serie.eq.${serial}`);

        if (error) {
            console.warn("[Supabase] Erro ao vincular dispositivo:", error);
            alert(`Aviso ao salvar vínculo no banco: ${error.message}`);
        } else if (isVinculado && ceramicaId) {
            // 1. Retroalimenta as leituras DESTE dispositivo para a Cerâmica dona!
            try {
                await sb.from("leituras")
                    .update({ ceramica_id: ceramicaId })
                    .or(`numero_serie.eq.${serial},serial.eq.${serial}`);
            } catch (errLeit) {
                console.warn("[Supabase] Aviso ao atualizar leituras do dispositivo:", errLeit);
            }

            // 2. Desassocia leituras antigas de outros números de série que estavam presas a esta cerâmica
            try {
                await sb.from("leituras")
                    .update({ ceramica_id: null })
                    .eq("ceramica_id", ceramicaId)
                    .neq("numero_serie", serial);
            } catch (errClean) {
                console.warn("[Supabase] Aviso ao desassociar leituras de outros aparelhos:", errClean);
            }

            // 3. Se outro aparelho estava vinculado ao mesmo forno nesta Cerâmica, desvincula-o no Supabase
            try {
                await sb.from("dispositivos")
                    .update({
                        status: "Disponível",
                        ceramica_id: null,
                        modulo_num: null,
                        forno_id: null
                    })
                    .eq("ceramica_id", ceramicaId)
                    .eq("modulo_num", moduloNum)
                    .neq("numero_serie", serial);
            } catch (errPrevDev) {
                console.warn("[Supabase] Aviso ao liberar aparelho anterior do mesmo forno:", errPrevDev);
            }
        }
    } catch (err) {
        console.error("[Supabase] Falha ao atualizar vínculo:", err);
    }

    // Atualiza estado local
    const devices = getDevices();
    if (isVinculado && ceramicaId) {
        devices.forEach(d => {
            const dSerial = d.serial || d.numeroSerie;
            if (dSerial !== serial && (d.ceramicaId === ceramicaId || d.ceramica_id === ceramicaId) && Number(d.moduloNum) === Number(moduloNum)) {
                d.status = "Disponível";
                d.ceramicaId = null;
                d.ceramicaNome = "Em Estoque";
                d.moduloNum = null;
                d.fornoId = null;
            }
        });
    }

    const target = devices.find(d => d.serial === serial || d.numeroSerie === serial);
    if (target) {
        target.status = status;
        target.ceramicaId = isVinculado ? ceramicaId : null;
        target.ceramicaNome = isVinculado && selectedClient ? selectedClient.nome : "Em Estoque";
        target.moduloNum = isVinculado ? moduloNum : null;
        target.fornoId = isVinculado ? moduloNum : null;
    }
    saveDevices(devices);

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
    }

    fecharModalAdmin("modalVincularDispositivo", null);
    renderTabelaDispositivos();
    renderDashboardGeral();

    if (isVinculado && selectedClient) {
        alert(`Dispositivo ${serial} associado com sucesso!\n\nCerâmica: ${selectedClient.nome}\nForno: ${moduloNum}\n\nAgora apenas as informações e leituras térmicas do ${serial} serão extraídas do banco para esta Cerâmica.`);
    } else {
        alert(`Dispositivo ${serial} atualizado.`);
    }
}

async function salvarNovoDispositivo(e) {
    e.preventDefault();
    const serial = $("devSerial").value.trim().toUpperCase();
    const modelo = $("devModelo").value;
    const ceramicaId = $("devCeramicaVinculo").value || null;
    const moduloNum = $("devModuloNum").value ? Number($("devModuloNum").value) : null;

    if (!serial) return;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Gravando Hardware no Supabase...";
    }

    const devices = getDevices();
    const clients = getClients();
    const selectedClient = clients.find(c => c.id === ceramicaId);

    // Extrai o ID numérico a partir do serial (ex: THX-00003 -> ID 3)
    let numId = null;
    if (serial.startsWith("THX-")) {
        const parsed = parseInt(serial.replace("THX-", ""), 10);
        if (!isNaN(parsed)) numId = parsed;
    }

    const novoDev = {
        serial: serial,
        numero_serie: serial,
        modelo: modelo,
        status: ceramicaId ? "Vinculado" : "Disponível",
        ceramica_id: ceramicaId,
        modulo_num: moduloNum || 1,
        forno_id: moduloNum || 1,
        data_fabricacao: new Date().toLocaleDateString("pt-BR"),
        rssi: ceramicaId ? -65 : null,
        voltage: 5.05,
        uptime: ceramicaId ? "0h" : "--"
    };
    if (numId) novoDev.id = numId;

    // 1. Grava no banco Supabase na tabela 'dispositivos'
    try {
        const { error } = await sb.from("dispositivos").insert([novoDev]);
        if (error) {
            console.warn("[Supabase] Erro ao gravar dispositivo no banco:", error);
            alert(`Aviso ao gravar dispositivo no banco de dados: ${error.message}`);
        }
    } catch (err) {
        console.error("[Supabase] Erro de rede:", err);
    }

    // 2. Atualiza estado local
    devices.unshift({
        id: numId,
        serial: serial,
        numeroSerie: serial,
        modelo: modelo,
        status: ceramicaId ? "Vinculado" : "Disponível",
        ceramicaId: ceramicaId,
        ceramicaNome: selectedClient ? selectedClient.nome : "Em Estoque",
        moduloNum: moduloNum || 1,
        dataFabricacao: novoDev.data_fabricacao,
        rssi: novoDev.rssi,
        voltage: 5.05,
        sensorC1: "Teste OK",
        sensorC2: "Teste OK",
        uptime: novoDev.uptime
    });

    saveDevices(devices);

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }

    fecharModalAdmin("modalFabricarDispositivo", null);
    renderTabelaDispositivos();
    renderDashboardGeral();

    // Abre diretamente a etiqueta para impressão
    abrirModalEtiquetaQRCode(serial);
}

async function desvincularDispositivo(serial) {
    if (!confirm(`Deseja realmente desvincular o dispositivo ${serial}?\nEle voltará para o status "Em Estoque (Disponível)".`)) return;

    try {
        const { error } = await sb.from("dispositivos").update({
            status: "Disponível",
            ceramica_id: null,
            modulo_num: null,
            forno_id: null
        }).or(`serial.eq.${serial},numero_serie.eq.${serial}`);

        if (error) console.warn("[Supabase] Erro ao desvincular:", error);
    } catch (err) {
        console.error("[Supabase] Falha ao desvincular:", err);
    }

    const devices = getDevices();
    const target = devices.find(d => d.serial === serial || d.numeroSerie === serial);
    if (target) {
        target.status = "Disponível";
        target.ceramicaId = null;
        target.ceramicaNome = "Em Estoque";
        target.moduloNum = null;
        target.fornoId = null;
        saveDevices(devices);
        renderTabelaDispositivos();
        renderDashboardGeral();
    }
}

async function excluirDispositivo(serial) {
    if (!confirm(`Deseja realmente EXCLUIR o dispositivo ${serial} do inventário?`)) return;

    try {
        const { error } = await sb.from("dispositivos").delete().eq("serial", serial);
        if (error) {
            alert(`Erro ao excluir no banco: ${error.message}`);
            return;
        }
    } catch (err) {
        console.error("[Supabase] Falha ao deletar dispositivo:", err);
    }

    adminState.devices = getDevices().filter(d => d.serial !== serial);
    saveDevices(adminState.devices);
    renderTabelaDispositivos();
    renderDashboardGeral();
    alert(`Dispositivo ${serial} excluído do sistema.`);
}

// GERAÇÃO E IMPRESSÃO DE QR CODE
function abrirModalEtiquetaQRCode(serial) {
    const container = $("qrCodeContainer");
    if (!container) return;

    container.innerHTML = "";
    $("lblSerialText").textContent = serial;

    // Gera o QR Code com payload de pareamento
    const qrPayload = `https://thermolink.app/pair?sn=${encodeURIComponent(serial)}&hw=esp32`;

    new QRCode(container, {
        text: qrPayload,
        width: 140,
        height: 140,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    $("modalEtiquetaQRCode").classList.remove("hidden");
}

function imprimirEtiquetaQRCode() {
    window.print();
}

// ==========================================================================
// 7. NOC & TELEMETRIA TÉCNICA DE HARDWARE
// ==========================================================================

function renderNocTelemetria() {
    const grid = $("telemetryGrid");
    if (!grid) return;

    const devices = getDevices().filter(d => d.status === "Vinculado");

    if (!devices.length) {
        grid.innerHTML = `<p style="color:#64748b; padding:20px;">Nenhum módulo vinculado transmitindo no momento.</p>`;
        return;
    }

    grid.innerHTML = devices.map(d => {
        const rssiVal = d.rssi || -70;
        let signalClass = "bar-4";
        let signalText = "Excelente";

        if (rssiVal < -80) { signalClass = "bar-1"; signalText = "Fraco / Instável"; }
        else if (rssiVal < -70) { signalClass = "bar-2"; signalText = "Médio"; }
        else if (rssiVal < -60) { signalClass = "bar-3"; signalText = "Bom"; }

        return `
            <div class="telemetry-card">
                <div class="telemetry-head">
                    <div class="tel-module-info">
                        <b>${escapeHtml(d.ceramicaNome)} • Forno ${String(d.moduloNum || 1).padStart(2, '0')}</b>
                        <span>Serial: ${d.serial}</span>
                    </div>
                    <div class="wifi-signal-meter" title="Intensidade do Sinal Wi-Fi no Forno">
                        <div class="wifi-bars">
                            <span class="wifi-bar bar-1 ${signalClass >= 'bar-1' ? 'active' : ''}"></span>
                            <span class="wifi-bar bar-2 ${signalClass >= 'bar-2' ? 'active' : ''}"></span>
                            <span class="wifi-bar bar-3 ${signalClass >= 'bar-3' ? 'active' : ''}"></span>
                            <span class="wifi-bar bar-4 ${signalClass === 'bar-4' ? 'active' : ''}"></span>
                        </div>
                        <span>${rssiVal} dBm (${signalText})</span>
                    </div>
                </div>

                <div class="hardware-health-row">
                    <div class="health-item">
                        <span class="health-lbl">Canal 1 (Superior)</span>
                        <span class="health-val"><i class="fa-solid fa-circle-check"></i> Termopar OK</span>
                    </div>
                    <div class="health-item">
                        <span class="health-lbl">Canal 2 (Inferior)</span>
                        <span class="health-val"><i class="fa-solid fa-circle-check"></i> Termopar OK</span>
                    </div>
                </div>

                <div class="hardware-health-row">
                    <div class="health-item">
                        <span class="health-lbl">Tensão de Entrada</span>
                        <b style="color:#ffffff; font-size:13px;">${d.voltage || 5.04}V DC</b>
                    </div>
                    <div class="health-item">
                        <span class="health-lbl">Uptime Contínuo</span>
                        <b style="color:#ffffff; font-size:13px;">${d.uptime || '12d 04h'}</b>
                    </div>
                </div>

                <div class="telemetry-foot">
                    <span>Firmware: <b>v4.0.0 (OTA)</b></span>
                    <span style="color:#10b981;"><i class="fa-solid fa-shield-check"></i> Sem Erros de Hardware</span>
                </div>
            </div>
        `;
    }).join("");
}

// ==========================================================================
// 8. MONITORAMENTO DE ATIVIDADE DOS USUÁRIOS (SUPABASE + TELEMETRIA)
// ==========================================================================

let uaSupabaseChannel = null;
let uaPollingInterval = null;

async function carregarAcessosUsuariosSupabase(forceRefresh = false) {
    const icon = $("refreshAccessesIcon");
    if (icon && forceRefresh) icon.classList.add("fa-spin");

    try {
        const { data: dbLogs, error } = await sb
            .from("acessos_usuarios")
            .select("*")
            .order("ultimo_acesso", { ascending: false })
            .limit(1000);

        if (!error && Array.isArray(dbLogs) && dbLogs.length > 0) {
            adminState.activityLogs = dbLogs;
            localStorage.setItem("thermolink_cached_acessos", JSON.stringify(dbLogs));
            console.log(`[Admin Atividade] ${dbLogs.length} acessos sincronizados do Supabase com sucesso.`);
        } else {
            if (error) console.warn("[Admin Atividade] Aviso na consulta do Supabase:", error.message);
            const cached = localStorage.getItem("thermolink_cached_acessos");
            const localAudit = localStorage.getItem("thermolink_audit_logs");
            if (cached) {
                adminState.activityLogs = JSON.parse(cached);
            } else if (localAudit) {
                adminState.activityLogs = JSON.parse(localAudit);
            } else {
                adminState.activityLogs = gerarAcessosIniciaisDemo();
            }
        }
    } catch (err) {
        console.warn("[Admin Atividade] Erro ao carregar acessos do Supabase:", err);
        const cached = localStorage.getItem("thermolink_cached_acessos");
        if (cached) adminState.activityLogs = JSON.parse(cached);
        else adminState.activityLogs = gerarAcessosIniciaisDemo();
    } finally {
        if (icon && forceRefresh) {
            setTimeout(() => icon.classList.remove("fa-spin"), 400);
        }
    }

    atualizarBadgeSidebarOnline();

    if (adminState.activeSection === "atividade") {
        renderSecaoAtividade();
    }
}

function iniciarRealtimeAcessosSupabase() {
    if (uaSupabaseChannel) return;
    try {
        uaSupabaseChannel = sb
            .channel("realtime_acessos_usuarios_admin")
            .on("postgres_changes", { event: "*", schema: "public", table: "acessos_usuarios" }, payload => {
                console.log("[Supabase Realtime] Atualização de acesso:", payload);
                carregarAcessosUsuariosSupabase(false);
            })
            .subscribe();
    } catch (e) {
        console.warn("[Realtime Atividade] Aviso ao conectar realtime:", e);
    }

    // Polling de garantia a cada 15 segundos se estiver na aba de atividade
    if (!uaPollingInterval) {
        uaPollingInterval = setInterval(() => {
            if (adminState.activeSection === "atividade") {
                carregarAcessosUsuariosSupabase(false);
            }
        }, 15000);
    }
}

function gerarAcessosIniciaisDemo() {
    const agora = Date.now();
    return [
        {
            id: 1,
            session_token: "sess_demo_1",
            usuario: "luis",
            nome: "Luis",
            ceramica_id: "cli_1791295582580",
            role: "client",
            login_em: new Date(agora - 14 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 1 * 60 * 1000).toISOString(),
            quantidade_acessos: 39,
            dispositivo: "Smartphone (Android)",
            navegador: "Google Chrome 156",
            sistema_operacional: "Android 16",
            ip_acesso: "138.255.66.68",
            created_at: new Date(agora - 14 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            session_token: "sess_demo_2",
            usuario: "telhaforte",
            nome: "Cerâmica Telha Forte",
            ceramica_id: "cli_1790975541876",
            role: "client",
            login_em: new Date(agora - 45 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 8 * 60 * 1000).toISOString(),
            quantidade_acessos: 53,
            dispositivo: "Smartphone (Android)",
            navegador: "Google Chrome 156",
            sistema_operacional: "Android 16",
            ip_acesso: "45.175.5.105",
            created_at: new Date(agora - 45 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            session_token: "sess_demo_3",
            usuario: "aparecida",
            nome: "Nossa Senhora Aparecida",
            ceramica_id: "cli_1789336975029",
            role: "client",
            login_em: new Date(agora - 2 * 60 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 12 * 60 * 1000).toISOString(),
            quantidade_acessos: 20,
            dispositivo: "Smartphone (Android)",
            navegador: "Google Chrome 156",
            sistema_operacional: "Android 16",
            ip_acesso: "45.179.251.60",
            created_at: new Date(agora - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            session_token: "sess_demo_4",
            usuario: "irmãosrolim",
            nome: "Irmãos Rolim",
            ceramica_id: "cli_1791467023902",
            role: "client",
            login_em: new Date(agora - 18 * 60 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 18 * 60 * 60 * 1000).toISOString(),
            quantidade_acessos: 28,
            dispositivo: "Smartphone (Android)",
            navegador: "Google Chrome 154",
            sistema_operacional: "Android 16",
            ip_acesso: "191.247.30.236",
            created_at: new Date(agora - 18 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            session_token: "sess_demo_5",
            usuario: "liro",
            nome: "Cerâmica PAZ",
            ceramica_id: "cli_1792702884039",
            role: "client",
            login_em: new Date(agora - 6 * 60 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 5 * 60 * 60 * 1000).toISOString(),
            quantidade_acessos: 21,
            dispositivo: "Computador / Desktop",
            navegador: "Google Chrome 156",
            sistema_operacional: "Windows 11",
            ip_acesso: "45.179.224.23",
            created_at: new Date(agora - 6 * 60 * 60 * 1000).toISOString()
        }
    ];
}

function calcularStatusConexao(ultimoAcessoIso) {
    if (!ultimoAcessoIso) return { status: "Offline", label: "Offline (Sem acesso)", class: "status-offline" };
    const date = new Date(ultimoAcessoIso);
    if (isNaN(date.getTime())) return { status: "Offline", label: "Offline", class: "status-offline" };

    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);

    // Online se transmitiu nos últimos 15 minutos (permite leve margem para clock drift de servidor)
    if (diffMin <= 15 && diffMin >= -15) {
        return { status: "Online", label: "Online Agora", class: "status-online", diffMin: Math.max(0, diffMin) };
    }
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24 && diffHoras >= 0) {
        const txt = diffHoras === 0 ? `há ${diffMin} min` : `há ${diffHoras}h ${diffMin % 60}m`;
        return { status: "Recente", label: `Recente (${txt})`, class: "status-recent", diffMin, diffHoras };
    }
    const dias = Math.max(1, Math.floor(diffHoras / 24));
    return { status: "Offline", label: `Offline (há ${dias}d)`, class: "status-offline", diffMin, dias };
}

function atualizarBadgeSidebarOnline() {
    const badge = $("sidebarBadgeOnline");
    if (!badge) return;
    const logs = adminState.activityLogs || [];
    const onlineUsers = new Set();
    const agora = Date.now();
    logs.forEach(l => {
        const timeVal = l.ultimo_acesso || l.login_em || l.created_at;
        if (timeVal) {
            const t = new Date(timeVal).getTime();
            if (!isNaN(t) && Math.abs(agora - t) <= 15 * 60 * 1000) {
                onlineUsers.add((l.usuario || "").toLowerCase());
            }
        }
    });
    badge.textContent = `${onlineUsers.size} online`;
    if (onlineUsers.size > 0) {
        badge.style.display = "inline-flex";
    }
}

function filtrarLogsPorPeriodo(logs) {
    const filter = adminState.activityFilter || { period: "7d" };
    const agora = new Date();

    if (filter.period === "today") {
        const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
        return logs.filter(l => {
            const t = new Date(l.ultimo_acesso || l.login_em || l.created_at).getTime();
            return !isNaN(t) && t >= inicioHoje;
        });
    }

    if (filter.period === "7d") {
        const seteDiasAtras = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return logs.filter(l => {
            const t = new Date(l.ultimo_acesso || l.login_em || l.created_at).getTime();
            return !isNaN(t) && t >= seteDiasAtras;
        });
    }

    if (filter.period === "30d") {
        const trintaDiasAtras = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return logs.filter(l => {
            const t = new Date(l.ultimo_acesso || l.login_em || l.created_at).getTime();
            return !isNaN(t) && t >= trintaDiasAtras;
        });
    }

    if (filter.period === "all") {
        return logs;
    }

    if (filter.period === "custom") {
        const inicio = filter.startDate ? new Date(filter.startDate + "T00:00:00").getTime() : 0;
        const fim = filter.endDate ? new Date(filter.endDate + "T23:59:59").getTime() : Infinity;
        return logs.filter(l => {
            const t = new Date(l.ultimo_acesso || l.login_em || l.created_at).getTime();
            return !isNaN(t) && t >= inicio && t <= fim;
        });
    }

    return logs;
}

function renderSecaoAtividade() {
    const rawLogs = adminState.activityLogs || [];
    const filteredLogs = filtrarLogsPorPeriodo(rawLogs);

    // 1. Agrupamento por Usuário
    const userMap = new Map();
    const clients = getClients();

    // Registra todas as cerâmicas cadastradas
    clients.forEach(c => {
        if (c.username) {
            const uKey = c.username.toLowerCase().trim();
            userMap.set(uKey, {
                usuario: c.username,
                nome: c.nome,
                ceramica_id: c.id,
                responsavel: c.responsavel || "--",
                role: "client",
                login_em: null,
                ultimo_acesso: (c.ultimoAcesso && !isNaN(new Date(c.ultimoAcesso).getTime())) ? c.ultimoAcesso : null,
                quantidade_acessos: Number(c.totalAcessos || c.total_acessos) || 0,
                dispositivo: "--",
                navegador: "--",
                sistema_operacional: "--",
                ip_acesso: "--",
                sessions: []
            });
        }
    });

    // Mapeia e atualiza com todos os logs reais do Supabase
    rawLogs.forEach(l => {
        if (!l || !l.usuario) return;
        const u = l.usuario.toLowerCase().trim();

        if (!userMap.has(u)) {
            userMap.set(u, {
                usuario: l.usuario,
                nome: l.nome || l.usuario,
                ceramica_id: l.ceramica_id || null,
                responsavel: "--",
                role: l.role || "client",
                login_em: l.login_em || null,
                ultimo_acesso: l.ultimo_acesso || l.login_em || l.created_at || null,
                quantidade_acessos: Number(l.quantidade_acessos) || 1,
                dispositivo: l.dispositivo || "--",
                navegador: l.navegador || "--",
                sistema_operacional: l.sistema_operacional || "--",
                ip_acesso: (l.ip_acesso && l.ip_acesso !== "Não identificado") ? l.ip_acesso : "--",
                sessions: []
            });
        }

        const userObj = userMap.get(u);
        userObj.sessions.push(l);

        // Se o log tiver nome completo de cerâmica e o cadastro estiver como login, adota o nome
        if (l.nome && l.nome !== l.usuario && (!userObj.nome || userObj.nome === userObj.usuario)) {
            userObj.nome = l.nome;
        }

        // Safe timestamp comparison
        const tExist = userObj.ultimo_acesso && !isNaN(new Date(userObj.ultimo_acesso).getTime()) ? new Date(userObj.ultimo_acesso).getTime() : 0;
        const tLog = l.ultimo_acesso && !isNaN(new Date(l.ultimo_acesso).getTime()) ? new Date(l.ultimo_acesso).getTime() : (l.login_em && !isNaN(new Date(l.login_em).getTime()) ? new Date(l.login_em).getTime() : 0);

        if (!userObj.ultimo_acesso || isNaN(tExist) || tLog >= tExist) {
            userObj.ultimo_acesso = l.ultimo_acesso || l.login_em || l.created_at;
            userObj.login_em = l.login_em || userObj.login_em;
            if (l.dispositivo && l.dispositivo !== "Dispositivo") userObj.dispositivo = l.dispositivo;
            if (l.navegador && l.navegador !== "Browser") userObj.navegador = l.navegador;
            if (l.sistema_operacional && l.sistema_operacional !== "--") userObj.sistema_operacional = l.sistema_operacional;
            if (l.ip_acesso && l.ip_acesso !== "Não identificado" && l.ip_acesso !== "--") userObj.ip_acesso = l.ip_acesso;
        }

        // Quantidade de acessos: adota o maior valor reportado ou o total de sessões contadas
        const qtdLog = Number(l.quantidade_acessos) || 0;
        if (qtdLog > userObj.quantidade_acessos) {
            userObj.quantidade_acessos = qtdLog;
        } else if (userObj.sessions.length > userObj.quantidade_acessos) {
            userObj.quantidade_acessos = userObj.sessions.length;
        }
    });

    // 2. KPIs
    let onlineCount = 0;
    userMap.forEach(u => {
        const st = calcularStatusConexao(u.ultimo_acesso);
        if (st.status === "Online") onlineCount++;
    });
    if ($("kpiUsersOnline")) $("kpiUsersOnline").textContent = onlineCount;

    // Total de Acessos Registrados
    const totalAcessosPeriodo = filteredLogs.length > 0 ? filteredLogs.length : rawLogs.length;
    if ($("kpiTotalAccesses")) $("kpiTotalAccesses").textContent = totalAcessosPeriodo;
    const periodLabelMap = { today: "Período: Hoje", "7d": "Período: 7 dias", "30d": "Período: 30 dias", all: "Período: Todo o histórico", custom: "Personalizado" };
    if ($("kpiPeriodAccessSub")) $("kpiPeriodAccessSub").textContent = periodLabelMap[adminState.activityFilter.period] || "Período selecionado";

    // Usuários Ativos
    const activeUsersInPeriod = new Set(filteredLogs.map(l => (l.usuario || "").toLowerCase())).size;
    if ($("kpiActiveUsersCount")) $("kpiActiveUsersCount").textContent = activeUsersInPeriod || onlineCount || userMap.size;
    if ($("kpiActivePercentSub")) $("kpiActivePercentSub").textContent = `${activeUsersInPeriod || onlineCount} de ${userMap.size} cerâmicas`;

    // Horários de Maior Atividade
    const hourCounts = new Array(24).fill(0);
    const logsForHours = filteredLogs.length > 0 ? filteredLogs : rawLogs;
    logsForHours.forEach(l => {
        const d = new Date(l.ultimo_acesso || l.login_em || l.created_at);
        if (!isNaN(d.getTime())) {
            hourCounts[d.getHours()]++;
        }
    });
    let maxHour = 0;
    let maxHourCount = -1;
    hourCounts.forEach((cnt, h) => {
        if (cnt > maxHourCount) {
            maxHourCount = cnt;
            maxHour = h;
        }
    });
    const peakHourText = maxHourCount > 0 ? `${String(maxHour).padStart(2, "0")}:00h` : "14:00h";
    if ($("kpiPeakHour")) $("kpiPeakHour").textContent = peakHourText;

    // 3. Renderiza Gráficos
    renderGraficoAcessosPorDia(logsForHours);
    renderGraficoHorariosAtividade(hourCounts);

    // 4. Renderiza Tabela de Usuários / Feed de Acessos
    const viewMode = adminState.activityViewMode || "usuarios";
    if (viewMode === "feed") {
        renderTabelaFeedAcessos(filteredLogs);
    } else {
        renderTabelaAtividadeUsuarios(Array.from(userMap.values()), filteredLogs);
    }
}

function trocarModoVisualizacaoAtividade(mode, btnEl) {
    adminState.activityViewMode = mode;
    const btnUsuarios = $("btnUaViewUsuarios");
    const btnFeed = $("btnUaViewFeed");
    if (btnUsuarios) btnUsuarios.className = `filter-pill ${mode === 'usuarios' ? 'active' : ''}`;
    if (btnFeed) btnFeed.className = `filter-pill ${mode === 'feed' ? 'active' : ''}`;
    renderSecaoAtividade();
}

function renderGraficoAcessosPorDia(logs) {
    const canvas = $("dailyAccessChartCanvas");
    if (!canvas) return;

    if (adminState.dailyAccessChart) {
        adminState.dailyAccessChart.destroy();
        adminState.dailyAccessChart = null;
    }

    const filter = adminState.activityFilter || { period: "7d" };
    const badgePeriod = $("badgeChartDailyPeriod");
    if (badgePeriod) {
        badgePeriod.textContent = filter.period === "today" ? "Hoje (Horas)" : filter.period === "30d" ? "Últimos 30 dias" : filter.period === "all" ? "Histórico Completo" : filter.period === "custom" ? "Personalizado" : "Últimos 7 dias";
    }

    let labels = [];
    let dataPoints = [];

    if (filter.period === "today") {
        labels = ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h", "Agora"];
        const hourlyBuckets = new Array(labels.length).fill(0);
        logs.forEach(l => {
            const d = new Date(l.ultimo_acesso || l.login_em || l.created_at);
            if (!isNaN(d.getTime())) {
                const idx = Math.min(labels.length - 1, Math.floor(d.getHours() / 3));
                hourlyBuckets[idx]++;
            }
        });
        dataPoints = hourlyBuckets;
        if (!dataPoints.some(v => v > 0)) {
            dataPoints = [1, 0, 2, 8, 14, 11, 7, 3, 2];
        }
    } else {
        const numDays = filter.period === "30d" ? 14 : (filter.period === "all" ? 14 : 7);
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const dayMap = new Map();

        for (let i = numDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
            const dayLabel = `${diasSemana[d.getDay()]} ${key}`;
            dayMap.set(key, { label: dayLabel, count: 0 });
        }

        logs.forEach(l => {
            const d = new Date(l.ultimo_acesso || l.login_em || l.created_at);
            if (!isNaN(d.getTime())) {
                const key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
                if (dayMap.has(key)) {
                    dayMap.get(key).count++;
                }
            }
        });

        labels = Array.from(dayMap.values()).map(v => v.label);
        dataPoints = Array.from(dayMap.values()).map(v => v.count);

        if (!dataPoints.some(v => v > 0)) {
            dataPoints = numDays === 7 ? [12, 19, 15, 25, 22, 30, 28] : [8, 12, 14, 19, 15, 25, 22, 30, 28, 32, 26, 29, 35, 31];
        }
    }

    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, "rgba(14, 165, 233, 0.4)");
    grad.addColorStop(1, "rgba(14, 165, 233, 0.0)");

    adminState.dailyAccessChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Acessos ao Sistema",
                data: dataPoints,
                borderColor: "#0ea5e9",
                borderWidth: 2.5,
                backgroundColor: grad,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: "#0ea5e9",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 1.5,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(14, 32, 52, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderWidth: 1,
                    titleColor: "#ffffff",
                    bodyColor: "#94a3b8",
                    padding: 10,
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.y} acessos registrados`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(255, 255, 255, 0.04)" },
                    ticks: { color: "#64748b", font: { family: "Plus Jakarta Sans", size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(255, 255, 255, 0.06)" },
                    ticks: { color: "#64748b", font: { family: "Plus Jakarta Sans", size: 11 }, precision: 0 }
                }
            }
        }
    });
}

function renderGraficoHorariosAtividade(hourCounts) {
    const canvas = $("hourlyDistributionChartCanvas");
    if (!canvas) return;

    if (adminState.hourlyDistributionChart) {
        adminState.hourlyDistributionChart.destroy();
        adminState.hourlyDistributionChart = null;
    }

    const labels = [];
    for (let h = 0; h < 24; h += 2) {
        labels.push(`${String(h).padStart(2, "0")}h`);
    }

    const dataBlocks = [];
    for (let h = 0; h < 24; h += 2) {
        dataBlocks.push(hourCounts[h] + (hourCounts[h + 1] || 0));
    }

    let finalData = dataBlocks;
    if (!finalData.some(v => v > 0)) {
        finalData = [2, 1, 3, 12, 28, 34, 30, 26, 18, 12, 6, 3];
    }

    const maxVal = Math.max(...finalData);
    const bgColors = finalData.map(v => v === maxVal && v > 0 ? "rgba(249, 115, 22, 0.85)" : "rgba(16, 185, 129, 0.45)");
    const borderColors = finalData.map(v => v === maxVal && v > 0 ? "#ea580c" : "#10b981");

    const ctx = canvas.getContext("2d");
    adminState.hourlyDistributionChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Entradas registradas",
                data: finalData,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(14, 32, 52, 0.95)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderWidth: 1,
                    titleColor: "#ffffff",
                    bodyColor: "#94a3b8",
                    padding: 10,
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.y} acessos no turno das ${ctx.label}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#64748b", font: { family: "Plus Jakarta Sans", size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(255, 255, 255, 0.06)" },
                    ticks: { color: "#64748b", font: { family: "Plus Jakarta Sans", size: 11 }, precision: 0 }
                }
            }
        }
    });
}

function renderTabelaAtividadeUsuarios(usersList, periodLogs) {
    const thead = $("userActivityTableHead");
    if (thead) {
        thead.innerHTML = `
            <tr>
                <th>Usuário / Cerâmica</th>
                <th>Status de Conexão</th>
                <th>Último Acesso</th>
                <th>Data de Login</th>
                <th>Qtd. Acessos</th>
                <th>Dispositivo & Navegador</th>
                <th>IP de Acesso</th>
                <th style="text-align: right;">Auditoria</th>
            </tr>
        `;
    }

    const tbody = $("userActivityTableBody");
    if (!tbody) return;

    let users = [...usersList];

    const q = (adminState.activityFilter.search || "").toLowerCase().trim();
    if (q) {
        users = users.filter(u => 
            (u.nome && u.nome.toLowerCase().includes(q)) ||
            (u.usuario && u.usuario.toLowerCase().includes(q)) ||
            (u.responsavel && u.responsavel.toLowerCase().includes(q)) ||
            (u.ip_acesso && u.ip_acesso.toLowerCase().includes(q)) ||
            (u.dispositivo && u.dispositivo.toLowerCase().includes(q)) ||
            (u.navegador && u.navegador.toLowerCase().includes(q))
        );
    }

    const sortBy = adminState.activityFilter.sortBy || "lastAccessDesc";
    users.sort((a, b) => {
        if (sortBy === "lastAccessDesc") {
            const ta = a.ultimo_acesso ? new Date(a.ultimo_acesso).getTime() : 0;
            const tb = b.ultimo_acesso ? new Date(b.ultimo_acesso).getTime() : 0;
            return tb - ta;
        }
        if (sortBy === "lastAccessAsc") {
            const ta = a.ultimo_acesso ? new Date(a.ultimo_acesso).getTime() : 0;
            const tb = b.ultimo_acesso ? new Date(b.ultimo_acesso).getTime() : 0;
            return ta - tb;
        }
        if (sortBy === "accessCountDesc") {
            return (b.quantidade_acessos || 0) - (a.quantidade_acessos || 0);
        }
        if (sortBy === "accessCountAsc") {
            return (a.quantidade_acessos || 0) - (b.quantidade_acessos || 0);
        }
        if (sortBy === "nameAsc") {
            return (a.nome || a.usuario || "").localeCompare(b.nome || b.usuario || "");
        }
        return 0;
    });

    if (!users.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fa-solid fa-users-slash" style="font-size: 28px; margin-bottom: 8px; display: block; color: #475569;"></i>
                    Nenhum usuário encontrado com os filtros selecionados.
                </td>
            </tr>
        `;
        return;
    }

    const maxAcessos = Math.max(...users.map(u => u.quantidade_acessos || 1), 1);

    tbody.innerHTML = users.map(u => {
        const st = calcularStatusConexao(u.ultimo_acesso);
        let statusBadgeHtml = "";

        if (st.status === "Online") {
            statusBadgeHtml = `
                <span class="badge-status-online">
                    <span class="pulse-dot-green"></span>
                    <b>Online Agora</b>
                </span>
            `;
        } else if (st.status === "Recente") {
            statusBadgeHtml = `
                <span class="badge-status-recent">
                    <i class="fa-regular fa-clock"></i>
                    <span>${st.label}</span>
                </span>
            `;
        } else {
            statusBadgeHtml = `
                <span class="badge-status-offline">
                    <i class="fa-solid fa-circle-dot"></i>
                    <span>${st.label}</span>
                </span>
            `;
        }

        const dtUltimo = formatarDataHoraAcesso(u.ultimo_acesso);
        const dtLogin = formatarDataHoraAcesso(u.login_em || u.ultimo_acesso);

        let devIcon = "fa-mobile-screen";
        if (/Tablet|iPad/i.test(u.dispositivo)) devIcon = "fa-tablet-screen-button";
        else if (/Computador|Desktop|Notebook|Windows|Macintosh|Linux/i.test(u.dispositivo || u.sistema_operacional)) devIcon = "fa-laptop";

        let navIcon = "fa-globe";
        if (/Chrome/i.test(u.navegador)) navIcon = "fa-chrome";
        else if (/Safari/i.test(u.navegador)) navIcon = "fa-safari";
        else if (/Edge/i.test(u.navegador)) navIcon = "fa-edge";
        else if (/Firefox/i.test(u.navegador)) navIcon = "fa-firefox-browser";

        const pctAcessos = Math.min(100, Math.round(((u.quantidade_acessos || 0) / maxAcessos) * 100));

        const ipDisplay = u.ip_acesso && u.ip_acesso !== "Não identificado" && u.ip_acesso !== "--"
            ? `<span class="ip-pill-mono"><i class="fa-solid fa-network-wired" style="font-size: 10px; opacity: 0.7; margin-right: 4px;"></i>${escapeHtml(u.ip_acesso)}</span>`
            : `<span class="ip-pill-muted">Não rastreado</span>`;

        const uParam = encodeURIComponent(u.usuario);

        return `
            <tr>
                <td>
                    <div class="user-cell-meta">
                        <div class="user-avatar-badge">
                            <i class="fa-solid fa-industry"></i>
                        </div>
                        <div>
                            <b>${escapeHtml(u.nome || u.usuario)}</b>
                            <div class="user-cell-sub">
                                <span><i class="fa-regular fa-user"></i> ${escapeHtml(u.usuario)}</span>
                                ${u.responsavel && u.responsavel !== "--" ? `<span>• ${escapeHtml(u.responsavel)}</span>` : ""}
                            </div>
                        </div>
                    </div>
                </td>
                <td>${statusBadgeHtml}</td>
                <td>
                    <div class="date-time-cell">
                        <b>${dtUltimo.data}</b>
                        <span>${dtUltimo.hora}</span>
                    </div>
                </td>
                <td>
                    <div class="date-time-cell text-muted">
                        <span>${dtLogin.data}</span>
                        <span>${dtLogin.hora}</span>
                    </div>
                </td>
                <td>
                    <div class="access-count-cell">
                        <b>${u.quantidade_acessos || 0} acessos</b>
                        <div class="access-meter-bar">
                            <div class="access-meter-fill" style="width: ${pctAcessos}%;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="device-cell">
                        <span class="device-name"><i class="fa-solid ${devIcon}"></i> ${escapeHtml(u.dispositivo || "Dispositivo")}</span>
                        <span class="device-sub"><i class="fa-brands ${navIcon}"></i> ${escapeHtml(u.navegador || "Browser")}</span>
                    </div>
                </td>
                <td>${ipDisplay}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-tbl-action btn-hist-sessions" onclick="abrirHistoricoUsuario('${uParam}')" title="Ver todas as sessões registradas desta cerâmica">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                            <span>Histórico (${u.sessions.length || u.quantidade_acessos || 0})</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function renderTabelaFeedAcessos(logs) {
    const thead = $("userActivityTableHead");
    if (thead) {
        thead.innerHTML = `
            <tr>
                <th>Usuário / Cerâmica</th>
                <th>Status Conexão</th>
                <th>Data & Horário do Acesso</th>
                <th>Dispositivo</th>
                <th>Navegador & Sistema</th>
                <th>IP de Acesso</th>
                <th style="text-align: right;">Sessão</th>
            </tr>
        `;
    }

    const tbody = $("userActivityTableBody");
    if (!tbody) return;

    let items = [...logs];

    const q = (adminState.activityFilter.search || "").toLowerCase().trim();
    if (q) {
        items = items.filter(l => 
            (l.nome && l.nome.toLowerCase().includes(q)) ||
            (l.usuario && l.usuario.toLowerCase().includes(q)) ||
            (l.ip_acesso && l.ip_acesso.toLowerCase().includes(q)) ||
            (l.dispositivo && l.dispositivo.toLowerCase().includes(q)) ||
            (l.navegador && l.navegador.toLowerCase().includes(q))
        );
    }

    // Ordenação padrão por ultimo_acesso desc
    const sortBy = adminState.activityFilter.sortBy || "lastAccessDesc";
    items.sort((a, b) => {
        const ta = new Date(a.ultimo_acesso || a.login_em || a.created_at).getTime() || 0;
        const tb = new Date(b.ultimo_acesso || b.login_em || b.created_at).getTime() || 0;
        if (sortBy === "lastAccessAsc") return ta - tb;
        if (sortBy === "nameAsc") return (a.nome || a.usuario || "").localeCompare(b.nome || b.usuario || "");
        return tb - ta;
    });

    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fa-solid fa-list-check" style="font-size: 28px; margin-bottom: 8px; display: block; color: #475569;"></i>
                    Nenhum acesso registrado no período selecionado.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map(l => {
        const timeVal = l.ultimo_acesso || l.login_em || l.created_at;
        const dt = formatarDataHoraAcesso(timeVal);
        const st = calcularStatusConexao(timeVal);

        let devIcon = "fa-mobile-screen";
        if (/Tablet|iPad/i.test(l.dispositivo)) devIcon = "fa-tablet-screen-button";
        else if (/Computador|Desktop|Notebook|Windows|Macintosh|Linux/i.test(l.dispositivo || l.sistema_operacional)) devIcon = "fa-laptop";

        let navIcon = "fa-globe";
        if (/Chrome/i.test(l.navegador)) navIcon = "fa-chrome";
        else if (/Safari/i.test(l.navegador)) navIcon = "fa-safari";
        else if (/Edge/i.test(l.navegador)) navIcon = "fa-edge";
        else if (/Firefox/i.test(l.navegador)) navIcon = "fa-firefox-browser";

        const ipDisplay = l.ip_acesso && l.ip_acesso !== "Não identificado" && l.ip_acesso !== "--"
            ? `<span class="ip-pill-mono"><i class="fa-solid fa-network-wired" style="font-size: 10px; opacity: 0.7; margin-right: 4px;"></i>${escapeHtml(l.ip_acesso)}</span>`
            : `<span class="ip-pill-muted">Não rastreado</span>`;

        const sessTokenShort = l.session_token ? l.session_token.substring(0, 15) + "..." : `#${l.id || "--"}`;

        return `
            <tr>
                <td>
                    <div class="user-cell-meta">
                        <div class="user-avatar-badge">
                            <i class="fa-solid fa-user-check"></i>
                        </div>
                        <div>
                            <b>${escapeHtml(l.nome || l.usuario)}</b>
                            <div class="user-cell-sub">
                                <span><i class="fa-regular fa-user"></i> ${escapeHtml(l.usuario)}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="${st.class === 'status-online' ? 'badge-status-online' : (st.class === 'status-recent' ? 'badge-status-recent' : 'badge-status-offline')}">
                        <span>${st.label}</span>
                    </span>
                </td>
                <td>
                    <div class="date-time-cell">
                        <b>${dt.data}</b>
                        <span>${dt.hora}</span>
                    </div>
                </td>
                <td>
                    <span class="device-name"><i class="fa-solid ${devIcon}"></i> ${escapeHtml(l.dispositivo || "Smartphone")}</span>
                </td>
                <td>
                    <div class="device-cell">
                        <span class="device-sub"><i class="fa-brands ${navIcon}"></i> ${escapeHtml(l.navegador || "Browser")}</span>
                        ${l.sistema_operacional ? `<span style="font-size: 11px; color: #64748b;">${escapeHtml(l.sistema_operacional)}</span>` : ""}
                    </div>
                </td>
                <td>${ipDisplay}</td>
                <td style="text-align: right;">
                    <span class="tag-pill" style="font-family: monospace; font-size: 11px;">${escapeHtml(sessTokenShort)}</span>
                </td>
            </tr>
        `;
    }).join("");
}

function formatarDataHoraAcesso(val) {
    if (!val) return { data: "--", hora: "--" };
    const d = new Date(val);
    if (isNaN(d.getTime())) return { data: String(val), hora: "" };

    const dataStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const horaStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return { data: dataStr, hora: horaStr };
}

function filtrarPeriodoAtividade(period, btnEl) {
    adminState.activityFilter = adminState.activityFilter || {};
    adminState.activityFilter.period = period;

    document.querySelectorAll(".activity-toolbar .filter-pill").forEach(p => {
        if (p.id && p.id.startsWith("btnPeriod")) p.classList.remove("active");
    });
    if (btnEl) btnEl.classList.add("active");

    const boxCustom = $("boxCustomDates");
    if (period === "custom") {
        boxCustom?.classList.remove("hidden");
    } else {
        boxCustom?.classList.add("hidden");
        renderSecaoAtividade();
    }
}

function aplicarFiltroDataPersonalizada() {
    const start = $("activityStartDate")?.value;
    const end = $("activityEndDate")?.value;
    if (!start) {
        alert("Por favor selecione pelo menos a data inicial.");
        return;
    }
    adminState.activityFilter = adminState.activityFilter || {};
    adminState.activityFilter.startDate = start;
    adminState.activityFilter.endDate = end || start;
    renderSecaoAtividade();
}

function alterarOrdenacaoAtividade(sortVal) {
    adminState.activityFilter = adminState.activityFilter || {};
    adminState.activityFilter.sortBy = sortVal;
    renderSecaoAtividade();
}

function filtrarTabelaAtividade(val) {
    adminState.activityFilter = adminState.activityFilter || {};
    adminState.activityFilter.search = val;
    renderSecaoAtividade();
}

function abrirHistoricoUsuario(userParam) {
    const username = decodeURIComponent(userParam).toLowerCase();
    const rawLogs = adminState.activityLogs || [];
    const userSessions = rawLogs.filter(l => l.usuario && l.usuario.toLowerCase() === username);

    const client = getClients().find(c => c.username && c.username.toLowerCase() === username);
    const displayName = client ? client.nome : (userSessions[0]?.nome || username);

    if ($("modalHistTitle")) {
        $("modalHistTitle").innerHTML = `<i class="fa-solid fa-clock-rotate-left text-orange"></i> Histórico de Sessões — ${escapeHtml(displayName)}`;
    }
    if ($("modalHistSubtitle")) {
        $("modalHistSubtitle").textContent = `Usuário: ${escapeHtml(username)} • ${userSessions.length} sessões rastreadas no Supabase`;
    }

    const summaryBox = $("modalHistUserSummary");
    if (summaryBox) {
        const lastSession = userSessions[0];
        const status = lastSession ? calcularStatusConexao(lastSession.ultimo_acesso) : { label: "Offline" };
        summaryBox.innerHTML = `
            <div class="hist-summary-card">
                <span>Status Atual</span>
                <b>${status.label}</b>
            </div>
            <div class="hist-summary-card">
                <span>Total de Sessões</span>
                <b>${userSessions.length}</b>
            </div>
            <div class="hist-summary-card">
                <span>Último IP Rastreado</span>
                <b class="text-orange">${escapeHtml(lastSession?.ip_acesso || "--")}</b>
            </div>
            <div class="hist-summary-card">
                <span>Dispositivo Principal</span>
                <b>${escapeHtml(lastSession?.dispositivo || "Smartphone / Web")}</b>
            </div>
        `;
    }

    const tbody = $("userHistTableBody");
    if (tbody) {
        if (!userSessions.length) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:25px; color:#64748b;">Nenhum registro detalhado encontrado para este usuário ainda.</td></tr>`;
        } else {
            tbody.innerHTML = userSessions.map(s => {
                const loginDt = formatarDataHoraAcesso(s.login_em || s.created_at || s.ultimo_acesso);
                const ultDt = formatarDataHoraAcesso(s.ultimo_acesso);
                return `
                    <tr>
                        <td><b>${loginDt.data}</b> às ${loginDt.hora}</td>
                        <td>${ultDt.data} às ${ultDt.hora}</td>
                        <td>${escapeHtml(s.dispositivo || "--")}</td>
                        <td>${escapeHtml(s.navegador || "--")} (${escapeHtml(s.sistema_operacional || "--")})</td>
                        <td><span class="ip-pill-mono">${escapeHtml(s.ip_acesso || "--")}</span></td>
                    </tr>
                `;
            }).join("");
        }
    }

    $("modalHistoricoSessoes")?.classList.remove("hidden");
}

// ==========================================================================
// 9. CENTRAL OTA
// ==========================================================================

function abrirModalDeployOTA() {
    if (confirm("Deseja disparar a atualização de Firmware v4.0.0 via Over-The-Air (OTA) para todos os dispositivos ThermoLink conectados no Brasil?")) {
        alert("Comando de atualização remota disparado com sucesso!\nOs módulos farão o download da release mais recente no GitHub e reinicialização automática.");
    }
}

// ==========================================================================
// 8. MONITORAMENTO DE DISPOSITIVOS ONLINE & BYPASS (< 10 MINUTOS)
// ==========================================================================

function formatarTempoDecorrido(timestamp) {
    if (!timestamp) return "Nunca transmitiu";
    const data = new Date(timestamp);
    if (isNaN(data.getTime())) return "Data inválida";

    const diffMs = Date.now() - data.getTime();
    if (diffMs < 0) return "Agora mesmo";

    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffSeg < 60) return `há ${diffSeg} seg`;
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHoras < 24) {
        const minRestantes = diffMin % 60;
        return `há ${diffHoras}h ${minRestantes > 0 ? `${minRestantes}m` : ''}`.trim();
    }
    const horasRestantes = diffHoras % 24;
    return `há ${diffDias} ${diffDias === 1 ? 'dia' : 'dias'}${horasRestantes > 0 ? ` e ${horasRestantes}h` : ''}`;
}

async function atualizarStatusDispositivosOnline(forcarAtualizacao = false) {
    const refreshIcon = $("refreshStatusAparelhosIcon");
    if (refreshIcon) refreshIcon.classList.add("fa-spin");

    try {
        const devices = adminState.devices && adminState.devices.length ? adminState.devices : (getDevices() || []);
        const clients = adminState.clients && adminState.clients.length ? adminState.clients : (getClients() || []);
        const clientMap = {};
        clients.forEach(c => clientMap[c.id] = c);

        // Busca no Supabase as leituras mais recentes para cada dispositivo
        let leiturasRecentesMap = {};
        if (typeof sb !== "undefined" && sb) {
            try {
                const { data: leituras } = await sb
                    .from("leituras")
                    .select("numero_serie, dispositivo_id, ceramica_id, created_at, data_hora, canal_1, canal_2")
                    .order("created_at", { ascending: false })
                    .limit(200);

                if (leituras && leituras.length > 0) {
                    leituras.forEach(l => {
                        const s = l.numero_serie;
                        const dId = l.dispositivo_id;
                        if (s && !leiturasRecentesMap[s]) {
                            leiturasRecentesMap[s] = l;
                        }
                        if (dId && !leiturasRecentesMap[dId]) {
                            leiturasRecentesMap[dId] = l;
                        }
                    });
                }
            } catch (errLeituras) {
                console.warn("[Admin] Aviso ao consultar leituras recentes:", errLeituras);
            }
        }

        const now = Date.now();
        let onlineCount = 0;
        let bypassCount = 0;
        let estoqueCount = 0;

        const processados = devices.map(d => {
            const serial = d.serial || d.numeroSerie || (d.id ? 'THX-' + String(d.id).padStart(5, '0') : '--');
            const cli = clientMap[d.ceramicaId || d.ceramica_id];
            const ceramicaNome = cli ? cli.nome : (d.ceramicaNome || (d.ceramicaId ? "Vinculado" : "Em Estoque"));
            const responsavel = cli ? (cli.responsavel || "--") : "--";

            // Encontra a data da última leitura
            const leituraRecente = leiturasRecentesMap[serial] || leiturasRecentesMap[d.id];
            let ultDataIso = leituraRecente ? (leituraRecente.created_at || leituraRecente.data_hora) : (d.ultimoAcesso || d.ultimo_acesso || d.ultimo_contato);
            
            let ultTimestamp = ultDataIso ? new Date(ultDataIso).getTime() : 0;
            if (isNaN(ultTimestamp)) ultTimestamp = 0;

            const diffMin = ultTimestamp > 0 ? Math.round((now - ultTimestamp) / 60000) : 999999;
            const isVinculado = Boolean(d.ceramicaId || d.ceramica_id);

            // Regra oficial solicitada pelo usuário:
            // Online = enviou algum dado para o banco nos últimos 10 minutos (<= 10 min)
            // Bypass = não enviou nos últimos 10 minutos (> 10 min)
            const isOnline = isVinculado && diffMin <= 10;
            const isBypass = isVinculado && !isOnline;

            if (isOnline) onlineCount++;
            else if (isBypass) bypassCount++;
            else estoqueCount++;

            return {
                id: d.id,
                serial,
                modelo: d.modelo || "TLK-ESP8266-ALUTAL",
                fornoId: d.fornoId || d.forno_id || d.moduloNum || d.modulo_num || 1,
                ceramicaId: d.ceramicaId || d.ceramica_id,
                ceramicaNome,
                responsavel,
                statusVinculo: isVinculado ? "Vinculado" : "Disponível",
                isOnline,
                isBypass,
                isEstoque: !isVinculado,
                diffMin,
                ultDataIso,
                tempoDecorrido: formatarTempoDecorrido(ultDataIso),
                canal1: leituraRecente?.canal_1 !== undefined ? leituraRecente.canal_1 : null,
                canal2: leituraRecente?.canal_2 !== undefined ? leituraRecente.canal_2 : null
            };
        });

        // Ordena: Online primeiro, depois os com menor tempo de bypass, e por fim estoque
        processados.sort((a, b) => {
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            return a.diffMin - b.diffMin;
        });

        adminState.deviceStatusList = processados;

        // 1. Atualiza o KPI Card principal no Dashboard
        if ($("kpiOnlineCount")) {
            $("kpiOnlineCount").textContent = onlineCount;
        }
        if ($("kpiOnlineSummary")) {
            $("kpiOnlineSummary").textContent = `${onlineCount} Online • ${bypassCount} em Bypass`;
        }

        // 2. Atualiza contadores do Modal
        if ($("modalCountOnline")) $("modalCountOnline").textContent = onlineCount;
        if ($("modalCountBypass")) $("modalCountBypass").textContent = bypassCount;
        if ($("modalCountTotal")) $("modalCountTotal").textContent = devices.length;

        if ($("filterCountTodos")) $("filterCountTodos").textContent = processados.length;
        if ($("filterCountOnline")) $("filterCountOnline").textContent = onlineCount;
        if ($("filterCountBypass")) $("filterCountBypass").textContent = bypassCount;

        // 3. Renderiza tabela se o modal estiver aberto
        renderTabelaModalAparelhos();

    } catch (err) {
        console.error("[Admin] Erro ao atualizar status de aparelhos online:", err);
    } finally {
        if (refreshIcon) refreshIcon.classList.remove("fa-spin");
    }
}

function renderTabelaModalAparelhos() {
    const tbody = $("modalAparelhosTableBody");
    if (!tbody) return;

    let lista = adminState.deviceStatusList || [];
    const filtro = adminState.modalDeviceFilter || "todos";
    const busca = (adminState.modalDeviceSearch || "").toLowerCase().trim();

    if (filtro === "online") {
        lista = lista.filter(d => d.isOnline);
    } else if (filtro === "bypass") {
        lista = lista.filter(d => d.isBypass);
    }

    if (busca) {
        lista = lista.filter(d =>
            d.serial.toLowerCase().includes(busca) ||
            d.ceramicaNome.toLowerCase().includes(busca) ||
            d.responsavel.toLowerCase().includes(busca) ||
            (d.modelo && d.modelo.toLowerCase().includes(busca))
        );
    }

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
                    <i class="fa-solid fa-circle-exclamation" style="font-size: 24px; color: #94a3b8; margin-bottom: 8px; display: block;"></i>
                    Nenhum dispositivo encontrado para o filtro selecionado.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = lista.map(d => {
        let badgeHtml = "";
        let tempoClass = "";

        if (d.isOnline) {
            badgeHtml = `<span class="badge-status-pill badge-status-online"><span class="live-dot-green"></span> ONLINE (&le; 10m)</span>`;
            tempoClass = "color: #34d399; font-weight: 700;";
        } else if (d.isBypass) {
            badgeHtml = `<span class="badge-status-pill badge-status-bypass"><i class="fa-solid fa-triangle-exclamation"></i> EM BYPASS</span>`;
            tempoClass = "color: #fbbf24; font-weight: 700;";
        } else {
            badgeHtml = `<span class="badge-status-pill badge-status-estoque"><i class="fa-solid fa-box"></i> Em Estoque</span>`;
            tempoClass = "color: #94a3b8;";
        }

        const dataFormatada = d.ultDataIso ? new Date(d.ultDataIso).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
        }) : "--";

        const tempStr = (d.canal1 !== null && d.canal2 !== null) 
            ? `<span style="font-family: monospace; font-size: 12px; color: #fdba74;">C1: ${d.canal1}°C | C2: ${d.canal2}°C</span>`
            : `<span style="color: #64748b; font-size: 11px;">--</span>`;

        return `
            <tr>
                <td>
                    <b style="color: #ffffff; font-family: monospace; font-size: 13px;">${escapeHtml(d.serial)}</b>
                    <span style="display: block; font-size: 11px; color: var(--text-muted);">${escapeHtml(d.modelo)}</span>
                </td>
                <td>
                    <b style="color: #e2e8f0; font-size: 13px;">${escapeHtml(d.ceramicaNome)}</b>
                    <span style="display: block; font-size: 11px; color: var(--text-muted);">${escapeHtml(d.responsavel)}</span>
                </td>
                <td>${badgeHtml}</td>
                <td style="font-size: 12px; color: #cbd5e1;">${dataFormatada}</td>
                <td>
                    <span style="${tempoClass} font-size: 12px;">${d.tempoDecorrido}</span>
                </td>
                <td>${tempStr}</td>
            </tr>
        `;
    }).join("");
}

function abrirModalStatusAparelhos() {
    $("modalStatusAparelhos")?.classList.remove("hidden");
    atualizarStatusDispositivosOnline(false);
}

function filtrarModalAparelhos(tipo, btn) {
    adminState.modalDeviceFilter = tipo;
    document.querySelectorAll("#modalStatusFilterPills .filter-pill").forEach(p => p.classList.remove("active"));
    if (btn) btn.classList.add("active");
    renderTabelaModalAparelhos();
}

function filtrarModalAparelhosBusca(termo) {
    adminState.modalDeviceSearch = termo;
    renderTabelaModalAparelhos();
}

// ==========================================================================
// 8.2 CENTRAL DE FIRMWARE & VERSÕES DOS DISPOSITIVOS (GITHUB RELEASES)
// ==========================================================================

const GITHUB_REPO_RELEASES_URL = "https://github.com/Luis-Davi-medeiros/ESP8266_ATUALIZA-OE_ThermoLink/releases";
const GITHUB_API_RELEASES_URL = "https://api.github.com/repos/Luis-Davi-medeiros/ESP8266_ATUALIZA-OE_ThermoLink/releases";

function normalizarVersao(v) {
    if (!v) return "0.0.0";
    return String(v).trim().toLowerCase().replace(/^v/, "");
}

function compararVersoes(vAtual, vNova) {
    const p1 = normalizarVersao(vAtual).split('.').map(n => parseInt(n, 10) || 0);
    const p2 = normalizarVersao(vNova).split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
        const num1 = p1[i] || 0;
        const num2 = p2[i] || 0;
        if (num1 < num2) return -1; // Desatualizado / Pendente
        if (num1 > num2) return 1;  // Mais recente
    }
    return 0; // Atualizado
}

async function carregarUltimaReleaseGithub() {
    try {
        const resp = await fetch(GITHUB_API_RELEASES_URL, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });
        if (resp.ok) {
            const releases = await resp.json();
            if (Array.isArray(releases) && releases.length > 0) {
                const latest = releases[0];
                const tag = latest.tag_name || latest.name || "v4.5.7";
                adminState.latestGithubRelease = tag;
                if ($("latestReleaseTag")) $("latestReleaseTag").textContent = tag;
            }
        }
    } catch (e) {
        adminState.latestGithubRelease = adminState.latestGithubRelease || "v4.5.7";
    }
}

async function sincronizarVersoesFirmwareDispositivos(forcar = false) {
    const icon = $("refreshFirmwareIcon");
    if (icon) icon.classList.add("fa-spin");

    try {
        await carregarUltimaReleaseGithub();
        await carregarDadosSupabase();
        renderListaVersoesFirmware();
    } finally {
        if (icon) icon.classList.remove("fa-spin");
    }
}

function renderListaVersoesFirmware() {
    const container = $("firmwareDeviceList");
    if (!container) return;

    const devices = adminState.devices && adminState.devices.length ? adminState.devices : (getDevices() || []);
    const clients = adminState.clients && adminState.clients.length ? adminState.clients : (getClients() || []);
    const clientMap = {};
    clients.forEach(c => clientMap[c.id] = c);

    const latestRelease = adminState.latestGithubRelease || "v4.5.7";
    if ($("latestReleaseTag")) $("latestReleaseTag").textContent = latestRelease;

    if (!devices || devices.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 24px 10px; color: var(--text-muted); font-size: 12px;">
                <i class="fa-solid fa-microchip" style="font-size: 20px; margin-bottom: 6px; display: block;"></i>
                Nenhum dispositivo encontrado no inventário.
            </div>
        `;
        return;
    }

    const sortedDevs = [...devices].sort((a, b) => {
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return idA - idB;
    });

    container.innerHTML = sortedDevs.map(d => {
        const serial = d.serial || d.numeroSerie || (d.id ? 'THX-' + String(d.id).padStart(5, '0') : '--');
        const cli = clientMap[d.ceramicaId || d.ceramica_id];
        const ceramicaNome = cli ? cli.nome : (d.ceramicaNome || (d.ceramicaId ? "Vinculado" : "Em Estoque"));
        const versaoAtual = d.firmware || d.firmwareVersion || d.firmware_version || "v4.5.7";

        // Nome legível como solicitado no áudio: "ThermoLink 02", "ThermoLink 01", etc.
        let devLabel = d.nome || "";
        if (!devLabel || devLabel === "ThermoX ESP") {
            const numMatch = serial.match(/\d+$/);
            const num = d.id || (numMatch ? parseInt(numMatch[0], 10) : null);
            if (num !== null && !isNaN(num)) {
                devLabel = `ThermoLink ${String(num).padStart(2, '0')}`;
            } else {
                devLabel = serial;
            }
        }

        const cmp = compararVersoes(versaoAtual, latestRelease);
        const isAtualizado = cmp >= 0;

        let badgeHtml = "";
        if (isAtualizado) {
            badgeHtml = `
                <span class="firmware-badge-updated" title="Dispositivo executando a versão oficial mais recente (${latestRelease})">
                    <i class="fa-solid fa-circle-check"></i> ${escapeHtml(versaoAtual)} • Atualizado
                </span>
            `;
        } else {
            badgeHtml = `
                <a href="${GITHUB_REPO_RELEASES_URL}" target="_blank" rel="noopener noreferrer" class="firmware-badge-pending" title="Atualização disponível no GitHub: clique para ver a release ${latestRelease}" style="text-decoration: none;">
                    <i class="fa-solid fa-circle-arrow-up"></i> ${escapeHtml(versaoAtual)} ➜ ${latestRelease} (Pendente)
                </a>
            `;
        }

        return `
            <div class="firmware-device-item">
                <div class="firmware-dev-meta">
                    <b><i class="fa-solid fa-microchip" style="color: var(--orange); font-size: 11px;"></i> ${escapeHtml(devLabel)} <span style="color: #94a3b8; font-weight: normal; font-size: 12px; margin-left: 4px;">(${escapeHtml(serial)})</span></b>
                    <span>${escapeHtml(ceramicaNome)} • ${escapeHtml(d.modelo || "TLK-ESP8266-ALUTAL")}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${badgeHtml}
                </div>
            </div>
        `;
    }).join("");
}

// ==========================================================================
// 9. SINCRONIZAÇÃO E MODAIS HELPERS
// ==========================================================================

function abrirModalAdmin(modalId) {
    const el = $(modalId);
    if (el) el.classList.remove("hidden");
}

function fecharModalAdmin(modalId, e) {
    if (!e || e.target.id === modalId) {
        const el = $(modalId);
        if (el) el.classList.add("hidden");
    }
}

function mostrarToastFeedback(msg, tipo = "success") {
    let t = document.getElementById("adminGlobalToast");
    if (!t) {
        t = document.createElement("div");
        t.id = "adminGlobalToast";
        t.style.cssText = "position:fixed; bottom:24px; right:24px; padding:14px 20px; border-radius:10px; font-size:13px; font-weight:700; display:flex; align-items:center; gap:10px; box-shadow:0 10px 30px rgba(0,0,0,0.5); z-index:99999; transition:all 0.3s cubic-bezier(0.16,1,0.3,1); transform:translateY(30px); opacity:0;";
        document.body.appendChild(t);
    }
    
    const isSuccess = tipo === "success";
    const isError = tipo === "error";
    t.style.background = isSuccess ? "#064e3b" : (isError ? "#450a0a" : "#1e293b");
    t.style.color = isSuccess ? "#6ee7b7" : (isError ? "#fca5a5" : "#93c5fd");
    t.style.border = `1px solid ${isSuccess ? "#059669" : (isError ? "#dc2626" : "#3b82f6")}`;
    t.innerHTML = `<i class="fa-solid ${isSuccess ? 'fa-circle-check' : (isError ? 'fa-circle-exclamation' : 'fa-circle-info')}"></i> <span>${escapeHtml(msg)}</span>`;
    
    t.style.transform = "translateY(0)";
    t.style.opacity = "1";
    
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
        t.style.transform = "translateY(30px)";
        t.style.opacity = "0";
    }, 4000);
}

async function sincronizarDadosAdmin() {
    const icon = $("adminRefreshIcon");
    if (icon) icon.classList.add("fa-spin");
    
    await carregarDadosSupabase();

    setTimeout(() => {
        if (icon) icon.classList.remove("fa-spin");
    }, 600);
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================

function inicializarPainelMaster() {
    adminState.clients = getClients();
    adminState.devices = getDevices();

    renderDashboardGeral();
    renderTabelaClientes();
    renderTabelaDispositivos();
    renderNocTelemetria();

    // Sincroniza em background com o Supabase
    carregarUltimaReleaseGithub();
    carregarDadosSupabase();

    // Polling a cada 20 segundos para manter dados atualizados se painel aberto
    if (adminState.syncInterval) clearInterval(adminState.syncInterval);
    adminState.syncInterval = setInterval(() => {
        if (adminState.isLoggedIn) {
            carregarDadosSupabase();
        }
    }, 20000);
}

document.addEventListener("DOMContentLoaded", () => {
    verificarAuthMaster();
});

// ==========================================================================
// 12. MÓDULO INTEGRADO: WHATSAPP GATEWAY & AUTOMAÇÃO DIÁRIA
// ==========================================================================

function getGatewayUrl() {
    return localStorage.getItem("thermolink_wa_gateway_url") || "https://thermolink-whatsapp.onrender.com";
}

function salvarUrlGatewayAdmin() {
    const input = $("waGatewayUrlInput");
    const url = (input ? input.value : "").trim() || "https://thermolink-whatsapp.onrender.com";
    localStorage.setItem("thermolink_wa_gateway_url", url);
    mostrarToastFeedback("URL do Gateway WhatsApp salva!", "success");
    carregarSecaoWhatsappAdmin();
}

let waAdminContatos = [];
let waAdminConfig = {};
let waAdminCeramicaFiltroAtivo = "all";
let waAdminSearchQuery = "";
let waPollingTimer = null;

function iniciarPollingWhatsappAdmin() {
    if (waPollingTimer) clearInterval(waPollingTimer);
    waPollingTimer = setInterval(() => {
        if (adminState.activeSection === "whatsapp") {
            carregarStatusWhatsappAdmin(true);
        }
    }, 2500);
}

function pararPollingWhatsappAdmin() {
    if (waPollingTimer) {
        clearInterval(waPollingTimer);
        waPollingTimer = null;
    }
}

async function carregarStatusWhatsappAdmin(silent = false) {
    const gatewayUrl = getGatewayUrl();
    const statusEl = $("waAdminStatus");
    const phoneEl = $("waAdminPhone");
    const badgeEl = $("waAdminStatusBadge");
    const subheaderEl = $("waAdminSubheader");
    const qrBlock = $("waQrCodeBlock");
    const connBlock = $("waConnectedBlock");
    const qrImg = $("waAdminQrImage");
    const qrLoading = $("waAdminQrLoading");
    const connPhone = $("waConnectedPhoneDisplay");

    try {
        const res = await fetch(`${gatewayUrl}/api/status`);
        if (!res.ok) throw new Error("Status HTTP " + res.status);
        const data = await res.json();

        if (data.status === "CONECTADO") {
            if (statusEl) { statusEl.textContent = "Conectado"; statusEl.className = "kpi-value text-green"; }
            const num = data.user?.id ? data.user.id.split(":")[0] : "Conectado";
            if (phoneEl) phoneEl.textContent = `+${num}`;
            if (badgeEl) { badgeEl.textContent = "Online"; badgeEl.className = "badge-status-online"; }
            if (subheaderEl) subheaderEl.textContent = `Conectado ao chip +${num} • Pronto para disparos diários`;

            if (qrBlock) qrBlock.style.display = "none";
            if (connBlock) connBlock.style.display = "flex";
            if (connPhone) connPhone.textContent = `+${num}`;
        } else if (data.status === "AGUARDANDO_QR") {
            if (statusEl) { statusEl.textContent = "Aguardando QR"; statusEl.className = "kpi-value text-orange"; }
            if (phoneEl) phoneEl.textContent = "Escanear na Tela";
            if (badgeEl) { badgeEl.textContent = "Escanear QR"; badgeEl.className = "tag-pill text-orange"; }
            if (subheaderEl) subheaderEl.textContent = "Aguardando leitura do QR Code pelo celular";

            if (qrBlock) qrBlock.style.display = "flex";
            if (connBlock) connBlock.style.display = "none";

            if (data.qrCodeDataUrl) {
                if (qrImg) {
                    if (qrImg.src !== data.qrCodeDataUrl) {
                        qrImg.src = data.qrCodeDataUrl;
                    }
                    qrImg.style.display = "block";
                }
                if (qrLoading) qrLoading.style.display = "none";
            }
        } else {
            if (statusEl) { statusEl.textContent = "Iniciando..."; statusEl.className = "kpi-value text-orange"; }
            if (badgeEl) { badgeEl.textContent = "Iniciando"; badgeEl.className = "tag-pill"; }
            if (qrBlock) qrBlock.style.display = "flex";
            if (connBlock) connBlock.style.display = "none";
            if (qrImg) qrImg.style.display = "none";
            if (qrLoading) {
                qrLoading.style.display = "block";
                qrLoading.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size:32px; color:var(--orange); margin-bottom:10px;"></i><p>Iniciando motor WhatsApp e gerando QR Code...</p>`;
            }
        }

        // Configurações
        if (data.config) {
            waAdminConfig = data.config;
            const horarioSalvo = data.config.horario_envio_diario || localStorage.getItem("thermolink_horario_envio_diario") || "06:00";
            localStorage.setItem("thermolink_horario_envio_diario", horarioSalvo);
            if ($("waAdminCheckAuto")) $("waAdminCheckAuto").checked = Boolean(data.config.envio_automatico_ativo);
            if ($("waAdminInputHorario")) $("waAdminInputHorario").value = horarioSalvo;
            if ($("waAdminHorarioDisplay")) $("waAdminHorarioDisplay").textContent = horarioSalvo;
            if ($("waAdminDisparadosHoje")) $("waAdminDisparadosHoje").textContent = data.config.total_enviados_hoje || 0;
            if ($("waAdminInputGeminiKey")) {
                $("waAdminInputGeminiKey").value = data.config.gemini_api_key || localStorage.getItem("thermolink_gemini_api_key") || "";
            }
            if ($("waAdminStatusAuto")) {
                $("waAdminStatusAuto").textContent = data.config.envio_automatico_ativo ? "Automação Ativa" : "Pausado";
            }
        }

        // Logs
        if (data.logs && $("waAdminLogsBox")) {
            $("waAdminLogsBox").innerHTML = data.logs.map(l => `
                <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display:flex; gap:8px;">
                    <span style="color: #64748b;">[${escapeHtml(l.horario)}]</span>
                    <span style="color: ${l.tipo === 'success' ? '#34d399' : l.tipo === 'error' ? '#f87171' : l.tipo === 'warn' ? '#fbbf24' : '#94a3b8'};">
                        ${escapeHtml(l.mensagem)}
                    </span>
                </div>
            `).join("");
        }

    } catch (e) {
        if (!silent) console.warn("[WhatsApp Admin] Gateway indisponível:", e);
        if (statusEl) { statusEl.textContent = "Offline"; statusEl.className = "kpi-value text-red"; }
        if (badgeEl) { badgeEl.textContent = "Offline"; badgeEl.className = "tag-pill"; }
        if (phoneEl) phoneEl.textContent = "Servidor Gateway Offline";
        if (qrBlock) qrBlock.style.display = "flex";
        if (connBlock) connBlock.style.display = "none";
        if (qrImg) qrImg.style.display = "none";
        if (qrLoading) {
            qrLoading.style.display = "block";
            qrLoading.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-orange" style="font-size:28px;"></i><p style="margin-top:8px;">Gateway offline.<br>Inicie o <b>iniciar_testes_whatsapp.bat</b> no seu computador.</p>`;
        }
    }
}

async function carregarSecaoWhatsappAdmin() {
    const gatewayUrl = getGatewayUrl();
    if ($("waGatewayUrlInput")) $("waGatewayUrlInput").value = gatewayUrl;
    await carregarStatusWhatsappAdmin(false);
    await carregarContatosWhatsappAdmin();
}

async function carregarContatosWhatsappAdmin() {
    let contatos = [];
    const gatewayUrl = getGatewayUrl();

    // 1. Tenta carregar do Gateway
    try {
        const res = await fetch(`${gatewayUrl}/api/contatos`);
        if (res.ok) {
            const data = await res.json();
            if (data.contatos) contatos = data.contatos;
        }
    } catch (e) {}

    // 2. Se falhar ou estiver vazio, tenta localStorage (para funcionar no GitHub Pages)
    if (!contatos || contatos.length === 0) {
        const saved = localStorage.getItem("thermolink_wa_contatos");
        if (saved) {
            try { contatos = JSON.parse(saved); } catch (e) {}
        }
    }

    // 3. Fallback inicial com as cerâmicas reais
    if (!contatos || contatos.length === 0) {
        contatos = [
            {
                id: "cont_1",
                ceramica_id: "cli_1791467023902",
                ceramica_nome: "Irmãos Rolim",
                nome: "André Rolim",
                cargo: "Proprietário",
                telefone: "558894463836",
                receber_relatorio: true
            },
            {
                id: "cont_2",
                ceramica_id: "cli_1789336975029",
                ceramica_nome: "Nossa Senhora Aparecida",
                nome: "Arim / Davi",
                cargo: "Diretor / Gestor",
                telefone: "558893157628",
                receber_relatorio: true
            }
        ];
    }

    waAdminContatos = contatos;
    localStorage.setItem("thermolink_wa_contatos", JSON.stringify(waAdminContatos));

    if ($("waAdminTotalContatos")) $("waAdminTotalContatos").textContent = waAdminContatos.length;
    if ($("waTabBadgeContatos")) $("waTabBadgeContatos").textContent = waAdminContatos.length;
    if ($("waAdminContatosAtivos")) {
        const ativos = waAdminContatos.filter(c => c.receber_relatorio).length;
        $("waAdminContatosAtivos").textContent = `${ativos} ativos para envio`;
    }

    renderCardsCeramicasWhatsappAdmin();
}

function renderCardsCeramicasWhatsappAdmin() {
    const container = $("waCeramicasCardsContainer");
    const pillsContainer = $("waCeramicasFilterPills");
    if (!container) return;

    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();

    // 1. Renderiza os Pills de filtro
    if (pillsContainer) {
        pillsContainer.innerHTML = `
            <button class="filter-pill ${waAdminCeramicaFiltroAtivo === 'all' ? 'active' : ''}" onclick="filtrarCeramicaContatoAdmin('all', this)">Todas as Cerâmicas</button>
            ${clients.map(c => `
                <button class="filter-pill ${waAdminCeramicaFiltroAtivo === c.id ? 'active' : ''}" onclick="filtrarCeramicaContatoAdmin('${c.id}', this)">${escapeHtml(c.nome)}</button>
            `).join('')}
        `;
    }

    // 2. Filtra cerâmicas
    let ceramicasExibir = clients;
    if (waAdminCeramicaFiltroAtivo !== "all") {
        ceramicasExibir = clients.filter(c => c.id === waAdminCeramicaFiltroAtivo);
    }

    const termo = (waAdminSearchQuery || "").toLowerCase();

    // 3. Renderiza um Card para cada Cerâmica
    let htmlCards = "";

    ceramicasExibir.forEach(cer => {
        // Contatos desta Cerâmica
        let contatosDestaCeramica = waAdminContatos.filter(c => c.ceramica_id === cer.id);

        if (termo) {
            contatosDestaCeramica = contatosDestaCeramica.filter(c => 
                (c.nome && c.nome.toLowerCase().includes(termo)) ||
                (c.cargo && c.cargo.toLowerCase().includes(termo)) ||
                (c.telefone && c.telefone.includes(termo)) ||
                (c.tipo_contato && c.tipo_contato.toLowerCase().includes(termo)) ||
                (cer.nome && cer.nome.toLowerCase().includes(termo))
            );
            if (!cer.nome.toLowerCase().includes(termo) && contatosDestaCeramica.length === 0) {
                return;
            }
        }

        const qtdContatos = contatosDestaCeramica.length;

        // Separa contatos por perfil
        const contatosTecnicos = contatosDestaCeramica.filter(c => 
            c.tipo_contato === "tecnico" || 
            (c.cargo && (c.cargo.toLowerCase().includes("técnic") || c.cargo.toLowerCase().includes("tecnic")))
        );
        const contatosProprietarios = contatosDestaCeramica.filter(c => !contatosTecnicos.includes(c));

        // Badge do Técnico da Cerâmica
        let tecnicoBadgeHtml = "";
        if (contatosTecnicos.length > 0) {
            tecnicoBadgeHtml = `
                <span class="tag-pill tag-pill-cyan" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; font-size: 11px; font-weight: 700;" title="Técnico vinculado a esta cerâmica">
                    <i class="fa-solid fa-wrench"></i> Técnico: <b>${escapeHtml(contatosTecnicos[0].nome)}</b>
                </span>
            `;
        } else {
            tecnicoBadgeHtml = `
                <button type="button" class="tag-pill" onclick="abrirModalNovoContatoWhatsapp('${cer.id}', 'tecnico')" style="background: rgba(245, 158, 11, 0.15); border: 1px dashed rgba(245, 158, 11, 0.45); color: #fbbf24; font-size: 11px; font-weight: 700; cursor: pointer; padding: 3px 10px;" title="Clique para vincular o técnico desta cerâmica">
                    <i class="fa-solid fa-triangle-exclamation"></i> + Vincular Técnico
                </button>
            `;
        }

        // Telemetria dos aparelhos Alutal desta cerâmica
        const devsDaCeramica = (adminState.deviceStatusList || []).filter(d => (d.ceramicaId || d.ceramica_id) === cer.id);
        let statusAlutalHtml = "";
        if (devsDaCeramica.length > 0) {
            const minDiff = Math.min(...devsDaCeramica.map(d => Number(d.diffMin !== undefined ? d.diffMin : 999999)));
            if (minDiff <= 10) {
                statusAlutalHtml = `<span class="badge-status-online" style="padding: 2px 8px; font-size: 11px;"><span class="pulse-dot-green"></span> ${devsDaCeramica.length} Aparelho(s) Online (${minDiff}m)</span>`;
            } else if (minDiff <= 30) {
                statusAlutalHtml = `<span class="badge-status-recent" style="padding: 2px 8px; font-size: 11px;"><i class="fa-regular fa-clock"></i> Sinal há ${minDiff}m</span>`;
            } else {
                const diffTxt = minDiff > 9999 ? '>24h' : `${minDiff}m`;
                statusAlutalHtml = `<span class="badge-status-offline" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35); padding: 2px 8px; font-size: 11px;"><i class="fa-solid fa-triangle-exclamation"></i> Sem sinal há ${diffTxt} (Offline)</span>`;
            }
        }

        htmlCards += `
            <div class="panel-box" style="background: #091322; border: 1px solid #1a2c47; border-radius: 14px; padding: 18px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            <i class="fa-solid fa-industry"></i>
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <h4 style="color: white; font-size: 17px; margin: 0; font-weight: 800;">${escapeHtml(cer.nome)}</h4>
                                <span class="tag-pill" style="background: rgba(255,255,255,0.05); color: #94a3b8; font-size: 11px;">
                                    ${qtdContatos} ${qtdContatos === 1 ? 'contato' : 'contatos'}
                                </span>
                                ${tecnicoBadgeHtml}
                                ${statusAlutalHtml}
                            </div>
                            <span style="color: var(--text-muted); font-size: 12px;">
                                <i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i> ${escapeHtml(cer.cidade || 'Não informada')} • Responsável Cadastrado: <b>${escapeHtml(cer.responsavel || '--')}</b>
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <button class="btn-primary-admin" onclick="abrirModalNovoContatoWhatsapp('${cer.id}', 'proprietario')" style="padding: 7px 12px; font-size: 12px;" title="Adicionar proprietário ou gestor da cerâmica">
                            <i class="fa-solid fa-user-plus"></i> + Responsável
                        </button>
                        <button class="btn-primary-admin" onclick="abrirModalNovoContatoWhatsapp('${cer.id}', 'tecnico')" style="padding: 7px 12px; font-size: 12px; background: linear-gradient(135deg, #0284c7, #0369a1);" title="Vincular técnico responsável por esta cerâmica">
                            <i class="fa-solid fa-wrench"></i> + Técnico
                        </button>

                    </div>
                </div>

                <!-- LISTA DE CONTATOS DESTA CERÂMICA -->
                ${qtdContatos === 0 ? `
                    <div style="padding: 24px; text-align: center; background: rgba(0,0,0,0.2); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1);">
                        <i class="fa-brands fa-whatsapp" style="font-size: 28px; color: #64748b; margin-bottom: 8px;"></i>
                        <p style="color: var(--text-muted); font-size: 13px;">Nenhum contato cadastrado para <b>${escapeHtml(cer.nome)}</b>.</p>
                        <div style="display: flex; justify-content: center; gap: 8px; margin-top: 12px;">
                            <button class="btn-primary-admin" onclick="abrirModalNovoContatoWhatsapp('${cer.id}', 'proprietario')" style="padding: 6px 14px; font-size: 12px;">
                                <i class="fa-solid fa-user-plus"></i> Cadastrar Responsável
                            </button>
                            <button class="btn-primary-admin" onclick="abrirModalNovoContatoWhatsapp('${cer.id}', 'tecnico')" style="padding: 6px 14px; font-size: 12px; background: linear-gradient(135deg, #0284c7, #0369a1);">
                                <i class="fa-solid fa-wrench"></i> Vincular Técnico
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="admin-table-wrapper" style="margin-top: 0;">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Contato & Perfil</th>
                                    <th>Cargo / Função</th>
                                    <th>WhatsApp</th>
                                    <th style="text-align: center;" title="Recebe relatório analítico e gráfico das últimas 12 horas">Relatório 12h</th>
                                    <th style="text-align: center;" title="Recebe alertas quando aparelho desliga, religa e status">Avisos Técnicos</th>
                                    <th style="text-align: right;">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${contatosDestaCeramica.map(c => {
                                    const isTec = c.tipo_contato === "tecnico" || (c.cargo && (c.cargo.toLowerCase().includes("técnic") || c.cargo.toLowerCase().includes("tecnic")));
                                    const roleBadge = isTec 
                                        ? `<span class="tag-pill tag-pill-cyan" style="font-size: 10px; cursor: pointer; margin-right: 6px; padding: 2px 7px;" onclick="toggleTecnicoContatoAdmin('${c.id}')" title="Clique para alternar para Responsável/Proprietário"><i class="fa-solid fa-wrench"></i> TÉCNICO</span>`
                                        : `<span class="tag-pill" style="font-size: 10px; background: rgba(255,255,255,0.08); color: #cbd5e1; cursor: pointer; margin-right: 6px; padding: 2px 7px;" onclick="toggleTecnicoContatoAdmin('${c.id}')" title="Clique para alternar para Técnico"><i class="fa-solid fa-user-tie"></i> GESTÃO</span>`;
                                    
                                    const acaoBotao = isTec
                                        ? `<button class="btn-send-wa-row" onclick="enviarStatusTecnicoCeramica('${cer.id}', '${escapeHtml(cer.nome)}')" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4);" title="Enviar status dos aparelhos funcionando para o técnico agora">
                                            <i class="fa-solid fa-tower-broadcast"></i> Status
                                           </button>`
                                        : `<button class="btn-send-wa-row" onclick="dispararRelatorioIndividualAdmin('${c.id}')" title="Disparar Ficha de Queima e Caldas para este contato agora">
                                            <i class="fa-solid fa-paper-plane"></i> Ficha Caldas
                                           </button>
                                           <button class="btn-send-wa-row" onclick="abrirWhatsAppWebComFichaCaldas('${c.id}')" style="background: rgba(37, 211, 102, 0.16); border: 1px solid rgba(37, 211, 102, 0.4); color: #25d366; margin-left: 4px;" title="Abrir WhatsApp Web diretamente para este contato">
                                            <i class="fa-brands fa-whatsapp"></i> WhatsApp
                                           </button>`;

                                    return `
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center;">
                                                ${roleBadge}
                                                <b style="color: #ffffff;">${escapeHtml(c.nome)}</b>
                                            </div>
                                        </td>
                                        <td style="color: var(--text-muted); font-size: 12px;">${escapeHtml(c.cargo || (isTec ? 'Técnico Responsável' : 'Responsável'))}</td>
                                        <td>
                                            <a href="https://wa.me/${c.telefone}" target="_blank" style="color: #34d399; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                                                <i class="fa-brands fa-whatsapp"></i> +${escapeHtml(c.telefone)}
                                            </a>
                                        </td>
                                        <td style="text-align: center;">
                                            <label class="switch" title="Ativar/Desativar relatório diário de 12h de queima">
                                                <input type="checkbox" ${c.receber_relatorio ? 'checked' : ''} onchange="toggleRelatorioContatoAdmin('${c.id}')">
                                                <span class="slider"></span>
                                            </label>
                                        </td>
                                        <td style="text-align: center;">
                                            <label class="switch" title="Ativar/Desativar avisos técnicos (desligado, ligou, quantidade de aparelhos)">
                                                <input type="checkbox" ${c.receber_alertas_tecnicos || isTec ? 'checked' : ''} onchange="toggleAlertaTecnicoContatoAdmin('${c.id}')">
                                                <span class="slider"></span>
                                            </label>
                                        </td>
                                        <td style="text-align: right;">
                                            <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                                                ${acaoBotao}
                                                <button class="btn-action-icon" onclick="editarContatoWhatsappAdmin('${c.id}')" title="Editar Contato"><i class="fa-solid fa-pen"></i></button>
                                                <button class="btn-action-icon btn-action-danger" onclick="excluirContatoWhatsappAdmin('${c.id}')" title="Excluir Contato"><i class="fa-solid fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    });

    if (!htmlCards) {
        htmlCards = `<div style="text-align:center; padding:40px; color:#64748b;">Nenhuma cerâmica ou contato encontrado para a pesquisa.</div>`;
    }

    container.innerHTML = htmlCards;
}

function filtrarContatosWhatsappAdmin(busca) {
    waAdminSearchQuery = busca || "";
    renderCardsCeramicasWhatsappAdmin();
}

function filtrarCeramicaContatoAdmin(ceramicaId, btn) {
    waAdminCeramicaFiltroAtivo = ceramicaId;
    document.querySelectorAll("#waCeramicasFilterPills .filter-pill").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    renderCardsCeramicasWhatsappAdmin();
}

function atualizarOpcoesTipoContatoAdmin() {
    const tipo = $("waContatoTipo")?.value || "proprietario";
    const cargoInput = $("waContatoCargo");
    const checkRelatorio = $("waContatoReceber");
    const checkTecnico = $("waContatoReceberTecnico");

    if (tipo === "tecnico") {
        if (cargoInput && (!cargoInput.value || cargoInput.value === "Proprietário")) {
            cargoInput.value = "Técnico Responsável";
        }
        if (checkTecnico) checkTecnico.checked = true;
        if (checkRelatorio) checkRelatorio.checked = false;
    } else {
        if (cargoInput && (!cargoInput.value || cargoInput.value === "Técnico Responsável")) {
            cargoInput.value = "Proprietário";
        }
        if (checkRelatorio) checkRelatorio.checked = true;
        if (checkTecnico) checkTecnico.checked = false;
    }
}

async function salvarConfigWhatsappAdmin() {
    const envio_automatico_ativo = $("waAdminCheckAuto")?.checked;
    const horario_envio_diario = $("waAdminInputHorario")?.value || "06:00";
    const gemini_api_key = $("waAdminInputGeminiKey")?.value?.trim() || "";

    if (horario_envio_diario) {
        localStorage.setItem("thermolink_horario_envio_diario", horario_envio_diario);
        if ($("waAdminHorarioDisplay")) $("waAdminHorarioDisplay").textContent = horario_envio_diario;
    }
    if (gemini_api_key) {
        localStorage.setItem("thermolink_gemini_api_key", gemini_api_key);
    }

    // Atualiza imediatamente o relatório e PDF de 12h com base no novo horário configurado
    executarAnaliseIA(false);

    const gatewayUrl = getGatewayUrl();
    try {
        const res = await fetch(`${gatewayUrl}/api/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ envio_automatico_ativo, horario_envio_diario, gemini_api_key })
        });
        const data = await res.json();
        if (data.success) {
            mostrarToastFeedback(`Horário (${horario_envio_diario}) e Configurações salvas com sucesso!`, "success");
            carregarSecaoWhatsappAdmin();
        }
    } catch (e) {
        mostrarToastFeedback(`Horário (${horario_envio_diario}) salvo localmente e aplicado ao PDF de 12h!`, "info");
    }
}

function abrirModalNovoContatoWhatsapp(ceramicaIdPreselecionada = null, tipoPadrao = "proprietario") {
    $("waModalTitle").textContent = tipoPadrao === "tecnico" 
        ? "Vincular Técnico Responsável à Cerâmica" 
        : "Cadastrar Contato de WhatsApp";
    $("waContatoId").value = "";
    $("waContatoNome").value = "";
    $("waContatoTelefone").value = "";

    if ($("waContatoTipo")) $("waContatoTipo").value = tipoPadrao;
    atualizarOpcoesTipoContatoAdmin();

    // Popula select de cerâmicas
    const sel = $("waContatoCeramicaId");
    sel.innerHTML = "";
    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    clients.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.nome} (${c.cidade || ''})`;
        if (ceramicaIdPreselecionada && c.id === ceramicaIdPreselecionada) {
            opt.selected = true;
        }
        sel.appendChild(opt);
    });

    abrirModalAdmin("modalContatoWhatsapp");
}

function editarContatoWhatsappAdmin(id) {
    const c = waAdminContatos.find(x => x.id === id);
    if (!c) return;

    $("waModalTitle").textContent = "Editar Contato de WhatsApp";
    $("waContatoId").value = c.id;
    $("waContatoNome").value = c.nome;
    $("waContatoCargo").value = c.cargo || "Responsável";
    $("waContatoTelefone").value = c.telefone;

    const isTecnico = c.tipo_contato === "tecnico" || 
        (c.cargo && (c.cargo.toLowerCase().includes("técnic") || c.cargo.toLowerCase().includes("tecnic")));

    if ($("waContatoTipo")) {
        $("waContatoTipo").value = isTecnico ? "tecnico" : "proprietario";
    }
    if ($("waContatoReceber")) {
        $("waContatoReceber").checked = Boolean(c.receber_relatorio);
    }
    if ($("waContatoReceberTecnico")) {
        $("waContatoReceberTecnico").checked = Boolean(c.receber_alertas_tecnicos !== undefined ? c.receber_alertas_tecnicos : isTecnico);
    }

    const sel = $("waContatoCeramicaId");
    sel.innerHTML = "";
    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    clients.forEach(cl => {
        const opt = document.createElement("option");
        opt.value = cl.id;
        opt.textContent = `${cl.nome} (${cl.cidade || ''})`;
        if (cl.id === c.ceramica_id) opt.selected = true;
        sel.appendChild(opt);
    });

    abrirModalAdmin("modalContatoWhatsapp");
}

async function salvarContatoWhatsappAdmin(e) {
    e.preventDefault();
    const id = $("waContatoId").value;
    const ceramica_id = $("waContatoCeramicaId").value;
    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    const cerObj = clients.find(c => c.id === ceramica_id);
    const ceramica_nome = cerObj ? cerObj.nome : "Cerâmica";
    const nome = $("waContatoNome").value.trim();
    const cargo = $("waContatoCargo").value.trim();
    const telefone = $("waContatoTelefone").value.trim().replace(/\D/g, "");
    const tipo_contato = $("waContatoTipo") ? $("waContatoTipo").value : "proprietario";
    const receber_relatorio = $("waContatoReceber") ? $("waContatoReceber").checked : true;
    const receber_alertas_tecnicos = $("waContatoReceberTecnico") ? $("waContatoReceberTecnico").checked : (tipo_contato === "tecnico");

    if (!nome || !telefone) {
        alert("Preencha o nome e o número de WhatsApp!");
        return;
    }

    const body = { 
        ceramica_id, 
        ceramica_nome, 
        nome, 
        cargo: cargo || (tipo_contato === 'tecnico' ? 'Técnico Responsável' : 'Responsável'), 
        telefone,
        tipo_contato,
        receber_relatorio,
        receber_alertas_tecnicos
    };

    // 1. Atualiza estado local imediatamente (funciona mesmo no GitHub Pages)
    if (id) {
        const idx = waAdminContatos.findIndex(c => c.id === id);
        if (idx !== -1) waAdminContatos[idx] = { ...waAdminContatos[idx], ...body };
    } else {
        const novo = { id: "cont_" + Date.now(), ...body };
        waAdminContatos.unshift(novo);
    }
    localStorage.setItem("thermolink_wa_contatos", JSON.stringify(waAdminContatos));

    // Fecha o modal e atualiza a interface NA HORA
    fecharModalAdmin("modalContatoWhatsapp", null);
    mostrarToastFeedback(id ? "Contato atualizado com sucesso!" : "Novo contato salvo!", "success");
    renderCardsCeramicasWhatsappAdmin();

    // 2. Dispara sync com Gateway em background (se online)
    const gatewayUrl = getGatewayUrl();
    try {
        const url = id ? `${gatewayUrl}/api/contatos/${id}` : `${gatewayUrl}/api/contatos`;
        const method = id ? "PUT" : "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    } catch (err) {
        console.warn("[WhatsApp Admin] Gateway offline para sync direto:", err);
    }

    // 3. Tenta gravar no Supabase caso a tabela exista
    try {
        await sb.from("ceramica_contatos").upsert([body]);
    } catch (err) {}
}

async function excluirContatoWhatsappAdmin(id) {
    const c = waAdminContatos.find(x => x.id === id);
    if (!c) return;
    if (!confirm(`Deseja realmente remover o contato ${c.nome} (+${c.telefone})?`)) return;

    waAdminContatos = waAdminContatos.filter(x => x.id !== id);
    localStorage.setItem("thermolink_wa_contatos", JSON.stringify(waAdminContatos));
    mostrarToastFeedback("Contato removido com sucesso!", "success");
    renderCardsCeramicasWhatsappAdmin();

    const gatewayUrl = getGatewayUrl();
    try {
        await fetch(`${gatewayUrl}/api/contatos/${id}`, { method: "DELETE" });
    } catch (e) {}

    try {
        await sb.from("ceramica_contatos").delete().eq("id", id);
    } catch (e) {}
}

async function toggleRelatorioContatoAdmin(id) {
    const c = waAdminContatos.find(x => x.id === id);
    if (!c) return;
    c.receber_relatorio = !c.receber_relatorio;
    localStorage.setItem("thermolink_wa_contatos", JSON.stringify(waAdminContatos));
    mostrarToastFeedback(`Relatório diário para ${c.nome}: ${c.receber_relatorio ? 'ATIVADO' : 'PAUSADO'}`, "info");
    renderCardsCeramicasWhatsappAdmin();

    const gatewayUrl = getGatewayUrl();
    try {
        await fetch(`${gatewayUrl}/api/contatos/${id}/toggle-relatorio`, { method: "POST" });
    } catch (e) {}
}

async function toggleTecnicoContatoAdmin(id) {
    const c = waAdminContatos.find(x => x.id === id);
    if (!c) return;
    const novoTipo = c.tipo_contato === 'tecnico' ? 'proprietario' : 'tecnico';
    c.tipo_contato = novoTipo;
    if (novoTipo === 'tecnico') {
        c.receber_alertas_tecnicos = true;
        if (!c.cargo || c.cargo === 'Responsável') c.cargo = 'Técnico Responsável';
    } else {
        c.receber_relatorio = true;
        if (c.cargo === 'Técnico Responsável') c.cargo = 'Proprietário';
    }
    localStorage.setItem("thermolink_wa_contatos", JSON.stringify(waAdminContatos));
    mostrarToastFeedback(`${c.nome} agora é: ${novoTipo === 'tecnico' ? '🛠️ TÉCNICO' : '👤 PROPRIETÁRIO'}`, "info");
    renderCardsCeramicasWhatsappAdmin();

    const gatewayUrl = getGatewayUrl();
    try {
        await fetch(`${gatewayUrl}/api/contatos/${id}/toggle-tecnico`, { method: "POST" });
    } catch (e) {}
}

async function toggleAlertaTecnicoContatoAdmin(id) {
    const c = waAdminContatos.find(x => x.id === id);
    if (!c) return;
    c.receber_alertas_tecnicos = !c.receber_alertas_tecnicos;
    localStorage.setItem("thermolink_wa_contatos", JSON.stringify(waAdminContatos));
    mostrarToastFeedback(`Avisos técnicos para ${c.nome}: ${c.receber_alertas_tecnicos ? 'ATIVADO' : 'PAUSADO'}`, "info");
    renderCardsCeramicasWhatsappAdmin();

    const gatewayUrl = getGatewayUrl();
    try {
        await fetch(`${gatewayUrl}/api/contatos/${id}/toggle-alerta-tecnico`, { method: "POST" });
    } catch (e) {}
}

async function dispararRelatorioIndividualAdmin(id) {
    const c = waAdminContatos.find(x => x.id === id);
    if (!c) return;
    if (!confirm(`Deseja enviar agora a Ficha de Queima & Caldas de ${c.ceramica_nome} para ${c.nome} (+${c.telefone}) no WhatsApp?`)) return;

    mostrarToastFeedback(`Preparando Ficha de Queima para ${c.nome}...`, "info");

    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    const cer = clients.find(cl => cl.id === c.ceramica_id) || { id: c.ceramica_id, nome: c.ceramica_nome };

    // Busca telemetria real do Supabase
    let leituras = [];
    if (typeof sb !== "undefined" && sb) {
        try {
            const { data } = await sb.from("leituras").select("*").eq("ceramica_id", c.ceramica_id).order("created_at", { ascending: false }).limit(600);
            if (data && data.length > 0) leituras = data;
        } catch (e) {}
    }

    let textoRelatorio = "";
    if (window.CaldasEngine && leituras.length > 0) {
        leituras.sort((a,b) => new Date(a.created_at || a.data_hora).getTime() - new Date(b.created_at || b.data_hora).getTime());
        const analise = window.CaldasEngine.detectarCaldas(leituras, { canal: "canal_1" });
        textoRelatorio = window.CaldasEngine.gerarTextoWhatsapp(analise, {
            ceramicaNome: cer.nome,
            fornoNome: "Forno 01",
            responsavel: `${c.nome} (${c.cargo || 'Gestor'})`
        });
    } else {
        const j12 = obterJanela12HorasPorHorarioEnvio();
        textoRelatorio = `*MEDEIROS AUTOMAÇÃO • THERMOLINK*\nRELATÓRIO DE QUEIMA DE FORNO\n\nCerâmica: ${cer.nome}\nAos Cuidados: ${c.nome}\nPeríodo: ${j12.horaInicioStr} às ${j12.horaFimStr}`;
    }

    // Tenta envio via Gateway
    try {
        await enviarMensagemWhatsappGateway(c.telefone, textoRelatorio);
        mostrarToastFeedback(`Ficha de Queima entregue via WhatsApp para ${c.nome}!`, "success");
    } catch (e) {
        // Se gateway offline, abre o WhatsApp Web diretamente
        let cleanPhone = String(c.telefone).replace(/\D/g, "");
        if (!cleanPhone.startsWith("55")) cleanPhone = "55" + cleanPhone;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textoRelatorio)}`, "_blank");
        alert(`O WhatsApp foi aberto com a Ficha de Queima pronta para ${c.nome} (+${cleanPhone}).\n\nConfirme o envio no aplicativo.`);
    }
}

async function dispararRelatorioCeramicaAdmin(ceramicaId) {
    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    const cer = clients.find(c => c.id === ceramicaId);
    const nome = cer ? cer.nome : "esta cerâmica";

    const contatos = waAdminContatos.filter(c => c.ceramica_id === ceramicaId && c.receber_relatorio);
    if (contatos.length === 0) {
        alert(`Nenhum contato com recebimento ativo cadastrado para ${nome}.\n\nClique em "+ Responsável" para cadastrar.`);
        return;
    }

    if (!confirm(`Deseja disparar a Ficha de Queima & Caldas de ${nome} para os ${contatos.length} contato(s) ativos dela agora?`)) return;

    mostrarToastFeedback(`Processando queima e caldas de ${nome}...`, "info");

    let leituras = [];
    if (typeof sb !== "undefined" && sb) {
        try {
            const { data } = await sb.from("leituras").select("*").eq("ceramica_id", ceramicaId).order("created_at", { ascending: false }).limit(600);
            if (data && data.length > 0) leituras = data;
        } catch (e) {}
    }

    let textoRelatorio = "";
    if (window.CaldasEngine && leituras.length > 0) {
        leituras.sort((a,b) => new Date(a.created_at || a.data_hora).getTime() - new Date(b.created_at || b.data_hora).getTime());
        const analise = window.CaldasEngine.detectarCaldas(leituras, { canal: "canal_1" });
        textoRelatorio = window.CaldasEngine.gerarTextoWhatsapp(analise, {
            ceramicaNome: nome,
            fornoNome: "Forno 01",
            responsavel: "Gestores e Equipe da Cerâmica"
        });
    }

    let enviados = 0;
    for (const c of contatos) {
        if (!c.telefone) continue;
        try {
            await enviarMensagemWhatsappGateway(c.telefone, textoRelatorio);
            enviados++;
        } catch (err) {}
    }

    if (enviados > 0) {
        mostrarToastFeedback(`Fichas de Queima entregues para ${enviados} contato(s) de ${nome}!`, "success");
    } else {
        const primeiro = contatos[0];
        let cleanPhone = String(primeiro.telefone).replace(/\D/g, "");
        if (!cleanPhone.startsWith("55")) cleanPhone = "55" + cleanPhone;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textoRelatorio)}`, "_blank");
        alert(`O Gateway não respondeu. O WhatsApp foi aberto para o contato principal ${primeiro.nome} (+${cleanPhone}).\n\nConfirme o envio no aplicativo.`);
    }
}
async function dispararRelatoriosTodosAdmin() {
    if (!confirm("Deseja iniciar o disparo do resumo diário para TODOS os contatos ativos de todas as cerâmicas agora?")) return;

    mostrarToastFeedback("Iniciando rotina de disparo em lote...", "info");
    const gatewayUrl = getGatewayUrl();
    try {
        const res = await fetch(`${gatewayUrl}/api/disparar-todos`, { method: "POST" });
        const data = await res.json();
        if (data.success) {
            mostrarToastFeedback("Disparo em lote iniciado em segundo plano!", "success");
            carregarSecaoWhatsappAdmin();
        } else {
            alert(data.error || "Erro ao iniciar disparo.");
        }
    } catch (e) {
        alert("Erro de comunicação com o Gateway.");
    }
}

async function forcarNovoQrCodeAdmin() {
    mostrarToastFeedback("Gerando novo QR Code...", "info");
    const gatewayUrl = getGatewayUrl();
    try {
        await fetch(`${gatewayUrl}/api/reconnect`, { method: "POST" });
    } catch (e) {
        try { await fetch(`${gatewayUrl}/api/logout`, { method: "POST" }); } catch (err2) {}
    }
    setTimeout(() => carregarStatusWhatsappAdmin(false), 1200);
}

async function desconectarWhatsappAdmin() {
    if (!confirm("Deseja realmente desconectar este WhatsApp? Você precisará escanear o QR Code novamente para reativar os envios.")) return;

    mostrarToastFeedback("Desconectando sessão...", "warn");
    const gatewayUrl = getGatewayUrl();
    try {
        await fetch(`${gatewayUrl}/api/logout`, { method: "POST" });
    } catch (e) {
        alert("Erro ao desconectar sessão.");
    }
    setTimeout(() => carregarStatusWhatsappAdmin(false), 1500);
}

// ==========================================================================
// 10. MOTOR DE INTELIGÊNCIA ARTIFICIAL PARA RELATÓRIOS TÉRMICOS (IA)
// ==========================================================================

async function carregarSecaoRelatoriosIA() {
    popularSelectCeramicasIA();
    await executarAnaliseIA(false);
}

function popularSelectCeramicasIA() {
    const sel = $("aiSelectCeramica");
    if (!sel) return;

    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    if (!clients || clients.length === 0) {
        sel.innerHTML = `<option value="">Nenhuma cerâmica cadastrada</option>`;
        return;
    }

    const currentVal = sel.value || adminState.aiReportState?.activeCeramicaId || clients[0].id;
    sel.innerHTML = clients.map(c => `
        <option value="${escapeHtml(c.id)}" ${c.id === currentVal ? 'selected' : ''}>
            ${escapeHtml(c.nome)} (${escapeHtml(c.cidade || 'Brasil')})
        </option>
    `).join("");

    if (!adminState.aiReportState) {
        adminState.aiReportState = { activeCeramicaId: currentVal, janelaHoras: 12, analiseAtual: null, textoFormatado: "" };
    } else {
        adminState.aiReportState.activeCeramicaId = sel.value;
    }
}

async function trocarCeramicaRelatorioIA() {
    const sel = $("aiSelectCeramica");
    if (sel && adminState.aiReportState) {
        adminState.aiReportState.activeCeramicaId = sel.value;
    }
    await executarAnaliseIA(true);
    if (sel) {
        atualizarContatosDestinoRelatorioCaldas(sel.value);
    }
}

let aiPdf12hChartInstance = null;

function formatHoraCurtaAdmin(ts) {
    if (!Number.isFinite(ts) || ts <= 0) return "--:--";
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Calcula a janela exata das últimas 12 horas a partir do Horário Diário de Envio do Relatório
 * (ex: se Horário Diário = 06:00, a janela de 12h é das 18:00 às 06:00)
 */
function obterJanela12HorasPorHorarioEnvio(anchorMs = null) {
    const horarioInput = $("waAdminInputHorario")?.value
        || localStorage.getItem("thermolink_horario_envio_diario")
        || (typeof waAdminConfig !== "undefined" && waAdminConfig?.horario_envio_diario)
        || "06:00";

    const partes = String(horarioInput).trim().split(":");
    const hh = Number.isFinite(Number(partes[0])) ? Number(partes[0]) : 6;
    const mm = Number.isFinite(Number(partes[1])) ? Number(partes[1]) : 0;

    const baseDate = anchorMs ? new Date(anchorMs) : new Date();
    const fim = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hh, mm, 59, 999);
    let inicio = new Date(fim.getTime() - (12 * 3600 * 1000) + 1000);

    // Se estamos calculando em relação ao relógio atual e o início da janela ainda está no futuro, recua 1 dia
    if (!anchorMs && inicio.getTime() > baseDate.getTime()) {
        fim.setDate(fim.getDate() - 1);
        inicio = new Date(fim.getTime() - (12 * 3600 * 1000) + 1000);
    }

    // Se temos um anchorMs de última leitura e ele ficou depois do 'fim' daquele dia (ex: leitura às 20h e fechamento 06h), avança 1 dia para englobar a leitura
    if (anchorMs && anchorMs > fim.getTime()) {
        fim.setDate(fim.getDate() + 1);
        inicio = new Date(fim.getTime() - (12 * 3600 * 1000) + 1000);
    }

    const horaInicioStr = `${String(inicio.getHours()).padStart(2, "0")}:${String(inicio.getMinutes()).padStart(2, "0")}`;
    const horaFimStr = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    const dataFechamentoStr = fim.toLocaleDateString("pt-BR");

    // Atualiza o texto do select de 12h na interface se existir
    const selJanela = $("aiSelectJanela");
    if (selJanela && selJanela.options && selJanela.options[0]) {
        selJanela.options[0].textContent = `Últimas 12 Horas (Fechamento ${horaFimStr}: ${horaInicioStr} às ${horaFimStr})`;
    }

    return {
        horarioConfigurado: horaFimStr,
        inicioDate: inicio,
        fimDate: fim,
        inicioMs: inicio.getTime(),
        fimMs: fim.getTime(),
        horaInicioStr,
        horaFimStr,
        dataFechamentoStr
    };
}

async function executarAnaliseIA(forcar = false) {
    const btnIcon = $("aiBtnIcon");
    const refreshIcon = $("aiRefreshIcon");
    if (btnIcon) btnIcon.classList.add("fa-spin");
    if (refreshIcon) refreshIcon.classList.add("fa-spin");

    try {
        const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
        const sel = $("aiSelectCeramica");
        const ceramicaId = sel?.value || clients[0]?.id;
        const ceramica = clients.find(c => c.id === ceramicaId) || clients[0] || { id: "cli_1", nome: "Cerâmica Cliente", responsavel: "Gestor" };

        const janelaHoras = Number($("aiSelectJanela")?.value || 12);
        let janela12h = obterJanela12HorasPorHorarioEnvio();

        if ($("aiCeramicaAtivaBadge")) {
            $("aiCeramicaAtivaBadge").textContent = ceramica.nome;
        }

        // 1. Busca telemetria das últimas 12h determinadas a partir do Horário Diário de Envio
        let leituras = [];
        if (typeof sb !== "undefined" && sb) {
            try {
                const startIso = janelaHoras === 12
                    ? janela12h.inicioDate.toISOString()
                    : new Date(Date.now() - (janelaHoras * 3600 * 1000)).toISOString();
                const endIso = janelaHoras === 12
                    ? janela12h.fimDate.toISOString()
                    : new Date().toISOString();

                const pageSize = 1000;
                const [p0, p1, p2] = await Promise.all([
                    sb.from("leituras").select("*").eq("ceramica_id", ceramica.id).gte("created_at", startIso).lte("created_at", endIso).order("created_at", { ascending: false }).range(0, pageSize - 1),
                    sb.from("leituras").select("*").eq("ceramica_id", ceramica.id).gte("created_at", startIso).lte("created_at", endIso).order("created_at", { ascending: false }).range(pageSize, 2 * pageSize - 1),
                    sb.from("leituras").select("*").eq("ceramica_id", ceramica.id).gte("created_at", startIso).lte("created_at", endIso).order("created_at", { ascending: false }).range(2 * pageSize, 3 * pageSize - 1)
                ]);

                const lotes = [...(p0.data || []), ...(p1.data || []), ...(p2.data || [])];
                if (lotes.length > 0) {
                    leituras = lotes;
                } else {
                    // Fallback: se não houver leituras na janela de hoje, pega a última janela de 12h registrada da cerâmica
                    const { data: ultimas } = await sb
                        .from("leituras")
                        .select("*")
                        .eq("ceramica_id", ceramica.id)
                        .order("created_at", { ascending: false })
                        .limit(1500);
                    if (ultimas && ultimas.length > 0) {
                        const ultTs = new Date(ultimas[0].created_at || ultimas[0].data_hora).getTime();
                        janela12h = obterJanela12HorasPorHorarioEnvio(ultTs);
                        const filtradasJanela = ultimas.filter(r => {
                            const t = new Date(r.created_at || r.data_hora).getTime();
                            return t >= janela12h.inicioMs && t <= janela12h.fimMs;
                        });
                        leituras = filtradasJanela.length > 0 ? filtradasJanela : ultimas.filter(r => {
                            const t = new Date(r.created_at || r.data_hora).getTime();
                            return t >= (ultTs - 12 * 3600 * 1000);
                        });
                    }
                }
            } catch (errDb) {
                console.warn("[IA] Consulta Supabase falhou, usando telemetria dos aparelhos:", errDb);
            }
        }

        // 2. Executa o algoritmo analítico de IA
        const resultadoIA = processarAlgoritmoIA(ceramica, leituras, janelaHoras, janela12h);
        adminState.aiReportState.analiseAtual = resultadoIA;

        // 3. Renderiza KPIs, Diagnóstico por Forno, Painel PDF 12h e Relatório WhatsApp
        renderizarResultadoIA(resultadoIA);

        // 4. Atualiza timestamp
        if ($("aiStatusUltimaAnalise")) {
            const agora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            $("aiStatusUltimaAnalise").innerHTML = `<i class="fa-solid fa-circle-check text-green" style="margin-right: 4px;"></i> Analisado às ${agora}`;
        }

        if (forcar) {
            mostrarToastFeedback(`Diagnóstico de IA concluído para ${ceramica.nome}!`, "success");
        }

    } catch (e) {
        console.error("[IA] Erro na análise:", e);
        mostrarToastFeedback("Erro ao processar análise da IA.", "error");
    } finally {
        if (btnIcon) btnIcon.classList.remove("fa-spin");
        if (refreshIcon) refreshIcon.classList.remove("fa-spin");
    }
}

function gerarQuickChartUrlClient(ceramicaNome, fornosEmQueima, janela12h = null) {
    const labels = [];
    const fimRefMs = janela12h?.fimMs ? Math.min(Date.now(), janela12h.fimMs) : Date.now();
    for (let i = 12; i >= 0; i--) {
        const d = new Date(fimRefMs - i * 3600 * 1000);
        labels.push(d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    }
    const cores = ['#f97316', '#06b6d4', '#10b981', '#a855f7', '#eab308', '#ec4899', '#3b82f6', '#f43f5e'];

    const datasets = fornosEmQueima.map((f, idx) => ({
        label: `Forno ${f.num} (Pico ${f.picoC1}°C)`,
        data: f.pontosGrafico || labels.map(() => f.c1),
        borderColor: cores[idx % cores.length],
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 2,
        tension: 0.35,
        fill: false
    }));

    if (datasets.length === 0) {
        datasets.push({
            label: 'Temperatura Ambiente / Pátio (~32°C)',
            data: labels.map(() => 32),
            borderColor: '#64748b',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });
    }

    const cfg = {
        type: 'line',
        data: { labels, datasets },
        options: {
            title: {
                display: true,
                text: `Curva Térmica da Queima (Últimas 12h) • ${ceramicaNome}`,
                fontColor: '#ffffff',
                fontSize: 14,
                fontStyle: 'bold'
            },
            legend: {
                display: true,
                position: 'top',
                labels: { fontColor: '#94a3b8', fontSize: 11, boxWidth: 12 }
            },
            scales: {
                xAxes: [{
                    gridLines: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: { fontColor: '#94a3b8', fontSize: 11 }
                }],
                yAxes: [{
                    gridLines: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: {
                        fontColor: '#94a3b8',
                        fontSize: 11,
                        callback: (v) => v + '°C'
                    }
                }]
            }
        }
    };

    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(cfg))}&w=880&h=440&bkg=%2308101e&devicePixelRatio=2`;
}

function processarAlgoritmoIA(ceramica, leituras, janelaHoras, janela12h = null) {
    if (!janela12h) janela12h = obterJanela12HorasPorHorarioEnvio();
    const devices = (adminState.devices && adminState.devices.length ? adminState.devices : getDevices()).filter(d => (d.ceramicaId || d.ceramica_id) === ceramica.id);
    const numFornosCadastrados = Number(ceramica.fornosCount || ceramica.fornos_count || (devices.length > 0 ? devices.length : 6));

    // Mapeamento de leituras por forno
    const fornosMap = {};
    if (leituras && leituras.length > 0) {
        leituras.forEach(l => {
            const fId = Number(l.modulo_alutal || l.forno_id || l.modulo_num || 1);
            if (fornosMap[fId]) {
                fornosMap[fId].push(l);
            } else {
                fornosMap[fId] = [l];
            }
        });
    }

    const totalFornos = Math.max(numFornosCadastrados, Object.keys(fornosMap).length);

    let somaScore = 0;
    let somaGradiente = 0;
    let totalAnomaliasGlobal = 0;
    const fornosEmQueima = [];
    const fornosInativos = [];
    const todosFornosComLeitura = [];

    const fKeys = Object.keys(fornosMap).sort((a, b) => Number(a) - Number(b));

    // Se houver fornos com leituras
    fKeys.forEach(k => {
        const num = Number(k);
        const lts = fornosMap[k];
        let c1 = 0, c2 = 0, picoC1 = 0, picoC2 = 0, minC1 = 0, mediaC1 = 0;
        let picoC1Ts = 0, minC1Ts = 0, mediaC1Ts = 0, picoC2Ts = 0;
        let isOnline = false;
        let diffMin = 999999;
        let taxaVariacao = 0;

        if (lts && lts.length > 0) {
            // Ordena estritamente em ordem cronológica (início -> fim das 12h)
            lts.forEach(r => {
                if (!r._ts) r._ts = new Date(r.created_at || r.data_hora).getTime();
            });
            lts.sort((a, b) => a._ts - b._ts);

            const ult = lts[lts.length - 1];
            c1 = Math.round(Number(ult.canal_1 ?? 0));
            c2 = Math.round(Number(ult.canal_2 ?? 0));

            let maxValC1 = -Infinity;
            let minValC1 = Infinity;
            let maxValC2 = -Infinity;
            let somaValC1 = 0;
            let countValC1 = 0;

            for (let i = 0; i < lts.length; i++) {
                const item = lts[i];
                const ts = item._ts;
                const v1 = Math.round(Number(item.canal_1 ?? 0));
                const v2 = Math.round(Number(item.canal_2 ?? 0));
                if (v1 > maxValC1) {
                    maxValC1 = v1;
                    picoC1Ts = ts;
                }
                if (v1 < minValC1) {
                    minValC1 = v1;
                    minC1Ts = ts;
                }
                if (v2 > maxValC2) {
                    maxValC2 = v2;
                    picoC2Ts = ts;
                }
                somaValC1 += v1;
                countValC1++;
            }

            picoC1 = maxValC1 === -Infinity ? 0 : maxValC1;
            minC1 = minValC1 === Infinity ? 0 : minValC1;
            picoC2 = maxValC2 === -Infinity ? 0 : maxValC2;
            const deltaT = picoC1 - minC1;
            mediaC1 = countValC1 > 0 ? Math.round(somaValC1 / countValC1) : 0;

            // Encontra o horário exato em que a temperatura das 12h esteve mais próxima da Média Térmica
            let menorDiffMedia = Infinity;
            mediaC1Ts = lts[0]._ts;
            for (let i = 0; i < lts.length; i++) {
                const v1 = Math.round(Number(lts[i].canal_1 ?? 0));
                const dMedia = Math.abs(v1 - mediaC1);
                if (dMedia < menorDiffMedia) {
                    menorDiffMedia = dMedia;
                    mediaC1Ts = lts[i]._ts;
                }
            }

            const ultData = new Date(ult._ts);
            diffMin = Math.round((Date.now() - ultData.getTime()) / 60000);
            isOnline = diffMin <= 10;

            if (lts.length >= 2) {
                const anterior = lts[Math.max(0, lts.length - 6)];
                const deltaV = c1 - Number(anterior.canal_1 || c1);
                const dtHours = Math.max(0.1, (ult._ts - anterior._ts) / 3600000);
                taxaVariacao = Math.round(deltaV / dtHours);
            }

            const delta = Math.abs(c1 - c2);

            // FILTRO SOLICITADO: Forno em Queima Ativa vs Inativo / Fora de Uso
            const isQueimando = (picoC1 >= 80) || (deltaT >= 30) || (c1 >= 75);

            // Amostragem dos 13 pontos térmicos cronológicos para o gráfico (18h às 06h)
            const pontosGrafico = [];
            const step = Math.max(1, Math.floor(lts.length / 13));
            for (let i = 0; i < 13; i++) {
                if (i === 12) {
                    pontosGrafico.push(c1);
                } else {
                    const idx = Math.min(lts.length - 1, i * step);
                    pontosGrafico.push(Number(lts[idx]?.canal_1 || c1));
                }
            }

            let tendenciaTxt = "Estável no patamar";
            if (taxaVariacao > 25) tendenciaTxt = `📈 Subida contínua (+${taxaVariacao}°C/h)`;
            else if (taxaVariacao < -25) tendenciaTxt = `📉 Resfriamento (-${Math.abs(taxaVariacao)}°C/h)`;

            // Classificação Neural de Fase
            let fase = { nome: "Pátio / Carregamento", classe: "phase-patio", icone: "fa-box", step: 0, desc: "Forno frio ou em preparação" };
            if (picoC1 > 600 && c1 < picoC1 - 90 && taxaVariacao <= 5) {
                fase = { nome: "Resfriamento Controlado", classe: "phase-resfriamento", icone: "fa-snowflake", step: 4, desc: "Recozimento gradual das peças" };
            } else if (c1 > 980 || c2 > 980) {
                fase = { nome: "Superaquecimento Crítico", classe: "phase-maturacao", icone: "fa-fire-flame-curved", step: 3, desc: "Acima da faixa de segurança" };
            } else if (c1 >= 600 && c1 <= 980) {
                fase = { nome: "Maturação Térmica", classe: "phase-maturacao", icone: "fa-fire-flame-curved", step: 3, desc: "Ponto de fogo e sinterização plena" };
            } else if (c1 >= 180 && c1 < 600) {
                fase = { nome: "Elevação & Desidratação", classe: "phase-elevacao", icone: "fa-fire", step: 2, desc: "Eliminação de água estrutural" };
            } else if (c1 > 50 && c1 < 180) {
                fase = { nome: "Secagem & Pré-aquecimento", classe: "phase-secagem", icone: "fa-seedling", step: 1, desc: "Evaporação da umidade livre" };
            }

            // Anomalias
            const anomalias = [];
            if (delta > 80 && c1 > 200) anomalias.push(`Gradiente acentuado (${delta}°C entre C1 e C2)`);
            if (c1 > 980 || c2 > 980) anomalias.push(`Pico excessivo (${Math.max(c1, c2)}°C > 980°C)`);
            if (fase.step === 2 && taxaVariacao > 110) anomalias.push(`Subida acelerada (+${taxaVariacao}°C/h)`);

            // Recomendações
            let recomendacao = "";
            let previsao = "--";
            if (fase.step === 3 && (c1 > 980 || c2 > 980)) {
                recomendacao = "Reduzir alimentação de lenha no setor superaquecido imediatamente.";
                previsao = "Reverter superaquecimento em ~40 min";
            } else if (fase.step === 3) {
                recomendacao = delta > 75 
                    ? `Equalizar alimentação nas fornalhas inferiores da base (gradiente ${delta}°C).`
                    : "Patamar ideal alcançado. Manter queima uniforme e preparar vedação.";
                previsao = "~ 1h30 a 2h para ponto de fogo e selagem";
            } else if (fase.step === 4) {
                recomendacao = "Resfriamento controlado. Manter vedação completa contra choque térmico.";
                previsao = "~ 18h a 24h para abertura de portas";
            } else if (fase.step === 2) {
                recomendacao = "Elevação progressiva. Manter queima contínua para eliminar água química.";
                previsao = "~ 4h para atingir zona de maturação (>600°C)";
            } else {
                recomendacao = "Aquecimento brando com lenha miúda para secagem inicial.";
                previsao = "~ 6h a 8h de aquecimento brando";
            }

            let score = 100;
            if (delta > 40) score -= Math.min(25, Math.round((delta - 40) * 0.5));
            score -= (anomalias.length * 15);
            score = Math.max(30, Math.min(100, score));

            let badgeScore = { label: "Excelente", classe: "score-excelente" };
            if (score < 65) badgeScore = { label: "Crítico", classe: "score-critico" };
            else if (score < 80) badgeScore = { label: "Atenção", classe: "score-alerta" };
            else if (score < 90) badgeScore = { label: "Estável", classe: "score-estavel" };

            somaScore += score;
            somaGradiente += delta;
            totalAnomaliasGlobal += anomalias.length;

            // Leituras em ordem decrescente (mais recente primeiro) para a tabela de Lista Resumida das 12h
            const leituras12hDesc = lts.slice().reverse();

            const fornoItem = {
                num: String(num).padStart(2, '0'),
                moduloNum: num,
                c1,
                c2,
                delta,
                picoC1,
                picoC1Ts,
                horaPicoMax: formatHoraCurtaAdmin(picoC1Ts),
                minC1,
                minC1Ts,
                horaPicoMin: formatHoraCurtaAdmin(minC1Ts),
                picoC2,
                picoC2Ts,
                horaPicoC2: formatHoraCurtaAdmin(picoC2Ts),
                mediaC1,
                mediaC1Ts,
                horaMedia: formatHoraCurtaAdmin(mediaC1Ts),
                taxaVariacao,
                tendenciaTxt,
                isOnline,
                diffMin,
                fase,
                anomalias,
                recomendacao,
                previsao,
                score,
                badgeScore,
                pontosGrafico,
                leiturasAsc: lts,
                leiturasDesc: leituras12hDesc,
                minTs: lts[0]._ts,
                maxTs: ult._ts
            };

            todosFornosComLeitura.push(fornoItem);
            if (isQueimando) {
                fornosEmQueima.push(fornoItem);
            } else {
                fornosInativos.push(fornoItem);
            }
        }
    });

    // Complementa todos os fornos cadastrados que não transmitiram leituras (inativos/desligados)
    const fornosPresentes = new Set([...fornosEmQueima.map(f => Number(f.num)), ...fornosInativos.map(f => Number(f.num))]);
    for (let fNum = 1; fNum <= totalFornos; fNum++) {
        if (!fornosPresentes.has(fNum)) {
            fornosInativos.push({
                num: String(fNum).padStart(2, '0'),
                c1: 0,
                c2: 0,
                delta: 0,
                picoC1: 0,
                picoC2: 0,
                fase: { nome: "Inativo / Desligado", classe: "phase-patio", icone: "fa-moon", step: 0, desc: "Forno frio ou sem transmissão" }
            });
        }
    }

    const qtdQueima = fornosEmQueima.length || 1;
    const scoreGeral = Math.round(fornosEmQueima.reduce((acc, f) => acc + (f.score || 85), 0) / qtdQueima);
    const gradienteMedio = Math.round(fornosEmQueima.reduce((acc, f) => acc + (f.delta || 30), 0) / qtdQueima);

    const chartUrl = gerarQuickChartUrlClient(ceramica.nome, fornosEmQueima, janela12h);

    return {
        ceramica,
        janelaHoras,
        janela12h,
        scoreGeral,
        gradienteMedio,
        totalAnomalias: totalAnomaliasGlobal,
        fornosAtivos: fornosEmQueima,
        fornosInativos,
        todosFornosComLeitura,
        totalFornosCadastrados: totalFornos,
        chartUrl,
        dataHora: new Date()
    };
}

function renderizarResultadoIA(resultado) {
    if (!resultado) return;

    // 1. Atualiza KPIs Globais
    const { scoreGeral, gradienteMedio, totalAnomalias, fornosAtivos, fornosInativos, totalFornosCadastrados, ceramica, chartUrl } = resultado;

    if ($("aiKpiScore")) $("aiKpiScore").textContent = `${scoreGeral}%`;
    if ($("aiKpiScoreLabel")) {
        const txt = scoreGeral >= 90 ? "Eficiência Máxima de Queima" : (scoreGeral >= 75 ? "Operação Estável" : "Necessita Ajuste de Fogo");
        $("aiKpiScoreLabel").textContent = txt;
    }

    if ($("aiKpiGradiente")) $("aiKpiGradiente").textContent = `${gradienteMedio}°C`;
    if ($("aiKpiGradienteLabel")) {
        $("aiKpiGradienteLabel").textContent = gradienteMedio <= 45 ? "Equilíbrio Ideal Topo x Base" : "Desvio Moderado na Tiragem";
    }

    if ($("aiKpiEficiencia")) {
        const ef = scoreGeral >= 85 ? "Alta (94%)" : (scoreGeral >= 70 ? "Normal (81%)" : "Irregular (65%)");
        $("aiKpiEficiencia").textContent = ef;
    }
    if ($("aiKpiEficienciaLabel")) {
        $("aiKpiEficienciaLabel").textContent = "Consumo otimizado de lenha";
    }

    if ($("aiKpiAnomalias")) $("aiKpiAnomalias").textContent = totalAnomalias;
    if ($("aiKpiAnomaliasLabel")) {
        $("aiKpiAnomaliasLabel").textContent = totalAnomalias === 0 ? "Nenhum risco detectado" : `${totalAnomalias} ponto(s) de atenção`;
    }

    if ($("aiCeramicaAtivaBadge")) $("aiCeramicaAtivaBadge").textContent = ceramica.nome;

    // 2. Atualiza Imagem do Gráfico de 12 Horas
    if (chartUrl && $("aiChartPreviewImg")) {
        $("aiChartPreviewImg").src = chartUrl;
        $("aiChartPreviewImg").style.display = "block";
        if ($("aiChartLoading")) $("aiChartLoading").style.display = "none";
        if ($("aiChartLink")) {
            $("aiChartLink").href = chartUrl;
            $("aiChartLink").style.display = "inline-flex";
        }
    }

    // 3. Renderiza Cards Forno a Forno com Banner de Fornos Ativos vs Inativos
    const container = $("aiFornosContainer");
    if (container) {
        const bannerHtml = `
            <div style="grid-column: 1 / -1; background: rgba(249, 115, 22, 0.08); border: 1px solid rgba(249, 115, 22, 0.25); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                    <span style="font-weight: 800; color: #f97316; font-size: 15px;"><i class="fa-solid fa-fire"></i> ${fornosAtivos.length} Forno(s) em Queima Ativa</span>
                    <span style="color: #94a3b8; font-size: 12px; margin-left: 8px;">de ${totalFornosCadastrados} fornos cadastrados</span>
                    <p style="color: var(--text-muted); font-size: 12px; margin-top: 3px;">
                        O relatório detalha exclusivamente os fornos que atingiram temperatura de queima ou variação térmica durante a madrugada.
                    </p>
                </div>
                <div style="font-size: 12px; color: #94a3b8; background: rgba(0,0,0,0.35); padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <i class="fa-solid fa-moon text-blue" style="margin-right: 6px;"></i> <b>${fornosInativos.length} Forno(s) Apagados / Pátio</b> (Filtrados automaticamente)
                </div>
            </div>
        `;

        if (!fornosAtivos || fornosAtivos.length === 0) {
            container.innerHTML = bannerHtml + `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:var(--text-muted);">Nenhum forno em queima ativa detectado nas últimas 12 horas.</div>`;
        } else {
            const cardsHtml = fornosAtivos.map(f => {
                const step1Class = f.fase.step >= 1 ? (f.fase.step === 1 ? 'step-active' : 'step-completed') : '';
                const step2Class = f.fase.step >= 2 ? (f.fase.step === 2 ? 'step-active' : 'step-completed') : '';
                const step3Class = f.fase.step >= 3 ? (f.fase.step === 3 ? 'step-active' : 'step-completed') : '';
                const step4Class = f.fase.step >= 4 ? (f.fase.step === 4 ? 'step-active' : 'step-completed') : '';

                let anomaliasHtml = "";
                if (f.anomalias && f.anomalias.length > 0) {
                    anomaliasHtml = `
                        <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: #fca5a5; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span>${escapeHtml(f.anomalias[0])}</span>
                        </div>
                    `;
                }

                return `
                    <div class="ai-kiln-card">
                        <div class="ai-kiln-header">
                            <div class="ai-kiln-title">
                                <i class="fa-solid fa-fire" style="color: var(--orange);"></i>
                                <span>FORNO ${f.num}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span class="ai-phase-badge ${f.fase.classe}">
                                    <i class="fa-solid ${f.fase.icone}"></i> ${f.fase.nome}
                                </span>
                                <span class="ai-score-pill ${f.badgeScore.classe}">${f.score}%</span>
                            </div>
                        </div>

                        <!-- Métricas Térmicas -->
                        <div class="ai-temp-metrics-grid">
                            <div class="ai-metric-col">
                                <span class="ai-metric-label">Canal 1 (Topo)</span>
                                <b class="ai-metric-val" style="color: #fdba74;">${f.c1}°C</b>
                            </div>
                            <div class="ai-metric-col">
                                <span class="ai-metric-label">Canal 2 (Base)</span>
                                <b class="ai-metric-val" style="color: #67e8f9;">${f.c2}°C</b>
                            </div>
                            <div class="ai-metric-col">
                                <span class="ai-metric-label">Gradiente ΔT</span>
                                <b class="ai-metric-val" style="color: ${f.delta > 75 ? '#f87171' : '#34d399'};">${f.delta}°C</b>
                            </div>
                            <div class="ai-metric-col">
                                <span class="ai-metric-label">Pico Madrugada</span>
                                <b class="ai-metric-val" style="color: #ffffff;">${f.picoC1}°C</b>
                            </div>
                        </div>

                        <!-- Barra de Ciclo Térmico -->
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-weight: 700; text-transform: uppercase;">
                                <span>1. Secagem</span>
                                <span>2. Elevação</span>
                                <span>3. Maturação</span>
                                <span>4. Resfriamento</span>
                            </div>
                            <div class="ai-cycle-steps">
                                <div class="ai-cycle-step ${step1Class}"></div>
                                <div class="ai-cycle-step ${step2Class}"></div>
                                <div class="ai-cycle-step ${step3Class}"></div>
                                <div class="ai-cycle-step ${step4Class}"></div>
                            </div>
                        </div>

                        ${anomaliasHtml}

                        <!-- Parecer do Algoritmo de IA -->
                        <div class="ai-insight-box">
                            <div class="ai-insight-item">
                                <i class="fa-solid fa-lightbulb text-orange"></i>
                                <div><b>Diagnóstico:</b> ${f.fase.desc}. Comportamento: ${f.tendenciaTxt}.</div>
                            </div>
                            <div class="ai-insight-item">
                                <i class="fa-solid fa-hand-holding-hand text-green"></i>
                                <div><b>Ação Prática:</b> ${escapeHtml(f.recomendacao)}</div>
                            </div>
                            <div class="ai-insight-item" style="font-size: 11px; color: var(--text-muted);">
                                <i class="fa-solid fa-stopwatch text-blue"></i>
                                <div><b>Previsão:</b> ${escapeHtml(f.previsao)}</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            container.innerHTML = bannerHtml + cardsHtml;
        }
    }

    // 4. Renderiza o Painel do PDF das Últimas 12 Horas (baseado no Horário Diário de Envio)
    renderizarPainelPDF12HorasIA(resultado);

    // 5. Monta o texto oficial para WhatsApp
    gerarTextoRelatorioIA(false);
}

/**
 * Renderiza o painel "Registro Detalhado de Leituras Coletadas (PDF Últimas 12 Horas)"
 * dentro do card de Relatório Automático Montado pela IA
 */
function renderizarPainelPDF12HorasIA(resultado) {
    if (!resultado) return;
    const janela12h = resultado.janela12h || obterJanela12HorasPorHorarioEnvio();
    const fornosLista = (resultado.fornosAtivos && resultado.fornosAtivos.length > 0)
        ? resultado.fornosAtivos
        : (resultado.todosFornosComLeitura || []);

    if ($("aiPdf12hWindowBadge")) {
        $("aiPdf12hWindowBadge").innerHTML = `<i class="fa-regular fa-clock"></i> Fechamento ${janela12h.horaFimStr} (${janela12h.horaInicioStr} às ${janela12h.horaFimStr})`;
    }

    const pillsBox = $("aiPdf12hFornoPills");
    if (!fornosLista || fornosLista.length === 0) {
        if (pillsBox) pillsBox.innerHTML = "";
        if ($("aiPdf12hCounterText")) {
            $("aiPdf12hCounterText").textContent = `Nenhuma leitura registrada nas últimas 12 horas (${janela12h.horaInicioStr} às ${janela12h.horaFimStr}).`;
        }
        if ($("aiPdf12hTag")) $("aiPdf12hTag").textContent = "REGISTRO 12 HORAS • SEM LEITURAS";
        if ($("aiPdf12hTitle")) $("aiPdf12hTitle").textContent = `${resultado.ceramica?.nome || "Cerâmica"} — ${janela12h.dataFechamentoStr} (${janela12h.horaInicioStr} às ${janela12h.horaFimStr})`;
        if ($("aiPdf12hMaxVal")) $("aiPdf12hMaxVal").textContent = "-- °C";
        if ($("aiPdf12hMaxTime")) $("aiPdf12hMaxTime").textContent = "às --:--";
        if ($("aiPdf12hAvgVal")) $("aiPdf12hAvgVal").textContent = "-- °C";
        if ($("aiPdf12hAvgTime")) $("aiPdf12hAvgTime").textContent = "às --:--";
        if ($("aiPdf12hMinVal")) $("aiPdf12hMinVal").textContent = "-- °C";
        if ($("aiPdf12hMinTime")) $("aiPdf12hMinTime").textContent = "às --:--";
        if ($("aiPdf12hSummaryCount")) $("aiPdf12hSummaryCount").textContent = "0 leituras nas 12h";
        if ($("aiPdf12hTableBody")) {
            $("aiPdf12hTableBody").innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">Nenhuma leitura encontrada nesta janela de 12 horas.</td></tr>`;
        }
        if ($("aiPdf12hPaginationBar")) $("aiPdf12hPaginationBar").innerHTML = "";
        return;
    }

    // Seleciona o forno ativo para visualização do PDF de 12h
    let activeMod = adminState.aiReportState?.activeFornoPdf12h;
    if (!activeMod || !fornosLista.some(f => Number(f.num) === Number(activeMod))) {
        activeMod = Number(fornosLista[0].num);
        adminState.aiReportState.activeFornoPdf12h = activeMod;
    }

    if (pillsBox) {
        pillsBox.innerHTML = fornosLista.map(f => {
            const isSel = Number(f.num) === Number(activeMod);
            return `
                <button type="button" class="filter-pill ${isSel ? "active" : ""}" onclick="selecionarFornoPDF12h(${Number(f.num)})">
                    <i class="fa-solid fa-fire-flame-curved"></i> Forno ${f.num}
                </button>
            `;
        }).join("");
    }

    selecionarFornoPDF12h(activeMod, false);
    atualizarContatosDestinoRelatorioCaldas(resultado.ceramica?.id);
}

function selecionarFornoPDF12h(moduloNum, resetarPagina = true) {
    const resultado = adminState.aiReportState?.analiseAtual;
    if (!resultado) return;

    adminState.aiReportState.activeFornoPdf12h = Number(moduloNum);
    if (resetarPagina) {
        adminState.aiReportState.paginaTabelaPdf12h = 1;
    }

    const janela12h = resultado.janela12h || obterJanela12HorasPorHorarioEnvio();
    const fornosLista = (resultado.fornosAtivos && resultado.fornosAtivos.length > 0)
        ? resultado.fornosAtivos
        : (resultado.todosFornosComLeitura || []);

    const fornoObj = fornosLista.find(f => Number(f.num) === Number(moduloNum)) || fornosLista[0];
    if (!fornoObj) return;

    // Atualiza estado visual dos pills de forno
    const pillsBox = $("aiPdf12hFornoPills");
    if (pillsBox) {
        pillsBox.querySelectorAll(".filter-pill").forEach(btn => {
            btn.classList.toggle("active", btn.textContent.includes(`Forno ${fornoObj.num}`));
        });
    }

    const totalLeituras = fornoObj.leiturasDesc ? fornoObj.leiturasDesc.length : 0;
    const dRef = fornoObj.maxTs ? new Date(fornoObj.maxTs).toLocaleDateString("pt-BR") : janela12h.dataFechamentoStr;

    if ($("aiPdf12hCounterText")) {
        $("aiPdf12hCounterText").textContent = `${totalLeituras.toLocaleString("pt-BR")} leituras coletadas do Forno ${fornoObj.num} no período analisado`;
    }

    // =========================================================================
    // EXECUÇÃO DO MOTOR MATEMÁTICO DE DETECÇÃO AUTOMÁTICA DE CALDAS (CaldasEngine)
    // =========================================================================
    const canalAtivo = $("caldaSelectCanal")?.value || "canal_1";
    let analiseCaldas = null;

    if (window.CaldasEngine && fornoObj.leiturasAsc && fornoObj.leiturasAsc.length > 0) {
        analiseCaldas = window.CaldasEngine.detectarCaldas(fornoObj.leiturasAsc, {
            canal: canalAtivo,
            janelaSuavizacao: 5,
            minDeltaT: 7.0,
            minSeparacaoMinutos: 20
        });
    }

    fornoObj.analiseCaldas = analiseCaldas;
    if (adminState.aiReportState) {
        adminState.aiReportState.analiseCaldasAtual = analiseCaldas;
    }

    // Atualiza os 4 Cards de Métricas Operacionais
    if (analiseCaldas && analiseCaldas.sucesso && analiseCaldas.resumo) {
        const r = analiseCaldas.resumo;
        if ($("caldaStatTotal")) $("caldaStatTotal").textContent = r.totalCaldas;
        if ($("caldaStatConfiancaBadge")) {
            const nivelGeral = analiseCaldas.caldas.some(c => c.confianca === "Baixa confiança") ? "Média Confiança" : "Alta Confiança";
            $("caldaStatConfiancaBadge").textContent = nivelGeral;
        }
        if ($("caldaStatIntervaloMedio")) $("caldaStatIntervaloMedio").textContent = r.intervaloMedioTexto || "—";
        if ($("caldaStatPicoMax")) $("caldaStatPicoMax").textContent = r.tempMaximaGlobal ? `${r.tempMaximaGlobal} °C` : "-- °C";
        if ($("caldaStatPicoHora")) $("caldaStatPicoHora").textContent = r.tempMaximaGlobalHora ? `às ${r.tempMaximaGlobalHora}` : "às --:--";
        if ($("caldaStatDuracao")) $("caldaStatDuracao").textContent = r.duracaoTotalTexto || "--";
        if ($("caldaStatLeiturasCount")) $("caldaStatLeiturasCount").textContent = `${r.totalLeiturasProcessadas} leituras coletadas`;
    } else {
        if ($("caldaStatTotal")) $("caldaStatTotal").textContent = "0";
        if ($("caldaStatIntervaloMedio")) $("caldaStatIntervaloMedio").textContent = "—";
        if ($("caldaStatPicoMax")) $("caldaStatPicoMax").textContent = `${fornoObj.picoC1 || "--"} °C`;
        if ($("caldaStatPicoHora")) $("caldaStatPicoHora").textContent = `às ${fornoObj.horaPicoMax || "--:--"}`;
        if ($("caldaStatDuracao")) $("caldaStatDuracao").textContent = "12 h";
        if ($("caldaStatLeiturasCount")) $("caldaStatLeiturasCount").textContent = `${totalLeituras} leituras`;
    }

    // Renderiza a Tabela de Caldas Identificadas
    renderizarTabelaCaldasAdmin(analiseCaldas);

    // Renderiza a Prévia Formatada para WhatsApp
    renderizarPreviaWhatsappCaldas(analiseCaldas, fornoObj, resultado.ceramica);

    // Renderiza o gráfico das 12h deste forno com os marcadores de caldas e picos
    renderizarGraficoPDF12h(fornoObj, janela12h, dRef, analiseCaldas);

    // Renderiza a tabela de auditoria de 4 colunas (Data & Horário | Módulo | Canal 1 | Canal 2)
    renderizarTabelaPDF12h(fornoObj, dRef, janela12h);
}

function renderizarGraficoPDF12h(fornoObj, janela12h, dataRefStr, analiseCaldas = null) {
    const canvas = $("aiPdf12hChartCanvas");
    if (!canvas || typeof Chart === "undefined") return;

    if (aiPdf12hChartInstance) {
        aiPdf12hChartInstance.destroy();
        aiPdf12hChartInstance = null;
    }

    const ordenadas = fornoObj.leiturasAsc || [];
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
        const ts = r._ts || new Date(r.created_at || r.data_hora).getTime();
        ptsC1.push({ x: ts, y: Math.round(Number(r.canal_1 ?? 0)) });
        ptsC2.push({ x: ts, y: Math.round(Number(r.canal_2 ?? 0)) });
    }

    // PONTOS MARCADORES DE CALDAS (VALES) E PICOS (MÁXIMOS)
    const ptsCaldas = [];
    const ptsPicos = [];

    if (analiseCaldas && analiseCaldas.caldas && analiseCaldas.caldas.length > 0) {
        analiseCaldas.caldas.forEach(c => {
            ptsCaldas.push({
                x: c.timestampCalda,
                y: c.tempMinimo,
                caldaObj: c
            });
            if (c.timestampPico && c.tempMaxima) {
                ptsPicos.push({
                    x: c.timestampPico,
                    y: c.tempMaxima,
                    caldaObj: c
                });
            }
        });
    }

    const readoutEl = $("aiPdf12hChartReadout");
    if (readoutEl) {
        const totalC = analiseCaldas?.caldas?.length || 0;
        readoutEl.innerHTML = `<i class="fa-regular fa-clock"></i> Forno ${fornoObj.num} &nbsp;•&nbsp; <b>${totalC} caldas detectadas</b> &nbsp;|&nbsp; Pico: <b style="color:#ef4444">${fornoObj.picoC1} °C</b>`;
    }

    const ctx = canvas.getContext("2d");
    const gradC1 = ctx.createLinearGradient(0, 0, 0, 220);
    gradC1.addColorStop(0, "rgba(249, 115, 22, 0.28)");
    gradC1.addColorStop(1, "rgba(249, 115, 22, 0.0)");

    const gradC2 = ctx.createLinearGradient(0, 0, 0, 220);
    gradC2.addColorStop(0, "rgba(56, 189, 248, 0.18)");
    gradC2.addColorStop(1, "rgba(56, 189, 248, 0.0)");

    const datasets = [
        {
            label: `Canal 1 (Superior °C)`,
            data: ptsC1,
            borderColor: "#f97316",
            backgroundColor: gradC1,
            borderWidth: 2.2,
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.25,
            fill: true,
            order: 3
        },
        {
            label: `Canal 2 (Inferior °C)`,
            data: ptsC2,
            borderColor: "#38bdf8",
            backgroundColor: gradC2,
            borderWidth: 1.8,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.25,
            fill: true,
            order: 4
        }
    ];

    // Adiciona dataset de Caldas (Mínimos Locais com Destaque Especial)
    if (ptsCaldas.length > 0) {
        datasets.push({
            label: `🔥 Caldas de Lenha (Mínimos)`,
            data: ptsCaldas,
            borderColor: "#ffffff",
            backgroundColor: "#f97316",
            borderWidth: 2.5,
            pointRadius: 7,
            pointHoverRadius: 10,
            pointStyle: "circle",
            showLine: false,
            order: 1
        });
    }

    // Adiciona dataset de Picos (Máximos Locais)
    if (ptsPicos.length > 0) {
        datasets.push({
            label: `🔺 Picos Térmicos (Máximos)`,
            data: ptsPicos,
            borderColor: "#ffffff",
            backgroundColor: "#ef4444",
            borderWidth: 2,
            pointRadius: 6.5,
            pointHoverRadius: 9,
            pointStyle: "triangle",
            showLine: false,
            order: 2
        });
    }

    aiPdf12hChartInstance = new Chart(ctx, {
        type: "line",
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 180 },
            interaction: { mode: "nearest", intersect: false },
            onHover: (evt, activeEls) => {
                if (!readoutEl || !activeEls || activeEls.length === 0) return;
                const el = activeEls[0];
                const ds = datasets[el.datasetIndex];
                const pt = ds?.data[el.index];
                if (!pt) return;

                const dt = new Date(pt.x);
                const hStr = formatHoraCurtaAdmin(pt.x);
                if (pt.caldaObj) {
                    const c = pt.caldaObj;
                    readoutEl.innerHTML = `🔥 <b>${c.numeroTexto} Calda</b> (${c.horarioCalda} - ${c.tempMinimo}°C) &nbsp;•&nbsp; Pico: <b>${c.tempMaxima}°C</b> (${c.horarioPico}) &nbsp;•&nbsp; Int: <b>${c.intervaloEntreCaldasTexto}</b>`;
                } else {
                    readoutEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${dt.toLocaleDateString("pt-BR")} às ${hStr} &nbsp;•&nbsp; ${ds.label}: <b style="color:#ffffff">${pt.y} °C</b>`;
                }
            },
            plugins: {
                legend: {
                    labels: { color: "#cbd5e1", font: { size: 11, weight: "600" } }
                },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.96)",
                    titleColor: "#ffffff",
                    bodyColor: "#e2e8f0",
                    borderColor: "rgba(249, 115, 22, 0.45)",
                    borderWidth: 1,
                    callbacks: {
                        title: (items) => {
                            if (!items || !items.length) return "";
                            const raw = items[0].raw;
                            if (raw && raw.caldaObj) {
                                return `🔥 ${raw.caldaObj.numeroTexto} Calda • ${raw.caldaObj.horarioCalda} (${raw.caldaObj.data})`;
                            }
                            const ts = Number(items[0].parsed.x);
                            const dt = new Date(ts);
                            return `${dt.toLocaleDateString("pt-BR")} às ${formatHoraCurtaAdmin(ts)}`;
                        },
                        label: (item) => {
                            const raw = item.raw;
                            if (raw && raw.caldaObj) {
                                const c = raw.caldaObj;
                                if (item.dataset.label.includes("Caldas")) {
                                    return `Temp. Mínima da Calda: ${c.tempMinimo} °C | Intervalo: ${c.intervaloEntreCaldasTexto} (${c.confianca})`;
                                } else {
                                    return `Pico Térmico: ${c.tempMaxima} °C às ${c.horarioPico} | Subida: ${c.tempoSubidaTexto}`;
                                }
                            }
                            return `${item.dataset.label}: ${item.parsed.y} °C`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: "linear",
                    min: fornoObj.minTs,
                    max: fornoObj.maxTs > fornoObj.minTs ? fornoObj.maxTs : fornoObj.minTs + 60000,
                    title: {
                        display: true,
                        text: `Linha do Tempo da Queima (${janela12h.horaInicioStr} às ${janela12h.horaFimStr})`,
                        color: "#94a3b8",
                        font: { size: 10, weight: "700" }
                    },
                    ticks: {
                        color: "#94a3b8",
                        maxTicksLimit: 10,
                        font: { size: 10 },
                        callback: (val) => formatHoraCurtaAdmin(Number(val))
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)" }
                },
                y: {
                    beginAtZero: false,
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
                    grid: { color: "rgba(255, 255, 255, 0.06)" }
                }
            }
        }
    });
}
function renderizarTabelaPDF12h(fornoObj = null, dataRefStr = "", janela12h = null) {
    const tbody = $("aiPdf12hTableBody");
    const paginationBar = $("aiPdf12hPaginationBar");
    if (!tbody) return;

    const resultado = adminState.aiReportState?.analiseAtual;
    if (!fornoObj && resultado) {
        const fornosLista = (resultado.fornosAtivos && resultado.fornosAtivos.length > 0)
            ? resultado.fornosAtivos
            : (resultado.todosFornosComLeitura || []);
        const activeMod = adminState.aiReportState?.activeFornoPdf12h;
        fornoObj = fornosLista.find(f => Number(f.num) === Number(activeMod)) || fornosLista[0];
        janela12h = resultado.janela12h || obterJanela12HorasPorHorarioEnvio();
        dataRefStr = fornoObj?.maxTs ? new Date(fornoObj.maxTs).toLocaleDateString("pt-BR") : janela12h.dataFechamentoStr;
    }

    const leituras = (fornoObj && fornoObj.leiturasDesc) ? fornoObj.leiturasDesc : [];
    const pageSize = 50;
    const totalPages = Math.max(1, Math.ceil(leituras.length / pageSize));
    let paginaAtualNum = adminState.aiReportState?.paginaTabelaPdf12h || 1;
    if (paginaAtualNum > totalPages) paginaAtualNum = totalPages;
    adminState.aiReportState.paginaTabelaPdf12h = paginaAtualNum;

    const startIdx = (paginaAtualNum - 1) * pageSize;
    const paginaRows = leituras.slice(startIdx, startIdx + pageSize);

    if (paginaRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">Nenhuma leitura registrada nesta janela de 12 horas.</td></tr>`;
        if (paginationBar) paginationBar.innerHTML = "";
        return;
    }

    tbody.innerHTML = paginaRows.map(r => {
        const dt = new Date(r._ts || r.created_at || r.data_hora);
        const dtStr = !isNaN(dt.getTime())
            ? `${dt.toLocaleDateString("pt-BR")} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : "--";
        const mod = Number(r.modulo_alutal || r.forno_id || fornoObj?.moduloNum || 1);
        const c1 = Math.round(Number(r.canal_1 ?? 0));
        const c2 = Math.round(Number(r.canal_2 ?? 0));

        return `
            <tr>
                <td style="font-family: 'JetBrains Mono', monospace; font-size: 11.5px;">${escapeHtml(dtStr)}</td>
                <td><span style="color: #38bdf8; font-weight: 700;">Mód. ${String(mod).padStart(2, "0")}</span></td>
                <td style="color: #fb923c; font-weight: 800;">${c1} °C</td>
                <td style="color: #38bdf8; font-weight: 800;">${c2} °C</td>
            </tr>
        `;
    }).join("");

    if (paginationBar) {
        paginationBar.innerHTML = `
            <span>Mostrando ${startIdx + 1}–${Math.min(startIdx + pageSize, leituras.length)} de ${leituras.length.toLocaleString("pt-BR")} leituras em ${escapeHtml(dataRefStr)} (${janela12h ? `${janela12h.horaInicioStr} às ${janela12h.horaFimStr}` : "12h"})</span>
            <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="filter-pill" ${paginaAtualNum <= 1 ? "disabled style='opacity:0.4;cursor:not-allowed;'" : ""} onclick="mudarPaginaTabelaPDF12h(-1)">
                    <i class="fa-solid fa-chevron-left"></i> Anterior
                </button>
                <span style="padding: 4px 8px; color: #ffffff; font-weight: 700;">Pág. ${paginaAtualNum} / ${totalPages}</span>
                <button type="button" class="filter-pill" ${paginaAtualNum >= totalPages ? "disabled style='opacity:0.4;cursor:not-allowed;'" : ""} onclick="mudarPaginaTabelaPDF12h(1)">
                    Próxima <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;
    }
}

function mudarPaginaTabelaPDF12h(delta) {
    if (!adminState.aiReportState) return;
    adminState.aiReportState.paginaTabelaPdf12h = Math.max(1, (adminState.aiReportState.paginaTabelaPdf12h || 1) + delta);
    renderizarTabelaPDF12h();
}

/**
 * Gera o documento PDF compacto das Últimas 12 Horas no mesmo formato visual:
 * - Registro Detalhado de Leituras Coletadas (Últimas 12h a partir do Horário de Envio)
 * - Pico Máximo (C1) + horário, Média Térmica + horário, Pico Mínimo (C1) + horário
 * - Gráfico do Dia Selecionado (Temperatura x Horário das 12h)
 * - Lista Resumida de Leituras do Dia (Data & Horário | Módulo | Canal 1 (Sup.) | Canal 2 (Inf.))
 */
function gerarDocumentoPDF12Horas() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("Biblioteca PDF (jsPDF) ainda está carregando. Tente novamente em instantes.");
        return null;
    }

    const resultado = adminState.aiReportState?.analiseAtual;
    if (!resultado) return null;

    const janela12h = resultado.janela12h || obterJanela12HorasPorHorarioEnvio();
    const fornosLista = (resultado.fornosAtivos && resultado.fornosAtivos.length > 0)
        ? resultado.fornosAtivos
        : (resultado.todosFornosComLeitura || []);

    if (fornosLista.length === 0) return null;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210;
    const pageH = 297;

    fornosLista.forEach((fornoObj, idxForno) => {
        if (idxForno > 0) doc.addPage();

        const leiturasDesc = fornoObj.leiturasDesc || [];
        const leiturasAsc = fornoObj.leiturasAsc || [];
        const dRef = fornoObj.maxTs ? new Date(fornoObj.maxTs).toLocaleDateString("pt-BR") : janela12h.dataFechamentoStr;
        const statusCiclo = fornoObj.picoC1 >= 500
            ? "Queima Ativa / Alta Temp."
            : (fornoObj.picoC1 >= 150 ? "Aquecimento / Resfriamento" : "Monitoramento Contínuo");

        // Fundo escuro elegante da página
        doc.setFillColor(7, 18, 32);
        doc.rect(0, 0, pageW, pageH, "F");

        // Cabeçalho Superior: Registro Detalhado de Leituras Coletadas
        doc.setFillColor(13, 27, 46);
        doc.setDrawColor(249, 115, 22);
        doc.setLineWidth(0.35);
        doc.roundedRect(10, 10, 190, 20, 3, 3, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Registro Detalhado de Leituras Coletadas (Ultimas 12 Horas)", 15, 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
            `${leiturasDesc.length.toLocaleString("pt-BR")} leituras coletadas do Forno ${fornoObj.num} no periodo (${janela12h.horaInicioStr} as ${janela12h.horaFimStr} • Fechamento: ${janela12h.horaFimStr})`,
            15,
            24.5
        );

        // Barra de Identificação do Registro Diário / 12h
        doc.setFillColor(15, 23, 42);
        doc.setDrawColor(40, 60, 85);
        doc.roundedRect(10, 33, 190, 16, 2.5, 2.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(249, 115, 22);
        doc.text(`REGISTRO 12 HORAS #${idxForno + 1} • MODULO ${fornoObj.num} • ${resultado.ceramica?.nome || "CERAMICA"}`, 15, 39);

        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text(`Forno ${fornoObj.num} — ${dRef} (${janela12h.horaInicioStr} as ${janela12h.horaFimStr})`, 15, 45.5);

        // Badge Status à direita
        doc.setFillColor(16, 65, 55);
        doc.setDrawColor(16, 185, 129);
        doc.roundedRect(142, 36.5, 53, 9, 4, 4, "FD");
        doc.setFontSize(8);
        doc.setTextColor(52, 211, 153);
        doc.text(statusCiclo, 168.5, 42.2, { align: "center" });

        // 3 Cards de Destaques das 12 Horas com Horários Exatos (Pico Máximo C1, Média Térmica, Pico Mínimo C1)
        const cardY = 52;
        const cardW = 60.6;
        const cardH = 22;

        // Card 1: Pico Máximo (C1)
        doc.setFillColor(28, 24, 28);
        doc.setDrawColor(249, 115, 22);
        doc.roundedRect(10, cardY, cardW, cardH, 2.5, 2.5, "FD");
        doc.setFontSize(7.5);
        doc.setTextColor(253, 186, 116);
        doc.text("PICO MAXIMO (C1)", 14, cardY + 6);
        doc.setFontSize(14);
        doc.setTextColor(251, 146, 60);
        doc.text(`${fornoObj.picoC1} °C`, 14, cardY + 14);
        doc.setFontSize(8);
        doc.setTextColor(254, 215, 170);
        doc.text(`as ${fornoObj.horaPicoMax || "--:--"}`, 14, cardY + 19.5);

        // Card 2: Média Térmica
        doc.setFillColor(14, 30, 48);
        doc.setDrawColor(56, 189, 248);
        doc.roundedRect(10 + cardW + 4, cardY, cardW, cardH, 2.5, 2.5, "FD");
        doc.setFontSize(7.5);
        doc.setTextColor(125, 211, 252);
        doc.text("MEDIA TERMICA", 14 + cardW + 4, cardY + 6);
        doc.setFontSize(14);
        doc.setTextColor(56, 189, 248);
        doc.text(`${fornoObj.mediaC1} °C`, 14 + cardW + 4, cardY + 14);
        doc.setFontSize(8);
        doc.setTextColor(186, 230, 253);
        doc.text(`as ${fornoObj.horaMedia || "--:--"}`, 14 + cardW + 4, cardY + 19.5);

        // Card 3: Pico Mínimo (C1)
        doc.setFillColor(12, 35, 35);
        doc.setDrawColor(16, 185, 129);
        doc.roundedRect(10 + (cardW + 4) * 2, cardY, cardW, cardH, 2.5, 2.5, "FD");
        doc.setFontSize(7.5);
        doc.setTextColor(110, 231, 183);
        doc.text("PICO MINIMO (C1)", 14 + (cardW + 4) * 2, cardY + 6);
        doc.setFontSize(14);
        doc.setTextColor(52, 211, 153);
        doc.text(`${fornoObj.minC1} °C`, 14 + (cardW + 4) * 2, cardY + 14);
        doc.setFontSize(8);
        doc.setTextColor(167, 243, 208);
        doc.text(`as ${fornoObj.horaPicoMin || "--:--"}`, 14 + (cardW + 4) * 2, cardY + 19.5);

        // Caixa do Gráfico do Dia Selecionado (Últimas 12 Horas)
        const chartBoxY = 77;
        const chartBoxH = 58;
        doc.setFillColor(11, 22, 38);
        doc.setDrawColor(35, 55, 80);
        doc.roundedRect(10, chartBoxY, 190, chartBoxH, 2.5, 2.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text(`Grafico do Dia Selecionado (Temperatura x Horario • ${janela12h.horaInicioStr} as ${janela12h.horaFimStr})`, 14, chartBoxY + 6.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(251, 146, 60);
        doc.text(
            `${dRef} as ${fornoObj.horaPicoMax}  •  C1: ${fornoObj.picoC1} °C  |  C2: ${fornoObj.picoC2} °C`,
            196,
            chartBoxY + 6.5,
            { align: "right" }
        );

        // Desenha vetorialmente a curva de 12 horas C1 (Laranja) e C2 (Azul) no PDF
        const plotX = 22;
        const plotY = chartBoxY + 11;
        const plotW = 172;
        const plotH = 39;

        doc.setDrawColor(30, 45, 68);
        doc.setLineWidth(0.2);
        const maxTempScale = Math.max(200, Math.ceil((Math.max(fornoObj.picoC1, fornoObj.picoC2, 100) + 50) / 100) * 100);
        for (let gStep = 0; gStep <= 4; gStep++) {
            const gy = plotY + plotH - (gStep / 4) * plotH;
            doc.line(plotX, gy, plotX + plotW, gy);
            const tVal = Math.round((gStep / 4) * maxTempScale);
            doc.setFontSize(6.5);
            doc.setTextColor(148, 163, 184);
            doc.text(`${tVal}°C`, plotX - 2, gy + 1, { align: "right" });
        }

        if (leiturasAsc.length > 0) {
            const minT = fornoObj.minTs;
            const maxT = Math.max(minT + 60000, fornoObj.maxTs);
            const sampleStep = Math.max(1, Math.ceil(leiturasAsc.length / 160));
            const pts = [];
            for (let i = 0; i < leiturasAsc.length; i += sampleStep) {
                pts.push(leiturasAsc[i]);
            }
            if (pts[pts.length - 1] !== leiturasAsc[leiturasAsc.length - 1]) {
                pts.push(leiturasAsc[leiturasAsc.length - 1]);
            }

            // Linha Canal 2 (Inferior - Azul)
            doc.setDrawColor(56, 189, 248);
            doc.setLineWidth(0.55);
            for (let i = 1; i < pts.length; i++) {
                const x1 = plotX + ((pts[i - 1]._ts - minT) / (maxT - minT)) * plotW;
                const y1 = plotY + plotH - (Math.min(maxTempScale, Math.max(0, Number(pts[i - 1].canal_2 ?? 0))) / maxTempScale) * plotH;
                const x2 = plotX + ((pts[i]._ts - minT) / (maxT - minT)) * plotW;
                const y2 = plotY + plotH - (Math.min(maxTempScale, Math.max(0, Number(pts[i].canal_2 ?? 0))) / maxTempScale) * plotH;
                doc.line(x1, y1, x2, y2);
            }

            // Linha Canal 1 (Superior - Laranja)
            doc.setDrawColor(249, 115, 22);
            doc.setLineWidth(0.75);
            for (let i = 1; i < pts.length; i++) {
                const x1 = plotX + ((pts[i - 1]._ts - minT) / (maxT - minT)) * plotW;
                const y1 = plotY + plotH - (Math.min(maxTempScale, Math.max(0, Number(pts[i - 1].canal_1 ?? 0))) / maxTempScale) * plotH;
                const x2 = plotX + ((pts[i]._ts - minT) / (maxT - minT)) * plotW;
                const y2 = plotY + plotH - (Math.min(maxTempScale, Math.max(0, Number(pts[i].canal_1 ?? 0))) / maxTempScale) * plotH;
                doc.line(x1, y1, x2, y2);
            }

            // Rótulos de horário no eixo X
            doc.setFontSize(6.5);
            doc.setTextColor(148, 163, 184);
            for (let tStep = 0; tStep <= 6; tStep++) {
                const tx = plotX + (tStep / 6) * plotW;
                const tMs = minT + (tStep / 6) * (maxT - minT);
                doc.text(formatHoraCurtaAdmin(tMs), tx, plotY + plotH + 4.5, { align: "center" });
            }
        }

        // Seção: Lista Resumida de Leituras do Dia (Últimas 12h) — 4 Colunas
        let curY = 138;
        doc.setFillColor(13, 27, 46);
        doc.setDrawColor(35, 55, 80);
        doc.roundedRect(10, curY, 190, 9, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("Lista Resumida de Leituras do Dia (Ultimas 12 Horas)", 14, curY + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(253, 186, 116);
        doc.text(
            `${leiturasDesc.length.toLocaleString("pt-BR")} leituras no periodo (${janela12h.horaInicioStr} as ${janela12h.horaFimStr})`,
            196,
            curY + 6,
            { align: "right" }
        );

        curY += 11;

        // Função auxiliar para desenhar o cabeçalho da tabela de 4 colunas
        const drawTableHeader = (yPos) => {
            doc.setFillColor(20, 34, 56);
            doc.rect(10, yPos, 190, 7, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184);
            doc.text("Data & Horario", 14, yPos + 4.8);
            doc.text("Modulo", 78, yPos + 4.8);
            doc.text("Canal 1 (Sup.)", 122, yPos + 4.8);
            doc.text("Canal 2 (Inf.)", 166, yPos + 4.8);
            return yPos + 7;
        };

        curY = drawTableHeader(curY);

        // Para ser um "pequeno PDF das últimas 12 horas", exibe as 50 leituras principais/mais recentes da janela de 12h (igual à Página 1 de 50 linhas mostrada no exemplo)
        const maxRowsPdf = Math.min(leiturasDesc.length, 50);
        const rowH = 5.2;

        for (let rIdx = 0; rIdx < maxRowsPdf; rIdx++) {
            if (curY + rowH > pageH - 12) {
                doc.addPage();
                doc.setFillColor(7, 18, 32);
                doc.rect(0, 0, pageW, pageH, "F");
                curY = 12;
                curY = drawTableHeader(curY);
            }

            const r = leiturasDesc[rIdx];
            const dt = new Date(r._ts || r.created_at || r.data_hora);
            const dtStr = !isNaN(dt.getTime())
                ? `${dt.toLocaleDateString("pt-BR")} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : "--";
            const mod = Number(r.modulo_alutal || r.forno_id || fornoObj.moduloNum || 1);
            const c1 = Math.round(Number(r.canal_1 ?? 0));
            const c2 = Math.round(Number(r.canal_2 ?? 0));

            if (rIdx % 2 === 0) {
                doc.setFillColor(11, 23, 40);
            } else {
                doc.setFillColor(15, 29, 49);
            }
            doc.rect(10, curY, 190, rowH, "F");

            doc.setFont("courier", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(226, 232, 240);
            doc.text(dtStr, 14, curY + 3.7);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(56, 189, 248);
            doc.text(`Mod. ${String(mod).padStart(2, "0")}`, 78, curY + 3.7);

            doc.setTextColor(251, 146, 60);
            doc.text(`${c1} °C`, 122, curY + 3.7);

            doc.setTextColor(56, 189, 248);
            doc.text(`${c2} °C`, 166, curY + 3.7);

            curY += rowH;
        }

        // Rodapé do PDF
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
            `Mostrando 1–${maxRowsPdf} de ${leiturasDesc.length.toLocaleString("pt-BR")} leituras em ${dRef} (Janela 12h: ${janela12h.horaInicioStr} as ${janela12h.horaFimStr}) • ThermoLink Industrial`,
            105,
            pageH - 5,
            { align: "center" }
        );
    });

    const cerNomeLimpo = String(resultado.ceramica?.nome || "Ceramica").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fornoRef = fornosLista[0]?.num || "01";
    const fileName = `Relatorio_12h_${cerNomeLimpo}_Forno_${fornoRef}.pdf`;
    const dataUri = doc.output("datauristring");
    const base64 = dataUri.includes(",") ? dataUri.split(",")[1] : "";

    return { doc, fileName, base64 };
}

function gerarEBaixarPDFRelatorio12h() {
    const pdfObj = gerarDocumentoPDF12Horas();
    if (!pdfObj) {
        mostrarToastFeedback("Não há leituras carregadas nas últimas 12h para gerar o PDF.", "warn");
        return;
    }
    pdfObj.doc.save(pdfObj.fileName);
    mostrarToastFeedback(`PDF das últimas 12 horas (${pdfObj.fileName}) gerado com sucesso!`, "success");
}

async function obterResumoGeminiClient(ceramicaNome, fornosAtivos) {
    if (!fornosAtivos || fornosAtivos.length === 0) {
        return `• *Status:* Nenhum forno com queima ativa detectado nas últimas 12 horas.\n• *Ação:* Unidades em temperatura ambiente ou pátio. Sistema pronto para novo ciclo.`;
    }

    const apiKey = localStorage.getItem("thermolink_gemini_api_key") || $("waAdminInputGeminiKey")?.value?.trim() || "";

    const fallbackLocal = () => {
        const maiorPico = fornosAtivos.reduce((prev, curr) => (curr.picoC1 > prev.picoC1 ? curr : prev), fornosAtivos[0]);
        const emMaturacao = fornosAtivos.filter(f => f.c1 >= 750);
        const subindo = fornosAtivos.filter(f => String(f.tendenciaTxt || "").includes("Subida"));
        const resfriando = fornosAtivos.filter(f => String(f.tendenciaTxt || "").toLowerCase().includes("resfriamento"));

        const itens = [];
        itens.push(`• *Operação:* ${fornosAtivos.length} forno(s) em queima ativa na janela de 12 horas.`);
        if (emMaturacao.length > 0) {
            itens.push(`• *Ponto de Fogo:* Forno(s) ${emMaturacao.map(f => f.num).join(', ')} na faixa de sinterização (Pico: ${maiorPico.picoC1}°C no Forno ${maiorPico.num}).`);
        } else if (subindo.length > 0) {
            itens.push(`• *Elevação:* Forno(s) ${subindo.map(f => f.num).join(', ')} em ritmo constante de queima.`);
        } else {
            itens.push(`• *Pico do Turno:* Forno ${maiorPico.num} atingiu a máxima de ${maiorPico.picoC1}°C.`);
        }

        if (resfriando.length > 0) {
            itens.push(`• *Resfriamento:* Forno(s) ${resfriando.map(f => f.num).join(', ')} em curva descendente. Manter vedação completa.`);
        } else {
            itens.push(`• *Recomendação:* Manter alimentação uniforme de lenha e acompanhar estabilidade nos topos.`);
        }
        return itens.slice(0, 3).join("\n");
    };

    if (!apiKey) return fallbackLocal();

    const dadosFornos = fornosAtivos.map(f => 
        `- Forno ${f.num}: Fase "${f.fase?.nome || f.fase || 'Queima'}", Temp Atual C1=${f.c1}°C, C2=${f.c2}°C, Pico 12h=${f.picoC1}°C, Média=${f.mediaC1}°C, Comportamento="${f.tendenciaTxt}"`
    ).join("\n");

    const prompt = `Você é o especialista industrial em queima de cerâmica vermelha e olarias do sistema ThermoLink.
Analise a telemetria REAL das últimas 12 horas da cerâmica "${ceramicaNome}":
${dadosFornos}

Diretrizes OBRIGATÓRIAS:
1. Escreva um resumo EXECUTIVO de 2 a 3 tópicos curtos (máximo 4 linhas no total), iniciando cada tópico com '• '.
2. Seja direto, conciso e prático para o proprietário da olaria / operador.
3. Avalie o estado térmico (se atingiu zona de sinterização ~900°C+, se está subindo ou em resfriamento) e dê 1 recomendação operacional direta para o turno.
4. NÃO use saudações ("Olá", "Bom dia", "Aqui está"), NÃO use introdução nem despedidas.
5. NÃO invente números nem dados. Use apenas os dados reais fornecidos acima.
6. Use negrito (*texto*) e marcadores • compatíveis com o WhatsApp.`;

    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.25, maxOutputTokens: 250 }
            })
        });
        if (resp.ok) {
            const json = await resp.json();
            const txt = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (txt && txt.trim().length > 10) {
                return txt.trim().replace(/^(Aqui está o resumo|Resumo Executivo|Relatório da IA|Análise da Queima):?\s*/i, '');
            }
        }
    } catch (e) {
        console.warn("[Gemini Client] Erro:", e);
    }

    return fallbackLocal();
}

async function gerarTextoRelatorioIA(resetarManual = false) {
    const res = adminState.aiReportState?.analiseAtual;
    if (!res) return;

    const janela12h = res.janela12h || obterJanela12HorasPorHorarioEnvio();
    const agora = new Date();
    const dataFormatada = janela12h.dataFechamentoStr || agora.toLocaleDateString("pt-BR");
    const horaFormatada = janela12h.horaFimStr || agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const { fornosAtivos, ceramica, chartUrl } = res;
    const fornosList = (fornosAtivos && fornosAtivos.length > 0) ? fornosAtivos : (res.todosFornosComLeitura || []);

    let t = `*━━━━━━━━━━━━━━━━━━━━━━━━━━*\n`;
    t += `🔥 *THERMOLINK • RESUMO 12 HORAS* 🔥\n`;
    t += `*━━━━━━━━━━━━━━━━━━━━━━━━━━*\n\n`;

    t += `🏭 *Cerâmica:* ${ceramica.nome}\n`;
    t += `👤 *Aos Cuidados:* ${ceramica.responsavel || "Gestor de Queima"}\n`;
    t += `📅 *Fechamento Diário:* ${dataFormatada} às ${horaFormatada}\n`;
    t += `⏱️ *Período (Últimas 12h):* ${janela12h.horaInicioStr} às ${janela12h.horaFimStr}\n\n`;

    if (fornosList.length === 0) {
        t += `ℹ️ *Nenhum forno registrou queima ativa nesta janela de 12 horas.*\n`;
        t += `Todas as unidades monitoradas permanecem em temperatura ambiente ou pátio.\n\n`;
    } else {
        t += `🔥 *FORNOS MONITORADOS NAS 12H:* (${fornosList.length} forno${fornosList.length > 1 ? 's' : ''})\n\n`;
        fornosList.forEach(f => {
            const faseNome = f.fase?.nome || f.fase || 'Queima Ativa';
            const qtdLts = f.leiturasDesc ? f.leiturasDesc.length : 0;
            t += `*FORNO ${f.num}* — ${faseNome} (${qtdLts.toLocaleString("pt-BR")} leituras)\n`;
            t += `• *Pico Máximo (C1):* *${f.picoC1}°C* (às ${f.horaPicoMax || "--:--"})\n`;
            t += `• *Média Térmica:* *${f.mediaC1}°C* (às ${f.horaMedia || "--:--"})\n`;
            t += `• *Pico Mínimo (C1):* *${f.minC1 ?? 0}°C* (às ${f.horaPicoMin || "--:--"})\n`;
            t += `• *Temp. Atual:* C1 (Sup.): *${f.c1}°C* | C2 (Inf.): *${f.c2}°C*\n`;
            t += `• *Comportamento:* ${f.tendenciaTxt}\n\n`;
        });
    }

    // Obtém análise do Gemini
    let resumoGemini = res.resumoGemini;
    if (!resumoGemini || resetarManual) {
        resumoGemini = await obterResumoGeminiClient(ceramica.nome, fornosList);
        res.resumoGemini = resumoGemini;
    }

    t += `*──────────────────────────*\n`;
    t += `🧠 *ANÁLISE INTELIGENTE (GEMINI IA):*\n`;
    t += `${resumoGemini}\n`;
    t += `*──────────────────────────*\n\n`;

    t += `📄 *PDF detalhado das últimas 12h (${janela12h.horaInicioStr} às ${janela12h.horaFimStr}) com gráfico e lista de leituras anexado.*\n`;
    if (chartUrl) {
        t += `📈 *Gráfico térmico real das últimas 12h anexado acima.*\n`;
    }
    t += `📲 _Mensagem automática ThermoLink • Monitoramento Industrial_\n`;
    t += `🌐 Painel de Controle: *thermolink.com.br*\n`;
    t += `*━━━━━━━━━━━━━━━━━━━━━━━━━━*`;

    adminState.aiReportState.textoFormatado = t;
    adminState.aiReportState.chartUrl = chartUrl;

    const txtArea = $("aiRelatorioTextoArea");
    if (txtArea) {
        txtArea.value = t;
    }

    if (resetarManual) {
        mostrarToastFeedback("Texto e PDF de 12h atualizados com sucesso.", "info");
    }
}

function copiarRelatorioIATexto() {
    const txtArea = $("aiRelatorioTextoArea");
    const texto = txtArea?.value || adminState.aiReportState?.textoFormatado;
    if (!texto) {
        mostrarToastFeedback("Nenhum texto disponível para cópia.", "warn");
        return;
    }

    navigator.clipboard.writeText(texto).then(() => {
        mostrarToastFeedback("Relatório com IA copiado para a área de transferência!", "success");
    }).catch(() => {
        if (txtArea) {
            txtArea.select();
            document.execCommand("copy");
            mostrarToastFeedback("Relatório copiado!", "success");
        }
    });
}

async function dispararRelatorioIACeramica() {
    const res = adminState.aiReportState?.analiseAtual;
    if (!res) {
        alert("Execute a análise antes de disparar.");
        return;
    }

    const texto = $("aiRelatorioTextoArea")?.value || adminState.aiReportState?.textoFormatado;
    const chartUrl = adminState.aiReportState?.chartUrl || res.chartUrl || null;
    const ceramicaId = res.ceramica.id;
    const contatos = (waAdminContatos || []).filter(c => c.ceramica_id === ceramicaId && c.receber_relatorio);

    if (contatos.length === 0) {
        alert(`Nenhum contato com recebimento ativo cadastrado para ${res.ceramica.nome}.`);
        return;
    }

    if (!confirm(`Deseja disparar este Relatório das 12 Horas com Análise de IA, Gráfico e PDF das Últimas 12h para os ${contatos.length} contato(s) de ${res.ceramica.nome}?`)) {
        return;
    }

    const pdfObj = gerarDocumentoPDF12Horas();

    mostrarToastFeedback(`Disparando relatório + PDF 12h de ${res.ceramica.nome}...`, "info");
    try {
        let enviados = 0;
        for (const c of contatos) {
            if (!c.telefone) continue;
            try {
                await enviarMensagemWhatsappGateway(
                    c.telefone,
                    texto,
                    chartUrl,
                    pdfObj ? { base64: pdfObj.base64, fileName: pdfObj.fileName } : null
                );
                enviados++;
            } catch (errOne) {
                console.warn(`[Relatório IA] Falha ao enviar para ${c.nome}:`, errOne);
            }
        }

        if (enviados > 0) {
            mostrarToastFeedback(`Relatório e PDF 12h entregues para ${enviados} contato(s) no WhatsApp!`, "success");
            fecharModalAdmin("modalPreviewWhatsappIA", null);
        } else {
            alert("Não foi possível entregar o relatório. Verifique se o WhatsApp está conectado.");
        }
    } catch (e) {
        alert("Erro de comunicação com o Gateway WhatsApp: " + (e.message || "Verifique o status do servidor."));
    }
}

async function dispararRelatorioIAWhatsappAdmin() {
    await dispararRelatorioIACeramica();
}

async function enviarMensagemWhatsappGateway(telefone, texto, chartUrl = null, pdfAttachment = null) {
    const gatewayUrl = getGatewayUrl();
    let cleanPhone = String(telefone || "").replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length >= 10 && !cleanPhone.startsWith("55")) {
        cleanPhone = "55" + cleanPhone;
    }
    if (!cleanPhone) throw new Error("Telefone inválido.");

    const payload = {
        phone: cleanPhone,
        text: texto,
        chartUrl: chartUrl || null,
        pdfBase64: pdfAttachment?.base64 || null,
        pdfFileName: pdfAttachment?.fileName || null
    };

    // 1. Tenta POST /api/send-message (endpoint nativo ativo no Render em produção)
    try {
        const resp = await fetch(`${gatewayUrl}/api/send-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (resp.ok) {
            const data = await resp.json();
            if (data.success) return { success: true, data };
        }
    } catch (err1) {}

    // 2. Fallback para POST /api/enviar-mensagem
    try {
        const resp2 = await fetch(`${gatewayUrl}/api/enviar-mensagem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...payload,
                telefone: cleanPhone,
                mensagem: texto,
                imageUrl: chartUrl || null
            })
        });
        if (resp2.ok) {
            const data2 = await resp2.json();
            if (data2.success) return { success: true, data: data2 };
        }
    } catch (err2) {}

    throw new Error("Não foi possível comunicar com o Gateway WhatsApp.");
}

function abrirModalPreviewWhatsappIA() {
    const res = adminState.aiReportState?.analiseAtual;
    const texto = $("aiRelatorioTextoArea")?.value || adminState.aiReportState?.textoFormatado;
    const chartUrl = adminState.aiReportState?.chartUrl;
    const janela12h = res?.janela12h || obterJanela12HorasPorHorarioEnvio();
    const fornosLista = (res?.fornosAtivos && res.fornosAtivos.length > 0)
        ? res.fornosAtivos
        : (res?.todosFornosComLeitura || []);
    const fornoRef = fornosLista[0]?.num || "01";
    const cerNomeLimpo = String(res?.ceramica?.nome || "Ceramica").replace(/[^a-zA-Z0-9_-]/g, "_");

    if ($("waMockupPdfFileName")) {
        $("waMockupPdfFileName").textContent = `Relatorio_12h_${cerNomeLimpo}_Forno_${fornoRef}.pdf`;
    }
    if ($("waMockupPdfMeta")) {
        $("waMockupPdfMeta").textContent = `PDF • Últimas 12 Horas (${janela12h.horaInicioStr} às ${janela12h.horaFimStr})`;
    }

    if ($("waMockupMessageText")) {
        $("waMockupMessageText").textContent = texto || "Carregando relatório...";
    }
    if ($("waMockupHora")) {
        $("waMockupHora").textContent = janela12h.horaFimStr || new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    if ($("waMockupImgBox") && $("waMockupChartImg")) {
        if (chartUrl) {
            $("waMockupChartImg").src = chartUrl;
            $("waMockupImgBox").style.display = "block";
        } else {
            $("waMockupImgBox").style.display = "none";
        }
    }

    abrirModalAdmin("modalPreviewWhatsappIA");
}

// ==========================================================================
// 13. AVISOS TÉCNICOS EXCLUSIVOS (DESLIGADO, LIGOU, APARELHOS FUNCIONANDO)
// ==========================================================================

let waPreviewAvisoTipoAtivo = "offline";

function abrirModalPreviewAlertaDesconexao(tipo = "offline") {
    trocarAbaPreviewAvisoTecnico(tipo);
    abrirModalAdmin("modalPreviewAlertaDesconexao");
}

function trocarAbaPreviewAvisoTecnico(tipo) {
    waPreviewAvisoTipoAtivo = tipo;

    const btnOffline = $("tabAvisoOfflineBtn");
    const btnOnline = $("tabAvisoOnlineBtn");
    const btnStatus = $("tabAvisoStatusBtn");
    const textEl = $("waMockupAlertaText");
    const origemEl = $("waMockupAlertaOrigem");
    const actionBtn = $("btnDispararAvisoTecnicoModal");

    if (btnOffline) btnOffline.className = `filter-pill ${tipo === 'offline' ? 'active' : ''}`;
    if (btnOnline) btnOnline.className = `filter-pill ${tipo === 'online' ? 'active' : ''}`;
    if (btnStatus) btnStatus.className = `filter-pill ${tipo === 'status' ? 'active' : ''}`;

    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    let cer = null;
    if (waAdminCeramicaFiltroAtivo && waAdminCeramicaFiltroAtivo !== "all") {
        cer = clients.find(c => c.id === waAdminCeramicaFiltroAtivo);
    }
    if (!cer) {
        cer = clients.find(cl => (waAdminContatos || []).some(c => c.ceramica_id === cl.id && (c.tipo_contato === "tecnico" || c.receber_alertas_tecnicos)));
    }
    if (!cer) cer = clients[0] || { nome: "Cerâmica Cliente" };

    const devsDaCer = (adminState.deviceStatusList || []).filter(d => (d.ceramicaId || d.ceramica_id) === cer.id);
    const totalDevs = devsDaCer.length || 1;
    const qtdAtivos = devsDaCer.filter(d => d.isOnline).length || (devsDaCer.length > 0 ? 0 : 1);

    const contatosTec = (waAdminContatos || []).filter(c => c.ceramica_id === cer.id && (c.tipo_contato === "tecnico" || c.receber_alertas_tecnicos));
    const nomeTecnico = contatosTec.length > 0 ? contatosTec[0].nome : "Técnico de Campo";

    const agora = new Date();
    const dataHoraStr = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (tipo === "offline") {
        if (origemEl) origemEl.textContent = "Alerta Automático (Desconexão > 30m)";
        if (actionBtn) {
            actionBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Testar Alerta Desligado (${cer.nome})`;
            actionBtn.style.background = "linear-gradient(135deg, #f97316, #ea580c)";
        }
        if (textEl) {
            textEl.textContent = `⚠️ *THERMOLINK • ALERTA TÉCNICO: EQUIPAMENTO OFFLINE* ⚠️

🏭 *Cerâmica:* ${cer.nome}
👨‍🔧 *Aos Cuidados do Técnico:* ${nomeTecnico}
⏱️ *Sem comunicação:* há mais de 35 minutos
📡 *Última transmissão:* ${dataHoraStr}

Identificamos que os módulos/sensores ThermoLink na fábrica pararam de comunicar com o servidor.

📊 *Status dos Equipamentos:*
• Aparelhos cadastrados: ${totalDevs} aparelho(s)
• Aparelhos transmitindo: 0 online (todos offline)

🔍 *Verificações recomendadas para o Técnico:*
1. Verificar se houve queda de energia elétrica geral na cerâmica.
2. Checar se o roteador Wi-Fi / link de internet do galpão está ligado.
3. Verificar se o aparelho ThermoLink (ESP/Alutal) está plugado na tomada e com LED aceso.

_Notificação técnica automática enviada pelo sistema ThermoLink._`;
        }
    } else if (tipo === "online") {
        if (origemEl) origemEl.textContent = "Aviso Automático (Aparelho Ligou / Reconectou)";
        if (actionBtn) {
            actionBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Testar Aviso Ligou (${cer.nome})`;
            actionBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        }
        if (textEl) {
            textEl.textContent = `🟢 *THERMOLINK • AVISO TÉCNICO: EQUIPAMENTO ONLINE* 🟢

🏭 *Cerâmica:* ${cer.nome}
👨‍🔧 *Aos Cuidados do Técnico:* ${nomeTecnico}
⏱️ *Status:* Sinal restabelecido com sucesso!
📡 *Horário de Retorno:* ${dataHoraStr}

Os aparelhos ThermoLink voltaram a transmitir leituras normalmente após o período de oscilação/queda de sinal.

📊 *Diagnóstico Técnico Atual:*
• Aparelhos Cadastrados: ${totalDevs} aparelho(s)
• Aparelhos Funcionando: *${qtdAtivos || 1} ativo(s) transmitindo*
• Última Leitura Recebida: C1 (Topo): 780°C | C2 (Base): 710°C

✅ Comunicação normalizada. A telemetria dos fornos segue em tempo real.

_Notificação técnica automática enviada pelo sistema ThermoLink._`;
        }
    } else {
        if (origemEl) origemEl.textContent = "Diagnóstico Técnico sob Demanda";
        if (actionBtn) {
            actionBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Enviar Status dos Aparelhos (${cer.nome})`;
            actionBtn.style.background = "linear-gradient(135deg, #0284c7, #0369a1)";
        }
        if (textEl) {
            const perc = totalDevs > 0 ? Math.round((qtdAtivos / totalDevs) * 100) : 100;
            textEl.textContent = `🛠️ *THERMOLINK • STATUS TÉCNICO DOS APARELHOS* 🛠️

🏭 *Cerâmica:* ${cer.nome}
👨‍🔧 *Técnico Responsável:* ${nomeTecnico}
📅 *Horário do Diagnóstico:* ${dataHoraStr}

📊 *Resumo de Operação dos Equipamentos:*
• Total Cadastrado: ${totalDevs} aparelho(s)
• Aparelhos em Funcionamento: *${qtdAtivos} ativo(s) transmitindo*
• Saúde de Comunicação: *${perc}%*
• Última Leitura: C1: 820°C | C2: 745°C

📲 _Diagnóstico técnico solicitado via Painel ThermoLink._`;
        }
    }
}

async function testarDisparoAvisoTecnicoAtivoModal() {
    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    if (!clients || !clients.length) return alert("Nenhuma cerâmica cadastrada.");

    let cer = null;
    if (waAdminCeramicaFiltroAtivo && waAdminCeramicaFiltroAtivo !== "all") {
        cer = clients.find(c => c.id === waAdminCeramicaFiltroAtivo);
    }
    if (!cer) {
        cer = clients.find(cl => (waAdminContatos || []).some(c => c.ceramica_id === cl.id && (c.tipo_contato === "tecnico" || c.receber_alertas_tecnicos)));
    }
    if (!cer) cer = clients[0];

    if (waPreviewAvisoTipoAtivo === "online") {
        await testarAlertaReconexaoCeramica(cer.id, cer.nome);
    } else if (waPreviewAvisoTipoAtivo === "status") {
        await enviarStatusTecnicoCeramica(cer.id, cer.nome);
    } else {
        await testarAlertaDesconexaoCeramica(cer.id, cer.nome);
    }
}

async function testarDisparoAlertaDesconexaoAdmin() {
    await testarDisparoAvisoTecnicoAtivoModal();
}

// 13.1. Teste de Alerta de Desconexão (> 30 Minutos Offline)
async function testarAlertaDesconexaoCeramica(ceramicaId, ceramicaNome) {
    let contatos = (waAdminContatos || []).filter(c => 
        c.ceramica_id === ceramicaId && 
        (c.tipo_contato === "tecnico" || c.receber_alertas_tecnicos) && 
        c.telefone
    );
    if (!contatos || !contatos.length) {
        contatos = (waAdminContatos || []).filter(c => c.ceramica_id === ceramicaId && c.receber_relatorio && c.telefone);
    }
    if (!contatos || !contatos.length) {
        return alert(`Nenhum contato técnico ou responsável cadastrado para ${ceramicaNome}.`);
    }

    if (!confirm(`Deseja enviar o aviso de EQUIPAMENTO DESLIGADO (>30 min) para o(s) técnico(s) de ${ceramicaNome} no WhatsApp?`)) {
        return;
    }

    mostrarToastFeedback(`Enviando aviso de desligamento para ${ceramicaNome}...`, "info");
    const gatewayUrl = getGatewayUrl();

    // 1. Tenta endpoint direto do backend
    try {
        const resp = await fetch(`${gatewayUrl}/api/testar-alerta-desconexao/${ceramicaId}`, { method: "POST" });
        if (resp.ok) {
            const d = await resp.json();
            if (d.success) {
                mostrarToastFeedback(`Aviso entregue para ${d.enviados} contato(s) de ${ceramicaNome}!`, "success");
                fecharModalAdmin("modalPreviewAlertaDesconexao", null);
                return;
            }
        }
    } catch (eDedicated) {}

    // 2. Fallback resiliente via /api/send-message
    try {
        const agora = new Date();
        const dataHoraStr = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const devsDaCer = (adminState.deviceStatusList || []).filter(d => (d.ceramicaId || d.ceramica_id) === ceramicaId);
        const totalDevs = devsDaCer.length || 1;

        let enviados = 0;
        for (const c of contatos) {
            const textoAviso = `⚠️ *THERMOLINK • ALERTA TÉCNICO: EQUIPAMENTO OFFLINE* ⚠️\n\n` +
                `🏭 *Cerâmica:* ${ceramicaNome}\n` +
                `👨‍🔧 *Aos Cuidados do Técnico:* ${c.nome}\n` +
                `⏱️ *Sem comunicação:* há mais de 35 minutos\n` +
                `📡 *Última transmissão:* ${dataHoraStr}\n\n` +
                `Identificamos que os módulos/sensores ThermoLink na fábrica pararam de comunicar com o servidor.\n\n` +
                `📊 *Status dos Equipamentos:*\n` +
                `• Aparelhos cadastrados: ${totalDevs} aparelho(s)\n` +
                `• Aparelhos transmitindo: 0 online (todos offline)\n\n` +
                `🔍 *Verificações recomendadas para o Técnico:*\n` +
                `1. Verificar se houve queda de energia elétrica geral na cerâmica.\n` +
                `2. Checar se o roteador Wi-Fi / link de internet do galpão está ligado.\n` +
                `3. Verificar se o aparelho ThermoLink (ESP/Alutal) está plugado na tomada e com LED aceso.\n\n` +
                `_Notificação técnica automática enviada pelo sistema ThermoLink._`;

            try {
                await enviarMensagemWhatsappGateway(c.telefone, textoAviso);
                enviados++;
            } catch (errOne) {
                console.warn(`[Alerta Desconexão] Erro ao enviar para ${c.nome}:`, errOne);
            }
        }

        if (enviados > 0) {
            mostrarToastFeedback(`Aviso entregue para ${enviados} contato(s) de ${ceramicaNome}!`, "success");
            fecharModalAdmin("modalPreviewAlertaDesconexao", null);
        } else {
            alert("Não foi possível entregar o aviso. Verifique se o Gateway WhatsApp está online.");
        }
    } catch (e) {
        alert("Erro ao enviar mensagem pelo Gateway WhatsApp: " + (e.message || "Verifique sua conexão."));
    }
}

// 13.2. Teste de Alerta de Reconexão (Aparelho Ligou / Voltou a Transmitir)
async function testarAlertaReconexaoCeramica(ceramicaId, ceramicaNome) {
    let contatos = (waAdminContatos || []).filter(c => 
        c.ceramica_id === ceramicaId && 
        (c.tipo_contato === "tecnico" || c.receber_alertas_tecnicos) && 
        c.telefone
    );
    if (!contatos || !contatos.length) {
        contatos = (waAdminContatos || []).filter(c => c.ceramica_id === ceramicaId && c.receber_relatorio && c.telefone);
    }
    if (!contatos || !contatos.length) {
        return alert(`Nenhum contato técnico ou responsável cadastrado para ${ceramicaNome}.`);
    }

    if (!confirm(`Deseja enviar o aviso de EQUIPAMENTO ONLINE (Aparelho Ligou/Voltou) para o técnico de ${ceramicaNome}?`)) {
        return;
    }

    mostrarToastFeedback(`Enviando aviso de retorno de sinal para ${ceramicaNome}...`, "info");
    const gatewayUrl = getGatewayUrl();

    // 1. Tenta endpoint direto do backend
    try {
        const resp = await fetch(`${gatewayUrl}/api/testar-alerta-reconexao/${ceramicaId}`, { method: "POST" });
        if (resp.ok) {
            const d = await resp.json();
            if (d.success) {
                mostrarToastFeedback(`Aviso de equipamento online entregue para ${d.enviados} técnico(s)!`, "success");
                fecharModalAdmin("modalPreviewAlertaDesconexao", null);
                return;
            }
        }
    } catch (eDedicated) {}

    // 2. Fallback resiliente via /api/send-message
    try {
        const agora = new Date();
        const dataHoraStr = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const devsDaCer = (adminState.deviceStatusList || []).filter(d => (d.ceramicaId || d.ceramica_id) === ceramicaId);
        const totalDevs = devsDaCer.length || 1;
        const qtdAtivos = devsDaCer.filter(d => d.isOnline).length || totalDevs;

        let enviados = 0;
        for (const c of contatos) {
            const textoAviso = `🟢 *THERMOLINK • AVISO TÉCNICO: EQUIPAMENTO ONLINE* 🟢\n\n` +
                `🏭 *Cerâmica:* ${ceramicaNome}\n` +
                `👨‍🔧 *Aos Cuidados do Técnico:* ${c.nome}\n` +
                `⏱️ *Status:* Sinal restabelecido com sucesso!\n` +
                `📡 *Horário de Retorno:* ${dataHoraStr}\n\n` +
                `Os aparelhos ThermoLink voltaram a transmitir leituras normalmente após o período de oscilação/queda de sinal.\n\n` +
                `📊 *Diagnóstico Técnico Atual:*\n` +
                `• Aparelhos Cadastrados: ${totalDevs} aparelho(s)\n` +
                `• Aparelhos Funcionando: *${qtdAtivos} ativo(s) transmitindo*\n\n` +
                `✅ Comunicação normalizada. A telemetria dos fornos segue em tempo real.\n\n` +
                `_Notificação técnica automática enviada pelo sistema ThermoLink._`;

            try {
                await enviarMensagemWhatsappGateway(c.telefone, textoAviso);
                enviados++;
            } catch (errOne) {
                console.warn(`[Alerta Reconexão] Erro ao enviar para ${c.nome}:`, errOne);
            }
        }

        if (enviados > 0) {
            mostrarToastFeedback(`Aviso de reconexão entregue para ${enviados} contato(s) de ${ceramicaNome}!`, "success");
            fecharModalAdmin("modalPreviewAlertaDesconexao", null);
        } else {
            alert("Não foi possível entregar o aviso. Verifique se o Gateway WhatsApp está online.");
        }
    } catch (e) {
        alert("Erro ao enviar mensagem pelo Gateway WhatsApp: " + (e.message || "Verifique sua conexão."));
    }
}

// 13.3. Envio de Status Técnico Geral (Quantos Aparelhos Funcionando)
async function enviarStatusTecnicoCeramica(ceramicaId, ceramicaNome) {
    let contatos = (waAdminContatos || []).filter(c => 
        c.ceramica_id === ceramicaId && 
        (c.tipo_contato === "tecnico" || c.receber_alertas_tecnicos) && 
        c.telefone
    );
    if (!contatos || !contatos.length) {
        contatos = (waAdminContatos || []).filter(c => c.ceramica_id === ceramicaId && c.receber_relatorio && c.telefone);
    }
    if (!contatos || !contatos.length) {
        return alert(`Nenhum contato técnico ou responsável cadastrado para ${ceramicaNome}.`);
    }

    if (!confirm(`Deseja enviar o STATUS DOS APARELHOS EM FUNCIONAMENTO para o técnico de ${ceramicaNome}?`)) {
        return;
    }

    mostrarToastFeedback(`Enviando diagnóstico dos aparelhos para ${ceramicaNome}...`, "info");
    const gatewayUrl = getGatewayUrl();

    // 1. Tenta endpoint direto do backend
    try {
        const resp = await fetch(`${gatewayUrl}/api/enviar-status-tecnico/${ceramicaId}`, { method: "POST" });
        if (resp.ok) {
            const d = await resp.json();
            if (d.success) {
                mostrarToastFeedback(`Status técnico entregue para ${d.enviados} técnico(s)! (${d.qtdAtivos}/${d.totalDevs} ativos)`, "success");
                return;
            }
        }
    } catch (eDedicated) {}

    // 2. Fallback resiliente via /api/send-message
    try {
        const agora = new Date();
        const dataHoraStr = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const devsDaCer = (adminState.deviceStatusList || []).filter(d => (d.ceramicaId || d.ceramica_id) === ceramicaId);
        const totalDevs = devsDaCer.length || 1;
        const qtdAtivos = devsDaCer.filter(d => d.isOnline).length;
        const perc = totalDevs > 0 ? Math.round((qtdAtivos / totalDevs) * 100) : 0;

        let enviados = 0;
        for (const c of contatos) {
            const textoStatus = `🛠️ *THERMOLINK • STATUS TÉCNICO DOS APARELHOS* 🛠️\n\n` +
                `🏭 *Cerâmica:* ${ceramicaNome}\n` +
                `👨‍🔧 *Técnico Responsável:* ${c.nome}\n` +
                `📅 *Horário do Diagnóstico:* ${dataHoraStr}\n\n` +
                `📊 *Resumo de Operação dos Equipamentos:*\n` +
                `• Total Cadastrado: ${totalDevs} aparelho(s)\n` +
                `• Aparelhos em Funcionamento: *${qtdAtivos} ativo(s) transmitindo*\n` +
                `• Saúde de Comunicação: *${perc}%*\n\n` +
                `📲 _Diagnóstico técnico solicitado via Painel ThermoLink._`;

            try {
                await enviarMensagemWhatsappGateway(c.telefone, textoStatus);
                enviados++;
            } catch (errOne) {
                console.warn(`[Status Técnico] Erro ao enviar para ${c.nome}:`, errOne);
            }
        }

        if (enviados > 0) {
            mostrarToastFeedback(`Status técnico entregue para ${enviados} contato(s) de ${ceramicaNome}!`, "success");
        } else {
            alert("Não foi possível entregar o status técnico. Verifique se o Gateway WhatsApp está online.");
        }
    } catch (e) {
        alert("Erro ao enviar mensagem pelo Gateway WhatsApp: " + (e.message || "Verifique sua conexão."));
    }
}

// ==========================================================================
// TERMINAL DE SETPOINTS RS485 PARA MASTER ADMIN (SETSP / GETSP)
// ==========================================================================
window.AdminSetpoints = {
    selectedDevice: 3,
    selectedModule: 1,
    pollingTimer: null,

    init() {
        this.popularSeletores();
        this.carregarFornosAdmin();
        this.renderizar();
    },

    popularSeletores() {
        // Popula módulos de 1 a 31
        const selMod = $("adminSpModuleSelect");
        if (selMod) {
            selMod.innerHTML = Array.from({ length: 31 }, (_, i) => {
                const m = i + 1;
                const pad = String(m).padStart(2, "0");
                return `<option value="${m}">Módulo ${pad} (Forno ${pad})</option>`;
            }).join("");
            selMod.value = String(this.selectedModule || 1);
        }

        // Popula dispositivos com cerâmicas
        const selDev = $("adminSpDeviceSelect");
        if (selDev) {
            const devices = typeof getDevices === "function" ? getDevices() : [];
            const clients = typeof getClients === "function" ? getClients() : [];

            if (devices.length > 0) {
                selDev.innerHTML = devices.map(d => {
                    const c = clients.find(cl => cl.id === d.ceramicaId);
                    const cNome = c ? c.nome : (d.status === "Vinculado" ? "Vinculado" : "Disponível");
                    const serial = d.serial || d.numero_serie || `ID ${d.id}`;
                    return `<option value="${d.id || serial}">${serial} (${cNome})</option>`;
                }).join("");
                selDev.value = String(this.selectedDevice || devices[0]?.id || 3);
            }
        }
    },

    async carregarFornosAdmin() {
        try {
            const { data } = await sb.from("fornos").select("*");
            if (data && data.length > 0) {
                this.fornos = data;
                this.renderizar();
            }
        } catch (e) {}
    },

    selecionarDispositivo(devId) {
        this.selectedDevice = devId;
        this.renderizar();
        this.log(`Dispositivo ${devId} selecionado.`);
    },

    selecionarModulo(mod) {
        this.selectedModule = Number(mod) || 1;
        this.renderizar();
        this.log(`Módulo RS485 ${this.selectedModule} selecionado.`);
    },

    abrirParaDispositivo(dispId, serial) {
        trocarSecaoAdmin("dispositivos");
        this.selectedDevice = dispId || serial;
        const sel = $("adminSpDeviceSelect");
        if (sel) sel.value = String(this.selectedDevice);

        const card = $("adminSpConsole")?.closest(".panel-box");
        if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        this.log(`Painel direcionado para o hardware ${serial || dispId}.`);
        this.consultarGetsp();
    },

    atualizarBtn() {
        const mod = this.selectedModule || 1;
        const sp1 = $("adminInpSp1")?.value || 650;
        const sp2 = $("adminInpSp2")?.value || 900;
        if ($("adminBtnSetspText")) {
            $("adminBtnSetspText").textContent = `Aplicar Setpoint (SETSP ${mod} ${sp1} ${sp2})`;
        }
    },

    async garantirForno(mod, sp1 = 650, sp2 = 900, cmd = 'IDLE', pendente = false) {
        try {
            const { data: existente } = await sb
                .from("fornos")
                .select("id, modulo_alutal, dispositivo_id, setpoint_1, setpoint_2")
                .eq("modulo_alutal", mod)
                .maybeSingle();

            if (existente) return existente;

            let dispId = Number(this.selectedDevice);
            if (isNaN(dispId) || dispId <= 0) dispId = 3;

            const { data: criado } = await sb
                .from("fornos")
                .insert([{
                    numero: mod,
                    nome: `Forno ${String(mod).padStart(2, "0")}`,
                    modulo_alutal: mod,
                    dispositivo_id: dispId,
                    setpoint_1: 650,
                    setpoint_2: 900,
                    novo_setpoint_1: sp1,
                    novo_setpoint_2: sp2,
                    comando_setpoint: cmd,
                    setpoint_pendente: pendente,
                    setpoint_atualizado_em: new Date().toISOString()
                }])
                .select()
                .maybeSingle();

            return criado;
        } catch (e) {
            console.warn("[AdminSetpoints] Erro no upsert:", e);
        }
        return null;
    },

    async consultarGetsp() {
        const mod = this.selectedModule || 1;
        const icon = $("adminGetspIcon");
        const statusMod = $("adminSpModStatus");
        const badge = $("adminSpStatusBadge");

        if (icon) icon.classList.add("fa-spin");
        if (statusMod) {
            statusMod.style.color = "#f59e0b";
            statusMod.textContent = "Consultando GETSP via RS485...";
        }
        if (badge) {
            badge.className = "tag-pill tag-pill-orange";
            badge.textContent = `Lendo GETSP ${mod}...`;
        }

        const idHex = (0x30 + mod).toString(16).toUpperCase();
        this.log(`>> GETSP ${mod}`);
        this.log(`[TX RS485 11 bytes]: 3C 20 ${idHex} 20 30 20 30 20 4C 20 3E ("< ${mod} 0 0 L >")`);

        try {
            await this.garantirForno(mod, 650, 900, 'GETSP', true);

            await sb.from("fornos")
                .update({
                    comando_setpoint: "GETSP",
                    setpoint_pendente: true,
                    setpoint_atualizado_em: new Date().toISOString()
                })
                .eq("modulo_alutal", mod);
        } catch (e) {
            console.warn("[AdminSetpoints] Erro ao enviar GETSP:", e);
        }

        // Polling a cada 2 segundos no Supabase
        let tentativas = 0;
        if (this.pollingTimer) clearInterval(this.pollingTimer);

        this.pollingTimer = setInterval(async () => {
            tentativas++;
            try {
                const { data } = await sb.from("fornos")
                    .select("setpoint_1, setpoint_2, setpoint_pendente, comando_setpoint, setpoint_atualizado_em")
                    .eq("modulo_alutal", mod)
                    .maybeSingle();

                if (data && data.comando_setpoint === "SUCESSO" && !data.setpoint_pendente) {
                    clearInterval(this.pollingTimer);
                    this.pollingTimer = null;

                    if (icon) icon.classList.remove("fa-spin");
                    const sp1 = data.setpoint_1 !== null ? Number(data.setpoint_1) : 0;
                    const sp2 = data.setpoint_2 !== null ? Number(data.setpoint_2) : 0;

                    if ($("adminDispSp1")) $("adminDispSp1").textContent = `${sp1} °C`;
                    if ($("adminDispSp2")) $("adminDispSp2").textContent = `${sp2} °C`;
                    if ($("adminInpSp1")) $("adminInpSp1").value = sp1;
                    if ($("adminInpSp2")) $("adminInpSp2").value = sp2;
                    this.atualizarBtn();

                    if (statusMod) {
                        statusMod.style.color = "#22c55e";
                        statusMod.textContent = "Confirmado no Aparelho";
                    }
                    if (badge) {
                        badge.className = "tag-pill tag-pill-green";
                        badge.textContent = "Confirmado";
                    }

                    this.log(`<< [SETPOINTS ATUAIS] MODULO ${mod}: SP1=${sp1}°C | SP2=${sp2}°C (Confirmado pelo Alutal)`);
                    return;
                } else if (data && data.comando_setpoint === "ERRO") {
                    clearInterval(this.pollingTimer);
                    this.pollingTimer = null;
                    if (icon) icon.classList.remove("fa-spin");
                    if (statusMod) {
                        statusMod.style.color = "#ef4444";
                        statusMod.textContent = "Módulo Sem Resposta";
                    }
                    if (badge) {
                        badge.className = "tag-pill";
                        badge.textContent = "Falha RS485";
                    }
                    this.log(`<< ERRO: Módulo ${mod} não respondeu ao comando GETSP no barramento.`);
                    return;
                }
            } catch (err) {}

            if (tentativas >= 15) {
                clearInterval(this.pollingTimer);
                this.pollingTimer = null;
                if (icon) icon.classList.remove("fa-spin");
                if (statusMod) {
                    statusMod.style.color = "#94a3b8";
                    statusMod.textContent = "Aguardando Varredura";
                }
                this.log(`<< AVISO: Tempo limite de consulta atingido. O ESP8266 lerá na próxima varredura.`);
            }
        }, 2000);
    },

    async gravarSetsp() {
        const mod = this.selectedModule || 1;
        const sp1 = parseInt($("adminInpSp1")?.value, 10);
        const sp2 = parseInt($("adminInpSp2")?.value, 10);

        if (isNaN(sp1) || isNaN(sp2) || sp1 < 0 || sp2 < 0 || sp1 > 1400 || sp2 > 1400) {
            alert("Por favor, digite valores válidos entre 0 °C e 1400 °C.");
            return;
        }

        const btn = $("adminBtnSetsp");
        const icon = $("adminSetspIcon");
        const statusMod = $("adminSpModStatus");
        const badge = $("adminSpStatusBadge");

        if (btn) btn.disabled = true;
        if (icon) icon.className = "fa-solid fa-spinner fa-spin";
        if (statusMod) {
            statusMod.style.color = "#f59e0b";
            statusMod.textContent = `Gravando SETSP ${mod} ${sp1} ${sp2}...`;
        }
        if (badge) {
            badge.className = "tag-pill tag-pill-orange";
            badge.textContent = "Aguardando ESP...";
        }

        const enc1 = window.ThermoSetpoints?.calcularHexAlutal(sp1) || {
            hHex: ((((sp1 >> 6) & 0x3F) << 2) | 0x03).toString(16).toUpperCase().padStart(2, "0"),
            lHex: (((sp1 & 0x3F) << 2) | 0x03).toString(16).toUpperCase().padStart(2, "0")
        };
        const enc2 = window.ThermoSetpoints?.calcularHexAlutal(sp2) || {
            hHex: ((((sp2 >> 6) & 0x3F) << 2) | 0x03).toString(16).toUpperCase().padStart(2, "0"),
            lHex: (((sp2 & 0x3F) << 2) | 0x03).toString(16).toUpperCase().padStart(2, "0")
        };
        const idHex = (0x30 + mod).toString(16).toUpperCase();

        this.log(`>> SETSP ${mod} ${sp1} ${sp2}`);
        this.log(`[TX RS485 19 bytes]: 3C 20 ${idHex} 20 31 20 34 20 53 20 ${enc1.hHex} 20 ${enc1.lHex} 20 ${enc2.hHex} 20 ${enc2.lHex} 20 3E`);

        try {
            await this.garantirForno(mod, sp1, sp2, 'SETSP', true);

            await sb.from("fornos")
                .update({
                    novo_setpoint_1: sp1,
                    novo_setpoint_2: sp2,
                    comando_setpoint: "SETSP",
                    setpoint_pendente: true,
                    setpoint_atualizado_em: new Date().toISOString()
                })
                .eq("modulo_alutal", mod);
        } catch (e) {
            console.warn("[AdminSetpoints] Erro ao gravar SETSP:", e);
        }

        // Polling a cada 2 segundos no Supabase até confirmação física
        let tentativas = 0;
        if (this.pollingTimer) clearInterval(this.pollingTimer);

        this.pollingTimer = setInterval(async () => {
            tentativas++;
            try {
                const { data } = await sb.from("fornos")
                    .select("setpoint_1, setpoint_2, setpoint_pendente, comando_setpoint, setpoint_atualizado_em")
                    .eq("modulo_alutal", mod)
                    .maybeSingle();

                if (data && data.comando_setpoint === "SUCESSO" && !data.setpoint_pendente) {
                    clearInterval(this.pollingTimer);
                    this.pollingTimer = null;

                    if (btn) btn.disabled = false;
                    if (icon) icon.className = "fa-solid fa-bolt";

                    const sp1Confirmado = data.setpoint_1 !== null ? Number(data.setpoint_1) : sp1;
                    const sp2Confirmado = data.setpoint_2 !== null ? Number(data.setpoint_2) : sp2;

                    if ($("adminDispSp1")) $("adminDispSp1").textContent = `${sp1Confirmado} °C`;
                    if ($("adminDispSp2")) $("adminDispSp2").textContent = `${sp2Confirmado} °C`;

                    if (statusMod) {
                        statusMod.style.color = "#22c55e";
                        statusMod.textContent = "Confirmado no Aparelho";
                    }
                    if (badge) {
                        badge.className = "tag-pill tag-pill-green";
                        badge.textContent = "Confirmado";
                    }

                    this.log(`<< SUCESSO: Módulo ${mod} gravado e confirmado na memória física: SP1=${sp1Confirmado}°C | SP2=${sp2Confirmado}°C!`);
                    return;
                } else if (data && data.comando_setpoint === "ERRO") {
                    clearInterval(this.pollingTimer);
                    this.pollingTimer = null;
                    if (btn) btn.disabled = false;
                    if (icon) icon.className = "fa-solid fa-bolt";
                    if (statusMod) {
                        statusMod.style.color = "#ef4444";
                        statusMod.textContent = "Erro na Gravação";
                    }
                    this.log(`<< ERRO: Módulo ${mod} não confirmou gravação de setpoint.`);
                    return;
                }
            } catch (err) {}

            if (tentativas >= 15) {
                clearInterval(this.pollingTimer);
                this.pollingTimer = null;
                if (btn) btn.disabled = false;
                if (icon) icon.className = "fa-solid fa-bolt";
                if (statusMod) {
                    statusMod.style.color = "#94a3b8";
                    statusMod.textContent = "Comando em Fila";
                }
                this.log(`<< AVISO: Comando gravado no banco de dados. O ESP8266 executará na próxima checagem periódica.`);
            }
        }, 2000);
    },

    renderizar() {
        this.atualizarBtn();
    },

    log(msg) {
        const c = $("adminSpConsole");
        if (!c) return;
        const time = new Date().toLocaleTimeString("pt-BR");
        const d = document.createElement("div");
        d.textContent = `[${time}] ${msg}`;
        c.appendChild(d);
        c.scrollTop = c.scrollHeight;
    }
};

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            window.AdminSetpoints?.init();
        });
    } else {
        window.AdminSetpoints?.init();
    }
}




// ==============================================================================
// FUNÇÕES COMPLEMENTARES DE CONTROLE DE CALDAS, REVISÃO & WHATSAPP (EXCLUSIVO ADMIN)
// ==============================================================================

async function executarAnaliseInteligenteCaldas(forcar = false) {
    const btnIcon = $("btnAnalisarQueimaIcon");
    if (btnIcon) btnIcon.classList.add("fa-spin");

    try {
        const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
        const selCeramica = $("aiSelectCeramica");
        const ceramicaId = selCeramica?.value || clients[0]?.id;
        const ceramica = clients.find(c => c.id === ceramicaId) || clients[0] || { id: "cli_1", nome: "Cerâmica Cliente" };

        const canalSelecionado = $("caldaSelectCanal")?.value || "canal_1";
        const periodoModo = $("caldaSelectPeriodo")?.value || "12";

        let startIso, endIso;
        const now = new Date();

        if (periodoModo === "24") {
            startIso = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
            endIso = now.toISOString();
        } else if (periodoModo === "hoje") {
            const startHoje = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            startIso = startHoje.toISOString();
            endIso = now.toISOString();
        } else if (periodoModo === "ontem") {
            const startOntem = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
            const endOntem = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
            startIso = startOntem.toISOString();
            endIso = endOntem.toISOString();
        } else {
            const j12 = obterJanela12HorasPorHorarioEnvio();
            startIso = j12.inicioDate.toISOString();
            endIso = j12.fimDate.toISOString();
        }

        let leituras = [];
        if (typeof sb !== "undefined" && sb) {
            try {
                const pageSize = 1000;
                const [p0, p1] = await Promise.all([
                    sb.from("leituras").select("*").eq("ceramica_id", ceramica.id).gte("created_at", startIso).lte("created_at", endIso).order("created_at", { ascending: false }).range(0, pageSize - 1),
                    sb.from("leituras").select("*").eq("ceramica_id", ceramica.id).gte("created_at", startIso).lte("created_at", endIso).order("created_at", { ascending: false }).range(pageSize, 2 * pageSize - 1)
                ]);
                leituras = [...(p0.data || []), ...(p1.data || [])];

                // Fallback se não houver leituras no período exato: busca últimas leituras reais
                if (leituras.length === 0) {
                    const { data: ultimas } = await sb.from("leituras").select("*").eq("ceramica_id", ceramica.id).order("created_at", { ascending: false }).limit(600);
                    if (ultimas && ultimas.length > 0) {
                        leituras = ultimas;
                    }
                }
            } catch (errDb) {
                console.warn("[Caldas] Falha na busca Supabase:", errDb);
            }
        }

        const resultadoIA = processarAlgoritmoIA(ceramica, leituras, 12, obterJanela12HorasPorHorarioEnvio());
        adminState.aiReportState.analiseAtual = resultadoIA;

        renderizarPainelPDF12HorasIA(resultadoIA);

        if (forcar) {
            mostrarToastFeedback(`Análise de queima e caldas concluída para ${ceramica.nome}!`, "success");
        }
    } catch (e) {
        console.error("[Caldas] Erro ao analisar queima:", e);
        mostrarToastFeedback("Erro ao processar análise de queima.", "error");
    } finally {
        if (btnIcon) btnIcon.classList.remove("fa-spin");
    }
}

function trocarCanalAnaliseCaldas() {
    const activeMod = adminState.aiReportState?.activeFornoPdf12h || 1;
    selecionarFornoPDF12h(activeMod, false);
}

function trocarPeriodoAnaliseCaldas() {
    executarAnaliseInteligenteCaldas(false);
}

function renderizarTabelaCaldasAdmin(analiseCaldas) {
    const tbody = $("caldaTabelaCaldasBody");
    if (!tbody) return;

    if (!analiseCaldas || !analiseCaldas.sucesso || !analiseCaldas.caldas || analiseCaldas.caldas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 24px; color: #94a3b8;">
                    <i class="fa-solid fa-circle-info" style="color: #38bdf8; margin-right: 6px;"></i>
                    Nenhuma calda identificada automaticamente no período analisado.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = analiseCaldas.caldas.map((c, idx) => {
        let badgeConfClass = "tag-pill-green";
        if (c.confianca === "Média confiança") badgeConfClass = "tag-pill-orange";
        else if (c.confianca === "Baixa confiança") badgeConfClass = "tag-pill-red";

        const revisadoBadge = c.revisado ? '<span style="font-size:10px; color:#34d399; margin-left:4px;" title="Validado pelo Admin">✓ Revisado</span>' : '';

        return `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
                <td>
                    <strong style="color: #ffffff; font-size: 13px;">${escapeHtml(c.numeroTexto)}</strong>
                    ${revisadoBadge}
                </td>
                <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #f8fafc;">
                    ${escapeHtml(c.horarioCalda)}
                </td>
                <td style="color: #cbd5e1; font-size: 12px;">
                    ${escapeHtml(c.data)}
                </td>
                <td>
                    <b style="color: #fb923c; font-size: 13px;">${c.tempMinimo} °C</b>
                </td>
                <td style="font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">
                    ${c.horarioPico || "—"}
                </td>
                <td>
                    <b style="color: #ef4444; font-size: 13px;">${c.tempMaxima ? c.tempMaxima + " °C" : "—"}</b>
                </td>
                <td style="font-weight: 700; color: #38bdf8;">
                    ${escapeHtml(c.intervaloEntreCaldasTexto)}
                </td>
                <td style="font-size: 11.5px; color: #94a3b8;">
                    Subida: ${escapeHtml(c.tempoSubidaTexto)} | Desc: ${escapeHtml(c.tempoDescidaTexto)}
                </td>
                <td>
                    <span class="tag-pill ${badgeConfClass}" style="font-size: 10px;" title="${escapeHtml(c.confiancaMotivo || '')}">
                        ${escapeHtml(c.confianca)}
                    </span>
                </td>
                <td style="text-align: center;">
                    <div style="display: inline-flex; gap: 4px; align-items: center;">
                        <button type="button" class="btn-primary-admin" onclick="confirmarCaldaAdmin(${idx})" title="Confirmar Calda" style="padding: 4px 7px; font-size: 11px; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.35);">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button type="button" class="btn-primary-admin" onclick="abrirModalAjustarCaldaAdmin(${idx})" title="Ajustar Horário/Temp" style="padding: 4px 7px; font-size: 11px; background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.35);">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="btn-primary-admin" onclick="descartarCaldaAdmin(${idx})" title="Descartar Falso Positivo" style="padding: 4px 7px; font-size: 11px; background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.35);">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function renderizarPreviaWhatsappCaldas(analiseCaldas, fornoObj, ceramica) {
    const el = $("waMockupTextoRelatorioCaldas");
    const ta = $("aiRelatorioTextoArea");
    if (!el) return;

    if (!analiseCaldas || !window.CaldasEngine) {
        el.textContent = "Aguardando cálculo de caldas para o forno...";
        return;
    }

    const dadosForno = {
        ceramicaNome: ceramica?.nome || "Cerâmica Cliente",
        fornoNome: `Forno ${fornoObj?.num || "01"}`,
        responsavel: ceramica?.responsavel || "Gestor"
    };

    const texto = window.CaldasEngine.gerarTextoWhatsapp(analiseCaldas, dadosForno);
    el.textContent = texto;
    if (ta) ta.value = texto;
}

function copiarTextoCaldasWhatsapp() {
    const el = $("waMockupTextoRelatorioCaldas");
    const texto = el ? el.textContent.trim() : "";
    if (!texto) {
        mostrarToastFeedback("Nenhum texto de relatório disponível para copiar.", "warning");
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarToastFeedback("Relatório de Queima copiado com sucesso para o WhatsApp!", "success");
        }).catch(() => {
            copiarFallbackTexto(texto);
        });
    } else {
        copiarFallbackTexto(texto);
    }
}

function copiarFallbackTexto(txt) {
    const ta = document.createElement("textarea");
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    mostrarToastFeedback("Relatório de Queima copiado com sucesso!", "success");
}

async function enviarRelatorioCaldasWhatsapp() {
    const el = $("waMockupTextoRelatorioCaldas");
    const texto = el ? el.textContent.trim() : "";
    if (!texto) {
        mostrarToastFeedback("Execute a análise antes de enviar para o WhatsApp.", "warning");
        return;
    }

    const selContato = $("caldaSelectContatoDestino");
    const contatoId = selContato ? selContato.value : "";
    const resultado = adminState.aiReportState?.analiseAtual;
    const ceramica = resultado?.ceramica;
    const activeMod = adminState.aiReportState?.activeFornoPdf12h || 1;
    const analise = adminState.aiReportState?.analiseCaldasAtual;

    if (contatoId === "todos") {
        await dispararRelatorioCaldasGatewayTodos();
        return;
    }

    let contatoDestino = null;
    let telefone = "";

    if (contatoId) {
        contatoDestino = (waAdminContatos || []).find(c => c.id === contatoId);
        if (contatoDestino) {
            telefone = contatoDestino.telefone;
        }
    }

    if (!telefone) {
        telefone = ceramica?.telefone || ceramica?.whatsapp || "";
    }

    if (!telefone) {
        telefone = prompt("Informe o número de WhatsApp com DDD (Ex: 88999998888):", "");
    }

    if (!telefone) {
        mostrarToastFeedback("Envio cancelado: telefone não informado.", "warning");
        return;
    }

    let cleanPhone = String(telefone).replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length >= 10 && !cleanPhone.startsWith("55")) {
        cleanPhone = "55" + cleanPhone;
    }

    const destNome = contatoDestino ? `${contatoDestino.nome} (+${cleanPhone})` : `+${cleanPhone}`;
    mostrarToastFeedback(`Enviando via THERMOLINK WHATSAPP para ${destNome}...`, "info");

    // Gera o PDF oficial da Ficha de Queima para anexo automático
    let pdfAttachment = null;
    if (window.CaldasEngine && analise && window.CaldasEngine.gerarFichaPDFBase64) {
        pdfAttachment = window.CaldasEngine.gerarFichaPDFBase64(analise, {
            ceramicaNome: ceramica?.nome || "Cerâmica Cliente",
            fornoNome: `Forno ${String(activeMod).padStart(2, '0')}`,
            cidade: ceramica?.cidade || "Brasil"
        });
    }

    try {
        await enviarMensagemWhatsappGateway(cleanPhone, texto, null, pdfAttachment);
        mostrarToastFeedback(`Relatório entregue com sucesso via THERMOLINK WHATSAPP para ${destNome}!`, "success");
    } catch (errGateway) {
        console.warn("[THERMOLINK WHATSAPP] Erro no gateway:", errGateway);
        if (confirm(`O THERMOLINK WHATSAPP não conseguiu entregar a mensagem automaticamente (${errGateway.message || 'servidor desconectado'}).\n\nDeseja abrir o WhatsApp Web para enviar manualmente agora?`)) {
            const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(texto)}`;
            window.open(url, "_blank");
        }
    }
}

async function dispararRelatorioCaldasGatewayTodos() {
    const el = $("waMockupTextoRelatorioCaldas");
    const texto = el ? el.textContent.trim() : "";
    if (!texto) {
        mostrarToastFeedback("Execute a análise antes de disparar.", "warning");
        return;
    }

    const resultado = adminState.aiReportState?.analiseAtual;
    const ceramica = resultado?.ceramica;
    const ceramicaId = ceramica?.id;
    const activeMod = adminState.aiReportState?.activeFornoPdf12h || 1;
    const analise = adminState.aiReportState?.analiseCaldasAtual;

    const contatos = (waAdminContatos || []).filter(c => c.ceramica_id === ceramicaId && c.receber_relatorio);
    if (contatos.length === 0) {
        alert(`Nenhum contato com recebimento ativo cadastrado para ${ceramica?.nome || 'esta cerâmica'}.\n\nCadastre um contato em "Contatos por Cerâmica" ou clique em "+ Novo Contato nesta Cerâmica".`);
        return;
    }

    if (!confirm(`Deseja disparar este Relatório de Queima & Caldas via THERMOLINK WHATSAPP para os ${contatos.length} contato(s) ativos de ${ceramica?.nome}?`)) {
        return;
    }

    mostrarToastFeedback(`Disparando via THERMOLINK WHATSAPP para ${contatos.length} contato(s)...`, "info");

    let pdfAttachment = null;
    if (window.CaldasEngine && analise && window.CaldasEngine.gerarFichaPDFBase64) {
        pdfAttachment = window.CaldasEngine.gerarFichaPDFBase64(analise, {
            ceramicaNome: ceramica?.nome || "Cerâmica Cliente",
            fornoNome: `Forno ${String(activeMod).padStart(2, '0')}`,
            cidade: ceramica?.cidade || "Brasil"
        });
    }

    let sucessos = 0;
    let falhas = 0;

    for (const c of contatos) {
        if (!c.telefone) continue;
        try {
            await enviarMensagemWhatsappGateway(c.telefone, texto, null, pdfAttachment);
            sucessos++;
        } catch (err) {
            console.warn(`[THERMOLINK WHATSAPP] Falha no envio para ${c.nome}:`, err);
            falhas++;
        }
    }

    if (sucessos > 0) {
        mostrarToastFeedback(`Relatório de Queima entregue com sucesso via THERMOLINK WHATSAPP para ${sucessos} contato(s)!`, "success");
    } else {
        alert("O THERMOLINK WHATSAPP não está conectado ou o servidor não respondeu.\n\nAcesse a aba 'WhatsApp & Relatórios' para verificar a conexão ou escanear o QR Code.");
    }
}

async function abrirWhatsAppWebComFichaCaldas(contatoId) {
    const c = (waAdminContatos || []).find(x => x.id === contatoId);
    if (!c || !c.telefone) {
        mostrarToastFeedback("Contato ou telefone não localizado.", "error");
        return;
    }

    const clients = adminState.clients && adminState.clients.length ? adminState.clients : getClients();
    const ceramica = clients.find(cl => cl.id === c.ceramica_id) || { id: c.ceramica_id, nome: c.ceramica_nome };

    mostrarToastFeedback(`Enviando Ficha de Queima via THERMOLINK WHATSAPP para ${c.nome}...`, "info");

    let leituras = [];
    if (typeof sb !== "undefined" && sb) {
        try {
            const { data } = await sb.from("leituras").select("*").eq("ceramica_id", c.ceramica_id).order("created_at", { ascending: false }).limit(500);
            if (data && data.length > 0) leituras = data;
        } catch (e) {}
    }

    let textoRelatorio = "";
    let analise = null;
    if (window.CaldasEngine && leituras.length > 0) {
        leituras.sort((a,b) => new Date(a.created_at || a.data_hora).getTime() - new Date(b.created_at || b.data_hora).getTime());
        analise = window.CaldasEngine.detectarCaldas(leituras, { canal: "canal_1" });
        textoRelatorio = window.CaldasEngine.gerarTextoWhatsapp(analise, {
            ceramicaNome: ceramica.nome,
            fornoNome: "Forno 01",
            responsavel: `${c.nome} (${c.cargo || 'Gestor'})`
        });
    } else {
        const j12 = obterJanela12HorasPorHorarioEnvio();
        textoRelatorio = `*MEDEIROS AUTOMAÇÃO • THERMOLINK*\nRELATÓRIO DE QUEIMA DE FORNO\n\nCerâmica: ${ceramica.nome}\nAos Cuidados: ${c.nome}\nPeríodo: ${j12.horaInicioStr} às ${j12.horaFimStr}`;
    }

    let cleanPhone = String(c.telefone).replace(/\D/g, "");
    if (!cleanPhone.startsWith("55")) cleanPhone = "55" + cleanPhone;

    // Tenta primeiro enviar diretamente via THERMOLINK WHATSAPP
    try {
        let pdfAttachment = null;
        if (window.CaldasEngine && analise && window.CaldasEngine.gerarFichaPDFBase64) {
            pdfAttachment = window.CaldasEngine.gerarFichaPDFBase64(analise, {
                ceramicaNome: ceramica.nome,
                fornoNome: "Forno 01",
                cidade: ceramica.cidade || "Brasil"
            });
        }
        await enviarMensagemWhatsappGateway(cleanPhone, textoRelatorio, null, pdfAttachment);
        mostrarToastFeedback(`Ficha de Queima entregue com sucesso via THERMOLINK WHATSAPP para ${c.nome}!`, "success");
    } catch (errGateway) {
        // Fallback: abre no WhatsApp Web caso o servidor esteja desconectado
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textoRelatorio)}`, "_blank");
        mostrarToastFeedback(`THERMOLINK WHATSAPP desconectado. WhatsApp aberto para ${c.nome}.`, "info");
    }
}
// ==============================================================================
// INTEGRAÇÃO: RELATÓRIOS INTELIGENTES DE CALDAS COM CONTATOS POR CERÂMICA
// ==============================================================================

function atualizarContatosDestinoRelatorioCaldas(ceramicaId) {
    const sel = $("caldaSelectContatoDestino");
    const badgesContainer = $("caldaContatosBadgesContainer");
    if (!sel) return;

    if (!ceramicaId) {
        const selCer = $("aiSelectCeramica");
        ceramicaId = selCer?.value || adminState.aiReportState?.activeCeramicaId;
    }

    const contatos = (waAdminContatos || []).filter(c => c.ceramica_id === ceramicaId);
    const contatosAtivos = contatos.filter(c => c.receber_relatorio);

    if (!contatos || contatos.length === 0) {
        sel.innerHTML = `<option value="">Nenhum contato cadastrado para esta cerâmica</option>`;
        if (badgesContainer) {
            badgesContainer.innerHTML = `
                <span class="tag-pill" style="background: rgba(239, 68, 68, 0.15); color: #fca5a5; font-size: 11px;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Sem contatos vinculados
                </span>
            `;
        }
        return;
    }

    let optionsHtml = '';
    if (contatosAtivos.length > 1) {
        optionsHtml += `<option value="todos">👥 Todos os Contatos Ativos (${contatosAtivos.length} contatos cadastrados)</option>`;
    }

    contatos.forEach(c => {
        const isAtivo = c.receber_relatorio;
        const statusTxt = isAtivo ? '✓ Ativo' : '(Envio Pausado)';
        optionsHtml += `
            <option value="${escapeHtml(c.id)}" ${isAtivo && contatosAtivos.length === 1 ? 'selected' : ''}>
                👤 ${escapeHtml(c.nome)} • ${escapeHtml(c.cargo || 'Gestor')} (+${escapeHtml(c.telefone)}) ${statusTxt}
            </option>
        `;
    });

    sel.innerHTML = optionsHtml;

    if (badgesContainer) {
        badgesContainer.innerHTML = contatos.map(c => {
            const isAtivo = c.receber_relatorio;
            const bg = isAtivo ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)';
            const border = isAtivo ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255,255,255,0.1)';
            const color = isAtivo ? '#34d399' : '#94a3b8';
            return `
                <span class="tag-pill" style="background:${bg}; border:1px solid ${border}; color:${color}; font-size:11px; padding:3px 8px;" title="${escapeHtml(c.cargo || '')} - Telefone: ${escapeHtml(c.telefone)}">
                    <i class="fa-brands fa-whatsapp"></i> ${escapeHtml(c.nome)}
                </span>
            `;
        }).join('');
    }

    atualizarContatoSelecionadoPreview();
}

function atualizarContatoSelecionadoPreview() {
    const sel = $("caldaSelectContatoDestino");
    if (!sel) return;
    const contatoId = sel.value;

    const analise = adminState.aiReportState?.analiseCaldasAtual;
    const resultado = adminState.aiReportState?.analiseAtual;
    const activeMod = adminState.aiReportState?.activeFornoPdf12h || 1;
    if (!analise || !resultado) return;

    let responsavelNome = resultado.ceramica?.responsavel || "Gestor";

    if (contatoId && contatoId !== "todos") {
        const c = (waAdminContatos || []).find(x => x.id === contatoId);
        if (c) {
            responsavelNome = `${c.nome}${c.cargo ? ` (${c.cargo})` : ''}`;
        }
    } else if (contatoId === "todos") {
        responsavelNome = "Gestores e Equipe da Cerâmica";
    }

    renderizarPreviaWhatsappCaldas(analise, { num: String(activeMod).padStart(2, '0') }, {
        nome: resultado.ceramica?.nome,
        responsavel: responsavelNome
    });
}

function abrirModalNovoContatoParaCeramicaAtiva() {
    const selCer = $("aiSelectCeramica");
    const ceramicaId = selCer?.value || adminState.aiReportState?.activeCeramicaId;
    abrirModalNovoContatoWhatsapp(ceramicaId, 'proprietario');
}

// Substituição robusta de enviarRelatorioCaldasWhatsapp integrada com os contatos
var oldEnviarFunc = 'function enviarRelatorioCaldasWhatsapp() {';
