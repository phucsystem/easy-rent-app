'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useFormField } from './form';

/**
 * FormMessage that translates Zod validation error messages.
 * Error messages like "validation.phoneInvalid" are translated using next-intl.
 */
export function FormMessageTranslated({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const t = useTranslations();

  let body: React.ReactNode = props.children;

  if (error?.message) {
    const message = String(error.message);
    // Check if it's a translation key (e.g., "validation.phoneInvalid")
    if (message.includes('.') && !message.includes(' ')) {
      try {
        body = t(message as Parameters<typeof t>[0]);
      } catch {
        // Fallback to raw message if translation not found
        body = message;
      }
    } else {
      body = message;
    }
  }

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  );
}
