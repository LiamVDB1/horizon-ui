import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { AppSidebar } from '@/components/core/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { auth } from '../(auth)/auth';
import { ChatClientBoundary } from '@/components/core/layout/chat-client-boundary';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <ChatClientBoundary user={session?.user} defaultOpen={!isCollapsed}>
      {children}
    </ChatClientBoundary>
  );
}