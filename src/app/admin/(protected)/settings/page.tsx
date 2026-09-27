'use client';

import { useState } from 'react';
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
import type { SiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const { state, patch } = useAdminContent();
  const loaded = state.status === 'ready' ? state.data : null;

  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [issues, setIssues] = useState<Record<string, string>>({});

  if (state.status === 'loading') return <Spinner label="Loading settings…" />;
  if (state.status === 'error') return <div className="rounded-2xl bg-alert-soft p-6 text-sm text-alert">{state.message}</div>;
  if (!loaded) return null;

  const settings = draft ?? loaded.settings;
  const dirty = draft !== null;

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setDraft({ ...settings, [key]: value });
    setMessage(null);
    setIssues((current) => {
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setIssues({});

    const response = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; settings?: SiteSettings; issues?: { field: string; message: string }[] }
      | null;

    setSaving(false);

    if (response.ok && data?.ok && data.settings) {
      setDraft(data.settings);
      patch({ ...loaded, settings: data.settings });
      setMessage('Saved.');
    } else if (data?.issues) {
      setIssues(
        Object.fromEntries(data.issues.map((issue) => [issue.field, issue.message])),
      );
    } else {
      window.alert('Could not save settings.');
    }
  };

  const error = (field: keyof SiteSettings) =>
    issues[field as string] ? (
      <p className="mt-1.5 text-xs font-medium text-alert" role="alert">
        {issues[field as string]}
      </p>
    ) : null;

  return (
    <>
      <PageHeading
        title="Settings"
        description="Clinic-wide information: emergency strip, timings, homepage headline, social links and map configuration."
      />

      <div className="space-y-5">
        <StorageNotice storage={loaded.storage} />

        <AdminCard title="Emergency strip" description="Shown above the navigation on every page.">
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Emergency phone (10 digits)" htmlFor="emergencyPhone" hint="Blank hides the call link">
              <input
                id="emergencyPhone"
                className={adminInput}
                inputMode="numeric"
                value={settings.emergencyPhone}
                onChange={(e) => update('emergencyPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
              {error('emergencyPhone')}
            </Field>
            <Field label="Strip text" className="lg:col-span-2" htmlFor="emergencyNote">
              <input
                id="emergencyNote"
                className={adminInput}
                value={settings.emergencyNote}
                onChange={(e) => update('emergencyNote', e.target.value)}
              />
              {error('emergencyNote')}
            </Field>
            <div className="lg:col-span-3">
              <Toggle
                id="emergencyEnabled"
                label="Show the emergency strip (keep the 24 × 7 wording only while the clinic offers it)"
                checked={settings.emergencyEnabled}
                onChange={(value) => update('emergencyEnabled', value)}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Timings" description="Editable clinic and home-visit hours.">
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Open days" htmlFor="openDays">
              <input
                id="openDays"
                className={adminInput}
                value={settings.openDays}
                onChange={(e) => update('openDays', e.target.value)}
                placeholder="Monday – Sunday"
              />
              {error('openDays')}
            </Field>
            <Field label="Clinic hours" htmlFor="clinicHours" hint="e.g. 8:00 AM – 10:00 PM (also builds the appointment time slots)">
              <input
                id="clinicHours"
                className={adminInput}
                value={settings.clinicHours}
                onChange={(e) => update('clinicHours', e.target.value)}
              />
              {error('clinicHours')}
            </Field>
            <Field label="Home visit hours" htmlFor="homeVisitHours">
              <input
                id="homeVisitHours"
                className={adminInput}
                value={settings.homeVisitHours}
                onChange={(e) => update('homeVisitHours', e.target.value)}
              />
              {error('homeVisitHours')}
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Homepage" description="Hero headline and subheading.">
          <div className="grid gap-4">
            <Field label="Headline" htmlFor="heroHeading">
              <input
                id="heroHeading"
                className={adminInput}
                value={settings.heroHeading}
                onChange={(e) => update('heroHeading', e.target.value)}
              />
              {error('heroHeading')}
            </Field>
            <Field label="Subheading" htmlFor="heroSubheading">
              <input
                id="heroSubheading"
                className={adminInput}
                value={settings.heroSubheading}
                onChange={(e) => update('heroSubheading', e.target.value)}
              />
              {error('heroSubheading')}
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Diagnostics" description="Controls the diagnostic tagline and the “same day results” badge.">
          <div className="grid gap-4">
            <Field label="Tagline (pipe separated)" htmlFor="diagnosticTagline">
              <input
                id="diagnosticTagline"
                className={adminInput}
                value={settings.diagnosticTagline}
                onChange={(e) => update('diagnosticTagline', e.target.value)}
              />
              {error('diagnosticTagline')}
            </Field>
            <Toggle
              id="showSameDayResults"
              label="Show “Same day results” where the clinic supports it"
              checked={settings.showSameDayResults}
              onChange={(value) => update('showSameDayResults', value)}
            />
          </div>
        </AdminCard>

        <AdminCard title="Appointments & quick actions">
          <div className="grid gap-4">
            <Field label="Notice under the appointment form" htmlFor="appointmentNotice">
              <textarea
                id="appointmentNotice"
                rows={2}
                className={adminInput}
                value={settings.appointmentNotice}
                onChange={(e) => update('appointmentNotice', e.target.value)}
              />
              {error('appointmentNotice')}
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                id="whatsappEnabled"
                label="WhatsApp buttons"
                checked={settings.whatsappEnabled}
                onChange={(value) => update('whatsappEnabled', value)}
              />
              <Toggle
                id="floatingButtonsEnabled"
                label="Floating quick-action buttons"
                checked={settings.floatingButtonsEnabled}
                onChange={(value) => update('floatingButtonsEnabled', value)}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Map & location" description="Leave blank to use the automatic key-less map of the clinic address.">
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Maps embed URL (optional)" className="lg:col-span-3" htmlFor="mapsEmbedUrl">
              <input
                id="mapsEmbedUrl"
                className={adminInput}
                value={settings.mapsEmbedUrl}
                onChange={(e) => update('mapsEmbedUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed/…"
              />
              {error('mapsEmbedUrl')}
            </Field>
            <Field label="Latitude (optional)" htmlFor="geoLat" hint="Only if supplied by the clinic">
              <input
                id="geoLat"
                className={adminInput}
                value={settings.geoLat}
                onChange={(e) => update('geoLat', e.target.value)}
                placeholder="19.19…"
              />
              {error('geoLat')}
            </Field>
            <Field label="Longitude (optional)" htmlFor="geoLng" hint="Only if supplied by the clinic">
              <input
                id="geoLng"
                className={adminInput}
                value={settings.geoLng}
                onChange={(e) => update('geoLng', e.target.value)}
                placeholder="72.85…"
              />
              {error('geoLng')}
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Social profiles" description="Shown in the footer and in schema.org sameAs when provided.">
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Facebook URL" htmlFor="facebookUrl">
              <input id="facebookUrl" className={adminInput} value={settings.facebookUrl} onChange={(e) => update('facebookUrl', e.target.value)} placeholder="https://facebook.com/…" />
              {error('facebookUrl')}
            </Field>
            <Field label="Instagram URL" htmlFor="instagramUrl">
              <input id="instagramUrl" className={adminInput} value={settings.instagramUrl} onChange={(e) => update('instagramUrl', e.target.value)} placeholder="https://instagram.com/…" />
              {error('instagramUrl')}
            </Field>
            <Field label="YouTube URL" htmlFor="youtubeUrl">
              <input id="youtubeUrl" className={adminInput} value={settings.youtubeUrl} onChange={(e) => update('youtubeUrl', e.target.value)} placeholder="https://youtube.com/…" />
              {error('youtubeUrl')}
            </Field>
          </div>
        </AdminCard>

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
