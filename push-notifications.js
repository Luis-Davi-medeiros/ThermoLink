// ==========================================================================
// THERMOLINK - NOTIFICAÇÕES PUSH (CLIENTE)
// Fluxo: usuário autenticado → "Ativar notificações" → permissão →
//        subscription → vinculada ao usuário/empresa via Edge Function.
// Regras:
//   - Nunca bloqueia o aplicativo se Push não estiver disponível/negada.
//   - Não solicita permissão repetidamente (só por ação do usuário).
//   - Clique na notificação abre direto no forno relacionado (?forno=XX).
// ==========================================================================

(function () {
    "use strict";

    // ------------------------------------------------------------------
    // CONFIGURAÇÃO (mesmo projeto Supabase já utilizado pelo app)
    // ------------------------------------------------------------------
    const SUPABASE_URL = "https://zawnluboujbovpgrgdcx.supabase.co";
    const API_PUSH = SUPABASE_URL + "/functions/v1/push-api";

    const LS_SESSAO = "thermolink_active_session";     // mesma sessão do app.js
    const LS_ATIVADO = "thermolink_push_ativado";      // intenção do usuário
    const LS_USUARIO_VINC = "thermolink_push_usuario"; // último usuário vinculado

    let swRegistration = null;

    const suportado =
        "serviceWorker" in navigator &&
        typeof window.PushManager !== "undefined" &&
        typeof window.Notification !== "undefined";

    // ------------------------------------------------------------------
    // UTILITÁRIOS
    // ------------------------------------------------------------------
    function getSessao() {
        try {
            return JSON.parse(localStorage.getItem(LS_SESSAO) || "null");
        } catch {
            return null;
        }
    }

    function urlBase64ParaUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const raw = atob(base64);
        const out = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
        return out;
    }

    function estaAtivado() {
        return localStorage.getItem(LS_ATIVADO) === "1";
    }

    async function getSubscriptionAtual() {
        if (!swRegistration) return null;
        try {
            return await swRegistration.pushManager.getSubscription();
        } catch {
            return null;
        }
    }

    // ------------------------------------------------------------------
    // REGISTRO DO SERVICE WORKER (não interfere no app existente)
    // ------------------------------------------------------------------
    async function registrarServiceWorker() {
        if (!suportado) return;
        if (window.location.protocol === "file:") return; // Push exige HTTPS/localhost
        try {
            swRegistration = await navigator.serviceWorker.register("sw.js");
        } catch (err) {
            console.warn("[ThermoLink Push] Service Worker não registrado:", err);
        }
    }

    // ------------------------------------------------------------------
    // ATIVAR / DESATIVAR
    // ------------------------------------------------------------------
    async function ativar() {
        if (!suportado) {
            render();
            return;
        }

        // 1. Permissão do navegador/sistema operacional
        let permissao = Notification.permission;
        if (permissao === "default") {
            try {
                permissao = await Notification.requestPermission();
            } catch {
                permissao = "denied";
            }
        }
        if (permissao !== "granted") {
            render(); // Usuário negou → app continua funcionando normalmente
            return;
        }

        try {
            await registrarServiceWorker();
            const reg = swRegistration || (await navigator.serviceWorker.ready);
            swRegistration = reg;

            // 2. Chave pública VAPID (servida pela Edge Function)
            const respKey = await fetch(API_PUSH, { method: "GET" });
            if (!respKey.ok) throw new Error("Falha ao obter chave VAPID");
            const { vapidPublicKey } = await respKey.json();

            // 3. Registro do dispositivo para Push (reaproveita se já existir)
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ParaUint8Array(vapidPublicKey)
                });
            }

            // 4+5. Associa ao usuário autenticado / empresa e armazena no Supabase
            await enviarInscricao(sub);

            localStorage.setItem(LS_ATIVADO, "1");
        } catch (err) {
            console.error("[ThermoLink Push] Falha ao ativar:", err);
        }
        render();
    }

    async function desativar() {
        try {
            const sub = await getSubscriptionAtual();
            if (sub && sub.endpoint) {
                // Best-effort: remove do backend mesmo se falhar localmente
                await fetch(API_PUSH, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "unsubscribe", endpoint: sub.endpoint })
                }).catch(() => {});
                await sub.unsubscribe().catch(() => {});
            }
        } catch (err) {
            console.warn("[ThermoLink Push] Falha ao desativar:", err);
        }
        localStorage.setItem(LS_ATIVADO, "0");
        render();
    }

    async function enviarInscricao(sub) {
        const sessao = getSessao() || {};
        await fetch(API_PUSH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "subscribe",
                endpoint: sub.endpoint,
                keys: sub.toJSON().keys,
                usuario: sessao.username || "desconhecido",
                empresa: sessao.name || sessao.username || "",
                userAgent: String(navigator.userAgent).slice(0, 300)
            })
        });
        localStorage.setItem(LS_USUARIO_VINC, sessao.username || "");
    }

    // ------------------------------------------------------------------
    // SINCRONIA COM AUTENTICAÇÃO (hooks chamados pelo app.js)
    // Reassocia a inscrição ao usuário que acabou de entrar.
    // ------------------------------------------------------------------
    function onAuthChanged() {
        render();
        (async () => {
            if (!estaAtivado()) return;
            const sub = await getSubscriptionAtual();
            if (!sub) return;
            const sessao = getSessao();
            const vinculado = localStorage.getItem(LS_USUARIO_VINC);
            if (sessao && sessao.username && sessao.username !== vinculado) {
                try {
                    await enviarInscricao(sub);
                } catch { /* silencioso: não impacta o app */ }
            }
        })();
    }

    // ------------------------------------------------------------------
    // UI DA SEÇÃO NOTIFICAÇÕES (Configurações)
    // ------------------------------------------------------------------
    function render() {
        const badge = document.getElementById("pushStateBadge");
        const btn = document.getElementById("btnTogglePush");
        const btnIcon = document.getElementById("btnTogglePushIcon");
        const btnLabel = document.getElementById("btnTogglePushLabel");
        const hint = document.getElementById("pushHint");
        if (!badge || !btn) return;

        badge.classList.remove("push-on", "push-off");

        if (!suportado || window.location.protocol === "file:") {
            badge.textContent = "Indisponível";
            badge.classList.add("push-off");
            btn.disabled = true;
            btnLabel.textContent = "Notificações não suportadas neste navegador";
            hint.textContent = "Este dispositivo/navegador não suporta notificações Push. O ThermoLink continua funcionando normalmente.";
            hint.classList.remove("hidden");
            return;
        }

        btn.disabled = false;
        const perm = Notification.permission;
        const ativado = estaAtivado();

        if (perm === "denied") {
            badge.textContent = "Bloqueadas";
            badge.classList.add("push-off");
            btnIcon.className = "fa-solid fa-bell-slash";
            btnLabel.textContent = "Permissão bloqueada no navegador";
            hint.textContent = "As notificações foram negadas neste navegador. Para reativá-las, libere a permissão nas configurações do site/navegador.";
            hint.classList.remove("hidden");
            return;
        }

        hint.classList.add("hidden");

        if (perm === "granted" && ativado) {
            badge.textContent = "Ativadas";
            badge.classList.add("push-on");
            btnIcon.className = "fa-solid fa-bell-slash";
            btnLabel.textContent = "Desativar notificações";
        } else {
            badge.textContent = "Desativadas";
            badge.classList.add("push-off");
            btnIcon.className = "fa-solid fa-bell";
            btnLabel.textContent = "Ativar notificações";
        }
    }

    function toggleFromUi() {
        if (!suportado) return;
        if (Notification.permission === "granted" && estaAtivado()) {
            desativar();
        } else {
            ativar();
        }
    }

    // ------------------------------------------------------------------
    // DEEP-LINK: abrir direto no forno vindo da notificação (?forno=XX)
    // ------------------------------------------------------------------
    function extrairFornoDaUrl(url) {
        try {
            const u = new URL(url, window.location.href);
            const v = Number(u.searchParams.get("forno"));
            return Number.isFinite(v) ? v : null;
        } catch {
            return null;
        }
    }

    function navegarParaForno(modulo) {
        if (modulo === null || modulo === undefined) return;
        if (typeof window.abrirDetalheForno !== "function") return;
        // `state` é declarado com const no app.js (não fica em window)
        if (typeof state === "undefined" || !state || !state.currentUser) return;

        state.selectedModule = null; // garante re-render correto
        window.abrirDetalheForno(Number(modulo));
    }

    function processarDeepLinkInicial() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has("ntf")) return;

        const forno = extrairFornoDaUrl(window.location.href);
        history.replaceState(null, "", window.location.pathname); // evita re-trigger no reload
        if (forno === null) return;

        // Aguarda o painel ficar visível (splash/login podem estar em andamento)
        let tentativas = 0;
        const timer = setInterval(() => {
            tentativas++;
            const appVisivel = !document.getElementById("mainApp").classList.contains("hidden");
            if (appVisivel && typeof state !== "undefined" && state && state.currentUser) {
                clearInterval(timer);
                navegarParaForno(forno);
            } else if (tentativas > 60) {
                clearInterval(timer); // desiste silenciosamente (~15s)
            }
        }, 250);
    }

    // Mensagem vinda do Service Worker quando uma janela já estava aberta
    navigator.serviceWorker?.addEventListener?.("message", (event) => {
        if (event.data && event.data.type === "thermolink-navegar") {
            const forno = extrairFornoDaUrl(event.data.url);
            navegarParaForno(forno);
        }
    });

    // ------------------------------------------------------------------
    // INICIALIZAÇÃO
    // ------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        render();
        registrarServiceWorker().then(() => render());
        processarDeepLinkInicial();
    });

    // API pública usada pelos hooks do app.js e onclick dos botões
    window.ThermoPush = { toggleFromUi, onAuthChanged };
})();
