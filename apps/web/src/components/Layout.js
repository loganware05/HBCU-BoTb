import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Settings, LogOut, Layers, Flame, TrendingUp, AlertCircle, Lightbulb, Zap, } from 'lucide-react';
import { appConfig } from '../config/app.config';
import { useCurrentUser, useLogout } from '../hooks/useAuth';
import { initials } from '../lib/utils';
const iconMap = {
    LayoutDashboard,
    Target,
    Settings,
    Layers,
    Flame,
    TrendingUp,
    AlertCircle,
    Lightbulb,
    Zap,
};
function NavIcon({ name }) {
    const Icon = iconMap[name] ?? Target;
    return _jsx(Icon, { size: 18 });
}
const clientBrand = appConfig.clientBrand;
export function AppLayout() {
    const user = useCurrentUser();
    const logout = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    return (_jsxs("div", { className: `flex h-screen overflow-hidden ${isDashboard ? 'bg-[#0A1120]' : 'bg-gray-50'}`, children: [_jsxs("aside", { className: "flex w-60 flex-shrink-0 flex-col bg-gray-900 text-gray-100", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-gray-800", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold", style: { background: clientBrand.primaryHex }, children: clientBrand.logoText }), _jsx("span", { className: "font-semibold text-white tracking-tight", children: clientBrand.productName })] }), _jsx("nav", { className: "flex-1 px-3 py-4 space-y-0.5 overflow-y-auto", children: appConfig.nav.map(item => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => [
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100',
                                isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                isActive && '!bg-[#F96302]',
                            ].filter(Boolean).join(' '), children: [_jsx(NavIcon, { name: item.icon }), item.label] }, item.path))) }), _jsxs("div", { className: "border-t border-gray-800 px-3 py-4", children: [user && (_jsxs("div", { className: "flex items-center gap-3 px-2 py-2 rounded-lg", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0", style: { background: clientBrand.primaryHex }, children: initials(user.name) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-white truncate", children: user.name }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: user.email })] })] })), _jsxs("button", { onClick: logout, className: "mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors", children: [_jsx(LogOut, { size: 16 }), "Sign out"] })] })] }), _jsxs("main", { className: "flex flex-1 flex-col overflow-hidden", children: [!isDashboard && (_jsxs("header", { className: "flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0", children: [_jsx("div", {}), _jsxs("div", { className: "flex items-center gap-3", children: [appConfig.demoMode.enabled && (_jsxs("span", { className: "flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700", children: [_jsx(Zap, { size: 10 }), appConfig.demoMode.badgeText] })), _jsx("button", { onClick: () => navigate('/settings'), className: "flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold transition-colors hover:opacity-90", style: { background: clientBrand.primaryHex }, children: user ? initials(user.name) : '?' })] })] })), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(Outlet, {}) })] })] }));
}
