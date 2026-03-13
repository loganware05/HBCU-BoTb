import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { appConfig } from '../config/app.config';
import { useLogin } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
export default function Landing() {
    const navigate = useNavigate();
    const login = useLogin();
    function handleStartDemo() {
        login.mutate({
            email: appConfig.demoMode.email,
            password: appConfig.demoMode.password,
        });
    }
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsxs("header", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold", children: appConfig.logoText }), _jsx("span", { className: "font-bold text-gray-900 text-lg", children: appConfig.productName })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/login'), children: "Sign in" }), appConfig.demoMode.enabled && (_jsx(Button, { size: "sm", onClick: handleStartDemo, loading: login.isPending, children: appConfig.demoMode.ctaLabel }))] })] }), _jsxs("section", { className: "mx-auto max-w-4xl px-6 pt-20 pb-24 text-center", children: [_jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-indigo-500" }), "HBCU Battle of the Brains 2026"] }), _jsx("h1", { className: "mt-6 text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] sm:text-6xl", children: appConfig.landing.headline.split('\n').map((line, i) => (_jsxs("span", { className: i === 1 ? 'text-indigo-600' : '', children: [line, i === 0 && _jsx("br", {})] }, i))) }), _jsx("p", { className: "mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed", children: appConfig.landing.subheadline }), _jsxs("div", { className: "mt-10 flex items-center justify-center gap-4", children: [appConfig.demoMode.enabled ? (_jsxs(Button, { size: "lg", onClick: handleStartDemo, loading: login.isPending, children: [appConfig.landing.ctaPrimary, _jsx(ArrowRight, { size: 18, className: "ml-1" })] })) : (_jsxs(Button, { size: "lg", onClick: () => navigate('/login'), children: ["Get started", _jsx(ArrowRight, { size: 18, className: "ml-1" })] })), _jsx(Button, { variant: "outline", size: "lg", onClick: () => navigate('/login'), children: appConfig.landing.ctaSecondary })] })] }), _jsx("footer", { className: "border-t border-gray-200 bg-gray-50 py-8", children: _jsxs("p", { className: "text-center text-sm text-gray-500", children: ["\u00A9 2026 ", appConfig.productName, " \u00B7 ", appConfig.tagline] }) })] }));
}
