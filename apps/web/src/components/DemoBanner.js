import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Zap } from 'lucide-react';
import { appConfig } from '../config/app.config';
export function DemoBanner() {
    if (!appConfig.demoMode.enabled)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-2 bg-amber-400 px-3 py-1.5 text-amber-900 text-xs font-semibold", children: [_jsx(Zap, { size: 12, className: "shrink-0" }), _jsxs("span", { children: [appConfig.demoMode.badgeText, " \u2014 credentials auto-filled"] })] }));
}
