import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Target, Filter } from 'lucide-react'
import { appConfig } from '../config/app.config'
import { useEntities, useCreateEntity, useDeleteEntity } from '../hooks/useEntities'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'
import { formatDate, formatRelative } from '../lib/utils'
import type { EntityStatus, EntityPriority } from '@repo/shared'

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

interface CreateFormState {
  title: string
  status: EntityStatus
  priority: EntityPriority
  description: string
  score: string
  tags: string
}

const DEFAULT_FORM: CreateFormState = {
  title: '',
  status: 'active',
  priority: 'medium',
  description: '',
  score: '',
  tags: '',
}

export default function Entities() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EntityStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<EntityPriority | ''>('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateFormState>(DEFAULT_FORM)

  const { data: entities, isLoading } = useEntities({
    search: search || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  })

  const createMutation = useCreateEntity()
  const deleteMutation = useDeleteEntity()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    createMutation.mutate(
      {
        title: form.title,
        status: form.status,
        priority: form.priority,
        description: form.description || undefined,
        score: form.score ? parseInt(form.score, 10) : undefined,
        tags: form.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          setShowCreate(false)
          setForm(DEFAULT_FORM)
        },
      }
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{appConfig.entity.plural}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {entities?.length ?? 0} {(entities?.length ?? 0) === 1 ? appConfig.entity.singular : appConfig.entity.plural}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} leftIcon={<Plus size={16} />}>
          {appConfig.entity.createLabel}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {appConfig.features.search && (
          <div className="flex-1 min-w-48">
            <Input
              placeholder={`Search ${appConfig.entity.plural.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={14} />}
            />
          </div>
        )}
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as EntityStatus | '')}
          className="w-44"
          aria-label="Filter by status"
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as EntityPriority | '')}
          className="w-44"
          aria-label="Filter by priority"
        />
        {(search || statusFilter || priorityFilter) && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setSearch('')
              setStatusFilter('')
              setPriorityFilter('')
            }}
            leftIcon={<Filter size={14} />}
          >
            Clear
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <SkeletonList count={6} />
      ) : !entities || entities.length === 0 ? (
        <EmptyState
          icon={<Target size={28} />}
          title={`No ${appConfig.entity.plural.toLowerCase()} yet`}
          description={`Create your first ${appConfig.entity.singular.toLowerCase()} to get started.`}
          action={
            <Button onClick={() => setShowCreate(true)} leftIcon={<Plus size={16} />}>
              {appConfig.entity.createLabel}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {entities.map(entity => (
            <Card key={entity.id} hover>
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/entities/${entity.id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                  >
                    {entity.title}
                  </Link>
                  {entity.description && (
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{entity.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      label={appConfig.entity.statusLabels[entity.status] ?? entity.status}
                      color={appConfig.entity.statusColors[entity.status] ?? 'gray'}
                      dot
                    />
                    <Badge
                      label={appConfig.entity.priorityLabels[entity.priority] ?? entity.priority}
                      color={appConfig.entity.priorityColors[entity.priority] ?? 'gray'}
                    />
                    {appConfig.features.tags &&
                      entity.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    {appConfig.features.scoring && entity.score !== null && (
                      <span className="text-xs text-gray-400">Score: {entity.score}/100</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  {appConfig.features.deadlines && entity.deadline && (
                    <p className="text-xs text-gray-400">{formatDate(entity.deadline)}</p>
                  )}
                  <p className="text-xs text-gray-400">{formatRelative(entity.updatedAt)}</p>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      if (confirm(`Delete "${entity.title}"?`)) {
                        deleteMutation.mutate(entity.id)
                      }
                    }}
                    className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => { setShowCreate(false); setForm(DEFAULT_FORM) }}
        title={appConfig.entity.createLabel}
        description={`Add a new ${appConfig.entity.singular.toLowerCase()} to track.`}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            placeholder={`${appConfig.entity.singular} title...`}
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              options={STATUS_OPTIONS.slice(1)}
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as EntityStatus }))}
            />
            <Select
              label="Priority"
              options={PRIORITY_OPTIONS.slice(1)}
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as EntityPriority }))}
            />
          </div>
          {appConfig.features.scoring && (
            <Input
              label="Score (0–100)"
              type="number"
              min={0}
              max={100}
              placeholder="Optional"
              value={form.score}
              onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
            />
          )}
          {appConfig.features.tags && (
            <Input
              label="Tags (comma-separated)"
              placeholder="e.g. strategy, q3, growth"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            />
          )}
          <Input
            label="Description"
            placeholder="Optional notes..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowCreate(false); setForm(DEFAULT_FORM) }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create {appConfig.entity.singular}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
