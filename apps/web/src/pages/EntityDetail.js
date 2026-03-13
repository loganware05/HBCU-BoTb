import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react';
import { appConfig } from '../config/app.config';
import { useEntity, useUpdateEntity, useDeleteEntity } from '../hooks/useEntities';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { formatDate, formatRelative } from '../lib/utils';
const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
];
const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];
export default function EntityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: entity, isLoading } = useEntity(id ?? '');
    const updateMutation = useUpdateEntity();
    const deleteMutation = useDeleteEntity();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        title: '',
        status: 'active',
        priority: 'medium',
        description: '',
        score: '',
        tags: '',
    });
    function startEditing() {
        if (!entity)
            return;
        setForm({
            title: entity.title,
            status: entity.status,
            priority: entity.priority,
            description: entity.description ?? '',
            score: entity.score?.toString() ?? '',
            tags: entity.tags.join(', '),
        });
        setEditing(true);
    }
    function handleSave(e) {
        e.preventDefault();
        if (!id)
            return;
        updateMutation.mutate({
            id,
            input: {
                title: form.title,
                status: form.status,
                priority: form.priority,
                description: form.description || undefined,
                score: form.score ? parseInt(form.score, 10) : undefined,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            },
        }, { onSuccess: () => setEditing(false) });
    }
    function handleDelete() {
        if (!id || !entity)
            return;
        if (confirm(`Delete "${entity.title}"? This cannot be undone.`)) {
            deleteMutation.mutate(id, {
                onSuccess: () => navigate('/entities'),
            });
        }
    }
    if (isLoading) {
        return (_jsx("div", { className: "p-6 max-w-3xl mx-auto", children: _jsx(SkeletonCard, {}) }));
    }
    if (!entity) {
        return (_jsxs("div", { className: "p-6 max-w-3xl mx-auto text-center", children: [_jsxs("p", { className: "text-gray-500", children: [appConfig.entity.singular, " not found."] }), _jsxs(Link, { to: "/entities", className: "mt-4 inline-block text-indigo-600 hover:underline text-sm", children: ["\u2190 Back to ", appConfig.entity.plural] })] }));
    }
    return (_jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6 animate-fade-in", children: [_jsxs(Link, { to: "/entities", className: "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors", children: [_jsx(ArrowLeft, { size: 14 }), appConfig.entity.plural] }), editing ? (
            /* ── Edit form ── */
            _jsx("form", { onSubmit: handleSave, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("h1", { className: "text-lg font-semibold text-gray-900", children: ["Edit ", appConfig.entity.singular] }) }), _jsxs(CardBody, { className: "space-y-4", children: [_jsx(Input, { label: "Title", value: form.title, onChange: e => setForm(f => ({ ...f, title: e.target.value })), required: true, autoFocus: true }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Select, { label: "Status", options: STATUS_OPTIONS, value: form.status, onChange: e => setForm(f => ({ ...f, status: e.target.value })) }), _jsx(Select, { label: "Priority", options: PRIORITY_OPTIONS, value: form.priority, onChange: e => setForm(f => ({ ...f, priority: e.target.value })) })] }), appConfig.features.scoring && (_jsx(Input, { label: "Score (0\u2013100)", type: "number", min: 0, max: 100, value: form.score, onChange: e => setForm(f => ({ ...f, score: e.target.value })) })), appConfig.features.tags && (_jsx(Input, { label: "Tags (comma-separated)", value: form.tags, onChange: e => setForm(f => ({ ...f, tags: e.target.value })) })), _jsx(Textarea, { label: "Description", value: form.description, onChange: e => setForm(f => ({ ...f, description: e.target.value })), rows: 4 }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setEditing(false), leftIcon: _jsx(X, { size: 14 }), children: "Cancel" }), _jsx(Button, { type: "submit", loading: updateMutation.isPending, leftIcon: _jsx(Save, { size: 14 }), children: "Save changes" })] })] })] }) })) : (
            /* ── View mode ── */
            _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: entity.title }), _jsxs("p", { className: "mt-1 text-xs text-gray-400", children: ["Updated ", formatRelative(entity.updatedAt), " \u00B7 Created ", formatDate(entity.createdAt)] })] }), _jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: startEditing, leftIcon: _jsx(Edit2, { size: 13 }), children: "Edit" }), _jsx(Button, { variant: "danger", size: "sm", onClick: handleDelete, loading: deleteMutation.isPending, leftIcon: _jsx(Trash2, { size: 13 }), children: "Delete" })] })] }) }), _jsxs(CardBody, { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Badge, { label: appConfig.entity.statusLabels[entity.status] ?? entity.status, color: appConfig.entity.statusColors[entity.status] ?? 'gray', dot: true }), _jsx(Badge, { label: appConfig.entity.priorityLabels[entity.priority] ?? entity.priority, color: appConfig.entity.priorityColors[entity.priority] ?? 'gray' }), appConfig.features.scoring && entity.score !== null && (_jsx(Badge, { label: `Score: ${entity.score}/100`, color: "indigo" }))] }), appConfig.features.tags && entity.tags.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Tags" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: entity.tags.map(tag => (_jsx("span", { className: "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600", children: tag }, tag))) })] })), appConfig.features.deadlines && entity.deadline && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Deadline" }), _jsx("p", { className: "text-sm text-gray-800", children: formatDate(entity.deadline) })] })), entity.description && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide", children: "Description" }), _jsx("p", { className: "text-sm text-gray-700 leading-relaxed whitespace-pre-wrap", children: entity.description })] }))] })] }))] }));
}
