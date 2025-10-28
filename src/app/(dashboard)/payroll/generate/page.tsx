import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function GeneratePayrollPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/login')

  const handleGenerate = async (formData: FormData) => {
    'use server'

    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user) throw new Error('Unauthorized')

    const month = String(formData.get('month') || new Date().getMonth() + 1).padStart(2, '0')
    const year = Number(formData.get('year') || new Date().getFullYear())

    try {
      // Get all active employees
      const employees = await payload.find({
        collection: 'users',
        where: {
          and: [{ isActive: { equals: true } }, { isSuperAdmin: { not_equals: true } }],
        },
        limit: 100,
        user,
      })

      console.log(`Found ${employees.docs.length} employees to process`)

      let created = 0
      let skipped = 0

      for (const employee of employees.docs) {
        try {
          // Get all active payroll settings for this employee
          const payrollSettings = await payload.find({
            collection: 'payroll-settings',
            where: {
              and: [
                { employee: { equals: employee.id } },
                { isActive: { equals: true } },
                {
                  or: [
                    { 'effectiveDate.endDate': { exists: false } },
                    { 'effectiveDate.endDate': { greater_than: new Date() } },
                  ],
                },
              ],
            },
            user,
          })

          // Create one payroll record per setting
          for (const setting of payrollSettings.docs) {
            try {
              // Check if payroll already exists for this specific setting
              const existing = await payload.find({
                collection: 'payroll',
                where: {
                  and: [
                    { employee: { equals: employee.id } },
                    { 'period.month': { equals: month } },
                    { 'period.year': { equals: year } },
                    { 'payrollItems.payrollSetting': { equals: setting.id } },
                  ],
                },
                user,
              })

              if (existing.docs.length > 0) {
                skipped++
                continue
              }

              // Create separate payroll record for each setting
              await payload.create({
                collection: 'payroll',
                data: {
                  employee: employee.id,
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
                  payrollItems: [
                    {
                      payrollSetting: setting.id,
                      description: setting.description || `${setting.payrollType} payment`,
                      payrollType: setting.payrollType,
                      amount: setting.paymentDetails?.amount || 0,
                      paymentType: setting.paymentDetails?.paymentType || 'bankTransfer',
                    },
                  ],
                  adjustments: {
                    bonusAmount: 0,
                    deductionAmount: 0,
                    adjustmentNote: '',
                  },
                  status: 'generated',
                },
                user,
              })

              created++
            } catch (error) {
              console.error(
                `Error creating payroll for employee ${employee.id}, setting ${setting.id}:`,
                error,
              )
            }
          }
        } catch (error) {
          console.error(`Error processing employee ${employee.id}:`, error)
        }
      }

      console.log(`Payroll generation complete: ${created} created, ${skipped} skipped`)
    } catch (error) {
      console.error('Error in payroll generation:', error)
      throw error
    }

    redirect('/payroll')
  }

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Generate Monthly Payrolls</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium mb-2">
                Month
              </label>
              <select
                id="month"
                name="month"
                defaultValue={currentMonth.toString().padStart(2, '0')}
                className="w-full rounded-md border bg-background p-2"
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-2">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                defaultValue={currentYear}
                min="2020"
                max="2030"
                className="w-full rounded-md border bg-background p-2"
              />
            </div>

            <Button type="submit" className="w-full">
              Generate Payrolls
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
