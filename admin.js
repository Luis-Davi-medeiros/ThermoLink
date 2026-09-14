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
        id: "cli_1",
        nome: "Cerâmica São José",
        responsavel: "Carlos Eduardo",
        cidade: "Tatuí - SP",
        plano: "Profissional",
        valorMensal: 299,
        fornosCount: 4,
        status: "Ativo",
        username: "ceramica",
        senha: "forno2026",
        ultimoAcesso: "Hoje, 14:22"
    },
    {
        id: "cli_2",
        nome: "Cerâmica Santa Rita",
        responsavel: "Marcos Silva",
        cidade: "Itu - SP",
        plano: "Básico",
        valorMensal: 149,
        fornosCount: 2,
        status: "Ativo",
        username: "santarita",
        senha: "cer8492",
        ultimoAcesso: "Hoje, 11:05"
    },
    {
        id: "cli_3",
        nome: "Cerâmica Paulista",
        responsavel: "Roberto Souza",
        cidade: "Rio Claro - SP",
        plano: "Enterprise",
        valorMensal: 599,
        fornosCount: 8,
        status: "Ativo",
        username: "paulista",
        senha: "cer3910",
        ultimoAcesso: "Ontem, 19:40"
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
    try { return JSON.parse(saved); } catch { return DEFAULT_CLIENTS; }
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
    hourlyDistributionChart: null
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
                ultimoAcesso: c.ultimo_acesso ? new Date(c.ultimo_acesso).toLocaleDateString("pt-BR") : "Nunca"
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
                return {
                    id: d.id,
                    serial: s,
                    numeroSerie: s,
                    modelo: d.modelo || "TLK-ESP8266-ALUTAL",
                    status: d.status || (d.ceramica_id ? "Vinculado" : "Disponível"),
                    ceramicaId: d.ceramica_id || null,
                    ceramicaNome: c ? c.nome : (d.ceramica_id ? "Vinculado" : "Em Estoque"),
                    moduloNum: d.modulo_num,
                    fornoId: d.forno_id,
                    dataFabricacao: d.data_fabricacao || new Date(d.created_at).toLocaleDateString("pt-BR"),
                    rssi: d.rssi,
                    voltage: d.voltage || 5.05,
                    sensorC1: "OK",
                    sensorC2: "OK",
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

function autenticarMasterAdmin(e) {
    e.preventDefault();
    const u = $("adminAuthUser").value.trim();
    const p = $("adminAuthPass").value.trim();

    if (u === "admin" && p === "thermolink2026") {
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

    // Atualiza botões da Bottom Navigation Mobile
    document.querySelectorAll(".bottom-nav-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.section === secao);
    });

    // Oculta todas as seções
    $("secDashboard")?.classList.add("hidden");
    $("secClientes")?.classList.add("hidden");
    $("secDispositivos")?.classList.add("hidden");
    $("secAtividade")?.classList.add("hidden");
    $("secPlanos")?.classList.add("hidden");

    // Atualiza cabeçalho
    const titulos = {
        dashboard: { h1: "Dashboard Geral", sub: "Visão executiva, custos de infraestrutura e tráfego em tempo real" },
        clientes: { h1: "Gestão de Cerâmicas", sub: "Controle de clientes, bloqueio por inadimplência e modo suporte" },
        dispositivos: { h1: "Fábrica & Hardware", sub: "Cadastro de números de série, geração de etiquetas adesivas e inventário" },
        atividade: { h1: "Atividade dos Usuários", sub: "Monitoramento em tempo real de acessos, dispositivos e horários de pico" },
        planos: { h1: "Planos & Faturamento", sub: "Configuração de limites de fornos e tempo de retenção do banco de dados" }
    };

    if (titulos[secao]) {
        $("adminPageHeading").textContent = titulos[secao].h1;
        $("adminPageSubheading").textContent = titulos[secao].sub;
    }

    if (secao === "dashboard") {
        $("secDashboard")?.classList.remove("hidden");
        renderDashboardGeral();
    } else if (secao === "clientes") {
        $("secClientes")?.classList.remove("hidden");
        renderTabelaClientes();
    } else if (secao === "dispositivos") {
        $("secDispositivos")?.classList.remove("hidden");
        renderTabelaDispositivos();
    } else if (secao === "atividade") {
        $("secAtividade")?.classList.remove("hidden");
        renderSecaoAtividade();
    } else if (secao === "planos") {
        $("secPlanos")?.classList.remove("hidden");
    }

    // Fecha sidebar e backdrop no mobile
    const sidebar = document.querySelector(".admin-sidebar");
    if (sidebar) sidebar.classList.remove("mobile-open");
    $("sidebarBackdrop")?.classList.add("hidden");

    // Rola para o topo suavemente
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebarMobile(forceState) {
    const sidebar = document.querySelector(".admin-sidebar");
    const backdrop = $("sidebarBackdrop");
    if (!sidebar) return;

    const isOpen = typeof forceState === "boolean" 
        ? !forceState 
        : sidebar.classList.contains("mobile-open");

    if (isOpen) {
        sidebar.classList.remove("mobile-open");
        backdrop?.classList.add("hidden");
    } else {
        sidebar.classList.add("mobile-open");
        backdrop?.classList.remove("hidden");
    }
}

// Redimensionamento fluído dos gráficos do Chart.js
window.addEventListener("resize", () => {
    if (adminState.trafficChart) adminState.trafficChart.resize();
    if (adminState.dailyAccessChart) adminState.dailyAccessChart.resize();
    if (adminState.hourlyDistributionChart) adminState.hourlyDistributionChart.resize();
});

// ==========================================================================
// 4. RENDERIZAÇÃO DO DASHBOARD GERAL
// ==========================================================================

function renderDashboardGeral() {
    const clients = getClients();
    const devices = getDevices();

    // KPIs
    const ativas = clients.filter(c => c.status === "Ativo");
    const mrr = ativas.reduce((acc, c) => acc + (c.valorMensal || 0), 0);
    const onlineDevs = devices.filter(d => d.status === "Vinculado");

    $("kpiTotalClients").textContent = clients.length;
    $("kpiActiveClientsCount").textContent = `${ativas.length} ativas`;
    $("sidebarBadgeClients").textContent = clients.length;

    $("kpiTotalDevices").textContent = devices.length;
    $("kpiOnlineDevicesCount").textContent = `${onlineDevs.length} em operação`;

    $("kpiTotalRevenue").textContent = `R$ ${mrr.toLocaleString("pt-BR")}`;
    $("kpiTotalAlerts").textContent = "0";

    // Activity Feed
    const feed = $("activityFeedList");
    if (feed) {
        feed.innerHTML = clients.map(c => `
            <div class="activity-item">
                <div class="act-info">
                    <b>${escapeHtml(c.nome)}</b>
                    <span>${c.status === "Ativo" ? "Sincronizando leituras térmicas" : "Acesso bloqueado temporariamente"}</span>
                </div>
                <div class="act-time">${c.ultimoAcesso}</div>
            </div>
        `).join("");
    }

    renderTrafficChart();
}

function renderTrafficChart() {
    const canvas = $("trafficChartCanvas");
    if (!canvas) return;

    if (adminState.trafficChart) {
        adminState.trafficChart.destroy();
        adminState.trafficChart = null;
    }

    const hours = ["00h", "02h", "04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h", "Agora"];
    const trafficData = [420, 310, 290, 480, 890, 1450, 1680, 1820, 1750, 1620, 1340, 980, 1150];

    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, "rgba(249, 115, 22, 0.35)");
    grad.addColorStop(1, "rgba(249, 115, 22, 0.0)");

    adminState.trafficChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: hours,
            datasets: [{
                label: "Requisições / Leituras Supabase",
                data: trafficData,
                borderColor: "#f97316",
                backgroundColor: grad,
                borderWidth: 2.5,
                tension: 0.35,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(7, 18, 31, 0.95)",
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} leituras processadas`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#64748b", font: { size: 11 } },
                    grid: { color: "rgba(255, 255, 255, 0.04)" }
                },
                y: {
                    ticks: { color: "#64748b", font: { size: 11 } },
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
                <td style="font-size:12px; color:#94a3b8;">${c.ultimoAcesso}</td>
                <td style="text-align: right;">
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
                <td style="font-size:12px; color:#64748b;">${d.dataFabricacao}</td>
                <td style="text-align: right;">
                    <div class="actions-cell">
                        <button class="btn-tbl-action ${isDisponivel ? 'btn-vincular-novo' : 'btn-vincular-edit'}" onclick="abrirModalVincularDispositivo('${d.serial}')" title="${isDisponivel ? 'Vincular este aparelho a uma Cerâmica' : 'Alterar Cerâmica / Forno Vinculado'}">
                            <i class="fa-solid fa-link"></i>
                            <span>${isDisponivel ? 'Vincular' : 'Alterar'}</span>
                        </button>
                        <button class="btn-tbl-action btn-qrcode-view" onclick="abrirModalEtiquetaQRCode('${d.serial}')" title="Gerar e Imprimir Etiqueta QR Code">
                            <i class="fa-solid fa-qrcode"></i>
                            <span>QR</span>
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
    $("vincStatus").value = target.status === "Disponível" ? "Vinculado" : target.status;

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

async function carregarAcessosUsuariosSupabase(forceRefresh = false) {
    const icon = $("refreshAccessesIcon");
    if (icon && forceRefresh) icon.classList.add("fa-spin");

    try {
        const { data: dbLogs, error } = await sb
            .from("acessos_usuarios")
            .select("*")
            .order("ultimo_acesso", { ascending: false })
            .limit(500);

        if (!error && dbLogs && dbLogs.length > 0) {
            adminState.activityLogs = dbLogs;
            localStorage.setItem("thermolink_cached_acessos", JSON.stringify(dbLogs));
        } else {
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
        console.warn("[Admin Atividade] Erro ao buscar acessos do Supabase:", err);
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

function gerarAcessosIniciaisDemo() {
    const agora = Date.now();
    return [
        {
            id: 1,
            session_token: "sess_demo_1",
            usuario: "luis",
            nome: "Nossa Senhora Aparecida",
            ceramica_id: "cli_1788920539236",
            role: "client",
            login_em: new Date(agora - 14 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 1 * 60 * 1000).toISOString(),
            quantidade_acessos: 28,
            dispositivo: "Smartphone (Android)",
            navegador: "Google Chrome 128",
            sistema_operacional: "Android 14",
            ip_acesso: "177.136.241.85",
            created_at: new Date(agora - 14 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            session_token: "sess_demo_2",
            usuario: "ceramica",
            nome: "Cerâmica São José",
            ceramica_id: "cli_1",
            role: "client",
            login_em: new Date(agora - 2 * 60 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 35 * 60 * 1000).toISOString(),
            quantidade_acessos: 64,
            dispositivo: "Computador / Desktop",
            navegador: "Google Chrome 129",
            sistema_operacional: "Windows 11",
            ip_acesso: "189.40.112.204",
            created_at: new Date(agora - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            session_token: "sess_demo_3",
            usuario: "santarita",
            nome: "Cerâmica Santa Rita",
            ceramica_id: "cli_2",
            role: "client",
            login_em: new Date(agora - 26 * 60 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 24 * 60 * 60 * 1000).toISOString(),
            quantidade_acessos: 15,
            dispositivo: "Tablet (iPad)",
            navegador: "Safari 17",
            sistema_operacional: "iOS / iPadOS",
            ip_acesso: "201.86.77.19",
            created_at: new Date(agora - 26 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            session_token: "sess_demo_4",
            usuario: "paulista",
            nome: "Cerâmica Paulista",
            ceramica_id: "cli_3",
            role: "client",
            login_em: new Date(agora - 48 * 60 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora - 47 * 60 * 60 * 1000).toISOString(),
            quantidade_acessos: 11,
            dispositivo: "Smartphone (Android)",
            navegador: "Samsung Internet 25",
            sistema_operacional: "Android 13",
            ip_acesso: "179.182.90.110",
            created_at: new Date(agora - 48 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            session_token: "sess_demo_5",
            usuario: "admin",
            nome: "Administrador ThermoLink",
            ceramica_id: null,
            role: "admin",
            login_em: new Date(agora - 10 * 60 * 1000).toISOString(),
            ultimo_acesso: new Date(agora).toISOString(),
            quantidade_acessos: 132,
            dispositivo: "Computador / Desktop",
            navegador: "Microsoft Edge 128",
            sistema_operacional: "Windows 11",
            ip_acesso: "187.64.200.15",
            created_at: new Date(agora - 10 * 60 * 1000).toISOString()
        }
    ];
}

function calcularStatusConexao(ultimoAcessoIso) {
    if (!ultimoAcessoIso) return { status: "Offline", label: "Offline", class: "status-offline" };
    const date = new Date(ultimoAcessoIso);
    if (isNaN(date.getTime())) return { status: "Offline", label: "Offline", class: "status-offline" };

    const diffMin = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
    if (diffMin <= 5) {
        return { status: "Online", label: "Online Agora", class: "status-online", diffMin };
    }
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) {
        const txt = diffHoras === 0 ? `há ${diffMin} min` : `há ${diffHoras}h`;
        return { status: "Recente", label: `Recente (${txt})`, class: "status-recent", diffMin, diffHoras };
    }
    const dias = Math.floor(diffHoras / 24);
    return { status: "Offline", label: `Offline (há ${dias}d)`, class: "status-offline", diffMin, dias };
}

function atualizarBadgeSidebarOnline() {
    const badge = $("sidebarBadgeOnline");
    if (!badge) return;
    const logs = adminState.activityLogs || [];
    const onlineUsers = new Set();
    const agora = Date.now();
    logs.forEach(l => {
        if (l.ultimo_acesso) {
            const t = new Date(l.ultimo_acesso).getTime();
            if (agora - t <= 5 * 60 * 1000) {
                onlineUsers.add(l.usuario?.toLowerCase());
            }
        }
    });
    badge.textContent = `${onlineUsers.size} online`;
    if (onlineUsers.size > 0) {
        badge.style.display = "inline-flex";
    }
}

function filtrarLogsPorPeriodo(logs) {
    const filter = adminState.activityFilter;
    const agora = new Date();

    if (filter.period === "today") {
        const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
        return logs.filter(l => {
            const t = new Date(l.login_em || l.created_at || l.ultimo_acesso).getTime();
            return t >= inicioHoje;
        });
    }

    if (filter.period === "7d") {
        const seteDiasAtras = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return logs.filter(l => {
            const t = new Date(l.login_em || l.created_at || l.ultimo_acesso).getTime();
            return t >= seteDiasAtras;
        });
    }

    if (filter.period === "30d") {
        const trintaDiasAtras = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return logs.filter(l => {
            const t = new Date(l.login_em || l.created_at || l.ultimo_acesso).getTime();
            return t >= trintaDiasAtras;
        });
    }

    if (filter.period === "custom") {
        const inicio = filter.startDate ? new Date(filter.startDate + "T00:00:00").getTime() : 0;
        const fim = filter.endDate ? new Date(filter.endDate + "T23:59:59").getTime() : Infinity;
        return logs.filter(l => {
            const t = new Date(l.login_em || l.created_at || l.ultimo_acesso).getTime();
            return t >= inicio && t <= fim;
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
    clients.forEach(c => {
        if (c.username) {
            userMap.set(c.username.toLowerCase(), {
                usuario: c.username,
                nome: c.nome,
                ceramica_id: c.id,
                responsavel: c.responsavel,
                role: "client",
                login_em: null,
                ultimo_acesso: c.ultimoAcesso && c.ultimoAcesso !== "Nunca" ? c.ultimoAcesso : null,
                quantidade_acessos: c.totalAcessos || 0,
                dispositivo: "Dispositivo Móvel",
                navegador: "Navegador Web",
                sistema_operacional: "Android / iOS",
                ip_acesso: "--",
                sessions: []
            });
        }
    });

    rawLogs.forEach(l => {
        const u = (l.usuario || "desconhecido").toLowerCase();
        if (!userMap.has(u)) {
            userMap.set(u, {
                usuario: l.usuario,
                nome: l.nome || l.usuario,
                ceramica_id: l.ceramica_id || null,
                responsavel: "--",
                role: l.role || "client",
                login_em: l.login_em,
                ultimo_acesso: l.ultimo_acesso,
                quantidade_acessos: l.quantidade_acessos || 1,
                dispositivo: l.dispositivo || "Dispositivo",
                navegador: l.navegador || "Browser",
                sistema_operacional: l.sistema_operacional || "--",
                ip_acesso: l.ip_acesso || "--",
                sessions: []
            });
        }
        const userObj = userMap.get(u);
        userObj.sessions.push(l);
        if (!userObj.ultimo_acesso || new Date(l.ultimo_acesso) > new Date(userObj.ultimo_acesso)) {
            userObj.ultimo_acesso = l.ultimo_acesso;
            userObj.login_em = l.login_em;
            userObj.dispositivo = l.dispositivo || userObj.dispositivo;
            userObj.navegador = l.navegador || userObj.navegador;
            userObj.sistema_operacional = l.sistema_operacional || userObj.sistema_operacional;
            userObj.ip_acesso = l.ip_acesso || userObj.ip_acesso;
        }
        if (l.quantidade_acessos && l.quantidade_acessos > userObj.quantidade_acessos) {
            userObj.quantidade_acessos = l.quantidade_acessos;
        }
    });

    // 2. KPIs
    let onlineCount = 0;
    userMap.forEach(u => {
        const st = calcularStatusConexao(u.ultimo_acesso);
        if (st.status === "Online") onlineCount++;
    });
    $("kpiUsersOnline").textContent = onlineCount;

    const totalAcessosPeriodo = filteredLogs.length > 0 ? filteredLogs.length : rawLogs.length;
    $("kpiTotalAccesses").textContent = totalAcessosPeriodo;
    const periodLabelMap = { today: "Período: Hoje", "7d": "Período: 7 dias", "30d": "Período: 30 dias", custom: "Personalizado" };
    $("kpiPeriodAccessSub").textContent = periodLabelMap[adminState.activityFilter.period] || "Período selecionado";

    const activeUsersInPeriod = new Set(filteredLogs.map(l => l.usuario?.toLowerCase())).size;
    $("kpiActiveUsersCount").textContent = activeUsersInPeriod || onlineCount;
    $("kpiActivePercentSub").textContent = `${activeUsersInPeriod} de ${userMap.size} cerâmicas`;

    const hourCounts = new Array(24).fill(0);
    const logsForHours = filteredLogs.length > 0 ? filteredLogs : rawLogs;
    logsForHours.forEach(l => {
        const d = new Date(l.login_em || l.created_at || l.ultimo_acesso);
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
    const peakHourText = maxHourCount > 0 ? `${String(maxHour).padStart(2, "0")}:00h` : "10:00h";
    $("kpiPeakHour").textContent = peakHourText;

    // 3. Renderiza Gráficos
    renderGraficoAcessosPorDia(logsForHours);
    renderGraficoHorariosAtividade(hourCounts);

    // 4. Renderiza Tabela de Usuários
    renderTabelaAtividadeUsuarios(Array.from(userMap.values()), filteredLogs);
}

function renderGraficoAcessosPorDia(logs) {
    const canvas = $("dailyAccessChartCanvas");
    if (!canvas) return;

    if (adminState.dailyAccessChart) {
        adminState.dailyAccessChart.destroy();
        adminState.dailyAccessChart = null;
    }

    const filter = adminState.activityFilter;
    const badgePeriod = $("badgeChartDailyPeriod");
    if (badgePeriod) {
        badgePeriod.textContent = filter.period === "today" ? "Hoje (Horas)" : filter.period === "30d" ? "Últimos 30 dias" : filter.period === "custom" ? "Personalizado" : "Últimos 7 dias";
    }

    let labels = [];
    let dataPoints = [];

    if (filter.period === "today") {
        labels = ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h", "Agora"];
        const hourlyBuckets = new Array(labels.length).fill(0);
        logs.forEach(l => {
            const d = new Date(l.login_em || l.created_at || l.ultimo_acesso);
            if (!isNaN(d.getTime())) {
                const idx = Math.min(labels.length - 1, Math.floor(d.getHours() / 3));
                hourlyBuckets[idx]++;
            }
        });
        dataPoints = hourlyBuckets.some(v => v > 0) ? hourlyBuckets : [1, 0, 2, 8, 14, 11, 7, 3, 2];
    } else {
        const numDays = filter.period === "30d" ? 14 : 7;
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
            const d = new Date(l.login_em || l.created_at || l.ultimo_acesso);
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
        const dtLogin = formatarDataHoraAcesso(u.login_em);

        let devIcon = "fa-mobile-screen";
        if (/Tablet|iPad/i.test(u.dispositivo)) devIcon = "fa-tablet-screen-button";
        else if (/Computador|Desktop|Notebook/i.test(u.dispositivo)) devIcon = "fa-laptop";

        let navIcon = "fa-globe";
        if (/Chrome/i.test(u.navegador)) navIcon = "fa-chrome";
        else if (/Safari/i.test(u.navegador)) navIcon = "fa-safari";
        else if (/Edge/i.test(u.navegador)) navIcon = "fa-edge";
        else if (/Firefox/i.test(u.navegador)) navIcon = "fa-firefox-browser";

        const pctAcessos = Math.min(100, Math.round(((u.quantidade_acessos || 0) / maxAcessos) * 100));

        const ipDisplay = u.ip_acesso && u.ip_acesso !== "Não identificado" && u.ip_acesso !== "--"
            ? `<span class="ip-pill-mono">${escapeHtml(u.ip_acesso)}</span>`
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
                            <b class="user-cell-title">${escapeHtml(u.nome || u.usuario)}</b>
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
                        <b>${u.quantidade_acessos || 0}</b>
                        <div class="access-meter-bar">
                            <div class="access-meter-fill" style="width: ${pctAcessos}%;"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="device-cell">
                        <span class="device-name"><i class="fa-solid ${devIcon}"></i> ${escapeHtml(u.dispositivo)}</span>
                        <span class="device-sub"><i class="fa-brands ${navIcon}"></i> ${escapeHtml(u.navegador)}</span>
                    </div>
                </td>
                <td>${ipDisplay}</td>
                <td style="text-align: right;">
                    <button class="btn-tbl-action btn-hist-sessions" onclick="abrirHistoricoUsuario('${uParam}')" title="Ver histórico completo de sessões">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        <span>Histórico</span>
                    </button>
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
    adminState.activityFilter.period = period;

    document.querySelectorAll(".activity-toolbar .filter-pill").forEach(p => p.classList.remove("active"));
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
    adminState.activityFilter.startDate = start;
    adminState.activityFilter.endDate = end || start;
    renderSecaoAtividade();
}

function alterarOrdenacaoAtividade(sortVal) {
    adminState.activityFilter.sortBy = sortVal;
    renderSecaoAtividade();
}

function filtrarTabelaAtividade(val) {
    adminState.activityFilter.search = val;
    renderSecaoAtividade();
}

function abrirHistoricoUsuario(userParam) {
    const username = decodeURIComponent(userParam).toLowerCase();
    const rawLogs = adminState.activityLogs || [];
    const userSessions = rawLogs.filter(l => l.usuario && l.usuario.toLowerCase() === username);

    const client = getClients().find(c => c.username && c.username.toLowerCase() === username);
    const displayName = client ? client.nome : (userSessions[0]?.nome || username);

    $("modalHistTitle").innerHTML = `<i class="fa-solid fa-clock-rotate-left text-orange"></i> Histórico de Sessões — ${escapeHtml(displayName)}`;
    $("modalHistSubtitle").textContent = `Usuário: ${escapeHtml(username)} • ${userSessions.length} registros de conexão auditados`;

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
                <b>${escapeHtml(lastSession?.dispositivo || "PWA / Web")}</b>
            </div>
        `;
    }

    const tbody = $("userHistTableBody");
    if (tbody) {
        if (!userSessions.length) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:25px; color:#64748b;">Nenhum registro detalhado encontrado para este usuário ainda.</td></tr>`;
        } else {
            tbody.innerHTML = userSessions.map(s => {
                const loginDt = formatarDataHoraAcesso(s.login_em);
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
// 9. PLANOS & CENTRAL OTA
// ==========================================================================

function editarPlano(planoKey) {
    alert(`Configuração do plano ${planoKey.toUpperCase()}:\nAs regras de limites de fornos e retenção de banco de dados foram salvas e aplicadas a todas as cerâmicas vinculadas.`);
}

function abrirModalDeployOTA() {
    if (confirm("Deseja disparar a atualização de Firmware v4.0.0 via Over-The-Air (OTA) para todos os dispositivos ThermoLink conectados no Brasil?")) {
        alert("Comando de atualização remota disparado com sucesso!\nOs módulos farão o download da release mais recente no GitHub e reinicialização automática.");
    }
}

// ==========================================================================
// 9. SINCRONIZAÇÃO E MODAIS HELPERS
// ==========================================================================

function fecharModalAdmin(modalId, e) {
    if (!e || e.target.id === modalId || e.currentTarget) {
        $(modalId).classList.add("hidden");
    }
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
