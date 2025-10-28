import '../(dashboard)/globals.css'

// Force dynamic rendering for employee pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
