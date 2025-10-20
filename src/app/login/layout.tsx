export const metadata = {
  title: 'Team Track - Login',
  description: 'Login to your Team Track account',
}

import React from 'react'
import '../(dashboard)/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
