import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Target, Filter } from 'lucide-react';
import { appConfig } from '../config/app.config';
import { useEntities, useCreateEntity, useDeleteEntity } from '../hooks/useEntities';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { formatDate, formatRelative } from '../lib/utils';
const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
];
const PRIORITY_OPTIONS = [
    { value: '', label: 'All priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];
const DEFAULT_FORM = {
    title: '',
    status: 'active',
    priority: 'medium',
    description: '',
    score: '',
    tags: '',
};
export default function Entities() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState(DEFAULT_FORM);
    const { data: entities, isLoading } = useEntities({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
    });
    const createMutation = useCreateEntity();
    const deleteMutation = useDeleteEntity();
    function handleCreate(e) {
        e.preventDefault();
        createMutation.mutate({
            title: form.title,
            status: form.status,
            priority: form.priority,
            description: form.description || undefined,
            score: form.score ? parseInt(form.score, 10) : undefined,
            tags: form.tags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean),
        }, {
            onSuccess: () => {
                setShowCreate(false);
                setForm(DEFAULT_FORM);
            },
        });
    }
    return (_jsxs("div", { className: "p-6 max-w-5xl mx-auto space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: appConfig.entity.plural }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: [entities?.length ?? 0, " ", (entities?.length ?? 0) === 1 ? appConfig.entity.singular : appConfig.entity.plural] })] }), _jsx(Button, { onClick: () => setShowCreate(true), leftIcon: _jsx(Plus, { size: 16 }), children: appConfig.entity.createLabel })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [appConfig.features.search && (_jsx("div", { className: "flex-1 min-w-48", children: _jsx(Input, { placeholder: `Search ${appConfig.entity.plural.toLowerCase()}...`, value: search, onChange: e => setSearch(e.target.value), leftIcon: _jsx(Search, { size: 14 }) }) })), _jsx(Select, { options: STATUS_OPTIONS, value: statusFilter, onChange: e => setStatusFilter(e.target.value), className: "w-44", "aria-label": "Filter by status" }), _jsx(Select, { options: PRIORITY_OPTIONS, value: priorityFilter, onChange: e => setPriorityFilter(e.target.value), className: "w-44", "aria-label": "Filter by priority" }), (search || statusFilter || priorityFilter) && (_jsx(Button, { variant: "ghost", size: "md", onClick: () => {
                            setSearch('');
                            setStatusFilter('');
                            setPriorityFilter('');
                        }, leftIcon: _jsx(Filter, { size: 14 }), children: "Clear" }))] }), isLoading ? (_jsx(SkeletonList, { count: 6 })) : !entities || entities.length === 0 ? (_jsx(EmptyState, { icon: _jsx(Target, { size: 28 }), title: `No ${appConfig.entity.plural.toLowerCase()} yet`, description: `Create your first ${appConfig.entity.singular.toLowerCase()} to get started.`, action: _jsx(Button, { onClick: () => setShowCreate(true), leftIcon: _jsx(Plus, { size: 16 }), children: appConfig.entity.createLabel }) })) : (_jsx("div", { className: "grid gap-3", children: entities.map(entity => (_jsx(Card, { hover: true, children: _jsxs("div", { className: "flex items-start gap-4 px-5 py-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Link, { to: `/entities/${entity.id}`, className: "text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1", children: entity.title }), entity.description && (_jsx("p", { className: "mt-0.5 text-xs text-gray-500 line-clamp-1", children: entity.description })), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [_jsx(Badge, { label: appConfig.entity.statusLabels[entity.status] ?? entity.status, color: appConfig.entity.statusColors[entity.status] ?? 'gray', dot: true }), _jsx(Badge, { label: appConfig.entity.priorityLabels[entity.priority] ?? entity.priority, color: appConfig.entity.priorityColors[entity.priority] ?? 'gray' }), appConfig.features.tags &&
                                                entity.tags.slice(0, 3).map(tag => (_jsx("span", { className: "rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500", children: tag }, tag))), appConfig.features.scoring && entity.score !== null && (_jsxs("span", { className: "text-xs text-gray-400", children: ["Score: ", entity.score, "/100"] }))] })] }), _jsxs("div", { className: "flex-shrink-0 text-right", children: [appConfig.features.deadlines && entity.deadline && (_jsx("p", { className: "text-xs text-gray-400", children: formatDate(entity.deadline) })), _jsx("p", { className: "text-xs text-gray-400", children: formatRelative(entity.updatedAt) }), _jsx("button", { onClick: e => {
                                            e.stopPropagation();
                                            if (confirm(`Delete "${entity.title}"?`)) {
                                                deleteMutation.mutate(entity.id);
                                            }
                                        }, className: "mt-2 text-xs text-red-400 hover:text-red-600 transition-colors", children: "Delete" })] })] }) }, entity.id))) })), _jsx(Modal, { open: showCreate, onClose: () => { setShowCreate(false); setForm(DEFAULT_FORM); }, title: appConfig.entity.createLabel, description: `Add a new ${appConfig.entity.singular.toLowerCase()} to track.`, children: _jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [_jsx(Input, { label: "Title", placeholder: `${appConfig.entity.singular} title...`, value: form.title, onChange: e => setForm(f => ({ ...f, title: e.target.value })), required: true, autoFocus: true }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Select, { label: "Status", options: STATUS_OPTIONS.slice(1), value: form.status, onChange: e => setForm(f => ({ ...f, status: e.target.value })) }), _jsx(Select, { label: "Priority", options: PRIORITY_OPTIONS.slice(1), value: form.priority, onChange: e => setForm(f => ({ ...f, priority: e.target.value })) })] }), appConfig.features.scoring && (_jsx(Input, { label: "Score (0\u2013100)", type: "number", min: 0, max: 100, placeholder: "Optional", value: form.score, onChange: e => setForm(f => ({ ...f, score: e.target.value })) })), appConfig.features.tags && (_jsx(Input, { label: "Tags (comma-separated)", placeholder: "e.g. strategy, q3, growth", value: form.tags, onChange: e => setForm(f => ({ ...f, tags: e.target.value })) })), _jsx(Input, { label: "Description", placeholder: "Optional notes...", value: form.description, onChange: e => setForm(f => ({ ...f, description: e.target.value })) }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => { setShowCreate(false); setForm(DEFAULT_FORM); }, children: "Cancel" }), _jsxs(Button, { type: "submit", loading: createMutation.isPending, children: ["Create ", appConfig.entity.singular] })] })] }) })] }));
}
