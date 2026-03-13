import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Send, TrendingUp, Activity } from 'lucide-react';
import { appConfig } from '../config/app.config';
import { cn } from '../lib/utils';
// ─── Mock data pools (Home Depot–centric demo mode) ────────────────────────────
const MOCK_QUERIES = [
    'best cordless drill for DIY',
    'pressure washer under $300',
    'paint for kitchen cabinets',
    'ceiling fan with remote',
    'lawn mower for small yard',
    'kitchen faucet with pull-down sprayer',
    'smart thermostat installation',
    'garage door opener belt drive',
    'outdoor string lights',
    'storage shed 8x10',
];
const MOCK_BRANDS = [
    ['The Home Depot', 'Lowe\'s'],
    ['DeWalt', 'Milwaukee', 'Ryobi'],
    ['Sherwin-Williams', 'Behr', 'Valspar'],
    ['GE', 'Samsung', 'LG'],
    ['Husqvarna', 'Toro', 'Greenworks'],
    ['The Home Depot', 'Ace Hardware'],
];
const MOCK_AI_RESPONSES = [
    'For cordless drills, DeWalt DCD771 and Milwaukee M18 are top picks. The Home Depot carries both with same-day delivery.',
    'The Home Depot offers a wide selection of pressure washers. Consider the Ryobi 3000 PSI or Greenworks Pro for under $300.',
    'Behr and Sherwin-Williams are recommended for cabinet paint. The Home Depot stocks Behr Cabinet & Trim Enamel.',
];
// ─── Small stat card ──────────────────────────────────────────────────────────
function SOVStat({ label, value, sub, highlight = false, }) {
    return (_jsxs("div", { className: cn('rounded-xl border p-4', highlight ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-gray-800 bg-gray-900'), children: [_jsx("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: label }), _jsx("p", { className: cn('mt-1 text-2xl font-bold', highlight ? 'text-emerald-400' : 'text-white'), children: value }), sub && _jsx("p", { className: "mt-0.5 text-xs text-gray-500", children: sub })] }));
}
// ─── Feed event row ───────────────────────────────────────────────────────────
function FeedRow({ queryText, brandsDetected, isoTime, isNew = false, }) {
    const time = new Date(isoTime);
    const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return (_jsxs("div", { className: cn('flex items-start gap-3 rounded-lg border px-4 py-3 transition-all', isNew
            ? 'border-emerald-500/50 bg-emerald-950/20'
            : 'border-gray-800 bg-gray-900/50'), children: [_jsx(Activity, { size: 14, className: cn('mt-0.5 flex-shrink-0', isNew ? 'text-emerald-400' : 'text-gray-600') }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm text-gray-300 truncate", children: queryText }), brandsDetected.length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: brandsDetected.map(b => (_jsx("span", { className: "rounded-full bg-indigo-900/50 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-700/50", children: b }, b))) }))] }), _jsx("span", { className: "flex-shrink-0 text-[10px] text-gray-600 font-mono", children: label })] }));
}
// ─── Main component (fully self-contained demo mode) ───────────────────────────
export function SOVSection({ compact = false }) {
    const brand = appConfig.clientBrand.productName;
    // Hardcoded snapshot stats
    const snapshot = {
        sovPct: 34.2,
        deltaVsLastWindow: 2.1,
        appearances: 1847,
        totalQueries: 5401,
        topTriggerAttribute: 'for DIY',
    };
    const [feedEvents, setFeedEvents] = useState([]);
    const [query, setQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    // Simulated live feed: append new event every 4–6 seconds
    useEffect(() => {
        const addSimulatedEvent = () => {
            const q = MOCK_QUERIES[Math.floor(Math.random() * MOCK_QUERIES.length)];
            const brands = MOCK_BRANDS[Math.floor(Math.random() * MOCK_BRANDS.length)];
            setFeedEvents(prev => [
                { queryText: q, brandsMentioned: brands, isoTime: new Date().toISOString() },
                ...prev.slice(0, 19),
            ]);
        };
        // Seed a few initial events
        addSimulatedEvent();
        addSimulatedEvent();
        const interval = setInterval(addSimulatedEvent, 4000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!query.trim() || submitting)
            return;
        setSubmitting(true);
        setLastResult(null);
        // Simulate 1.5s delay
        await new Promise(r => setTimeout(r, 1500));
        const mockResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
        const mockBrands = MOCK_BRANDS[Math.floor(Math.random() * MOCK_BRANDS.length)];
        setFeedEvents(prev => [
            { queryText: query.trim(), brandsMentioned: mockBrands, isoTime: new Date().toISOString() },
            ...prev,
        ]);
        setLastResult({ rawAiResponse: mockResponse, brandsDetected: mockBrands });
        setQuery('');
        setSubmitting(false);
    }, [query, submitting]);
    return (_jsxs("section", { className: compact ? 'bg-transparent py-0' : 'bg-gray-950 border-t border-gray-800 py-20', children: [_jsxs("div", { className: compact ? 'mx-auto max-w-5xl' : 'mx-auto max-w-5xl px-6', children: [_jsxs("div", { className: compact ? 'mb-6 flex items-start justify-between gap-4' : 'mb-10 flex items-start justify-between gap-4', children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx(TrendingUp, { size: 18, className: "text-emerald-400" }), _jsx("span", { className: "text-xs font-semibold uppercase tracking-[2px] text-emerald-400", children: "Share of Voice" })] }), _jsx("h2", { className: "text-3xl font-bold text-white", children: "Live AI Brand Visibility" }), _jsxs("p", { className: "mt-2 text-sm text-gray-500", children: ["Real-time tracking of how often", ' ', _jsx("span", { className: "font-medium text-gray-300", children: brand }), " appears in AI-generated shopping responses across platforms."] })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-950/30 px-3 py-1.5 text-xs font-medium flex-shrink-0 text-emerald-400", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400", style: { animation: 'sov-pulse 1.5s infinite' } }), "Demo mode"] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [_jsx(SOVStat, { label: "Share of Voice", value: `${snapshot.sovPct}%`, sub: `+${snapshot.deltaVsLastWindow}% vs last window`, highlight: true }), _jsx(SOVStat, { label: "Appearances", value: snapshot.appearances, sub: "In current window" }), _jsx(SOVStat, { label: "Total Queries", value: snapshot.totalQueries, sub: "Processed" }), _jsx(SOVStat, { label: "Top Trigger", value: snapshot.topTriggerAttribute, sub: "Most associated attribute" })] }), _jsxs("div", { className: "rounded-xl border border-gray-800 bg-gray-900/60 p-5", children: [_jsx("p", { className: "mb-3 text-sm font-medium text-gray-300", children: "Submit a shopping query" }), _jsx("p", { className: "mb-4 text-xs text-gray-500", children: "Add a query to the simulated feed below. No server required \u2014 demo mode." }), _jsxs("form", { onSubmit: handleSubmit, className: "flex gap-3", children: [_jsx("input", { type: "text", value: query, onChange: e => setQuery(e.target.value), placeholder: `e.g. "best cordless drill for DIY"`, className: "flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500", disabled: submitting }), _jsxs("button", { type: "submit", disabled: submitting || !query.trim(), className: "flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none", children: [submitting ? (_jsxs("svg", { className: "animate-spin h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] })) : (_jsx(Send, { size: 14 })), "Submit"] })] }), lastResult && (_jsxs("div", { className: "mt-4 rounded-lg border border-gray-700 bg-gray-800/60 p-4", children: [_jsx("p", { className: "mb-1 text-[10px] uppercase tracking-wide text-gray-500 font-medium", children: "AI Response (simulated)" }), _jsx("p", { className: "text-sm text-gray-300 leading-relaxed", children: lastResult.rawAiResponse }), lastResult.brandsDetected.length > 0 && (_jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Brands detected:" }), lastResult.brandsDetected.map(b => (_jsx("span", { className: "rounded-full bg-indigo-900/50 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-700/50", children: b }, b)))] }))] }))] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Live query feed (simulated)" }), _jsxs("span", { className: "text-xs text-gray-600", children: [feedEvents.length, " event", feedEvents.length !== 1 ? 's' : ''] })] }), feedEvents.length === 0 ? (_jsxs("div", { className: "rounded-xl border border-gray-800 bg-gray-900/30 py-12 text-center", children: [_jsx(Activity, { size: 24, className: "mx-auto mb-2 text-gray-700" }), _jsx("p", { className: "text-sm text-gray-600", children: "Waiting for queries\u2026 Submit one above or watch the simulated feed." })] })) : (_jsx("div", { className: "space-y-2", children: feedEvents.map((ev, i) => (_jsx(FeedRow, { queryText: ev.queryText, brandsDetected: ev.brandsMentioned, isoTime: ev.isoTime, isNew: i === 0 }, `${ev.isoTime}-${i}`))) }))] })] })] }), _jsx("style", { children: `
        @keyframes sov-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      ` })] }));
}
