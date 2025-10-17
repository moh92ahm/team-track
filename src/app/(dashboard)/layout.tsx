import React from 'react'
import './globals.css'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/site-header'
import { AppSidebar } from '@/components/app-sidebar'
import { requireAuth } from '@/lib/auth'

export default async function DashboardLayout(props: { children: React.ReactNode }) {
  // This will redirect to /login if user is not authenticated
  const user = await requireAuth()

  const { children } = props

  return (
    <html lang="en">
      <body>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 20)',
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
