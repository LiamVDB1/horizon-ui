'use client';

import React from 'react';

import { AppSidebar } from '@/components/core/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DeveloperModeProvider } from '@/components/core/context/developer-mode-context';
import { ChatLayoutClient } from '@/components/core/layout/chat-layout-client';
import { User } from 'next-auth'; // Assuming User type comes from next-auth

interface ChatClientBoundaryProps {
  user: User | undefined;
  defaultOpen: boolean;
  children: React.ReactNode;
}

export function ChatClientBoundary({
  user,
  defaultOpen,
  children,
}: ChatClientBoundaryProps) {
  return (
    // Developer Mode Provider wraps everything client-side
    <DeveloperModeProvider>
      {/* Sidebar Provider likely needs client context */}
      <SidebarProvider defaultOpen={defaultOpen}>
        {/* AppSidebar might be okay as server, but safer here if it uses client features */}
        <AppSidebar user={user} />
        <SidebarInset>
          {/* ChatLayoutClient uses context, needs to be inside DeveloperModeProvider */}
          <ChatLayoutClient>{children}</ChatLayoutClient>
        </SidebarInset>
      </SidebarProvider>
    </DeveloperModeProvider>
  );
} 