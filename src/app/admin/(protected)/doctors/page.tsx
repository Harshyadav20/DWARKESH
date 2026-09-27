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
import { slugify } from '@/lib/utils';
import type { Doctor } from '@/lib/types';

function blankDoctor(order: number): Doctor {
  return {
    id: `doc_${Date.now().toString(36)}`,
    slug: '',
    name: '',
    qualifications: '',
    specialization: '',
    department: 'Polyclinic',
    photo: null,
    consultationTiming: null,
    bio: null,
    highlights: [],
    order,
    visible: true,
  };
}

export default function AdminDoctorsPage() {
  const { state, patch } = useAdminContent();
  const loaded = state.status === 'ready' ? state.data : null;

  const [draft, setDraft] = useState<Doctor[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (state.status === 'loading') return <Spinner label="Loading doctors…" />;
  if (state.status === 'error') return <div className="rounded-2xl bg-alert-soft p-6 text-sm text-alert">{state.message}</div>;
  if (!loaded) return null;

  const doctors = draft ?? loaded.doctors;
  const dirty = draft !== null;

  const setList = (next: Doctor[]) => {
    setDraft(next);
    setMessage(null);
  };

  const update = (id: string, changes: Partial<Doctor>) =>
    setList(doctors.map((doctor) => (doctor.id === id ? { ...doctor, ...changes } : doctor)));

  const add = () => setList([...doctors, blankDoctor(doctors.length + 1)]);

  const remove = (id: string) => {
    if (!window.confirm('Remove this doctor from the website?')) return;
    setList(doctors.filter((doctor) => doctor.id !== id));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const normalized = doctors.map((doctor, index) => ({
      ...doctor,
      slug: doctor.slug || slugify(doctor.name),
      order: index + 1,
      name: doctor.name.trim(),
    }));

    const response = await fetch('/api/admin/collections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection: 'doctors', items: normalized }),
    });

    setSaving(false);
    if (response.ok) {
      setDraft(normalized);
      patch({ ...loaded, doctors: normalized });
      setMessage('Saved — the public site updates within a few minutes.');
    } else {
      const data = (await response.json().catch(() => null)) as { issues?: unknown } | null;
      window.alert(data?.issues ? `Some fields need attention: ${JSON.stringify(data.issues)}` : 'Could not save doctors.');
    }
  };

  return (
    <>
      <PageHeading
        title="Doctors"
        description="Doctor directory shown on the website. Leave the photo empty to show a monogram placeholder — never use a stock portrait for a real doctor."
      >
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add doctor
        </button>
      </PageHeading>

      <div className="space-y-5">
        <StorageNotice storage={loaded.storage} />

        {doctors.map((doctor) => (
          <AdminCard
            key={doctor.id}
            title={doctor.name || 'New doctor'}
            description={`${doctor.department || 'Department'} · order ${doctor.order}`}
            actions={
              <button
                type="button"
                onClick={() => remove(doctor.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-alert-soft hover:text-alert"
                aria-label={`Remove ${doctor.name || 'doctor'}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            }
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Full name" htmlFor={`name-${doctor.id}`}>
                <input
                  id={`name-${doctor.id}`}
                  className={adminInput}
                  value={doctor.name}
                  onChange={(e) => update(doctor.id, { name: e.target.value })}
                  placeholder="Dr. Name"
                />
              </Field>
              <Field label="Qualification" htmlFor={`qual-${doctor.id}`}>
                <input
                  id={`qual-${doctor.id}`}
                  className={adminInput}
                  value={doctor.qualifications ?? ''}
                  onChange={(e) => update(doctor.id, { qualifications: e.target.value })}
                  placeholder="MBBS, MD (Medicine)"
                />
              </Field>
              <Field label="Specialization" htmlFor={`spec-${doctor.id}`}>
                <input
                  id={`spec-${doctor.id}`}
                  className={adminInput}
                  value={doctor.specialization}
                  onChange={(e) => update(doctor.id, { specialization: e.target.value })}
                  placeholder="Internal Medicine"
                />
              </Field>
              <Field label="Department" htmlFor={`dept-${doctor.id}`}>
                <input
                  id={`dept-${doctor.id}`}
                  className={adminInput}
                  value={doctor.department}
                  onChange={(e) => update(doctor.id, { department: e.target.value })}
                />
              </Field>
              <Field
                label="Photo path / URL"
                htmlFor={`photo-${doctor.id}`}
                hint="e.g. /images/doctors/name.jpg — leave blank for a monogram"
              >
                <input
                  id={`photo-${doctor.id}`}
                  className={adminInput}
                  value={doctor.photo ?? ''}
                  onChange={(e) => update(doctor.id, { photo: e.target.value || null })}
                  placeholder="/images/doctors/…"
                />
              </Field>
              <Field label="Consultation timing" htmlFor={`timing-${doctor.id}`} hint="Blank shows “Details to be updated”">
                <input
                  id={`timing-${doctor.id}`}
                  className={adminInput}
                  value={doctor.consultationTiming ?? ''}
                  onChange={(e) => update(doctor.id, { consultationTiming: e.target.value || null })}
                  placeholder="Mon–Sat, 10:00 AM – 1:00 PM"
                />
              </Field>
              <Field
                label="URL slug"
                htmlFor={`slug-${doctor.id}`}
                className="lg:col-span-2"
                hint="Used in /doctors/… — generated from the name if left blank"
              >
                <input
                  id={`slug-${doctor.id}`}
                  className={adminInput}
                  value={doctor.slug}
                  onChange={(e) => update(doctor.id, { slug: slugify(e.target.value) })}
                  placeholder="dr-name"
                />
              </Field>
              <div className="flex items-end">
                <div className="w-full">
                  <Toggle
                    id={`visible-${doctor.id}`}
                    label="Show on website"
                    checked={doctor.visible}
                    onChange={(value) => update(doctor.id, { visible: value })}
                  />
                </div>
              </div>
              <Field label="Short bio (optional)" className="lg:col-span-3" htmlFor={`bio-${doctor.id}`}>
                <textarea
                  id={`bio-${doctor.id}`}
                  rows={3}
                  className={adminInput}
                  value={doctor.bio ?? ''}
                  onChange={(e) => update(doctor.id, { bio: e.target.value || null })}
                  placeholder="Only information supplied by the clinic — no invented experience or awards."
                />
              </Field>
              <Field
                label="Consultation covers (one per line)"
                className="lg:col-span-3"
                htmlFor={`highlights-${doctor.id}`}
              >
                <textarea
                  id={`highlights-${doctor.id}`}
                  rows={3}
                  className={adminInput}
                  value={(doctor.highlights ?? []).join('\n')}
                  onChange={(e) =>
                    update(doctor.id, {
                      highlights: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                    })
                  }
                />
              </Field>
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
