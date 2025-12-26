'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { contractTemplateFormSchema, type ContractTemplateFormData } from '@/lib/validations/contract-template';
import { contractTemplateService } from '@/lib/services/contract-template-service';
import type { ContractTemplate, UpdateContractTemplateInput } from '@/types/contract-template';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  template?: ContractTemplate | null;
}

export function TemplateFormDialog({
  open,
  onOpenChange,
  onSuccess,
  mode,
  template,
}: TemplateFormDialogProps) {
  const form = useForm({
    resolver: zodResolver(contractTemplateFormSchema),
    defaultValues: {
      name: template?.name ?? '',
      content: template?.content ?? '',
      variables: template?.variables ?? [],
      isDefault: template?.isDefault ?? false,
    },
  });

  const createMutation = useMutation({
    mutationFn: contractTemplateService.create,
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Tạo mẫu hợp đồng thất bại: ${(error as Error).message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContractTemplateInput }) =>
      contractTemplateService.update(id, input),
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Cập nhật mẫu hợp đồng thất bại: ${(error as Error).message}`);
    },
  });

  const onSubmit = async (data: ContractTemplateFormData) => {
    // Extract variables from content automatically
    const extractedVars = contractTemplateService.extractVariables(data.content);

    const submitData = {
      ...data,
      variables: data.variables.length > 0 ? data.variables : extractedVars.map((key) => ({
        key,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        type: 'text' as const,
        required: true,
      })),
    };

    if (mode === 'create') {
      createMutation.mutate(submitData);
    } else if (mode === 'edit' && template) {
      updateMutation.mutate({ id: template.id, input: submitData });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Tạo mẫu hợp đồng mới' : 'Chỉnh sửa mẫu hợp đồng'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Tạo mẫu hợp đồng với biến số động để sử dụng cho nhiều hợp đồng.'
              : 'Cập nhật thông tin mẫu hợp đồng.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên mẫu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Hợp đồng thuê nhà dân dụng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nội dung hợp đồng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung hợp đồng. Sử dụng {{tên_biến}} để thêm biến số động.&#10;&#10;VD: Bên thuê là {{tenant_full_name}}, CCCD số {{tenant_id_card}}..."
                      className="min-h-[300px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sử dụng cú pháp <code className="rounded bg-muted px-1 py-0.5">
                      {'{{'} tên_biến {'}}'}</code> để thêm biến số động vào hợp đồng.
                    <br />
                    VD: <code className="rounded bg-muted px-1 py-0.5">
                      {'{{'} tenant_full_name {'}}'}</code>,{' '}
                    <code className="rounded bg-muted px-1 py-0.5">
                      {'{{'} monthly_rent {'}}'}</code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === 'create'
                    ? 'Đang tạo...'
                    : 'Đang lưu...'
                  : mode === 'create'
                    ? 'Tạo mẫu'
                    : 'Lưu thay đổi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
