import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
const colorMap = {
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
    red: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
};
const dotColorMap = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-emerald-500',
    gray: 'bg-gray-400',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
};
export function Badge({ label, color = 'gray', dot = false, className }) {
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', colorMap[color], className), children: [dot && _jsx("span", { className: cn('h-1.5 w-1.5 rounded-full', dotColorMap[color]) }), label] }));
}
