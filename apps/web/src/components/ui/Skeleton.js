import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
export function Skeleton({ className }) {
    return (_jsx("div", { className: cn('animate-pulse rounded-md bg-gray-200', className) }));
}
export function SkeletonCard() {
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { className: "h-4 w-4 rounded" }), _jsx(Skeleton, { className: "h-4 flex-1 max-w-xs" }), _jsx(Skeleton, { className: "h-5 w-20 rounded-full" })] }), _jsx(Skeleton, { className: "h-3 w-full" }), _jsx(Skeleton, { className: "h-3 w-2/3" }), _jsxs("div", { className: "flex gap-2 pt-1", children: [_jsx(Skeleton, { className: "h-5 w-16 rounded-full" }), _jsx(Skeleton, { className: "h-5 w-16 rounded-full" })] })] }));
}
export function SkeletonStatCard() {
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5", children: [_jsx(Skeleton, { className: "h-4 w-24 mb-2" }), _jsx(Skeleton, { className: "h-8 w-16" })] }));
}
export function SkeletonList({ count = 5 }) {
    return (_jsx("div", { className: "space-y-3", children: Array.from({ length: count }).map((_, i) => (_jsx(SkeletonCard, {}, i))) }));
}
