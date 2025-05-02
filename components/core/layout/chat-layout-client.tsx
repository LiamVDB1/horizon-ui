'use client';

import React, { ReactNode } from 'react';
import { useDeveloperMode } from '@/components/core/context/developer-mode-context';
import { cn } from '@/lib/utils';

interface ChatLayoutClientProps {
  children: ReactNode;
}

export function ChatLayoutClient({ children }: ChatLayoutClientProps) {
  const { isDeveloperMode } = useDeveloperMode();

  // We need to apply the class to a high-level element.
  // Applying directly to `body` from a client component is tricky and can cause hydration issues.
  // Instead, we wrap the children in a div that gets the class.
  // The global CSS will target elements *within* `.developer-mode`.
  return (
    <div className='h-full'>
      {children}
    </div>
  );
} 