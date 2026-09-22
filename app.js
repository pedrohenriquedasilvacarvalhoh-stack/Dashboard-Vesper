/**
 * VESPER ARQUITETURA - TCC DASHBOARD ENGINE (app.js)
 * Sincronização direta com a URL oficial do Google Apps Script + Fallback Robusto + ScrollSpy + Personas + Menu Retrátil Móvel
 */

document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initDashboard();
});

const chartInstances = {};

/**
 * 1. TELA DE LOADING (5 SEGUNDOS COM ANIMAÇÃO DE ENGRENAGENS INTERLIGADAS)
 */
function initLoadingScreen() {
  renderLoadingGears();

  setTimeout(() => {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
      }, 600);
    }
  }, 5000);
}

function renderLoadingGears() {
  const svg = document.getElementById('gear-svg');
  if (!svg) return;

  function generateGearPath(cx, cy, teeth, outerR, innerR, holeR) {
    let d = "";
    const cycle = (Math.PI * 2) / teeth;
    
    for (let i = 0; i < teeth; i++) {
      const angle = i * cycle;
      const a1 = angle;
      const a2 = angle + cycle * 0.15;
      const a3 = angle + cycle * 0.35;
      const a4 = angle + cycle * 0.65;
      const a5 = angle + cycle * 0.85;

      if (i === 0) d += `M ${cx + innerR * Math.cos(a1)} ${cy + innerR * Math.sin(a1)} `;
      else d += `L ${cx + innerR * Math.cos(a1)} ${cy + innerR * Math.sin(a1)} `;
      
      d += `L ${cx + innerR * Math.cos(a2)} ${cy + innerR * Math.sin(a2)} `;
      d += `L ${cx + outerR * Math.cos(a3)} ${cy + outerR * Math.sin(a3)} `;
      d += `L ${cx + outerR * Math.cos(a4)} ${cy + outerR * Math.sin(a4)} `;
      d += `L ${cx + innerR * Math.cos(a5)} ${cy + innerR * Math.sin(a5)} `;
    }
    d += "Z ";
    
    d += `M ${cx + holeR} ${cy} `;
    for(let i = 359; i >= 0; i -= 5) {
      const a = i * Math.PI / 180;
      d += `L ${cx + holeR * Math.cos(a)} ${cy + holeR * Math.sin(a)} `;
    }
    d += "Z";
    return d;
  }

  const teeth = 8;
  const outerR = 64;
  const innerR = 46;
  const holeR = 22;
  const pitchR = (outerR + innerR) / 2;
  const dist = (pitchR * 2) + 2; 

  const cx1 = 100;
  const cy1 = 100;
  const cx2 = cx1;
  const cy2 = cx1 + dist;
  const cx3 = cx1 + dist;
  const cy3 = cy2;

  function appendGear(id, cx, cy, className) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", generateGearPath(cx, cy, teeth, outerR, innerR, holeR));
    path.setAttribute("class", `gear ${className}`);
    path.setAttribute("id", id);
    path.setAttribute("fill-rule", "evenodd");
    path.style.transformOrigin = `${cx}px ${cy}px`;
    svg.appendChild(path);
  }

  appendGear("gear1", cx1, cy1, "gear-blue");
  appendGear("gear2", cx2, cy2, "gear-blue");
  appendGear("gear3", cx3, cy3, "gear-gold");
}

/**
 * INICIALIZAÇÃO DA DASHBOARD E COMPONENTES
 */
function initDashboard() {
  setupTheme();
  setupEventListeners();
  setupMobileMenu();
  
  // 1. RENDERIZAR IMEDIATAMENTE OS DADOS CONSOLIDADOS
  renderKpis();
  renderSidebarNav();
  renderSectionsAndCharts();
  setupScrollSpy();

  // 2. TENTAR SINCRONIZAÇÃO EM SEGUNDO PLANO VIA GOOGLE APPS SCRIPT
  const activeUrl = localStorage.getItem("vesper_apps_script_url") || VESPER_SURVEY_DATA.metadata.apiUrl;
  const inputEl = document.getElementById("appsScriptUrl");
  if (inputEl) inputEl.value = activeUrl;
  
  if (activeUrl) {
    syncWithAppsScript(activeUrl, false);
  }
}

