import * as fs from "fs";
import * as path from "path";
import * as http from "http";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface DashboardData {
  kpis: KPI[];
  platforms: Platform[];
  revenueWeeks: string[];
  revenueValues: number[];
  promptLabels: string[];
  promptValues: number[];
  conversionPages: ConversionPage[];
  trendGPT: number[];
  trendGemini: number[];
  trendClaude: number[];
  generatedAt: string;
}

interface KPI {
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "neutral";
  accent: string;
}

interface Platform {
  name: string;
  mentions: number;
  color: string;
}

interface ConversionPage {
  name: string;
  rate: number;
  color: string;
}

// ─────────────────────────────────────────────────────────────
// DATA GENERATION  (replace these functions with real API calls)
// ─────────────────────────────────────────────────────────────

function rnd(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function rndF(min: number, max: number, dec = 1): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(dec));
}

function pct(val: number, ref: number): string {
  const d = Math.round(((val - ref) / ref) * 100);
  return (d >= 0 ? "+" : "") + d + "% vs prev";
}

function generateData(): DashboardData {
  const rev = rnd(150_000, 210_000);
  const prevRev = rnd(130_000, 180_000);
  const conv = rnd(1_000, 1_500);
  const prevConv = rnd(900, 1_300);
  const cpa = rnd(18, 32);
  const roas = rndF(3.5, 5.5);
  const spend = rnd(35_000, 55_000);

  const chatgpt = rnd(4_200, 6_000);
  const gemini  = rnd(3_200, 5_000);
  const claude  = rnd(2_400, 4_000);

  const weeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

  return {
    kpis: [
      { label: "Revenue",     value: `$${rev.toLocaleString()}`,   sub: pct(rev, prevRev),   trend: rev >= prevRev ? "up" : "down", accent: "#00C9A7" },
      { label: "ROAS",        value: `${roas}×`,                   sub: "Return on ad spend", trend: "neutral",                      accent: "#4F8EF7" },
      { label: "Conversions", value: conv.toLocaleString(),        sub: pct(conv, prevConv), trend: conv >= prevConv ? "up" : "down",accent: "#F7C94F" },
      { label: "CPA",         value: `$${cpa}`,                    sub: "Cost per acquisition",trend: cpa <= 24 ? "up" : "down",     accent: "#9B6DFF" },
      { label: "Ad Spend",    value: `$${spend.toLocaleString()}`, sub: "Total media budget", trend: "neutral",                      accent: "#F75F5F" },
    ],
    platforms: [
      { name: "ChatGPT", mentions: chatgpt, color: "#74AA9C" },
      { name: "Gemini",  mentions: gemini,  color: "#F7C94F" },
      { name: "Claude",  mentions: claude,  color: "#9B6DFF" },
    ],
    revenueWeeks:  weeks,
    revenueValues: weeks.map(() => rnd(120_000, 220_000)),
    promptLabels: [
      '"best standing desk"',
      '"ergonomic office desk"',
      '"desks for remote work"',
      '"height adjustable desk"',
      '"standing desk under $500"',
    ],
    promptValues: Array.from({ length: 5 }, () => rnd(1_500, 10_000)),
    conversionPages: [
      { name: "/ergonomic-desk",      rate: rndF(4.0, 7.0), color: "#00C9A7" },
      { name: "/home-office",         rate: rndF(3.5, 6.0), color: "#4F8EF7" },
      { name: "/best-standing-desks", rate: rndF(2.5, 5.0), color: "#F7C94F" },
    ],
    trendGPT:    weeks.map(() => rndF(4.5, 5.8)),
    trendGemini: weeks.map(() => rndF(3.8, 5.2)),
    trendClaude: weeks.map(() => rndF(3.2, 4.6)),
    generatedAt: new Date().toLocaleString(),
  };
}

// ─────────────────────────────────────────────────────────────
// HTML TEMPLATE
// ─────────────────────────────────────────────────────────────

