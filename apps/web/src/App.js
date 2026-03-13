import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/Layout';
import { useIsAuthenticated } from './hooks/useAuth';
import { appConfig } from './config/app.config';
// Lazy-load pages for fast initial bundle
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Entities = lazy(() => import('./pages/Entities'));
const EntityDetail = lazy(() => import('./pages/EntityDetail'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 10000,
        },
    },
});
function ProtectedRoute({ children }) {
    const isAuthenticated = useIsAuthenticated();
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
}
function PageLoader() {
    return (_jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" }) }));
}
// Inject CSS variables from app.config so brand colors work
function injectBrandVars() {
    const root = document.documentElement;
    Object.entries(appConfig.brand.cssVars).forEach(([k, v]) => {
        root.style.setProperty(k, v);
    });
}
injectBrandVars();
export default function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(BrowserRouter, { children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/entities", element: _jsx(Entities, {}) }), _jsx(Route, { path: "/entities/:id", element: _jsx(EntityDetail, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }), _jsx(Toaster, { position: "bottom-right", toastOptions: {
                    duration: 3500,
                    style: {
                        borderRadius: '10px',
                        background: '#1f2937',
                        color: '#f9fafb',
                        fontSize: '14px',
                    },
                } }), import.meta.env.DEV && _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
}