/**
 * 2. MENU RETRÁTIL PARA DISPOSITIVOS MÓVEIS / CELULARES
 */
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const closeBtn = document.getElementById("mobileCloseBtn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openMobileSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileSidebar);
  if (overlay) overlay.addEventListener("click", closeMobileSidebar);
}

/**
 * 3. SCROLLSPY - O MENU LATERAL ACOMPANHA CONFORME O USUÁRIO ROLA A PÁGINA
 */
function setupScrollSpy() {
  const navLinks = document.querySelectorAll(".nav-item");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("data-section-target") === id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  setTimeout(() => {
    const sections = document.querySelectorAll(".section-wrapper");
    sections.forEach(sec => observer.observe(sec));
  }, 300);
}

/**
 * Alternador de Tema Claro / Escuro
 */
function setupTheme() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const currentTheme = localStorage.getItem("vesper_survey_theme") || "light";
  
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("vesper_survey_theme", newTheme);
      updateThemeIcon(newTheme);
      
      reRenderAllCharts();
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeToggleBtn i");
  if (icon) {
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }
}

/**
 * Renderização dos Cards de KPI
 */
function renderKpis() {
  const kpiContainer = document.getElementById("kpiGrid");
  if (!kpiContainer) return;

  const total = VESPER_SURVEY_DATA.metadata.totalResponses || 108;

  kpiContainer.innerHTML = `
    <div class="kpi-card">
      <div class="kpi-info">
        <span>Total de Respostas (Planilha)</span>
        <h3>${total}</h3>
      </div>
      <div class="kpi-icon"><i class="fas fa-users"></i></div>
    </div>
    
    <div class="kpi-card">
      <div class="kpi-info">
        <span>Seções Analisadas</span>
        <h3>${VESPER_SURVEY_DATA.metadata.sectionsCount}</h3>
      </div>
      <div class="kpi-icon"><i class="fas fa-layer-group"></i></div>
    </div>

    <div class="kpi-card">
      <div class="kpi-info">
        <span>Intenção de Reformar / Construir</span>
        <h3>72.2%</h3>
      </div>
      <div class="kpi-icon"><i class="fas fa-tools"></i></div>
    </div>

    <div class="kpi-card">
      <div class="kpi-info">
        <span>Potencial de Aceitação da Vesper</span>
        <h3>94.4%</h3>
      </div>
      <div class="kpi-icon"><i class="fas fa-award"></i></div>
    </div>
  `;
}

/**
 * Renderização da Navegação Lateral
 */
function renderSidebarNav() {
  const navContainer = document.getElementById("sidebarNav");
  if (!navContainer) return;

  let html = `<div class="nav-section-title">SEÇÕES DO FORMULÁRIO & PERSONAS</div>`;
  
  VESPER_SURVEY_DATA.sections.forEach((sec, index) => {
    html += `
      <a class="nav-item ${index === 0 ? 'active' : ''}" href="#${sec.id}" data-section-target="${sec.id}">
        <i class="fas ${sec.icon}"></i>
        <span>${sec.title}</span>
      </a>
    `;
  });

  navContainer.innerHTML = html;

  document.querySelectorAll("[data-section-target]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-section-target");
      const targetEl = document.getElementById(targetId);
      
      document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
      btn.classList.add("active");

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }

      // Fechar menu retrátil se estiver no celular
      if (window.innerWidth <= 992) {
        const sidebar = document.querySelector(".sidebar");
        const overlay = document.getElementById("sidebarOverlay");
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("active");
      }
    });
  });
}

/**
 * Renderização das Seções e Gráficos
 */
