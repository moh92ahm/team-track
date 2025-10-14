import React from 'react'
import './globals.css'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/site-header'
import { AppSidebar } from '@/components/app-sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout(props: { children: React.ReactNode }) {
  const token = (await cookies()).get("payload-token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`, {
    headers: { Authorization: `JWT ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/admin/login");
  }

  const { user } = await res.json();
  if (!user) {
    redirect("/admin/login");
  }

  const { children } = props

  return (
    <html lang="en">
      <body>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 20)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
              <main className="flex flex-1 flex-col overflow-hidden">
                {children}
              </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
