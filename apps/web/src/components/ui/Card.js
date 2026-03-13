import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
export function Card({ children, className, hover, onClick }) {
    return (_jsx("div", { onClick: onClick, className: cn('rounded-xl border border-gray-200 bg-white shadow-sm', hover && 'hover:shadow-md hover:border-indigo-200 transition-all duration-150 cursor-pointer', className), children: children }));
}
export function CardHeader({ children, className }) {
    return _jsx("div", { className: cn('px-5 py-4 border-b border-gray-100', className), children: children });
}
export function CardBody({ children, className }) {
    return _jsx("div", { className: cn('px-5 py-4', className), children: children });
}
export function CardFooter({ children, className }) {
    return _jsx("div", { className: cn('px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl', className), children: children });
}
export function StatCard({ label, value, icon, suffix, trend, className }) {
    return (_jsx(Card, { className: cn('p-5', className), children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 truncate", children: label }), _jsxs("p", { className: "mt-1 text-3xl font-bold text-gray-900 tracking-tight", children: [value ?? '—', suffix && _jsx("span", { className: "text-base font-medium text-gray-500 ml-0.5", children: suffix })] }), trend && (_jsxs("p", { className: cn('mt-1 text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'), children: [trend.value >= 0 ? '↑' : '↓', " ", Math.abs(trend.value), "% ", trend.label] }))] }), icon && (_jsx("div", { className: "flex-shrink-0 p-2 rounded-lg bg-indigo-50 text-indigo-600", children: icon }))] }) }));
}
