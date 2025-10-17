import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { InventoryForm } from '@/components/inventory/forms/inventory-form'

export default async function NewInventoryPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin')

  // Fetch user options for holder select
  const staffResult = await payload.find({
    collection: 'users',
    limit: 100,
    sort: 'fullName',
    user,
  })

  const handleCreateInventory = async (formData: FormData) => {
    'use server'

    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    const itemType = String(formData.get('itemType') || '')
    const model = String(formData.get('model') || '')
    const serialNumber = String(formData.get('serialNumber') || '')
    const status = String(formData.get('status') || '')
    const rawHolder = String(formData.get('holder') || '')
    const holder = rawHolder === '__none__' ? '' : rawHolder
    const purchaseDate = String(formData.get('purchaseDate') || '')
    const warrantyExpiry = String(formData.get('warrantyExpiry') || '')
    const notes = String(formData.get('notes') || '')

    // Upload multiple images
    const imageFiles = formData.getAll('image').filter((f): f is File => f instanceof File && f.size > 0)
    const imageIds: number[] = []
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const upload = await payload.create({
        collection: 'media',
        data: { alt: `${itemType} image` },
        file: { data: buffer, mimetype: file.type, name: file.name, size: file.size },
        user,
      })
      imageIds.push(upload.id as number)
    }

    const data: any = {
      itemType,
      model,
      serialNumber,
      status,
    }
    if (holder) data.holder = parseInt(holder)
    if (purchaseDate) data.purchaseDate = purchaseDate
    if (warrantyExpiry) data.warrantyExpiry = warrantyExpiry
    if (notes) data.notes = notes
    if (imageIds.length) data.image = imageIds

    await payload.create({ collection: 'inventory', data, user })

    redirect('/inventory')
  }

  return (
    <>
      <InventoryForm
      mode="create"
      formAction={handleCreateInventory}
      holders={staffResult.docs.map((s) => ({ value: String(s.id), label: s.fullName }))}
      />
    </>
  )
}
