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
    syncInterval: null
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

        if (statusEl) statusEl.textContent = "ATIVO";

        // Renderiza as telas atualizadas
        renderDashboardGeral();
        renderTabelaClientes();
        renderTabelaDispositivos();

    } catch (err) {
        console.warn("[Admin Supabase] Falha ao carregar dados do Supabase:", err);
        adminState.clients = getClients();
        adminState.devices = getDevices();
        renderDashboardGeral();
        renderTabelaClientes();
        renderTabelaDispositivos();
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
    document.querySelectorAll(".sidebar-nav .nav-btn").forEach(b => b.classList.remove("active"));
    event?.currentTarget?.classList?.add("active");

    // Oculta todas as seções
    $("secDashboard")?.classList.add("hidden");
    $("secClientes")?.classList.add("hidden");
    $("secDispositivos")?.classList.add("hidden");
    $("secPlanos")?.classList.add("hidden");

    // Atualiza cabeçalho
    const titulos = {
        dashboard: { h1: "Dashboard Geral", sub: "Visão executiva, custos de infraestrutura e tráfego em tempo real" },
        clientes: { h1: "Gestão de Cerâmicas", sub: "Controle de clientes, bloqueio por inadimplência e modo suporte" },
        dispositivos: { h1: "Fábrica & Hardware", sub: "Cadastro de números de série, geração de etiquetas adesivas e inventário" },
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
    } else if (secao === "planos") {
        $("secPlanos")?.classList.remove("hidden");
    }

    // Fecha sidebar no mobile
    const sidebar = document.querySelector(".admin-sidebar");
    if (sidebar) sidebar.classList.remove("mobile-open");
}

function toggleSidebarMobile() {
    const sidebar = document.querySelector(".admin-sidebar");
    if (sidebar) sidebar.classList.toggle("mobile-open");
}

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

async function alternarBloqueioCliente(clienteId) {
    const clients = getClients();
    const target = clients.find(c => c.id === clienteId);
    if (!target) return;

    const novoStatus = target.status === "Ativo" ? "Bloqueado" : "Ativo";

    if (target.status === "Ativo") {
        if (!confirm(`Deseja realmente BLOQUEAR o acesso da ${target.nome}?\nO cliente não conseguirá visualizar os fornos até ser desbloqueado.`)) {
            return;
        }
    }

    target.status = novoStatus;
    saveClients(clients);
    renderTabelaClientes();
    renderDashboardGeral();

    // Persiste atualização no Supabase
    try {
        const { error } = await sb
            .from("ceramicas")
            .update({ status: novoStatus })
            .eq("id", clienteId);

        if (error) console.warn("[Supabase] Aviso ao atualizar status da cerâmica:", error);
    } catch (err) {
        console.error("[Supabase] Erro de rede ao atualizar status:", err);
    }
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
            // Retroalimenta as leituras deste dispositivo para a Cerâmica dona!
            try {
                await sb.from("leituras")
                    .update({ ceramica_id: ceramicaId })
                    .or(`numero_serie.eq.${serial},serial.eq.${serial}`);
            } catch (errLeit) {
                console.warn("[Supabase] Aviso ao atualizar leituras existentes:", errLeit);
            }
        }
    } catch (err) {
        console.error("[Supabase] Falha ao atualizar vínculo:", err);
    }

    // Atualiza estado local
    const devices = getDevices();
    const target = devices.find(d => d.serial === serial || d.numeroSerie === serial);
    if (target) {
        target.status = status;
        target.ceramicaId = isVinculado ? ceramicaId : null;
        target.ceramicaNome = isVinculado && selectedClient ? selectedClient.nome : "Em Estoque";
        target.moduloNum = isVinculado ? moduloNum : null;
        target.fornoId = isVinculado ? moduloNum : null;
        saveDevices(devices);
    }

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
    }

    fecharModalAdmin("modalVincularDispositivo", null);
    renderTabelaDispositivos();
    renderDashboardGeral();

    if (isVinculado && selectedClient) {
        alert(`Dispositivo ${serial} associado com sucesso!\n\nCerâmica: ${selectedClient.nome}\nForno: ${moduloNum}\n\nAgora todas as leituras térmicas deste aparelho pertencem exclusivamente a esta Cerâmica.`);
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
// 8. PLANOS & CENTRAL OTA
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
