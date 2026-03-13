import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
export const Input = forwardRef(({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-sm font-medium text-gray-700", children: label })), _jsxs("div", { className: "relative", children: [leftIcon && (_jsx("div", { className: "absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400", children: leftIcon })), _jsx("input", { ref: ref, id: inputId, className: cn('h-9 w-full rounded-lg border bg-white px-3 text-sm text-gray-900', 'placeholder:text-gray-400', 'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent', 'disabled:opacity-50 disabled:bg-gray-50', 'transition-shadow duration-150', error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300', leftIcon && 'pl-9', className), ...props })] }), error && _jsx("p", { className: "text-xs text-red-600", children: error }), hint && !error && _jsx("p", { className: "text-xs text-gray-500", children: hint })] }));
});
Input.displayName = 'Input';
export const Textarea = forwardRef(({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-sm font-medium text-gray-700", children: label })), _jsx("textarea", { ref: ref, id: inputId, className: cn('w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900', 'placeholder:text-gray-400 resize-none', 'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent', 'disabled:opacity-50 disabled:bg-gray-50', error ? 'border-red-400' : 'border-gray-300', className), rows: 4, ...props }), error && _jsx("p", { className: "text-xs text-red-600", children: error }), hint && !error && _jsx("p", { className: "text-xs text-gray-500", children: hint })] }));
});
Textarea.displayName = 'Textarea';
export const Select = forwardRef(({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-sm font-medium text-gray-700", children: label })), _jsx("select", { ref: ref, id: inputId, className: cn('h-9 w-full rounded-lg border bg-white px-3 text-sm text-gray-900', 'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent', 'disabled:opacity-50', error ? 'border-red-400' : 'border-gray-300', className), ...props, children: options.map(o => (_jsx("option", { value: o.value, children: o.label }, o.value))) }), error && _jsx("p", { className: "text-xs text-red-600", children: error })] }));
});
Select.displayName = 'Select';
