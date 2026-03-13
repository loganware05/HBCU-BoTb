import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
};
export function Modal({ open, onClose, title, description, children, size = 'md', className }) {
    const overlayRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);
    if (!open)
        return null;
    return (_jsxs("div", { ref: overlayRef, className: "fixed inset-0 z-50 flex items-center justify-center p-4", onClick: e => { if (e.target === overlayRef.current)
            onClose(); }, children: [_jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" }), _jsxs("div", { className: cn('relative w-full rounded-2xl bg-white shadow-2xl animate-slide-up', sizeMap[size], className), children: [(title || description) && (_jsxs("div", { className: "flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100", children: [_jsxs("div", { children: [title && _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: title }), description && _jsx("p", { className: "mt-0.5 text-sm text-gray-500", children: description })] }), _jsx("button", { onClick: onClose, className: "ml-4 rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors", children: _jsx(X, { size: 18 }) })] })), _jsx("div", { className: "px-6 py-5", children: children })] })] }));
}
