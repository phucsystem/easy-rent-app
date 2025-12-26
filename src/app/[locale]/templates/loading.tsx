import { TemplateSkeleton } from '@/components/templates/template-skeleton';

export default function TemplatesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>
      <TemplateSkeleton count={6} />
    </div>
  );
}
