import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceDetail } from '@/components/services/service-detail';
import { buildMetadata } from '@/lib/seo';
import { address, clinic } from '@/lib/site';
import { findService, getContent, servicesByGroup } from '@/lib/store';

type Params = { slug: string };

export async function generateStaticParams() {
  const { services } = await getContent();
  return servicesByGroup(services, 'medical').map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { services } = await getContent();
  const service = findService(services, slug);

  if (!service || service.group !== 'medical') return { title: 'Service not found' };

  return buildMetadata({
    title: `${service.name}`,
    description: `${service.description ?? service.shortDescription} Available at ${clinic.legalName}, ${address.locality}, ${address.city}.`,
    path: `/services/${service.slug}`,
    image: service.image ?? '/images/og-cover.png',
    keywords: [`${service.name.toLowerCase()} Malad East`, `${service.name.toLowerCase()} Mumbai`],
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, services } = await getContent();
  const service = findService(services, slug);

  if (!service || service.group !== 'medical') notFound();

  const related = servicesByGroup(services, 'medical').filter((item) => item.id !== service.id);

  return (
    <ServiceDetail
      service={service}
      related={related}
      settings={settings}
      crumbParent={{ name: 'Services', href: '/services' }}
    />
  );
}
