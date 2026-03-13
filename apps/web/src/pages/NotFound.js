import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { appConfig } from '../config/app.config';
export default function NotFound() {
    return (_jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center", children: [_jsx("p", { className: "text-6xl font-extrabold text-indigo-200", children: "404" }), _jsx("h1", { className: "mt-4 text-2xl font-bold text-gray-900", children: "Page not found" }), _jsx("p", { className: "mt-2 text-gray-500", children: "The page you're looking for doesn't exist or has been moved." }), _jsxs(Link, { to: "/", className: "mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors", children: ["Back to ", appConfig.productName] })] }));
}
