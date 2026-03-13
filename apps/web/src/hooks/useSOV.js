import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { appConfig } from '../config/app.config';
// SOV is demo-mode only; serverUrl removed. This hook is unused but kept for reference.
const SOV_URL = appConfig.sov.serverUrl ?? 'http://localhost:8000';
// ─── Snapshot (polled) ────────────────────────────────────────────────────────
export function useSOVSnapshot(brand = appConfig.sov.brand) {
    return useQuery({
        queryKey: ['sov', 'snapshot', brand],
        queryFn: async () => {
            const res = await fetch(`${SOV_URL}/snapshot/${encodeURIComponent(brand)}`);
            if (!res.ok)
                throw new Error('SOV server unreachable');
            return res.json();
        },
        refetchInterval: 10000,
        retry: false,
        staleTime: 8000,
    });
}
export function useSOVStream(brand = appConfig.sov.brand, maxEvents = 10) {
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState('connecting');
    const esRef = useRef(null);
    useEffect(() => {
        let cancelled = false;
        function connect() {
            if (cancelled)
                return;
            try {
                const es = new EventSource(`${SOV_URL}/stream/${encodeURIComponent(brand)}`);
                esRef.current = es;
                es.onopen = () => {
                    if (!cancelled)
                        setStatus('connected');
                };
                es.onmessage = e => {
                    if (cancelled)
                        return;
                    try {
                        const payload = JSON.parse(e.data);
                        setEvents(prev => [payload, ...prev].slice(0, maxEvents));
                    }
                    catch {
                        // ignore malformed events
                    }
                };
                es.onerror = () => {
                    es.close();
                    esRef.current = null;
                    if (!cancelled) {
                        setStatus('offline');
                        // attempt reconnect after 5 s
                        setTimeout(connect, 5000);
                    }
                };
            }
            catch {
                if (!cancelled)
                    setStatus('offline');
            }
        }
        connect();
        return () => {
            cancelled = true;
            esRef.current?.close();
            esRef.current = null;
        };
    }, [brand, maxEvents]);
    return { events, status };
}
// ─── Submit a query to the SOV server ────────────────────────────────────────
export async function submitSOVQuery(queryText, category = 'general') {
    const res = await fetch(`${SOV_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query_text: queryText, category }),
    });
    if (!res.ok)
        throw new Error('Query submission failed');
    return res.json();
}