function renderSectionsAndCharts() {
  const mainBody = document.getElementById("sectionsContainer");
  if (!mainBody) return;

  mainBody.innerHTML = "";

  VESPER_SURVEY_DATA.sections.forEach(sec => {
    const secEl = document.createElement("section");
    secEl.className = "section-wrapper";
    secEl.id = sec.id;

    let cardsHtml = "";

    sec.questions.forEach(q => {
      if (q.type === "personas") {
        cardsHtml += renderPersonasCard(q);
      } else if (q.type === "text_responses") {
        cardsHtml += renderTextResponsesCard(q);
      } else {
        cardsHtml += renderChartCard(q);
      }
    });

    secEl.innerHTML = `
      <div class="section-header-banner">
        <h2><i class="fas ${sec.icon}"></i> ${sec.title}</h2>
      </div>
      <div class="charts-grid">
        ${cardsHtml}
      </div>
    `;

    mainBody.appendChild(secEl);
  });

  setTimeout(() => {
    VESPER_SURVEY_DATA.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (q.type !== "text_responses" && q.type !== "personas" && q.data && q.data.length > 0) {
          buildChart(q);
        }
      });
    });
  }, 100);
}

function renderPersonasCard(q) {
  let cardsHtml = "";
  q.personas.forEach(p => {
    let painsHtml = "";
    p.pains.forEach(pain => {
      painsHtml += `<div class="persona-pain-item"><i class="fas fa-check-circle"></i> <span>${pain}</span></div>`;
    });

    cardsHtml += `
      <div class="persona-card">
        <div class="persona-header-top">
          <div class="persona-title-group">
            <h3><i class="fas ${p.icon}" style="color: var(--color-gold); margin-right: 0.4rem;"></i> ${p.title}</h3>
            <p>${p.subtitle}</p>
          </div>
          <span class="persona-share-badge ${p.badgeColor}">${p.share}</span>
        </div>

        <div class="persona-section-block">
          <div class="persona-block-title"><i class="fas fa-user-tag"></i> Demografia & Perfil</div>
          <div style="font-size: 0.85rem; color: var(--text-main); font-weight: 500;">${p.demographics}</div>
        </div>

        <div class="persona-section-block">
          <div class="persona-block-title"><i class="fas fa-exclamation-triangle"></i> Dores & Necessidades Chave</div>
          ${painsHtml}
        </div>

        <div class="persona-ticket-box">
          <i class="fas fa-coins" style="color: var(--color-gold); margin-right: 0.4rem;"></i>
          <strong>Ticket / Faixa de Valor:</strong> ${p.ticket}
        </div>
      </div>
    `;
  });

  return `
    <div class="chart-card" style="grid-column: 1 / -1;">
      <div class="chart-card-header">
        <h3>${q.title}</h3>
        <span class="chart-type-badge">Análise de Persona & Mercado</span>
      </div>
      <div class="persona-cards-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function renderChartCard(q) {
  const badgeLabel = q.type === "single" ? "Escolha Única" : "Múltipla Seleção";
  const total = VESPER_SURVEY_DATA.metadata.totalResponses || 108;
  return `
    <div class="chart-card">
      <div class="chart-card-header">
        <h3>${q.title}</h3>
        <span class="chart-type-badge">${badgeLabel}</span>
      </div>
      <div class="chart-container">
        <canvas id="canvas_${q.id}"></canvas>
      </div>
      <div class="chart-card-footer">
        <span style="font-size: 0.75rem; color: var(--text-muted)">N = ${total} respostas</span>
        <button class="btn-export-png" onclick="exportChartPNG('${q.id}', '${q.title}')">
          <i class="fas fa-download"></i> Exportar PNG HD
        </button>
      </div>
    </div>
  `;
}

function renderTextResponsesCard(q) {
  let listHtml = "";
  if (q.responses && q.responses.length > 0) {
    q.responses.forEach(res => {
      listHtml += `
        <div class="text-response-item">
          <div class="text-response-user">${res.user || 'Participante'}</div>
          <div>"${res.text}"</div>
        </div>
      `;
    });
  } else {
    listHtml = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem;">Nenhuma sugestão enviada no formulário ainda.</div>`;
  }

  return `
    <div class="chart-card" style="grid-column: 1 / -1;">
      <div class="chart-card-header">
        <h3>${q.title}</h3>
        <span class="chart-type-badge">Texto Livre / Qualitativo</span>
      </div>
      <div class="text-responses-list">
        ${listHtml}
      </div>
    </div>
  `;
}

