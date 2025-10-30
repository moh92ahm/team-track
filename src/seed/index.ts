import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Payload } from 'payload'
import { seedRolesAndDepartments } from './roles-departments'

export async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data first (optional)
    // await clearDatabase(payload)

    // 1. Create Roles and Departments
    console.log('📁 Creating roles and departments...')
    await seedRolesAndDepartments(payload)

    // Fetch created departments and roles
    const departmentsData = await payload.find({
      collection: 'departments',
      limit: 100,
    })
    const rolesData = await payload.find({
      collection: 'roles',
      limit: 100,
    })

    const departments = departmentsData.docs
    const roles = rolesData.docs

    // 2. Create Users (Marvel characters)
    console.log('🦸 Creating Marvel characters as users...')
    const users = await seedMarvelCharacters(payload, departments, roles)

    // 3. Create Payroll Settings for each user
    console.log('💰 Creating payroll settings...')
    await seedPayrollSettings(payload, users)

    // 4. Create Payroll History (last 3 months)
    console.log('� Creating payroll history...')
    await seedPayrollHistory(payload, users)

    // 5. Create Inventory (30 items assigned to users)
    console.log('💻 Creating inventory items...')
    await seedInventory(payload, users)

    // 6. Create Leave records
    console.log('🏖️ Creating leave records...')
    await seedLeaves(payload, users)

    console.log('✅ Database seeding completed successfully!')
    return { success: true }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Helper function to get random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to get random item from array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Marvel Characters Data
