import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PayrollForm } from '@/components/payroll/forms/payroll-form'

export default async function NewPayrollPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/login')

  // Fetch user options for employee select
  const userResult = await payload.find({
    collection: 'users',
    limit: 100,
    sort: 'fullName',
    user,
  })

  const handleCreatePayroll = async (formData: FormData) => {
    'use server'

    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    const employeeId = String(formData.get('employee') || '')
    const month = String(formData.get('month') || '')
    const year = Number(formData.get('year') || 0)
    const totalWorkingDays = Number(formData.get('totalWorkingDays') || 0)
    const daysWorked = Number(formData.get('daysWorked') || 0)
    const leaveDays = Number(formData.get('leaveDays') || 0)
    const bonusAmount = Number(formData.get('bonusAmount') || 0)
    const deductionAmount = Number(formData.get('deductionAmount') || 0)
    const overtimePay = Number(formData.get('overtimePay') || 0)
    const adjustmentNote = String(formData.get('adjustmentNote') || '')
    const status = String(formData.get('status') || 'generated')

    const data: any = {
      employee: parseInt(employeeId),
      period: {
        month: month as
          | '01'
          | '02'
          | '03'
          | '04'
          | '05'
          | '06'
          | '07'
          | '08'
          | '09'
          | '10'
          | '11'
          | '12',
        year,
      },
      workDays: {
        totalWorkingDays,
        daysWorked,
        leaveDays,
      },
      adjustments: {
        bonusAmount,
        deductionAmount,
        overtimePay,
        adjustmentNote: adjustmentNote || null,
      },
      status,
    }

    await payload.create({ collection: 'payroll', data, user })

    redirect('/payroll')
  }

  return (
    <>
      <PayrollForm
        mode="create"
        formAction={handleCreatePayroll}
        employees={userResult.docs.map((u) => ({ value: String(u.id), label: u.fullName }))}
      />
    </>
  )
}