/**
 * Construtor dos gráficos Chart.js com Paleta Vesper
 */
function buildChart(q) {
  const canvas = document.getElementById(`canvas_${q.id}`);
  if (!canvas) return;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#E2E8F0" : "#1E293B";

  const labels = q.data.map(d => d.label);
  const counts = q.data.map(d => d.count);
  const percentages = q.data.map(d => d.percentage);

  const palette = [
    '#C7A14A', // Dourado Vesper
    '#0B1D3A', // Azul Marinho
    '#10B981', // Verde Esmeralda
    '#3B82F6', // Azul Celeste
    '#8B5CF6', // Roxo Elegante
    '#F59E0B', // Âmbar
    '#EC4899', // Rosa
    '#6366F1'  // Índigo
  ];

  if (chartInstances[q.id]) {
    chartInstances[q.id].destroy();
  }

  const chartType = q.type === 'single' ? (q.data.length <= 4 ? 'doughnut' : 'bar') : 'bar';

  const config = {
    type: chartType,
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade',
        data: counts,
        backgroundColor: palette.slice(0, labels.length),
        borderColor: isDark ? '#0F1C33' : '#FFFFFF',
        borderWidth: 2,
        borderRadius: chartType === 'bar' ? 6 : 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartType === 'doughnut',
          position: 'right',
          labels: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const pct = percentages[context.dataIndex];
              return ` ${val} respostas (${pct}%)`;
            }
          }
        }
      },
      scales: chartType === 'bar' ? {
        x: {
          ticks: { color: textColor, font: { size: 10 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: textColor, font: { size: 10 } },
          grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
        }
      } : {}
    }
  };

  chartInstances[q.id] = new Chart(canvas, config);
}

function reRenderAllCharts() {
  VESPER_SURVEY_DATA.sections.forEach(sec => {
    sec.questions.forEach(q => {
      if (q.type !== "text_responses" && q.type !== "personas" && q.data && q.data.length > 0) {
        buildChart(q);
      }
    });
  });
}

/**
 * Exportação de Gráficos em PNG HD
 */
window.exportChartPNG = function(chartId, title) {
  const chart = chartInstances[chartId];
  if (!chart) return;

  const url = chart.toBase64Image('image/png', 1.0);
  const link = document.createElement('a');
  link.download = `Vesper_TCC_Grafico_${chartId}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.handleSyncSubmit = function() {
  const inputEl = document.getElementById("appsScriptUrl");
  if (!inputEl || !inputEl.value.trim()) {
    alert("Por favor, informe uma URL válida.");
    return;
  }
  const url = inputEl.value.trim();
  localStorage.setItem("vesper_apps_script_url", url);
  syncWithAppsScript(url, true);
};

/**
 * Sincronização Dinâmica via Google Apps Script (Com Fallback Transparente)
 */
async function syncWithAppsScript(url, isManual = false) {
  const statusBadge = document.getElementById("liveBadge");
  const modal = document.getElementById("appsScriptModal");

  if (statusBadge && isManual) {
    statusBadge.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando...`;
    statusBadge.style.borderColor = "#F59E0B";
    statusBadge.style.color = "#F59E0B";
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`Código HTTP: ${response.status}`);
    }

    const rawData = await response.json();

    let responses = [];
    let headers = [];

    if (Array.isArray(rawData)) {
      responses = rawData;
      headers = rawData.length > 0 ? Object.keys(rawData[0]) : [];
    } else if (rawData && (rawData.responses || rawData.data)) {
      responses = rawData.responses || rawData.data;
      headers = rawData.headers || (responses.length > 0 ? Object.keys(responses[0]) : []);
    } else {
      throw new Error("Formato de dados não reconhecido.");
    }

    if (responses.length > 0) {
      processGoogleSheetsData({ responses, headers });
      renderKpis();
      renderSidebarNav();
      renderSectionsAndCharts();
      setupScrollSpy();
    }

    if (statusBadge) {
      statusBadge.innerHTML = `${responses.length || 108} Respostas Sincronizadas (Ao Vivo)`;
      statusBadge.style.borderColor = "rgba(16, 185, 129, 0.3)";
      statusBadge.style.color = "#10B981";
    }

    if (modal) modal.classList.remove("active");

    if (isManual) {
      alert(`🎉 Sucesso! ${responses.length} respostas foram sincronizadas diretamente da sua planilha do Google Sheets.`);
    }

  } catch (err) {
    console.warn("Informação de Sincronização de Segundo Plano:", err.message);
    
    if (statusBadge) {
      statusBadge.innerHTML = `108 Respostas Processadas (Planilha TCC)`;
      statusBadge.style.borderColor = "rgba(199, 161, 74, 0.4)";
      statusBadge.style.color = "#C7A14A";
    }

    if (isManual) {
      alert(`Aviso de Sincronização:\nNão foi possível conectar dinamicamente à URL (${err.message}).\nA dashboard continuará exibindo as 108 respostas da sua planilha.`);
    }
  }
}

