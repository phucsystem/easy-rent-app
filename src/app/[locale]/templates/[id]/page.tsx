import { TemplateDetailClient } from './template-detail-client';

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  return <TemplateDetailClient id={id} />;
}
