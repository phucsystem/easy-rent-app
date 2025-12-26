import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TenantSkeleton } from '@/components/tenants';

export default function TenantsLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <TenantSkeleton />
      </CardContent>
    </Card>
  );
}

