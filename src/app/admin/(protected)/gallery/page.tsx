'use client';

import Image from 'next/image';
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
import { galleryCategories } from '@/lib/data/gallery';
import type { GalleryItem } from '@/lib/types';

const categories = galleryCategories.filter((category) => category !== 'All');

function blankItem(order: number): GalleryItem {
  return {
    id: `gal_${Date.now().toString(36)}`,
    src: '/images/gallery-reception.jpg',
    alt: '',
    category: 'Clinic',
    caption: '',
    order,
    visible: true,
  };
}

export default function AdminGalleryPage() {
  const { state, patch } = useAdminContent();
  const loaded = state.status === 'ready' ? state.data : null;

  const [draft, setDraft] = useState<GalleryItem[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (state.status === 'loading') return <Spinner label="Loading gallery…" />;
  if (state.status === 'error') return <div className="rounded-2xl bg-alert-soft p-6 text-sm text-alert">{state.message}</div>;
  if (!loaded) return null;

  const gallery = draft ?? loaded.gallery;
  const dirty = draft !== null;

  const setList = (next: GalleryItem[]) => {
    setDraft(next);
    setMessage(null);
  };

  const update = (id: string, changes: Partial<GalleryItem>) =>
    setList(gallery.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const normalized = gallery.map((item, index) => ({ ...item, order: index + 1 }));

    const response = await fetch('/api/admin/collections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: 'gallery', items: normalized }),
    });

    setSaving(false);
    if (response.ok) {
      setDraft(normalized);
      patch({ ...loaded, gallery: normalized });
      setMessage('Saved.');
    } else {
      window.alert('Could not save the gallery — check that every image has a path and alt text.');
    }
  };

  return (
    <>
      <PageHeading
        title="Gallery"
        description="Photographs shown on /gallery and the home page teaser. Alt text is required — it is read out by screen readers and used by search engines."
      >
        <button
          type="button"
          onClick={() => setList([...gallery, blankItem(gallery.length + 1)])}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add photo
        </button>
      </PageHeading>

      <div className="space-y-5">
        <StorageNotice storage={loaded.storage} />

        {gallery.map((item) => (
          <AdminCard
            key={item.id}
            title={
              <span className="flex items-center gap-3">
                <span className="relative inline-block h-12 w-16 overflow-hidden rounded-lg bg-brand-50 ring-1 ring-brand-900/10">
                  <Image src={item.src} alt="" fill sizes="4rem" className="object-cover" />
                </span>
                {item.caption || item.alt || 'New photo'}
              </span>
            }
            description={`${item.category} · order ${item.order}`}
            actions={
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Remove this photo from the gallery?')) {
                    setList(gallery.filter((entry) => entry.id !== item.id));
                  }
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-alert-soft hover:text-alert"
                aria-label={`Remove photo ${item.caption || item.alt}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            }
          >
            <div className="grid gap-4 lg:grid-cols-4">
              <Field label="Image path / URL" htmlFor={`gsrc-${item.id}`} className="lg:col-span-2">
                <input
                  id={`gsrc-${item.id}`}
                  className={adminInput}
                  value={item.src}
                  onChange={(e) => update(item.id, { src: e.target.value })}
                  placeholder="/images/…"
                />
              </Field>
              <Field label="Category" htmlFor={`gcat-${item.id}`}>
                <select
                  id={`gcat-${item.id}`}
                  className={adminInput}
                  value={item.category}
                  onChange={(e) => update(item.id, { category: e.target.value as GalleryItem['category'] })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Caption" htmlFor={`gcap-${item.id}`}>
                <input
                  id={`gcap-${item.id}`}
                  className={adminInput}
                  value={item.caption ?? ''}
                  onChange={(e) => update(item.id, { caption: e.target.value })}
                />
              </Field>
              <Field label="Alt text (required)" className="lg:col-span-3" htmlFor={`galt-${item.id}`}>
                <input
                  id={`galt-${item.id}`}
                  className={adminInput}
                  value={item.alt}
                  onChange={(e) => update(item.id, { alt: e.target.value })}
                  placeholder="Describe the photograph for screen readers"
                />
              </Field>
              <div className="flex items-end">
                <div className="w-full">
                  <Toggle
                    id={`gvisible-${item.id}`}
                    label="Show on website"
                    checked={item.visible}
                    onChange={(value) => update(item.id, { visible: value })}
                  />
                </div>
              </div>
            </div>
          </AdminCard>
        ))}

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
