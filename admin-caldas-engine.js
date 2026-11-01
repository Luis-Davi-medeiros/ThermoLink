/**
 * ==============================================================================
 * THERMOLINK INDUSTRIAL • MOTOR MATEMÁTICO DE DETECÇÃO AUTOMÁTICA DE CALDAS
 * Módulo Exclusivo para o Painel Administrativo Global (Medeiros Automação)
 * ==============================================================================
 * Realiza o processamento de sinais das séries temporais de temperatura de fornos
 * cerâmicos, identificando ciclos térmicos, pontos de mínimo (caldas) e pontos
 * de pico (máximo), calculando intervalos e gerando relatórios para WhatsApp e PDF.
 */

(function (window) {
    'use strict';

    const CaldasEngine = {
        version: '1.0.0',

        /**
         * Formata minutos em formato amigável em português: "1 h e 55 min" ou "45 min"
         */
        formatarIntervaloMinutos: function (totalMinutos) {
            if (!Number.isFinite(totalMinutos) || totalMinutos < 0) return '—';
            const m = Math.round(totalMinutos);
            const horas = Math.floor(m / 60);
            const mins = m % 60;
            if (horas === 0) return `${mins} min`;
            if (mins === 0) return `${horas} h`;
            return `${horas} h e ${mins} min`;
        },

        /**
         * Formata timestamp para HH:mm
         */
        formatarHora: function (dateObj) {
            if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '--:--';
            const hh = String(dateObj.getHours()).padStart(2, '0');
            const mm = String(dateObj.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
        },

        /**
         * Formata timestamp para DD/MM/AAAA
         */
        formatarData: function (dateObj) {
            if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '--/--/----';
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const aaaa = dateObj.getFullYear();
            return `${dd}/${mm}/${aaaa}`;
        },

        /**
         * Filtro de média móvel ponderada com janela móvel para suavizar oscilações
         * de ruído eletrônico sem deslocar o instante no tempo dos picos e vales.
         */
        suavizarSerie: function (leituras, canalProp = 'canal_1', janela = 5) {
            const n = leituras.length;
            const suavizada = new Array(n);
            const half = Math.floor(janela / 2);

            for (let i = 0; i < n; i++) {
                let soma = 0;
                let pesoTotal = 0;
                for (let j = Math.max(0, i - half); j <= Math.min(n - 1, i + half); j++) {
                    const val = Number(leituras[j][canalProp]);
                    if (Number.isFinite(val) && val > 0) {
                        // Peso triangular / gaussiano simples: centro tem mais peso
                        const peso = half + 1 - Math.abs(i - j);
                        soma += val * peso;
                        pesoTotal += peso;
                    }
                }
                suavizada[i] = pesoTotal > 0 ? soma / pesoTotal : Number(leituras[i][canalProp]) || 0;
            }
            return suavizada;
        },

        /**
         * Processamento principal da série temporal de temperatura
         */
        detectarCaldas: function (leiturasBrutas, options = {}) {
            const opts = Object.assign({
                canal: 'canal_1',             // 'canal_1' (Superior) ou 'canal_2' (Inferior)
                janelaSuavizacao: 5,         // Janela de média móvel
                minDeltaT: 7.0,              // Elevação térmica mínima em °C para confirmar combustão da lenha
                minSeparacaoMinutos: 20,     // Tempo mínimo entre duas caldas consecutivas
                gapBlackoutMinutos: 35       // Período sem sinal de sensor para marcar quebra de ciclo
            }, options);

            if (!leiturasBrutas || !Array.isArray(leiturasBrutas) || leiturasBrutas.length === 0) {
                return {
                    sucesso: false,
                    mensagem: 'Nenhuma leitura disponível para análise.',
                    caldas: [],
                    resumo: null,
                    leiturasValidas: []
                };
            }

            // 1. Filtragem e ordenação cronológica das leituras válidas
            const leiturasValidas = leiturasBrutas
                .filter(r => {
                    const temp = Number(r[opts.canal]);
                    const dtStr = r.data_hora || r.created_at;
                    return Number.isFinite(temp) && temp > 15 && temp < 1400 && dtStr;
                })
                .map(r => {
                    const dtStr = r.data_hora || r.created_at;
                    const dateObj = new Date(dtStr);
                    return {
                        id: r.id,
                        dt: dateObj,
                        ts: dateObj.getTime(),
                        temp: Math.round(Number(r[opts.canal])),
                        modulo: r.modulo_alutal || r.forno_id || 1,
                        forno_id: r.forno_id,
                        ceramica_id: r.ceramica_id,
                        canal_1: r.canal_1,
                        canal_2: r.canal_2,
                        raw: r
                    };
                })
                .sort((a, b) => a.ts - b.ts);

            if (leiturasValidas.length < 5) {
                return {
                    sucesso: false,
                    mensagem: 'Número insuficiente de leituras no período (mínimo 5 leituras requeridas).',
                    caldas: [],
                    resumo: null,
                    leiturasValidas
                };
            }

            // 2. Curva suavizada
            const suavizada = this.suavizarSerie(leiturasValidas, 'temp', opts.janelaSuavizacao);

            // 3. Detecção de vales (mínimos locais)
            // Um vale ocorre quando a temperatura para de cair e passa a subir de forma consistente
            const vales = [];
            const n = leiturasValidas.length;
            const minSeparacaoMs = opts.minSeparacaoMinutos * 60 * 1000;

            for (let i = 2; i < n - 2; i++) {
                const cur = suavizada[i];

                // Mínimo local na vizinhança imediata
                let isMinLocal = true;
                for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) {
                    if (suavizada[j] < cur) {
                        isMinLocal = false;
                        break;
                    }
                }

                if (isMinLocal) {
                    // Verifica elevação térmica persistente para frente (combustão da lenha)
                    // Olha até 35 amostras para frente (~30 min de leitura a 1 min/leitura)
                    const forwardSlice = suavizada.slice(i, Math.min(n, i + 35));
                    let maxFwd = cur;
                    let maxFwdIdx = i;
                    for (let k = 0; k < forwardSlice.length; k++) {
                        if (forwardSlice[k] > maxFwd) {
                            maxFwd = forwardSlice[k];
                            maxFwdIdx = i + k;
                        }
                    }

                    const ganho = maxFwd - cur;
                    if (ganho >= opts.minDeltaT) {
                        const curTs = leiturasValidas[i].ts;
                        const ultimoVale = vales[vales.length - 1];

                        // Respeita separação mínima de tempo entre caldas
                        if (!ultimoVale || (curTs - ultimoVale.ts) >= minSeparacaoMs) {
                            // Encontra o ponto exato da série bruta mais baixo na vizinhança
                            let bestMinIdx = i;
                            let bestMinTemp = leiturasValidas[i].temp;
                            for (let j = Math.max(0, i - 2); j <= Math.min(n - 1, i + 2); j++) {
                                if (leiturasValidas[j].temp < bestMinTemp) {
                                    bestMinTemp = leiturasValidas[j].temp;
                                    bestMinIdx = j;
                                }
                            }

                            vales.push({
                                idx: bestMinIdx,
                                dt: leiturasValidas[bestMinIdx].dt,
                                ts: leiturasValidas[bestMinIdx].ts,
                                temp: bestMinTemp,
                                ganhoEstimado: ganho,
                                confirmedAtIdx: maxFwdIdx,
                                confirmedAtDt: leiturasValidas[maxFwdIdx].dt
                            });
                        }
                    }
                }
            }

            // 4. Formação dos ciclos térmicos e identificação dos picos
            const caldas = [];
            for (let idx = 0; idx < vales.length; idx++) {
                const v = vales[idx];
                const nextValeIdx = (idx + 1 < vales.length) ? vales[idx + 1].idx : Math.min(n - 1, v.idx + 45);

                // Pico de temperatura no ciclo [valeAtual .. proximoVale]
                let peakIdx = v.idx;
                let peakTemp = v.temp;
                for (let k = v.idx; k <= nextValeIdx; k++) {
                    if (leiturasValidas[k].temp >= peakTemp) {
                        peakTemp = leiturasValidas[k].temp;
                        peakIdx = k;
                    }
                }

                const peakObj = leiturasValidas[peakIdx];

                // Intervalo entre caldas (vale anterior -> vale atual)
                let intervaloCaldasMin = null;
                let intervaloCaldasTexto = '—';
                if (idx > 0) {
                    intervaloCaldasMin = (v.ts - vales[idx - 1].ts) / (60 * 1000);
                    intervaloCaldasTexto = this.formatarIntervaloMinutos(intervaloCaldasMin);
                }

                // Tempo de subida (vale atual -> pico do ciclo)
                const tempoSubidaMin = (peakObj.ts - v.ts) / (60 * 1000);

                // Tempo de descida (pico do ciclo -> próximo vale)
                let tempoDescidaMin = null;
                let tempoDescidaTexto = '—';
                if (idx + 1 < vales.length) {
                    tempoDescidaMin = (vales[idx + 1].ts - peakObj.ts) / (60 * 1000);
                    tempoDescidaTexto = this.formatarIntervaloMinutos(tempoDescidaMin);
                }

                // Cálculo objetivo do nível de confiança
                let confianca = 'Alta confiança';
                let confiancaMotivo = 'Variação térmica nítida e persistente';
                if (v.ganhoEstimado < 10) {
                    confianca = 'Média confiança';
                    confiancaMotivo = 'Subida térmica moderada (+ ' + Math.round(v.ganhoEstimado) + '°C)';
                } else if (v.ganhoEstimado < 7.5) {
                    confianca = 'Baixa confiança';
                    confiancaMotivo = 'Variação térmica próxima ao limiar de ruído';
                }

                // Checa se há gap de blackout antes ou depois
                const isIncompleto = (idx === vales.length - 1 && (n - 1 - peakIdx) < 5);

                caldas.push({
                    id: `calda_${idx + 1}_${v.ts}`,
                    numeroSequencial: idx + 1,
                    numeroTexto: `${idx + 1}ª`,
                    horarioCalda: this.formatarHora(v.dt),
                    data: this.formatarData(v.dt),
                    timestampCalda: v.ts,
                    tempMinimo: v.temp,
                    horarioPico: this.formatarHora(peakObj.dt),
                    timestampPico: peakObj.ts,
                    tempMaxima: peakTemp,
                    intervaloEntreCaldasMin: intervaloCaldasMin,
                    intervaloEntreCaldasTexto: intervaloCaldasTexto,
                    tempoSubidaMin: tempoSubidaMin,
                    tempoSubidaTexto: this.formatarIntervaloMinutos(tempoSubidaMin),
                    tempoDescidaMin: tempoDescidaMin,
                    tempoDescidaTexto: tempoDescidaTexto,
                    confianca: confianca,
                    confiancaMotivo: confiancaMotivo,
                    incompleto: isIncompleto,
                    origem: 'auto',
                    revisado: false,
                    leituraVale: leiturasValidas[v.idx],
                    leituraPico: peakObj
                });
            }

            // 5. Métricas e Resumo Geral da Queima
            let tempMaxGlobal = -Infinity;
            let tempMaxGlobalDt = null;
            let tempMinGlobal = Infinity;
            let tempMinGlobalDt = null;

            for (let i = 0; i < leiturasValidas.length; i++) {
                const t = leiturasValidas[i].temp;
                if (t > tempMaxGlobal) {
                    tempMaxGlobal = t;
                    tempMaxGlobalDt = leiturasValidas[i].dt;
                }
                if (t < tempMinGlobal) {
                    tempMinGlobal = t;
                    tempMinGlobalDt = leiturasValidas[i].dt;
                }
            }

            const dtInicio = leiturasValidas[0].dt;
            const dtFim = leiturasValidas[leiturasValidas.length - 1].dt;
            const duracaoTotalMin = (leiturasValidas[leiturasValidas.length - 1].ts - leiturasValidas[0].ts) / (60 * 1000);

            // Intervalo médio entre caldas (desconsiderando a primeira)
            const intervalosValidos = caldas.slice(1).map(c => c.intervaloEntreCaldasMin).filter(m => Number.isFinite(m) && m > 0);
            const mediaIntervaloMin = intervalosValidos.length > 0
                ? (intervalosValidos.reduce((a, b) => a + b, 0) / intervalosValidos.length)
                : null;

            const resumo = {
                totalCaldas: caldas.length,
                intervaloMedioMinutos: mediaIntervaloMin,
                intervaloMedioTexto: mediaIntervaloMin ? this.formatarIntervaloMinutos(mediaIntervaloMin) : '—',
                tempMaximaGlobal: tempMaxGlobal !== -Infinity ? tempMaxGlobal : null,
                tempMaximaGlobalHora: this.formatarHora(tempMaxGlobalDt),
                tempMaximaGlobalData: this.formatarData(tempMaxGlobalDt),
                tempMinimaGlobal: tempMinGlobal !== Infinity ? tempMinGlobal : null,
                tempMinimaGlobalHora: this.formatarHora(tempMinGlobalDt),
                duracaoTotalMinutos: duracaoTotalMin,
                duracaoTotalTexto: this.formatarIntervaloMinutos(duracaoTotalMin),
                inicioPeriodoTexto: `${this.formatarData(dtInicio)} às ${this.formatarHora(dtInicio)}`,
                fimPeriodoTexto: `${this.formatarData(dtFim)} às ${this.formatarHora(dtFim)}`,
                totalLeiturasProcessadas: leiturasValidas.length,
                canalUtilizado: opts.canal === 'canal_1' ? 'Canal 1 (Superior)' : 'Canal 2 (Inferior)'
            };

            return {
                sucesso: true,
                caldas: caldas,
                resumo: resumo,
                leiturasValidas: leiturasValidas,
                curvaSuavizada: suavizada
            };
        },

        /**
         * Gera a mensagem formatada para envio e cópia direta no WhatsApp
         * seguindo rigorosamente a estrutura oficial Medeiros Automação / ThermoLink
         */
        gerarTextoWhatsapp: function (analise, dadosForno = {}) {
            if (!analise || !analise.sucesso || !analise.resumo) {
                return 'Relatório de queima indisponível para o período.';
            }

            const r = analise.resumo;
            const ceramicaNome = dadosForno.ceramicaNome || 'Cerâmica Cliente';
            const fornoNome = dadosForno.fornoNome || 'Forno 01';
            const responsavel = dadosForno.responsavel || 'Gestor';

            let msg = `*━━━━━━━━━━━━━━━━━━━━━━━━━━*\n`;
            msg += `🔥 *MEDEIROS AUTOMAÇÃO • THERMOLINK* 🔥\n`;
            msg += `📋 *RELATÓRIO DE QUEIMA DE FORNO*\n`;
            msg += `*━━━━━━━━━━━━━━━━━━━━━━━━━━*\n\n`;

            msg += `🏭 *Cerâmica:* ${ceramicaNome}\n`;
            if (responsavel && responsavel !== 'Gestor') {
                msg += `👤 *Aos Cuidados:* ${responsavel}\n`;
            }
            msg += `🔥 *Forno:* ${fornoNome}\n`;
            msg += `⏱️ *Período:* ${r.inicioPeriodoTexto} até ${r.fimPeriodoTexto}\n\n`;

            msg += `📋 *CALDAS REGISTRADAS / IDENTIFICADAS:*\n`;
            msg += `──────────────────────────\n`;

            if (analise.caldas.length === 0) {
                msg += `_Nenhuma calda identificada no período analisado._\n`;
            } else {
                analise.caldas.forEach(c => {
                    const statusRevisado = c.revisado ? ' ✓' : '';
                    msg += `• *${c.numeroTexto} Calda:* ${c.horarioCalda} (${c.data}) • *${c.tempMinimo} °C*${statusRevisado}\n`;
                });
            }
            msg += `──────────────────────────\n\n`;

            // Intervalo entre caldas
            if (analise.caldas.length > 1) {
                msg += `⏱️ *INTERVALO ENTRE CALDAS:*\n`;
                for (let i = 1; i < analise.caldas.length; i++) {
                    const ant = analise.caldas[i - 1];
                    const atu = analise.caldas[i];
                    msg += `• ${ant.numeroTexto} para ${atu.numeroTexto}: *${atu.intervaloEntreCaldasTexto}*\n`;
                }
                msg += `\n`;
            }

            msg += `📊 *RESUMO DA QUEIMA:*\n`;
            msg += `• *Total de Caldas:* ${r.totalCaldas} caldas identificadas\n`;
            if (r.intervaloMedioMinutos) {
                msg += `• *Intervalo Médio:* ${r.intervaloMedioTexto} entre caldas\n`;
            }
            if (r.tempMaximaGlobal) {
                msg += `• *Temperatura Máxima:* ${r.tempMaximaGlobal} °C (às ${r.tempMaximaGlobalHora})\n`;
            }
            msg += `• *Duração Analisada:* ${r.duracaoTotalTexto} (${r.totalLeiturasProcessadas} leituras)\n`;
            msg += `• *Sensor de Referência:* ${r.canalUtilizado}\n\n`;

            msg += `📲 _Relatório emitido via ThermoLink • Gestão Térmica Industrial_\n`;
            msg += `🌐 *thermolink.com.br*\n`;
            msg += `*━━━━━━━━━━━━━━━━━━━━━━━━━━*`;

            return msg;
        },

        /**
         * Gera a Ficha de Queima Tradicional em formato PDF vertical (A4)
         * utilizando jsPDF, ideal para imprimir ou enviar como documento no WhatsApp.
         */
        gerarFichaPDF: function (analise, dadosForno = {}) {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                throw new Error('Biblioteca jsPDF não encontrada no navegador.');
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const r = analise.resumo;
            const ceramicaNome = dadosForno.ceramicaNome || 'Cerâmica Cliente';
            const fornoNome = dadosForno.fornoNome || 'Forno 01';
            const cidade = dadosForno.cidade || 'Brasil';

            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 14;
            const contentWidth = pageWidth - (margin * 2);

            let cursorY = 16;

            function desenharCabecalho(paginaNum, totalPaginas) {
                // Faixa de Topo
                doc.setFillColor(15, 23, 42); // Navy Dark
                doc.rect(margin, cursorY, contentWidth, 22, 'F');

                // Borda laranja fina
                doc.setDrawColor(249, 115, 22);
                doc.setLineWidth(0.8);
                doc.line(margin, cursorY + 22, margin + contentWidth, cursorY + 22);

                // Títulos
                doc.setTextColor(249, 115, 22); // Laranja ThermoLink
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(13);
                doc.text('MEDEIROS AUTOMAÇÃO • THERMOLINK', margin + 6, cursorY + 8);

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.text('FICHA OPERACIONAL DE CONTROLE DE QUEIMA', margin + 6, cursorY + 15);

                doc.setTextColor(148, 163, 184);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.text(`Pág. ${paginaNum} de ${totalPaginas || 1}`, margin + contentWidth - 22, cursorY + 15);

                cursorY += 26;

                // Box com Metadados da Queima
                doc.setFillColor(248, 250, 252);
                doc.rect(margin, cursorY, contentWidth, 16, 'F');
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.3);
                doc.rect(margin, cursorY, contentWidth, 16, 'S');

                doc.setTextColor(30, 41, 59);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.text(`Cerâmica: ${ceramicaNome} (${cidade})`, margin + 4, cursorY + 6);
                doc.text(`Forno: ${fornoNome}`, margin + 110, cursorY + 6);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(71, 85, 105);
                doc.text(`Período Analisado: ${r.inicioPeriodoTexto} até ${r.fimPeriodoTexto} (${r.duracaoTotalTexto})`, margin + 4, cursorY + 12);
                doc.text(`Canal Térmico: ${r.canalUtilizado}`, margin + 110, cursorY + 12);

                cursorY += 20;

                // Cabeçalho da Tabela
                doc.setFillColor(30, 41, 59); // Slate escuro
                doc.rect(margin, cursorY, contentWidth, 8, 'F');

                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);

                const colunas = [
                    { tit: 'CALDA', x: margin + 4 },
                    { tit: 'HORA CALDA', x: margin + 22 },
                    { tit: 'DATA', x: margin + 48 },
                    { tit: 'TEMP. MÍNIMO', x: margin + 74 },
                    { tit: 'HORA PICO', x: margin + 104 },
                    { tit: 'TEMP. MÁXIMA', x: margin + 128 },
                    { tit: 'INTERVALO ENTRE CALDAS', x: margin + 152 }
                ];

                colunas.forEach(col => {
                    doc.text(col.tit, col.x, cursorY + 5.5);
                });

                cursorY += 8;
            }

            // Inicia primeira página
            desenharCabecalho(1, 1);

            // Linhas da tabela
            const caldas = analise.caldas;
            const linhaAltura = 7;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);

            for (let i = 0; i < caldas.length; i++) {
                const c = caldas[i];

                // Checa quebra de página
                if (cursorY + linhaAltura > pageHeight - 35) {
                    doc.addPage();
                    cursorY = 16;
                    desenharCabecalho(doc.getNumberOfPages(), doc.getNumberOfPages());
                }

                // Fundo zebrado
                if (i % 2 === 0) {
                    doc.setFillColor(241, 245, 249);
                    doc.rect(margin, cursorY, contentWidth, linhaAltura, 'F');
                }

                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.2);
                doc.line(margin, cursorY + linhaAltura, margin + contentWidth, cursorY + linhaAltura);

                doc.setTextColor(15, 23, 42);
                doc.setFont('helvetica', 'bold');
                doc.text(c.numeroTexto, margin + 4, cursorY + 5);

                doc.setFont('helvetica', 'normal');
                doc.text(c.horarioCalda, margin + 22, cursorY + 5);
                doc.text(c.data, margin + 48, cursorY + 5);

                // Mínimo (Laranja sutil)
                doc.setTextColor(194, 65, 12);
                doc.setFont('helvetica', 'bold');
                doc.text(`${c.tempMinimo} °C`, margin + 74, cursorY + 5);

                // Pico
                doc.setTextColor(71, 85, 105);
                doc.setFont('helvetica', 'normal');
                doc.text(c.horarioPico || '—', margin + 104, cursorY + 5);

                doc.setTextColor(220, 38, 38);
                doc.setFont('helvetica', 'bold');
                doc.text(c.tempMaxima ? `${c.tempMaxima} °C` : '—', margin + 128, cursorY + 5);

                // Intervalo
                doc.setTextColor(15, 23, 42);
                doc.setFont('helvetica', 'normal');
                doc.text(c.intervaloEntreCaldasTexto, margin + 152, cursorY + 5);

                cursorY += linhaAltura;
            }

            // Resumo no rodapé da página final
            cursorY += 6;
            if (cursorY + 30 > pageHeight - 15) {
                doc.addPage();
                cursorY = 16;
            }

            doc.setFillColor(254, 243, 199); // Âmbar clarinho
            doc.rect(margin, cursorY, contentWidth, 22, 'F');
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(0.4);
            doc.rect(margin, cursorY, contentWidth, 22, 'S');

            doc.setTextColor(146, 64, 14);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.text('RESUMO GERAL DA QUEIMA:', margin + 4, cursorY + 5.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            doc.text(`• Total de caldas identificadas: ${r.totalCaldas} alimentações`, margin + 4, cursorY + 11);
            doc.text(`• Intervalo médio entre caldas: ${r.intervaloMedioTexto}`, margin + 4, cursorY + 16);

            doc.text(`• Pico térmico máximo: ${r.tempMaximaGlobal} °C às ${r.tempMaximaGlobalHora}`, margin + 95, cursorY + 11);
            doc.text(`• Total de leituras processadas: ${r.totalLeiturasProcessadas} leituras reais`, margin + 95, cursorY + 16);

            // Rodapé final de validação
            cursorY += 26;
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7.5);
            doc.text(`Documento emitido automaticamente pelo sistema ThermoLink em ${new Date().toLocaleString('pt-BR')} • Exclusivo Medeiros Automação`, margin, cursorY);

            const nomeArquivo = `Ficha_Queima_${fornoNome.replace(/\s+/g, '_')}_${r.dataFechamento || new Date().toISOString().slice(0, 10)}.pdf`;
            doc.save(nomeArquivo);
            return nomeArquivo;
        },

        gerarFichaPDFBase64: function (analise, dadosForno = {}) {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                return null;
            }

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const r = analise.resumo;
                const ceramicaNome = dadosForno.ceramicaNome || 'Cerâmica Cliente';
                const fornoNome = dadosForno.fornoNome || 'Forno 01';
                const cidade = dadosForno.cidade || 'Brasil';

                const pageWidth = 210;
                const pageHeight = 297;
                const margin = 14;
                const contentWidth = pageWidth - (margin * 2);

                let cursorY = 16;

                function desenharCabecalho(paginaNum, totalPaginas) {
                    doc.setFillColor(15, 23, 42);
                    doc.rect(margin, cursorY, contentWidth, 22, 'F');

                    doc.setDrawColor(249, 115, 22);
                    doc.setLineWidth(0.8);
                    doc.line(margin, cursorY + 22, margin + contentWidth, cursorY + 22);

                    doc.setTextColor(249, 115, 22);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(13);
                    doc.text('MEDEIROS AUTOMAÇÃO • THERMOLINK', margin + 6, cursorY + 8);

                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(10);
                    doc.text('FICHA OPERACIONAL DE CONTROLE DE QUEIMA', margin + 6, cursorY + 15);

                    doc.setTextColor(148, 163, 184);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8.5);
                    doc.text(`Pág. ${paginaNum} de ${totalPaginas || 1}`, margin + contentWidth - 22, cursorY + 15);

                    cursorY += 26;

                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, cursorY, contentWidth, 16, 'F');
                    doc.setDrawColor(226, 232, 240);
                    doc.setLineWidth(0.3);
                    doc.rect(margin, cursorY, contentWidth, 16, 'S');

                    doc.setTextColor(30, 41, 59);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(9);
                    doc.text(`Cerâmica: ${ceramicaNome} (${cidade})`, margin + 4, cursorY + 6);
                    doc.text(`Forno: ${fornoNome}`, margin + 110, cursorY + 6);

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    doc.setTextColor(71, 85, 105);
                    doc.text(`Período Analisado: ${r.inicioPeriodoTexto} até ${r.fimPeriodoTexto} (${r.duracaoTotalTexto})`, margin + 4, cursorY + 12);
                    doc.text(`Canal Térmico: ${r.canalUtilizado}`, margin + 110, cursorY + 12);

                    cursorY += 20;

                    doc.setFillColor(30, 41, 59);
                    doc.rect(margin, cursorY, contentWidth, 8, 'F');

                    doc.setTextColor(255, 255, 255);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);

                    const colunas = [
                        { tit: 'CALDA', x: margin + 4 },
                        { tit: 'HORA CALDA', x: margin + 22 },
                        { tit: 'DATA', x: margin + 48 },
                        { tit: 'TEMP. MÍNIMO', x: margin + 74 },
                        { tit: 'HORA PICO', x: margin + 104 },
                        { tit: 'TEMP. MÁXIMA', x: margin + 128 },
                        { tit: 'INTERVALO ENTRE CALDAS', x: margin + 152 }
                    ];

                    colunas.forEach(col => {
                        doc.text(col.tit, col.x, cursorY + 5.5);
                    });

                    cursorY += 8;
                }

                desenharCabecalho(1, 1);

                const caldas = analise.caldas || [];
                const linhaAltura = 7;

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);

                for (let i = 0; i < caldas.length; i++) {
                    const c = caldas[i];
                    if (cursorY + linhaAltura > pageHeight - 35) {
                        doc.addPage();
                        cursorY = 16;
                        desenharCabecalho(doc.getNumberOfPages(), doc.getNumberOfPages());
                    }

                    if (i % 2 === 0) {
                        doc.setFillColor(241, 245, 249);
                        doc.rect(margin, cursorY, contentWidth, linhaAltura, 'F');
                    }

                    doc.setDrawColor(226, 232, 240);
                    doc.setLineWidth(0.2);
                    doc.line(margin, cursorY + linhaAltura, margin + contentWidth, cursorY + linhaAltura);

                    doc.setTextColor(15, 23, 42);
                    doc.setFont('helvetica', 'bold');
                    doc.text(c.numeroTexto, margin + 4, cursorY + 5);

                    doc.setFont('helvetica', 'normal');
                    doc.text(c.horarioCalda, margin + 22, cursorY + 5);
                    doc.text(c.data, margin + 48, cursorY + 5);

                    doc.setTextColor(194, 65, 12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${c.tempMinimo} °C`, margin + 74, cursorY + 5);

                    doc.setTextColor(71, 85, 105);
                    doc.setFont('helvetica', 'normal');
                    doc.text(c.horarioPico || '—', margin + 104, cursorY + 5);

                    doc.setTextColor(220, 38, 38);
                    doc.setFont('helvetica', 'bold');
                    doc.text(c.tempMaxima ? `${c.tempMaxima} °C` : '—', margin + 128, cursorY + 5);

                    doc.setTextColor(15, 23, 42);
                    doc.setFont('helvetica', 'normal');
                    doc.text(c.intervaloEntreCaldasTexto, margin + 152, cursorY + 5);

                    cursorY += linhaAltura;
                }

                cursorY += 6;
                if (cursorY + 30 > pageHeight - 15) {
                    doc.addPage();
                    cursorY = 16;
                }

                doc.setFillColor(254, 243, 199);
                doc.rect(margin, cursorY, contentWidth, 22, 'F');
                doc.setDrawColor(245, 158, 11);
                doc.setLineWidth(0.4);
                doc.rect(margin, cursorY, contentWidth, 22, 'S');

                doc.setTextColor(146, 64, 14);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.text('RESUMO GERAL DA QUEIMA:', margin + 4, cursorY + 5.5);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(30, 41, 59);
                doc.text(`• Total de caldas identificadas: ${r.totalCaldas} alimentações`, margin + 4, cursorY + 11);
                doc.text(`• Intervalo médio entre caldas: ${r.intervaloMedioTexto}`, margin + 4, cursorY + 16);

                doc.text(`• Pico térmico máximo: ${r.tempMaximaGlobal} °C às ${r.tempMaximaGlobalHora}`, margin + 95, cursorY + 11);
                doc.text(`• Total de leituras processadas: ${r.totalLeiturasProcessadas} leituras reais`, margin + 95, cursorY + 16);

                cursorY += 26;
                doc.setTextColor(148, 163, 184);
                doc.setFontSize(7.5);
                doc.text(`Documento emitido automaticamente pelo sistema ThermoLink em ${new Date().toLocaleString('pt-BR')} • Exclusivo Medeiros Automação`, margin, cursorY);

                const dataUri = doc.output('datauristring');
                const base64 = dataUri.split(',')[1];
                const nomeArquivo = `Ficha_Queima_${fornoNome.replace(/\s+/g, '_')}_${r.dataFechamento || new Date().toISOString().slice(0, 10)}.pdf`;

                return { base64, fileName: nomeArquivo };
            } catch (errPdf) {
                console.warn('[Caldas PDF Base64] Erro:', errPdf);
                return null;
            }
        }};

    window.CaldasEngine = CaldasEngine;
})(window);

