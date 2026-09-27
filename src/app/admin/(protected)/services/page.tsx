'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  AdminCard,
  Field,
  PageHeading,
  SaveBar,
  Spinner,
  StorageNotice,
  Toggle,
  adminInput,
  useAdminContent,
} from '@/components/admin/ui';
import { iconNames, resolveIcon } from '@/lib/icons';
import { slugify } from '@/lib/utils';
import type { ServiceItem } from '@/lib/types';

const groups: ServiceItem['group'][] = ['medical', 'diagnostic', 'dental', 'home-visit'];

function blankService(order: number): ServiceItem {
  return {
    id: `svc_${Date.now().toString(36)}`,
    slug: '',
    name: '',
    group: 'medical',
    shortDescription: '',
    description: '',
    icon: 'Stethoscope',
    image: null,
    points: [],
    department: 'Polyclinic',
    order,
    visible: true,
  };
}

export default function AdminServicesPage() {
  const { state, patch } = useAdminContent();
  const loaded = state.status === 'ready' ? state.data : null;

  const [draft, setDraft] = useState<ServiceItem[] | null>(null);
  const [groupFilter, setGroupFilter] = useState<'all' | ServiceItem['group']>('all');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (state.status === 'loading') return <Spinner label="Loading services…" />;
  if (state.status === 'error') return <div className="rounded-2xl bg-alert-soft p-6 text-sm text-alert">{state.message}</div>;
  if (!loaded) return null;

  const services = draft ?? loaded.services;
  const visibleList = services.filter((s) => groupFilter === 'all' || s.group === groupFilter);
  const dirty = draft !== null;

  const setList = (next: ServiceItem[]) => {
    setDraft(next);
    setMessage(null);
  };

  const update = (id: string, changes: Partial<ServiceItem>) =>
    setList(services.map((service) => (service.id === id ? { ...service, ...changes } : service)));

  const remove = (id: string) => {
    if (!window.confirm('Remove this service from the website?')) return;
    setList(services.filter((service) => service.id !== id));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const normalized = services.map((service, index) => ({
      ...service,
      slug: service.slug || slugify(service.name),
      order: index + 1,
      name: service.name.trim(),
    }));

    const response = await fetch('/api/admin/collections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: 'services', items: normalized }),
    });

    setSaving(false);
    if (response.ok) {
      setDraft(normalized);
      patch({ ...loaded, services: normalized });
      setMessage('Saved.');
    } else {
      const data = (await response.json().catch(() => null)) as { issues?: unknown } | null;
      window.alert(data?.issues ? `Check the highlighted fields: ${JSON.stringify(data.issues)}` : 'Could not save services.');
    }
  };

  return (
    <>
      <PageHeading
        title="Services"
        description="Medical, diagnostic, dental and home-visit services. Icons and images are referenced by name/path so the content stays portable."
      >
        <button
          type="button"
          onClick={() => setList([...services, blankService(services.length + 1)])}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add service
        </button>
      </PageHeading>

      <div className="space-y-5">
        <StorageNotice storage={loaded.storage} />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services by group">
          {(['all', ...groups] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setGroupFilter(value)}
              aria-pressed={groupFilter === value}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                groupFilter === value
                  ? 'bg-brand-700 text-white'
                  : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300'
              }`}
            >
              {value}
              <span className="ml-1.5 text-xs opacity-80">
                {value === 'all' ? services.length : services.filter((s) => s.group === value).length}
              </span>
            </button>
          ))}
        </div>

        {visibleList.map((service) => {
          const Icon = resolveIcon(service.icon);
          return (
            <AdminCard
              key={service.id}
              title={
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {service.name || 'New service'}
                </span>
              }
              description={`${service.group} · ${service.department}`}
              actions={
                <button
                  type="button"
                  onClick={() => remove(service.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-alert-soft hover:text-alert"
                  aria-label={`Remove ${service.name || 'service'}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              }
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Name" htmlFor={`sname-${service.id}`}>
                  <input
                    id={`sname-${service.id}`}
                    className={adminInput}
                    value={service.name}
                    onChange={(e) => update(service.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Group" htmlFor={`sgroup-${service.id}`}>
                  <select
                    id={`sgroup-${service.id}`}
                    className={adminInput}
                    value={service.group}
                    onChange={(e) => update(service.id, { group: e.target.value as ServiceItem['group'] })}
                  >
                    {groups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Department" htmlFor={`sdept-${service.id}`}>
                  <input
                    id={`sdept-${service.id}`}
                    className={adminInput}
                    value={service.department}
                    onChange={(e) => update(service.id, { department: e.target.value })}
                  />
                </Field>
                <Field label="Icon" htmlFor={`sicon-${service.id}`} hint="Lucide icon name">
                  <select
                    id={`sicon-${service.id}`}
                    className={adminInput}
                    value={service.icon}
                    onChange={(e) => update(service.id, { icon: e.target.value })}
                  >
                    {iconNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Image path / URL" htmlFor={`simg-${service.id}`}>
                  <input
                    id={`simg-${service.id}`}
                    className={adminInput}
                    value={service.image ?? ''}
                    onChange={(e) => update(service.id, { image: e.target.value || null })}
                    placeholder="/images/…"
                  />
                </Field>
                <Field label="Button label" htmlFor={`scta-${service.id}`}>
                  <input
                    id={`scta-${service.id}`}
                    className={adminInput}
                    value={service.ctaLabel ?? ''}
                    onChange={(e) => update(service.id, { ctaLabel: e.target.value })}
                    placeholder="Book Diagnostic Appointment"
                  />
                </Field>
                <Field label="Short description" className="lg:col-span-3" htmlFor={`sshort-${service.id}`}>
                  <input
                    id={`sshort-${service.id}`}
                    className={adminInput}
                    value={service.shortDescription}
                    onChange={(e) => update(service.id, { shortDescription: e.target.value })}
                  />
                </Field>
                <Field label="Full description" className="lg:col-span-3" htmlFor={`sdesc-${service.id}`}>
                  <textarea
                    id={`sdesc-${service.id}`}
                    rows={3}
                    className={adminInput}
                    value={service.description ?? ''}
                    onChange={(e) => update(service.id, { description: e.target.value })}
                  />
                </Field>
                <Field label="Bullet points (one per line)" className="lg:col-span-2" htmlFor={`spoints-${service.id}`}>
                  <textarea
                    id={`spoints-${service.id}`}
                    rows={4}
                    className={adminInput}
                    value={(service.points ?? []).join('\n')}
                    onChange={(e) =>
                      update(service.id, {
                        points: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                      })
                    }
                  />
                </Field>
                <div className="flex flex-col justify-end gap-3">
                  <Toggle
                    id={`svisible-${service.id}`}
                    label="Show on website"
                    checked={service.visible}
                    onChange={(value) => update(service.id, { visible: value })}
                  />
                  <Toggle
                    id={`ssameday-${service.id}`}
                    label="Same day results"
                    checked={Boolean(service.sameDayResults)}
                    onChange={(value) => update(service.id, { sameDayResults: value })}
                  />
                </div>
              </div>
            </AdminCard>
          );
        })}

        <SaveBar
          dirty={dirty}
          saving={saving}
          onSave={save}
          onReset={() => setDraft(null)}
          message={message}
        />
      </div>
    </>
  );
}
