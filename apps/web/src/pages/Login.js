import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { appConfig } from '../config/app.config';
import { useLogin, useIsAuthenticated } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DemoBanner } from '../components/DemoBanner';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated)
            navigate('/dashboard');
    }, [isAuthenticated, navigate]);
    // Auto-fill in demo mode
    useEffect(() => {
        if (appConfig.demoMode.enabled) {
            setEmail(appConfig.demoMode.email);
            setPassword(appConfig.demoMode.password);
        }
    }, []);
    function handleSubmit(e) {
        e.preventDefault();
        login.mutate({ email, password });
    }
    return (_jsxs("div", { className: "flex min-h-screen flex-col", children: [_jsx(DemoBanner, {}), _jsx("div", { className: "flex flex-1 items-center justify-center bg-gray-50 px-4 py-12", children: _jsxs("div", { className: "w-full max-w-sm", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-lg", children: appConfig.logoText }), _jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: ["Sign in to ", appConfig.productName] }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: appConfig.tagline })] }), _jsxs("form", { onSubmit: handleSubmit, className: "rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-5", children: [_jsx(Input, { label: "Email", type: "email", placeholder: "you@example.com", value: email, onChange: e => setEmail(e.target.value), leftIcon: _jsx(Mail, { size: 16 }), required: true, autoFocus: !appConfig.demoMode.enabled }), _jsx(Input, { label: "Password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: e => setPassword(e.target.value), leftIcon: _jsx(Lock, { size: 16 }), required: true }), _jsx(Button, { type: "submit", className: "w-full", size: "lg", loading: login.isPending, children: "Sign in" }), appConfig.demoMode.enabled && (_jsx("p", { className: "text-center text-xs text-amber-600 bg-amber-50 rounded-lg py-2", children: "Demo credentials pre-filled \u2014 just click Sign in" }))] }), _jsx("p", { className: "mt-4 text-center text-sm text-gray-500", children: _jsx(Link, { to: "/", className: "text-indigo-600 hover:underline", children: "\u2190 Back to home" }) })] }) })] }));
}
