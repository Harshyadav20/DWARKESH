'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { clinic } from '@/lib/site';
import { mailtoHref, whatsappHref } from '@/lib/links';
import { cn } from '@/lib/utils';

/**
 * "Send us a message" composer.
 *
 * There is no hidden backend here: the links are built from what the visitor
 * typed and open WhatsApp or their mail app pre-filled, so the action always
 * works and nothing is silently discarded.
 */
export function MessageComposer() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const nameValid = name.trim().length >= 2;
  const messageValid = message.trim().length >= 5;
  const isValid = nameValid && messageValid;

  /** Pure builder — no state updates while rendering. */
  const draft = [
    `Hello ${clinic.legalName},`,
    '',
    message.trim(),
    '',
    `Name: ${name.trim()}`,
    phone.trim() ? `Phone: ${phone.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const guard = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isValid) {
      setError(null);
      return;
    }
    event.preventDefault();
    if (!nameValid) {
      setError('Please enter your name so we know who is writing.');
      document.getElementById('mc-name')?.focus();
    } else {
      setError('Please write a short message.');
      document.getElementById('mc-message')?.focus();
    }
  };

  return (
    <div className="card p-6" aria-labelledby="message-composer-heading">
      <h3 id="message-composer-heading" className="font-display text-lg font-bold text-brand-950">
        Send us a message
      </h3>
      <p className="mt-1.5 text-sm text-ink-600">
        Type your query and continue on WhatsApp or email — your message opens pre-filled.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mc-name" className="label">
            Your name
          </label>
          <input
            id="mc-name"
            name="name"
            autoComplete="name"
            className={cn('input', error && !nameValid && 'input-error')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setError(null)}
            placeholder="e.g. Sunita Sharma"
            required
          />
        </div>
        <div>
          <label htmlFor="mc-phone" className="label">
            Mobile number <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <input
            id="mc-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="input"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="10-digit mobile number"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mc-message" className="label">
            Message
          </label>
          <textarea
            id="mc-message"
            name="message"
            rows={4}
            className={cn('input resize-y', error && !messageValid && 'input-error')}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onBlur={() => setError(null)}
            placeholder="What would you like to know?"
            required
          />
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={whatsappHref(isValid ? draft : `Hello ${clinic.legalName},`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={guard}
          className={buttonStyles({ variant: 'whatsapp', size: 'md' })}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Send on WhatsApp
        </a>
        <a
          href={mailtoHref(
            `Enquiry from ${name.trim() || 'website visitor'}`,
            isValid ? draft : '',
          )}
          onClick={guard}
          className={buttonStyles({ variant: 'outline', size: 'md' })}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Send by Email
        </a>
        <span className="inline-flex items-center gap-1.5 self-center text-xs text-ink-500">
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          Opens in WhatsApp / your mail app
        </span>
      </div>
    </div>
  );
}
