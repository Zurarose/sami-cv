'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Settings,
  FileText,
  User,
  Menu,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/ui-kit/basic/sidebar';
import { Button } from '@/ui-kit/basic/button';
import { Separator } from '@/ui-kit/basic/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/ui-kit/basic/sheet';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { routes } from '@/constant/routes';

// Menu items data
const menuItems = [
  {
    title: 'Documents',
    icon: FileText,
    url: '/dashboard',
  },
];

const settingsItems = [
  {
    title: 'Settings',
    icon: Settings,
    url: '/settings',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const breadcrumbs = pathname.split('/').filter(Boolean);

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    alt="SAMI CV"
                    width={200}
                    height={54}
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/profile">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs">john@example.com</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 h-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" />
            {/* Breadcrumb or title */}
            <div className="flex items-center gap-x-2 flex-wrap">
              {breadcrumbs.map((breadcrumb, index) => {
                return (
                  <React.Fragment key={breadcrumb}>
                    {index === 0 ? (
                      <Link href={routes.documents}>
                        <h1 className="font-semibold max-w-24 min-lg:max-w-none truncate text-xs min-lg:text-lg">
                          {breadcrumb?.charAt(0).toUpperCase() +
                            breadcrumb?.slice(1)}
                        </h1>
                      </Link>
                    ) : (
                      <h1 className="font-semibold max-w-24 min-lg:max-w-none truncate text-xs min-lg:text-lg">
                        {breadcrumb?.charAt(0).toUpperCase() +
                          breadcrumb?.slice(1)}
                      </h1>
                    )}

                    {index !== breadcrumbs.length - 1 && <ChevronRight />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Header right side */}
          <div className="ml-auto flex items-center gap-2 pr-4">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/profile">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <User className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs">john@example.com</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <Separator />
                <div className="grid gap-4 py-4">
                  <nav className="grid gap-2">
                    {menuItems.map(item => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        className="justify-start"
                        asChild
                      >
                        <Link href={item.url}>
                          <item.icon className="mr-2 size-4" />
                          {item.title}
                        </Link>
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const MagicLinkLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <React.Fragment>
      <nav className="flex flex-1 flex-col gap-4 p-4 w-full bg-transparent">
        <Image src="/logo.svg" alt="SAMI CV" width={200} height={54} />
      </nav>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </React.Fragment>
  );
};
