import { escapeJsonLd } from '@/lib/utils';

/**
 * Renders a JSON-LD <script> block safely.
 * Values are JSON-stringified and the dangerous characters are escaped so
 * content can never break out of the script tag.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(data) }}
    />
  );
}
