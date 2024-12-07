'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type User } from 'next-auth';

import {HorizonIcon, PlusIcon} from '@/components/custom/icons';
import { SidebarHistory } from '@/components/custom/sidebar-history';
import { SidebarUserNav } from '@/components/custom/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
      <Sidebar className="group-data-[side=left]:border-r-0">
          <SidebarHeader>
              <SidebarMenu>
                  <div className="flex flex-row justify-between items-center">
                      <div
                          onClick={() => {
                              setOpenMobile(false);
                              router.push('/');
                              router.refresh();
                          }}
                          className="flex flex-row gap-3 items-center"
                      >
                          <div className={"flex flew-row gap-0 items-center"}>
                              <HorizonIcon size={26} className={"text-primary"} />
                              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                                Jupiter Horizon
                              </span>
                          </div>
                      </div>
                      <BetterTooltip content="New Chat" align="start">
                          <Button
                              variant="ghost"
                              className="p-2 h-fit"
                              onClick={() => {
                                  setOpenMobile(false);
                                  router.push('/');
                                  router.refresh();
                              }}
                          >
                              <PlusIcon/>
                          </Button>
                      </BetterTooltip>
                  </div>
              </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
              <SidebarGroup>
                  <SidebarHistory user={user}/>
              </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="gap-0">
              {user && (
                  <SidebarGroup>
                      <SidebarGroupContent>
                          <SidebarUserNav user={user}/>
                      </SidebarGroupContent>
                  </SidebarGroup>
              )}
          </SidebarFooter>
      </Sidebar>
  );
}