function buildHTML(data: DashboardData): string {
  const maxMentions = Math.max(...data.platforms.map((p) => p.mentions));
  const maxConvRate = Math.max(...data.conversionPages.map((p) => p.rate));

  const kpiCards = data.kpis
    .map(
      (k) => `
      <div class="kpi" style="--accent:${k.accent}">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-sub ${k.trend === "neutral" ? "" : k.trend}">${k.sub}</div>
      </div>`
    )
    .join("");

  const platformBars = data.platforms
    .map(
      (p) => `
      <div class="ai-platform">
        <div class="ai-name">${p.name}</div>
        <div class="ai-bar-wrap">
          <div class="ai-bar" style="width:${Math.round((p.mentions / maxMentions) * 100)}%;background:${p.color}"></div>
        </div>
        <div class="ai-val" style="color:${p.color}">${p.mentions.toLocaleString()}</div>
      </div>`
    )
    .join("");

  const conversionRows = data.conversionPages
    .map(
      (p) => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:10px;color:#8899BB">${p.name}</span>
          <span style="font-size:11px;font-weight:500;color:${p.color}">${p.rate}%</span>
        </div>
        <div style="background:#253350;border-radius:3px;height:8px">
          <div style="width:${Math.round((p.rate / maxConvRate) * 100)}%;background:${p.color};height:100%;border-radius:3px"></div>
        </div>
      </div>`
    )
    .join("");

  const revenueJSON   = JSON.stringify(data.revenueValues);
  const promptJSON    = JSON.stringify(data.promptValues);
  const trendGPT      = JSON.stringify(data.trendGPT);
  const trendGemini   = JSON.stringify(data.trendGemini);
  const trendClaude   = JSON.stringify(data.trendClaude);
  const weeks         = JSON.stringify(data.revenueWeeks);
  const promptLabels  = JSON.stringify(data.promptLabels);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AI Brand Visibility Dashboard</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0A1120;color:#fff;min-height:100vh}
  .header{background:#161E2E;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #4F8EF7;position:sticky;top:0;z-index:10}
  .header-title{font-size:15px;font-weight:600;letter-spacing:2px;text-transform:uppercase}
  .header-sub{font-size:11px;color:#8899BB;margin-top:2px}
  .live-badge{background:rgba(79,142,247,0.15);border:1px solid #4F8EF7;border-radius:4px;padding:4px 12px;font-size:10px;color:#4F8EF7;letter-spacing:1px;display:flex;align-items:center;gap:6px}
  .live-dot{width:7px;height:7px;border-radius:50%;background:#00C9A7;animation:pulse 1.5s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  .content{padding:20px 24px;max-width:1400px;margin:0 auto}
  .kpi-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:18px}
  .kpi{background:#161E2E;border:1px solid #253350;border-radius:8px;padding:14px;border-top:3px solid var(--accent)}
  .kpi-label{font-size:9px;color:var(--accent);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px}
  .kpi-value{font-size:22px;font-weight:600;color:#fff;line-height:1.1}
  .kpi-sub{font-size:10px;color:#8899BB;margin-top:4px}
  .kpi-sub.up{color:#00C9A7}
  .kpi-sub.down{color:#F75F5F}
  .charts-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
  .bottom-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  .panel{background:#161E2E;border:1px solid #253350;border-radius:8px;padding:16px}
  .panel-title{font-size:9px;color:#8899BB;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px}
  .ai-platform{display:flex;align-items:center;gap:10px;margin-bottom:12px}
  .ai-name{font-size:12px;font-weight:500;color:#fff;width:70px}
  .ai-bar-wrap{flex:1;background:#253350;border-radius:3px;height:10px;overflow:hidden}
  .ai-bar{height:100%;border-radius:3px}
  .ai-val{font-size:11px;font-weight:500;width:52px;text-align:right}
  .footer{background:#161E2E;padding:10px 24px;text-align:center;font-size:9px;color:#5A6D8A;letter-spacing:1px;border-top:1px solid #253350;margin-top:20px}
  .refresh-btn{background:transparent;border:1px solid #253350;color:#8899BB;font-size:10px;padding:5px 14px;border-radius:4px;cursor:pointer;letter-spacing:1px;transition:all 0.2s}
  .refresh-btn:hover{border-color:#4F8EF7;color:#4F8EF7}
  .ts{font-size:10px;color:#5A6D8A;margin-top:2px}
  @media(max-width:900px){.kpi-row{grid-template-columns:repeat(3,1fr)}.charts-row,.bottom-row{grid-template-columns:1fr}}
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="header-title">AI Brand Visibility Dashboard</div>
    <div class="header-sub">ChatGPT · Gemini · Claude — Last 30 Days</div>
  </div>
  <div style="display:flex;gap:12px;align-items:center">
    <button class="refresh-btn" onclick="location.reload()">Refresh data</button>
    <div class="live-badge"><span class="live-dot"></span>Live</div>
  </div>
</div>

<div class="content">
  <div class="kpi-row">${kpiCards}</div>

  <div class="charts-row">
    <div class="panel">
      <div class="panel-title">AI Platform Mentions</div>
      ${platformBars}
    </div>
    <div class="panel">
      <div class="panel-title">Revenue trend — 12 weeks</div>
      <div style="position:relative;height:150px"><canvas id="revenueChart"></canvas></div>
    </div>
  </div>

  <div class="bottom-row">
    <div class="panel">
      <div class="panel-title">Prompt trigger clicks</div>
      <div style="position:relative;height:150px"><canvas id="promptChart"></canvas></div>
    </div>
    <div class="panel">
      <div class="panel-title">Conversion rate by page</div>
      ${conversionRows}
    </div>
    <div class="panel">
      <div class="panel-title">AI mention rate trend</div>
      <div style="position:relative;height:150px"><canvas id="trendChart"></canvas></div>
    </div>
  </div>
</div>

<div class="footer">
  CONFIDENTIAL · AI VISIBILITY INTELLIGENCE · Q1 2026
  &nbsp;·&nbsp;
  Generated: ${data.generatedAt}
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script>
  const weeks        = ${weeks};
  const revenueVals  = ${revenueJSON};
  const promptLabels = ${promptLabels};
  const promptVals   = ${promptJSON};
  const trendGPT     = ${trendGPT};
  const trendGemini  = ${trendGemini};
  const trendClaude  = ${trendClaude};

  const gridColor = "rgba(37,51,80,0.6)";
  const mutedText = "#5A6D8A";
  const dimText   = "#8899BB";

  new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: weeks,
      datasets: [{
        label: "Revenue", data: revenueVals,
        borderColor: "#4F8EF7", backgroundColor: "rgba(79,142,247,0.08)",
        borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: mutedText, font: { size: 9 } }, grid: { color: gridColor } },
        y: { ticks: { color: mutedText, font: { size: 9 }, callback: v => "$" + (v/1000) + "k" }, grid: { color: gridColor } }
      }
    }
  });

  new Chart(document.getElementById("promptChart"), {
    type: "bar",
    data: {
      labels: promptLabels,
      datasets: [{ label: "Clicks", data: promptVals, backgroundColor: "#F7C94F", borderRadius: 3 }]
    },
    options: {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: mutedText, font: { size: 9 } }, grid: { color: gridColor } },
        y: { ticks: { color: dimText,   font: { size: 8 } }, grid: { display: false } }
      }
    }
  });

  new Chart(document.getElementById("trendChart"), {
    type: "line",
    data: {
      labels: weeks,
      datasets: [
        { label: "ChatGPT", data: trendGPT,    borderColor: "#74AA9C", borderWidth: 2, pointRadius: 0, tension: 0.4 },
        { label: "Gemini",  data: trendGemini, borderColor: "#F7C94F", borderWidth: 2, pointRadius: 0, tension: 0.4 },
        { label: "Claude",  data: trendClaude, borderColor: "#9B6DFF", borderWidth: 2, pointRadius: 0, tension: 0.4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: "bottom", labels: { color: dimText, font: { size: 8 }, boxWidth: 8, padding: 8 } } },
      scales: {
        x: { ticks: { color: mutedText, font: { size: 8 } }, grid: { color: gridColor } },
        y: { ticks: { color: mutedText, font: { size: 8 }, callback: (v: number) => v + "%" }, grid: { color: gridColor } }
      }
    }
  });
</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// SERVER
// ─────────────────────────────────────────────────────────────

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = req.url ?? "/";

  if (url === "/api/data" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
    res.end(JSON.stringify(generateData()));
    return;
  }

  if (url === "/" || url === "/index.html") {
    const html = buildHTML(generateData());
    res.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-cache" });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n✅ Dashboard running at http://localhost:${PORT}`);
  console.log(`   API endpoint:      http://localhost:${PORT}/api/data`);
  console.log(`   Press Ctrl+C to stop\n`);
});

// ─────────────────────────────────────────────────────────────
// OPTIONAL: write a static snapshot to ./dist/
// ─────────────────────────────────────────────────────────────

const DIST_DIR  = path.join(process.cwd(), "dist");
const DIST_FILE = path.join(DIST_DIR, "dashboard.html");

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(DIST_FILE, buildHTML(generateData()), "utf8");
console.log(`📄 Static snapshot saved to ${DIST_FILE}`);