async function seedMarvelCharacters(payload: Payload, departments: any[], roles: any[]) {
  // Find departments by name
  const findDepts = (names: string[]) => {
    return names.map((name) => departments.find((d) => d.name === name)?.id).filter(Boolean)
  }

  const findRole = (name: string) => roles.find((r) => r.name === name)?.id

  const marvelCharacters = [
    {
      fullName: 'Mohammad Ahmadian',
      email: 'mohamad92ahm@gmail.com',
      username: 'mohammad',
      secondaryEmail: '',
      password: '123321',
      isSuperAdmin: true, // Super admin - has full access
      jobTitle: 'System Administrator',
      departments: findDepts(['Human Resources']), // HR department for admin
      role: findRole('HR Manager'),
      birthDate: '1992-05-15',
      primaryPhone: '+1-555-MOHAMMAD',
      secondaryPhone: '',
      employmentType: 'citizen',
      nationality: 'Iranian',
      identificationNumber: 'IR-ADMIN-001',
      address: 'Admin Office, Tehran',
      joinedAt: '2020-01-15T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Tony Stark',
      email: 'tony.stark@shield.marvel',
      username: 'tstark',
      secondaryEmail: 'ironman@stark.industries',
      password: 'IAmIronMan123!',
      isSuperAdmin: false,
      jobTitle: 'Chief Technology Officer',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1970-05-29',
      primaryPhone: '+1-555-STARK',
      secondaryPhone: '+1-555-JARVIS',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-STARK-001',
      address: '10880 Malibu Point, Malibu, CA 90265',
      joinedAt: '2020-01-15T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Natasha Romanoff',
      email: 'natasha.romanoff@shield.marvel',
      username: 'nromanoff',
      secondaryEmail: 'blackwidow@avengers.com',
      password: 'RedRoom123!',
      isSuperAdmin: false,
      jobTitle: 'Senior Field Agent',
      departments: findDepts(['Field', 'Russian', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1984-12-03',
      primaryPhone: '+1-555-WIDOW',
      employmentType: 'citizen',
      nationality: 'Russian-American',
      identificationNumber: 'RU-ROMAN-001',
      address: 'SHIELD Headquarters, Washington DC',
      joinedAt: '2019-06-20T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Steve Rogers',
      email: 'steve.rogers@shield.marvel',
      username: 'srogers',
      secondaryEmail: 'captainamerica@avengers.com',
      password: 'Brooklyn1918!',
      isSuperAdmin: false,
      jobTitle: 'Operations Manager',
      departments: findDepts(['Field', 'English']),
      role: findRole('Department Manager'),
      birthDate: '1918-07-04',
      primaryPhone: '+1-555-CAPTAIN',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-ROGERS-001',
      address: 'Brooklyn, New York',
      joinedAt: '2018-03-01T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Bruce Banner',
      email: 'bruce.banner@shield.marvel',
      username: 'bbanner',
      secondaryEmail: 'hulk@gamma.lab',
      password: 'GreenGiant123!',
      isSuperAdmin: false,
      jobTitle: 'Research Scientist',
      departments: findDepts(['Marketing', 'English']),
      role: findRole('Marketing Specialist'),
      birthDate: '1969-12-18',
      primaryPhone: '+1-555-BANNER',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-BANNER-001',
      address: 'New York City',
      joinedAt: '2019-09-15T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Thor Odinson',
      email: 'thor.odinson@shield.marvel',
      username: 'thor',
      secondaryEmail: 'godofthunder@asgard.realm',
      password: 'Mjolnir123!',
      isSuperAdmin: false,
      jobTitle: 'Field Operations Lead',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1985-01-01', // Changed from year 965 to avoid date validation issues
      primaryPhone: '+1-555-THUNDER',
      employmentType: 'other',
      nationality: 'Asgardian',
      identificationNumber: 'AS-THOR-001',
      address: 'New Asgard, Norway',
      joinedAt: '2018-05-10T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Peter Parker',
      email: 'peter.parker@shield.marvel',
      username: 'pparker',
      secondaryEmail: 'spiderman@queens.ny',
      password: 'WebSlinger123!',
      isSuperAdmin: false,
      jobTitle: 'Junior Field Agent',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '2001-08-10',
      primaryPhone: '+1-555-SPIDEY',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-PARKER-001',
      address: 'Queens, New York',
      joinedAt: '2023-06-01T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Wanda Maximoff',
      email: 'wanda.maximoff@shield.marvel',
      username: 'wmaximoff',
      secondaryEmail: 'scarletwitch@hex.magic',
      password: 'ChaosM agic123!',
      isSuperAdmin: false,
      jobTitle: 'Special Operations Agent',
      departments: findDepts(['Field', 'Russian', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1989-02-10',
      primaryPhone: '+1-555-WANDA',
      employmentType: 'workPermit',
      nationality: 'Sokovian',
      identificationNumber: 'SK-MAXIM-001',
      workPermitExpiry: '2026-12-31',
      address: 'Westview, New Jersey',
      joinedAt: '2021-04-15T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Stephen Strange',
      email: 'stephen.strange@shield.marvel',
      username: 'sstrange',
      secondaryEmail: 'drstrange@sanctum.mystic',
      password: 'TimeSt0ne123!',
      isSuperAdmin: false,
      jobTitle: 'Medical Consultant',
      departments: findDepts(['Dental Clinic - Doctors', 'English']),
      role: findRole('Doctor'),
      birthDate: '1976-11-18',
      primaryPhone: '+1-555-STRANGE',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-STRANGE-001',
      address: '177A Bleecker Street, New York',
      joinedAt: '2020-11-01T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Carol Danvers',
      email: 'carol.danvers@shield.marvel',
      username: 'cdanvers',
      secondaryEmail: 'captainmarvel@space.force',
      password: 'Binary123!',
      isSuperAdmin: false,
      jobTitle: 'Senior Field Agent',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1968-04-24',
      primaryPhone: '+1-555-MARVEL',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-DANVERS-001',
      address: 'Louisiana',
      joinedAt: '2019-03-08T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'TChalla',
      email: 'tchalla@shield.marvel',
      username: 'tchalla',
      secondaryEmail: 'blackpanther@wakanda.nation',
      password: 'Vibranium123!',
      isSuperAdmin: false,
      jobTitle: 'International Relations Manager',
      departments: findDepts(['Sales', 'English', 'French']),
      role: findRole('Sales Representative'),
      birthDate: '1980-06-15',
      primaryPhone: '+1-555-PANTHER',
      employmentType: 'other',
      nationality: 'Wakandan',
      identificationNumber: 'WK-TCHALLA-001',
      address: 'Wakanda',
      joinedAt: '2018-02-16T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Clint Barton',
      email: 'clint.barton@shield.marvel',
      username: 'cbarton',
      secondaryEmail: 'hawkeye@avengers.com',
      password: 'BullsEye123!',
      isSuperAdmin: false,
      jobTitle: 'Field Agent',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1971-01-07',
      primaryPhone: '+1-555-HAWKEYE',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-BARTON-001',
      address: 'Iowa',
      joinedAt: '2019-01-10T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Scott Lang',
      email: 'scott.lang@shield.marvel',
      username: 'slang',
      secondaryEmail: 'antman@pym.tech',
      password: 'Quantum123!',
      isSuperAdmin: false,
      jobTitle: 'Technical Specialist',
      departments: findDepts(['Transfer', 'English']),
      role: findRole('Sales Representative'),
      birthDate: '1979-04-06',
      primaryPhone: '+1-555-ANTMAN',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-LANG-001',
      address: 'San Francisco, California',
      joinedAt: '2022-07-06T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Hope van Dyne',
      email: 'hope.vandyne@shield.marvel',
      username: 'hvandyne',
      secondaryEmail: 'wasp@pym.tech',
      password: 'WaspWings123!',
      isSuperAdmin: false,
      jobTitle: 'Operations Specialist',
      departments: findDepts(['Transfer', 'English']),
      role: findRole('Sales Representative'),
      birthDate: '1981-08-23',
      primaryPhone: '+1-555-WASP',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-VANDYNE-001',
      address: 'San Francisco, California',
      joinedAt: '2022-07-06T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Sam Wilson',
      email: 'sam.wilson@shield.marvel',
      username: 'swilson',
      secondaryEmail: 'falcon@avengers.com',
      password: 'Wingman123!',
      isSuperAdmin: false,
      jobTitle: 'Field Operations Manager',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1978-09-23',
      primaryPhone: '+1-555-FALCON',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-WILSON-001',
      address: 'Washington DC',
      joinedAt: '2020-04-04T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Bucky Barnes',
      email: 'bucky.barnes@shield.marvel',
      username: 'bbarnes',
      secondaryEmail: 'wintersoldier@hydra.defunct',
      password: 'WhiteWolf123!',
      isSuperAdmin: false,
      jobTitle: 'Security Specialist',
      departments: findDepts(['Field', 'English', 'Russian']),
      role: findRole('Field Agent'),
      birthDate: '1917-03-10',
      primaryPhone: '+1-555-BUCKY',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-BARNES-001',
      address: 'Brooklyn, New York',
      joinedAt: '2021-03-19T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Nick Fury',
      email: 'nick.fury@shield.marvel',
      username: 'nfury',
      secondaryEmail: 'director@shield.gov',
      password: 'OnlyOneEye123!',
      isSuperAdmin: false,
      jobTitle: 'Director of Operations',
      departments: findDepts(['Human Resources']),
      role: findRole('HR Manager'),
      birthDate: '1951-07-04',
      primaryPhone: '+1-555-FURY',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-FURY-001',
      address: 'Classified',
      joinedAt: '2015-01-01T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Shuri',
      email: 'shuri@shield.marvel',
      username: 'shuri',
      secondaryEmail: 'blackpanther@wakanda.lab',
      password: 'TechGenius123!',
      isSuperAdmin: false,
      jobTitle: 'Technology Innovation Lead',
      departments: findDepts(['Marketing', 'English']),
      role: findRole('Marketing Specialist'),
      birthDate: '1998-10-01',
      primaryPhone: '+1-555-SHURI',
      employmentType: 'other',
      nationality: 'Wakandan',
      identificationNumber: 'WK-SHURI-001',
      address: 'Wakanda',
      joinedAt: '2020-02-16T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Pietro Maximoff',
      email: 'pietro.maximoff@shield.marvel',
      username: 'pmaximoff',
      secondaryEmail: 'quicksilver@speed.fast',
      password: 'FastRunner123!',
      isSuperAdmin: false,
      jobTitle: 'Rapid Response Agent',
      departments: findDepts(['Field', 'Russian', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1989-02-10',
      primaryPhone: '+1-555-QUICK',
      employmentType: 'workPermit',
      nationality: 'Sokovian',
      identificationNumber: 'SK-MAXIM-002',
      workPermitExpiry: '2026-12-31',
      address: 'Sokovia',
      joinedAt: '2021-04-15T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Kamala Khan',
      email: 'kamala.khan@shield.marvel',
      username: 'kkhan',
      secondaryEmail: 'msmarvel@jersey.city',
      password: 'Embiggen123!',
      isSuperAdmin: false,
      jobTitle: 'Junior Marketing Specialist',
      departments: findDepts(['Marketing', 'English']),
      role: findRole('Marketing Specialist'),
      birthDate: '2003-06-13',
      primaryPhone: '+1-555-KAMALA',
      employmentType: 'citizen',
      nationality: 'Pakistani-American',
      identificationNumber: 'US-KHAN-001',
      address: 'Jersey City, New Jersey',
      joinedAt: '2024-01-10T09:00:00.000Z',
      isActive: true,
    },
    {
      fullName: 'Marc Spector',
      email: 'marc.spector@shield.marvel',
      username: 'mspector',
      secondaryEmail: 'moonknight@khonshu.egypt',
      password: 'MoonKnight123!',
      isSuperAdmin: false,
      jobTitle: 'Night Operations Agent',
      departments: findDepts(['Field', 'English']),
      role: findRole('Field Agent'),
      birthDate: '1975-03-09',
      primaryPhone: '+1-555-MOON',
      employmentType: 'citizen',
      nationality: 'American',
      identificationNumber: 'US-SPECTOR-001',
      address: 'New York City',
      joinedAt: '2022-03-30T09:00:00.000Z',
      isActive: true,
    },
  ]

  const users = []
  for (const character of marvelCharacters) {
    try {
      const created = await payload.create({
        collection: 'users',
        data: character as any,
      })
      users.push(created)
      console.log(`  ✓ Created user: ${character.fullName}`)
    } catch (error) {
      console.error(`  ✗ Failed to create user ${character.fullName}:`, error)
    }
  }

  return users
}

// Payroll Settings - Create ongoing salary settings for each user
async function seedPayrollSettings(payload: Payload, users: any[]) {
  const payrollSettings = []

  // Base salaries by role type
  const salaryRanges: Record<string, number> = {
    'HR Manager': 12000,
    'Department Manager': 10000,
    'Field Agent': 7000,
    'Sales Representative': 6500,
    Doctor: 15000,
    'Marketing Specialist': 6000,
  }

  for (const user of users) {
    try {
      const roleName = typeof user.role === 'object' ? user.role.name : 'Field Agent'
      const baseSalary = salaryRanges[roleName] || 6000

      // Primary Salary
      const primarySalary = await payload.create({
        collection: 'payroll-settings',
        data: {
          employee: user.id,
          payrollType: 'primary',
          description: `Monthly Salary - ${user.fullName}`,
          paymentDetails: {
            amount: baseSalary,
            paymentType: 'bankTransfer',
            paymentFrequency: 'monthly',
          },
          bankAccount: {
            accountNumber: `ACC${Math.floor(Math.random() * 1000000)}`,
            bankName: 'SHIELD Credit Union',
            accountHolderName: user.fullName,
            swiftCode: 'SHIELDXX',
          },
          isActive: true,
          effectiveDate: {
            startDate: user.joinedAt || new Date().toISOString(),
          },
        },
      })
      payrollSettings.push(primarySalary)

      // Random bonuses for some users (30% chance)
      if (Math.random() > 0.7) {
        const bonus = await payload.create({
          collection: 'payroll-settings',
          data: {
            employee: user.id,
            payrollType: 'bonus',
            description: `Performance Bonus - ${user.fullName}`,
            paymentDetails: {
              amount: Math.floor(Math.random() * 2000) + 500,
              paymentType: 'bankTransfer',
              paymentFrequency: 'monthly',
            },
            isActive: true,
            effectiveDate: {
              startDate: user.joinedAt || new Date().toISOString(),
            },
          },
        })
        payrollSettings.push(bonus)
      }

      console.log(`  ✓ Created payroll settings for: ${user.fullName}`)
    } catch (error) {
      console.error(`  ✗ Failed to create payroll settings for ${user.fullName}:`, error)
    }
  }

  return payrollSettings
}

// Payroll History - Create payroll records for last 3 months
async function seedPayrollHistory(payload: Payload, users: any[]) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 1-12

  // Get last 3 months
  const months = []
  for (let i = 2; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - 1 - i, 1)
    months.push({
      month: String(date.getMonth() + 1).padStart(2, '0'),
      year: date.getFullYear(),
    })
  }

  const payrolls = []

  for (const user of users) {
    // Get this user's payroll settings
    const settings = await payload.find({
      collection: 'payroll-settings',
      where: {
        and: [{ employee: { equals: user.id } }, { isActive: { equals: true } }],
      },
    })

    for (const period of months) {
      try {
        // Build payroll items from settings
        const payrollItems = settings.docs.map((setting: any) => ({
          payrollSetting: setting.id,
          description: setting.description || `${setting.payrollType} payment`,
          payrollType: setting.payrollType,
          amount: setting.paymentDetails?.amount || 0,
          paymentType: setting.paymentDetails?.paymentType || 'bankTransfer',
        }))

        // Calculate total
        const totalFromSettings = payrollItems.reduce(
          (sum: number, item: any) => sum + item.amount,
          0,
        )

        // Random adjustments (20% chance)
        const bonusAmount = Math.random() > 0.8 ? Math.floor(Math.random() * 500) + 100 : 0
        const deductionAmount = Math.random() > 0.9 ? Math.floor(Math.random() * 200) + 50 : 0

        const totalAmount = totalFromSettings + bonusAmount - deductionAmount

        // Status based on month (older = paid, recent = approved)
        const monthIndex = months.indexOf(period)
        const status = monthIndex === 0 ? 'paid' : monthIndex === 1 ? 'approved' : 'paid'

        const payrollData: any = {
          employee: user.id,
          period: {
            month: period.month as
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
            year: period.year,
          },
          payrollItems,
          adjustments: {
            bonusAmount,
            deductionAmount,
            adjustmentNote:
              bonusAmount > 0
                ? 'Performance bonus'
                : deductionAmount > 0
                  ? 'Late arrival deduction'
                  : undefined,
          },
          totalAmount,
          status,
        }

        // Add payment details if paid
        if (status === 'paid') {
          payrollData.paymentDetails = {
            paymentDate: new Date(period.year, parseInt(period.month) - 1, 28).toISOString(),
            paymentReference: `TXN-${Math.floor(Math.random() * 1000000)}`,
            paymentNotes: 'Payment processed successfully',
          }
          payrollData.processedAt = new Date(
            period.year,
            parseInt(period.month) - 1,
            28,
          ).toISOString()
        }

        const created = await payload.create({
          collection: 'payroll',
          data: payrollData,
        })
        payrolls.push(created)
      } catch (error) {
        console.error(
          `  ✗ Failed to create payroll for ${user.fullName} (${period.month}/${period.year}):`,
          error,
        )
      }
    }
    console.log(`  ✓ Created 3 months of payroll history for: ${user.fullName}`)
  }

  return payrolls
}

// Inventory - 30 items (laptops, phones, sim cards)
async function seedInventory(payload: Payload, users: any[]) {
  const laptopModels = [
    'MacBook Pro 16" M3 Pro',
    'MacBook Pro 14" M3',
    'MacBook Air 15" M2',
    'Dell XPS 15',
    'Lenovo ThinkPad X1 Carbon',
    'HP EliteBook 840',
    'ASUS ZenBook Pro',
  ]

  const phoneModels = [
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'Samsung Galaxy S24 Ultra',
    'Google Pixel 8 Pro',
    'OnePlus 12',
  ]

  const simCardProviders = ['Verizon', 'AT&T', 'T-Mobile', 'Vodafone', 'O2']

  const inventoryData = []

  // Assign laptops to first 15 users
  for (let i = 0; i < Math.min(15, users.length); i++) {
    inventoryData.push({
      itemType: 'laptop' as const,
      model: laptopModels[i % laptopModels.length],
      serialNumber: `LAPTOP-${String(i + 1).padStart(4, '0')}`,
      holder: users[i].id,
      status: 'inUse' as const,
      purchaseDate: new Date(2024, Math.floor(Math.random() * 10), 1).toISOString(),
      warrantyExpiry: new Date(2027, Math.floor(Math.random() * 12), 1).toISOString(),
      notes: `Assigned to ${users[i].fullName}`,
    })
  }

  // Assign phones to first 10 users
  for (let i = 0; i < Math.min(10, users.length); i++) {
    inventoryData.push({
      itemType: 'phone' as const,
      model: phoneModels[i % phoneModels.length],
      serialNumber: `PHONE-${String(i + 1).padStart(4, '0')}`,
      holder: users[i].id,
      status: 'inUse' as const,
      purchaseDate: new Date(2024, Math.floor(Math.random() * 10), 1).toISOString(),
      warrantyExpiry: new Date(2025, Math.floor(Math.random() * 12), 1).toISOString(),
      notes: `Work phone for ${users[i].fullName}`,
    })
  }

  // Assign SIM cards to random 5 users
  const simUsers = getRandomItems(users, 5)
  for (let i = 0; i < simUsers.length; i++) {
    inventoryData.push({
      itemType: 'simCard' as const,
      model: `${simCardProviders[i % simCardProviders.length]} SIM Card`,
      serialNumber: `SIM-${String(i + 1).padStart(4, '0')}`,
      holder: simUsers[i].id,
      status: 'inUse' as const,
      purchaseDate: new Date(2024, Math.floor(Math.random() * 10), 1).toISOString(),
      notes: `Active SIM for ${simUsers[i].fullName}`,
    })
  }

  // Create inventory items
  const inventory = []
  for (const item of inventoryData) {
    try {
      const created = await payload.create({
        collection: 'inventory',
        data: item,
      })
      inventory.push(created)
    } catch (error) {
      console.error(`  ✗ Failed to create inventory item:`, error)
    }
  }

  console.log(`  ✓ Created ${inventory.length} inventory items`)
  return inventory
}

// Leaves - Random leave days for users
async function seedLeaves(payload: Payload, users: any[]) {
  const leaveTypes: Array<'annual' | 'sick' | 'unpaid' | 'other'> = [
    'annual',
    'sick',
    'unpaid',
    'other',
  ]

  const leaveReasons = [
    'Family vacation',
    'Medical appointment',
    'Personal matters',
    'Wedding attendance',
    'Sick leave - flu',
    'Emergency family matter',
    'Mental health day',
    'Moving house',
    'Attending conference',
    'Religious holiday',
  ]

  const leaves = []

  // Create random leaves for each user (1-3 leaves per user)
  for (const user of users) {
    const numLeaves = Math.floor(Math.random() * 3) + 1 // 1-3 leaves

    for (let i = 0; i < numLeaves; i++) {
      try {
        // Random date in the past 6 months or next 3 months
        const monthOffset = Math.floor(Math.random() * 9) - 6 // -6 to +3 months
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() + monthOffset)
        startDate.setDate(Math.floor(Math.random() * 28) + 1)

        // Leave duration: 1-10 days
        const duration = Math.floor(Math.random() * 10) + 1
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + duration)

        // Status based on date
        const isPast = startDate < new Date()
        const status: 'approved' | 'rejected' | 'requested' = isPast
          ? (getRandomItem(['approved', 'approved', 'rejected']) as 'approved' | 'rejected')
          : (getRandomItem(['requested', 'approved']) as 'requested' | 'approved')

        const leaveData = {
          user: user.id,
          type: getRandomItem(leaveTypes),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status,
          reason: getRandomItem(leaveReasons),
          note:
            status === 'rejected'
              ? 'Insufficient notice period'
              : status === 'approved'
                ? 'Approved by manager'
                : undefined,
        }

        const created = await payload.create({
          collection: 'leave-days',
          data: leaveData,
        })
        leaves.push(created)
      } catch (error) {
        console.error(`  ✗ Failed to create leave for ${user.fullName}:`, error)
      }
    }
    console.log(`  ✓ Created ${numLeaves} leave records for: ${user.fullName}`)
  }

  return leaves
}
