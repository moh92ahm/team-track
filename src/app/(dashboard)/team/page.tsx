import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import { StaffList } from '@/components/staff/staff-list'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Authenticate using the request cookies (same login as /admin)
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin')

  // Fetch Staff docs
  const { docs } = await payload.find({
    collection: 'staff',
    depth: 2,
    limit: 50,
    sort: '-joinedAt',
    user,
  })

  return (
    <Tabs defaultValue="outline">
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="space-y-4 p-4 lg:p-6">
          <StaffList data={docs} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
