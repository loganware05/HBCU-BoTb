import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
export function EmptyState({ icon, title, description, action, className }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center py-16 px-4 text-center', className), children: [icon && (_jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400", children: icon })), _jsx("h3", { className: "text-base font-semibold text-gray-900", children: title }), description && _jsx("p", { className: "mt-1 text-sm text-gray-500 max-w-xs", children: description }), action && _jsx("div", { className: "mt-5", children: action })] }));
}