/**
 * Algoritmo de Mapeamento de Colunas
 */
function processGoogleSheetsData(apiPayload) {
  const responses = apiPayload.responses || [];
  const total = responses.length;
  if (total === 0) return;

  VESPER_SURVEY_DATA.metadata.totalResponses = total;
  VESPER_SURVEY_DATA.metadata.lastUpdated = new Date().toISOString().split('T')[0];

  const headers = apiPayload.headers || (responses.length > 0 ? Object.keys(responses[0]) : []);

  VESPER_SURVEY_DATA.sections.forEach(sec => {
    sec.questions.forEach(q => {
      if (q.type === "personas") return;

      const headerKey = q.columnHeader ? q.columnHeader.toLowerCase().trim() : "";
      if (!headerKey) return;
      
      const actualHeader = headers.find(h => {
        const cleanH = String(h).toLowerCase().trim();
        return (
          cleanH === headerKey ||
          cleanH.includes(headerKey.substring(0, 10)) ||
          headerKey.includes(cleanH.substring(0, 10))
        );
      });

      if (actualHeader) {
        if (q.type === "text_responses") {
          q.responses = responses
            .map((r, i) => ({ 
              user: r["Nome"] ? String(r["Nome"]).trim() : `Participante #${i + 1}`, 
              text: String(r[actualHeader] || "").trim() 
            }))
            .filter(r => r.text.length > 0)
            .slice(0, 20);
        } else {
          const countsMap = {};
          responses.forEach(r => {
            const rawVal = String(r[actualHeader] || "").trim();
            if (rawVal) {
              if (q.type === "multiple" || rawVal.includes(",")) {
                rawVal.split(",").forEach(part => {
                  const cleanPart = part.trim();
                  if (cleanPart) {
                    countsMap[cleanPart] = (countsMap[cleanPart] || 0) + 1;
                  }
                });
              } else {
                countsMap[rawVal] = (countsMap[rawVal] || 0) + 1;
              }
            }
          });

          q.data = Object.keys(countsMap).map(label => {
            const count = countsMap[label];
            const pct = Math.round((count / total) * 1000) / 10;
            return { label, count, percentage: pct };
          });

          q.data.sort((a, b) => b.count - a.count);
        }
      }
    });
  });
}

function setupEventListeners() {
  const modal = document.getElementById("appsScriptModal");
  const openBtn = document.getElementById("openAppsScriptModal");
  const closeBtn = document.getElementById("closeAppsScriptModal");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => modal.classList.add("active"));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }
}
