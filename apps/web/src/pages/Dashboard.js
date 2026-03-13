import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { SOVSection } from '../components/SOVSection';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler, } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { RefreshCw } from 'lucide-react';
import { appConfig } from '../config/app.config';
const clientBrand = appConfig.clientBrand;
import { useDashboardData } from '../hooks/useDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '../hooks/useDashboard';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);
// ─── Shared chart defaults ────────────────────────────────────────────────────
const GRID = 'rgba(37,51,80,0.6)';
const MUTED = '#5A6D8A';
const DIM = '#8899BB';
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
        y: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
    },
};
// ─── Panels & KPI helpers ─────────────────────────────────────────────────────
function Panel({ title, children, className = '', }) {
    return (_jsxs("div", { className: `rounded-lg border p-4 ${className}`, style: { background: '#161E2E', borderColor: '#253350' }, children: [title && (_jsx("p", { className: "mb-3 text-[9px] font-medium uppercase tracking-[1.5px]", style: { color: '#8899BB' }, children: title })), children] }));
}
function KPICard({ label, value, sub, trend, accent, small = false, }) {
    const subColor = trend === 'up' ? '#00C9A7' : trend === 'down' ? '#F75F5F' : '#8899BB';
    return (_jsxs("div", { className: "rounded-lg border p-3", style: {
            background: '#161E2E',
            borderColor: '#253350',
            borderTop: `3px solid ${accent}`,
        }, children: [_jsx("p", { className: "mb-1 text-[9px] font-medium uppercase tracking-[1.5px]", style: { color: accent }, children: label }), _jsx("p", { className: "font-semibold leading-tight text-white", style: { fontSize: small ? 16 : 22 }, children: value }), _jsx("p", { className: "mt-1 text-[10px]", style: { color: subColor }, children: sub })] }));
}
function HorizBar({ name, value, max, color, suffix = '', }) {
    const pct = Math.round((value / max) * 100);
    return (_jsxs("div", { className: "mb-2.5", children: [_jsxs("div", { className: "mb-1 flex justify-between", children: [_jsx("span", { className: "text-[10px]", style: { color: '#8899BB' }, children: name }), _jsxs("span", { className: "text-[10px] font-medium", style: { color }, children: [typeof value === 'number' && value > 100
                                ? value.toLocaleString()
                                : value, suffix] })] }), _jsx("div", { className: "h-[7px] rounded-sm", style: { background: '#253350' }, children: _jsx("div", { className: "h-full rounded-sm", style: { width: `${pct}%`, background: color } }) })] }));
}
// ─── Tab pages ────────────────────────────────────────────────────────────────
function BusinessTab({ data }) {
    const revData = {
        labels: data.days,
        datasets: [
            {
                label: 'Revenue',
                data: data.revenueTrend,
                borderColor: '#4F8EF7',
                backgroundColor: 'rgba(79,142,247,0.08)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
            },
        ],
    };
    const roasData = {
        labels: data.weekLabels,
        datasets: [
            {
                label: 'ROAS',
                data: data.roasByWeek,
                backgroundColor: '#4F8EF7',
                borderRadius: 4,
                yAxisID: 'yR',
            },
            {
                label: 'CPA ($)',
                data: data.cpaByWeek,
                backgroundColor: '#F96302',
                borderRadius: 4,
                yAxisID: 'yC',
            },
        ],
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-5", children: data.kpis.map(k => (_jsx(KPICard, { ...k }, k.label))) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Panel, { title: "Revenue trend \u2014 daily (30 days)", children: _jsx("div", { className: "h-56", children: _jsx(Line, { data: revData, options: {
                                    ...baseOptions,
                                    scales: {
                                        x: {
                                            ticks: { color: MUTED, font: { size: 9 } },
                                            grid: { color: GRID },
                                        },
                                        y: {
                                            ticks: {
                                                color: MUTED,
                                                font: { size: 9 },
                                                callback: v => '$' + (Number(v) / 1000).toFixed(1) + 'k',
                                            },
                                            grid: { color: GRID },
                                        },
                                    },
                                } }) }) }), _jsx(Panel, { title: "ROAS & CPA by week", children: _jsx("div", { className: "h-56", children: _jsx(Bar, { data: roasData, options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'bottom',
                                            labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 10 },
                                        },
                                    },
                                    scales: {
                                        x: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
                                        yR: {
                                            position: 'left',
                                            ticks: {
                                                color: '#4F8EF7',
                                                font: { size: 9 },
                                                callback: v => v + '×',
                                            },
                                            grid: { color: GRID },
                                        },
                                        yC: {
                                            position: 'right',
                                            ticks: {
                                                color: '#F75F5F',
                                                font: { size: 9 },
                                                callback: v => '$' + v,
                                            },
                                            grid: { display: false },
                                        },
                                    },
                                } }) }) })] })] }));
}
function VisibilityTab({ data }) {
    const LINK_COLORS = ['#4F8EF7', '#00C9A7', '#F7C94F', '#9B6DFF', '#F75F5F'];
    const maxClicks = Math.max(...data.topLinks.map(l => l.clicks));
    const maxConv = Math.max(...data.conversionPages.map(p => p.rate));
    const promptData = {
        labels: data.promptTriggers.map(p => p.label),
        datasets: [
            {
                label: 'Mentions',
                data: data.promptTriggers.map(p => p.mentions),
                backgroundColor: '#4F8EF7',
                borderRadius: 3,
            },
            {
                label: 'Link Clicks',
                data: data.promptTriggers.map(p => p.clicks),
                backgroundColor: '#00C9A7',
                borderRadius: 3,
            },
        ],
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-7 gap-3", children: data.visibilityMetrics.map(k => (_jsx(KPICard, { ...k, small: true }, k.label))) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs(Panel, { children: [_jsx("p", { className: "mb-3 text-[9px] font-medium uppercase tracking-[1.5px]", style: { color: '#8899BB' }, children: "Top performing links \u2014 link clicks" }), data.topLinks.map((l, i) => (_jsx(HorizBar, { name: l.name, value: l.clicks, max: maxClicks, color: LINK_COLORS[i % LINK_COLORS.length] }, l.name))), _jsx("p", { className: "mb-3 mt-5 text-[9px] font-medium uppercase tracking-[1.5px]", style: { color: '#8899BB' }, children: "Conversion rate by page" }), data.conversionPages.map(p => (_jsx(HorizBar, { name: p.name, value: p.rate, max: maxConv, color: p.color, suffix: "%" }, p.name)))] }), _jsx(Panel, { title: "AI prompt triggers \u2014 mentions & link clicks", children: _jsx("div", { className: "h-80", children: _jsx(Bar, { data: promptData, options: {
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'bottom',
                                            labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 10 },
                                        },
                                    },
                                    scales: {
                                        x: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
                                        y: {
                                            ticks: { color: DIM, font: { size: 8 } },
                                            grid: { display: false },
                                        },
                                    },
                                } }) }) })] })] }));
}
function CompetitorTab({ data }) {
    const pieData = {
        labels: data.competitors.map(c => c.name),
        datasets: [
            {
                data: data.competitors.map(c => c.pct),
                backgroundColor: data.competitors.map(c => c.color),
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };
    const trendData = {
        labels: data.trendWeeks,
        datasets: [
            {
                label: 'ChatGPT',
                data: data.trendGPT,
                borderColor: '#74AA9C',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            },
            {
                label: 'Gemini',
                data: data.trendGemini,
                borderColor: '#F7C94F',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            },
            {
                label: 'Claude',
                data: data.trendClaude,
                borderColor: '#9B6DFF',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            },
            {
                label: 'Perplexity',
                data: data.trendPerplexity,
                borderColor: '#4F8EF7',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            },
        ],
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsx(Panel, { title: "Mention share by brand", children: _jsx("div", { className: "h-48", children: _jsx(Doughnut, { data: pieData, options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '55%',
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'bottom',
                                            labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 8 },
                                        },
                                    },
                                } }) }) }), _jsxs(Panel, { title: "Competitor rankings", children: [_jsxs("div", { className: "mb-1 flex gap-2 border-b pb-1.5 text-[9px]", style: { color: '#5A6D8A', borderColor: '#253350' }, children: [_jsx("span", { className: "w-5" }), _jsx("span", { className: "flex-1", children: "Company" }), _jsx("span", { className: "w-10 text-right", children: "Share" }), _jsx("span", { className: "w-7 text-right", children: "Rank" })] }), data.competitors.map(c => (_jsxs("div", { className: "flex items-center gap-2 border-b py-1.5", style: { borderColor: '#1E2D45' }, children: [_jsx("div", { className: "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold", style: { background: c.color, color: '#0F1623' }, children: c.rank }), _jsx("span", { className: "flex-1 text-[11px] text-white", children: c.name }), _jsxs("span", { className: "w-10 text-right text-[11px] font-medium", style: { color: c.color }, children: [c.pct, "%"] }), _jsx("span", { className: "w-7 text-right text-[10px]", style: { color: '#5A6D8A' }, children: c.avgRank })] }, c.name)))] }), _jsx(Panel, { title: "AI platform breakdown", children: data.platforms.map(p => (_jsxs("div", { className: "mb-2.5 flex items-center gap-2.5 rounded-lg border p-3", style: { background: '#1A2540', borderColor: p.color }, children: [_jsx("div", { className: "h-12 w-1 flex-shrink-0 rounded", style: { background: p.color } }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[13px] font-semibold text-white", children: p.name }), _jsxs("p", { className: "mt-0.5 text-[9px]", style: { color: '#8899BB' }, children: ["Avg Rank ", p.rank, " \u00B7 CTR ", p.ctr] })] }), _jsx("p", { className: "text-xl font-semibold", style: { color: p.color }, children: p.mentions.toLocaleString() })] }, p.name))) })] }), _jsx(Panel, { title: "AI brand mention rate trend \u2014 all platforms (30 days)", children: _jsx("div", { className: "h-40", children: _jsx(Line, { data: trendData, options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                    labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 8 },
                                },
                            },
                            scales: {
                                x: { ticks: { color: MUTED, font: { size: 8 } }, grid: { color: GRID } },
                                y: {
                                    ticks: {
                                        color: MUTED,
                                        font: { size: 8 },
                                        callback: v => v + '%',
                                    },
                                    grid: { color: GRID },
                                },
                            },
                        } }) }) })] }));
}
// ─── Loading skeleton ─────────────────────────────────────────────────────────
function DashboardSkeleton() {
    return (_jsxs("div", { className: "space-y-4 animate-pulse", children: [_jsx("div", { className: "grid grid-cols-5 gap-3", children: Array.from({ length: 5 }).map((_, i) => (_jsx("div", { className: "h-24 rounded-lg", style: { background: '#161E2E' } }, i))) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "h-72 rounded-lg", style: { background: '#161E2E' } }), _jsx("div", { className: "h-72 rounded-lg", style: { background: '#161E2E' } })] })] }));
}
const TABS = [
    { id: 'cover', label: 'Home', activeColor: '#00C9A7' },
    { id: 'business', label: 'Business Overview', activeColor: '#4F8EF7' },
    { id: 'visibility', label: 'AI Visibility', activeColor: '#F7C94F' },
    { id: 'competitor', label: 'Competitor Breakdown', activeColor: '#F75F5F' },
];
// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('cover');
    const { data, isLoading, error } = useDashboardData();
    const queryClient = useQueryClient();
    return (_jsxs("div", { style: { background: '#0A1120', minHeight: 'calc(100vh - 53px)' }, children: [_jsxs("div", { className: "sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3", style: { background: '#161E2E', borderColor: clientBrand.primaryHex }, children: [_jsxs("div", { className: "text-[13px] font-semibold uppercase tracking-[2px] text-white", children: [clientBrand.productName, ' ', _jsx("span", { style: { color: clientBrand.primaryHex }, children: "Visibility" }), " Dashboard"] }), _jsxs("div", { className: "flex items-center gap-3", children: [data && (_jsxs("span", { className: "text-[10px]", style: { color: '#5A6D8A' }, children: ["Generated: ", data.generatedAt] })), _jsxs("button", { onClick: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.data }), className: "flex items-center gap-1.5 rounded border px-3 py-1 text-[10px] uppercase tracking-[1px] transition-colors hover:border-[#F96302] hover:text-[#F96302]", style: {
                                    borderColor: '#253350',
                                    color: '#8899BB',
                                    background: 'transparent',
                                }, children: [_jsx(RefreshCw, { size: 11 }), "Refresh data"] }), _jsxs("div", { className: "flex items-center gap-1.5 rounded border px-2.5 py-1 text-[10px] uppercase tracking-[1px]", style: {
                                    background: 'rgba(249, 99, 2, 0.15)',
                                    borderColor: clientBrand.primaryHex,
                                    color: clientBrand.primaryHex,
                                }, children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full", style: { background: '#00C9A7', animation: 'pulse 1.5s infinite' } }), "Live"] })] })] }), _jsx("div", { className: "sticky top-[53px] z-10 flex gap-0.5 border-b px-6", style: { background: '#0F1623', borderColor: '#253350' }, children: TABS.map(tab => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: "border-b-2 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[1px] transition-all whitespace-nowrap", style: {
                        color: activeTab === tab.id ? tab.activeColor : '#5A6D8A',
                        borderBottomColor: activeTab === tab.id ? tab.activeColor : 'transparent',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `2px solid ${activeTab === tab.id ? tab.activeColor : 'transparent'}`,
                        cursor: 'pointer',
                    }, children: tab.label }, tab.id))) }), _jsxs("div", { className: "p-6", style: { maxWidth: 1400, margin: '0 auto' }, children: [isLoading && activeTab !== 'cover' && _jsx(DashboardSkeleton, {}), error && (_jsxs("div", { className: "rounded-lg border p-8 text-center", style: { background: '#161E2E', borderColor: '#253350' }, children: [_jsx("p", { style: { color: '#F75F5F' }, children: "Failed to load dashboard data." }), _jsx("p", { className: "mt-1 text-sm", style: { color: '#5A6D8A' }, children: "Make sure the API is running on port 4000." })] })), activeTab === 'cover' && _jsx(SOVSection, { compact: true }), data && activeTab !== 'cover' && (_jsxs(_Fragment, { children: [activeTab === 'business' && _jsx(BusinessTab, { data: data }), activeTab === 'visibility' && _jsx(VisibilityTab, { data: data }), activeTab === 'competitor' && _jsx(CompetitorTab, { data: data })] }))] }), _jsx("div", { className: "border-t py-2 text-center text-[9px] uppercase tracking-[1px]", style: { background: '#161E2E', borderColor: '#253350', color: '#5A6D8A' }, children: "CONFIDENTIAL \u00B7 AI VISIBILITY INTELLIGENCE \u00B7 P1 2026" }), _jsx("style", { children: `
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      ` })] }));
}
