import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Payload } from 'payload'

export async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data first (optional)
    // await clearDatabase(payload)

    // 1. Create Departments first
    console.log('📁 Creating departments...')
    const departments = await seedDepartments(payload)

    // 2. Create Roles
    console.log('👔 Creating roles...')
    const roles = await seedRoles(payload)

    // 3. Create Staff (depends on departments and roles)
    console.log('👥 Creating staff members...')
    const staff = await seedStaff(payload, departments, roles)

    // 4. Create Inventory (can reference staff as holders)
    console.log('💻 Creating inventory items...')
    await seedInventory(payload, staff)

    // 5. Create Leave records (depends on staff)
    console.log('🏖️ Creating leave records...')
    await seedLeaves(payload, staff)

    // 6. Create Payroll records (depends on staff)
    console.log('💰 Creating payroll records...')
    await seedPayroll(payload, staff)

    console.log('✅ Database seeding completed successfully!')
    return { success: true }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Optional: Clear existing data
async function clearDatabase(payload: any) {
  console.log('🧹 Clearing existing data...')

  const collections = ['payroll', 'leaves', 'inventory', 'staff', 'roles', 'departments']

  for (const collection of collections) {
    try {
      const existing = await payload.find({ collection, limit: 1000 })
      for (const item of existing.docs) {
        await payload.delete({ collection, id: item.id })
      }
      console.log(`  Cleared ${collection}`)
    } catch (error) {
      console.log(`  Skipped ${collection} (might not exist)`)
    }
  }
}

async function seedDepartments(payload: any) {
  const departmentsData = [
    {
      name: 'Engineering',
      description: 'Software development, infrastructure, and technical operations',
      isActive: true,
    },
    {
      name: 'Design',
      description: 'UI/UX design, product design, and creative services',
      isActive: true,
    },
    {
      name: 'Product',
      description: 'Product management and strategy',
      isActive: true,
    },
    {
      name: 'Marketing',
      description: 'Digital marketing, content, and brand management',
      isActive: true,
    },
    {
      name: 'Sales',
      description: 'Sales operations and business development',
      isActive: true,
    },
    {
      name: 'Human Resources',
      description: 'People operations, recruitment, and employee relations',
      isActive: true,
    },
    {
      name: 'Finance',
      description: 'Financial planning, accounting, and operations',
      isActive: true,
    },
    {
      name: 'Customer Success',
      description: 'Customer support and success management',
      isActive: true,
    },
  ]

  const departments = []
  for (const deptData of departmentsData) {
    try {
      const department = await payload.create({
        collection: 'departments',
        data: deptData,
      })
      departments.push(department)
      console.log(`  ✓ Created department: ${deptData.name}`)
    } catch (error) {
      console.error(`  ✗ Failed to create department ${deptData.name}:`, error)
    }
  }

  return departments
}

async function seedRoles(payload: any) {
  const rolesData = [
    // Engineering roles
    { name: 'Junior Developer', level: 'junior', department: 'Engineering', isActive: true },
    { name: 'Software Developer', level: 'mid', department: 'Engineering', isActive: true },
    { name: 'Senior Developer', level: 'senior', department: 'Engineering', isActive: true },
    { name: 'Tech Lead', level: 'lead', department: 'Engineering', isActive: true },
    { name: 'Engineering Manager', level: 'manager', department: 'Engineering', isActive: true },

    // Design roles
    { name: 'UI Designer', level: 'mid', department: 'Design', isActive: true },
    { name: 'UX Designer', level: 'mid', department: 'Design', isActive: true },
    { name: 'Senior Designer', level: 'senior', department: 'Design', isActive: true },
    { name: 'Design Lead', level: 'lead', department: 'Design', isActive: true },

    // Product roles
    { name: 'Product Manager', level: 'mid', department: 'Product', isActive: true },
    { name: 'Senior Product Manager', level: 'senior', department: 'Product', isActive: true },
    { name: 'Product Lead', level: 'lead', department: 'Product', isActive: true },

    // Other roles
    { name: 'Marketing Specialist', level: 'mid', department: 'Marketing', isActive: true },
    { name: 'Sales Representative', level: 'mid', department: 'Sales', isActive: true },
    { name: 'HR Specialist', level: 'mid', department: 'Human Resources', isActive: true },
    { name: 'Accountant', level: 'mid', department: 'Finance', isActive: true },
    {
      name: 'Customer Success Manager',
      level: 'mid',
      department: 'Customer Success',
      isActive: true,
    },
  ]

  const roles = []
  for (const roleData of rolesData) {
    try {
      const role = await payload.create({
        collection: 'roles',
        data: roleData,
      })
      roles.push(role)
      console.log(`  ✓ Created role: ${roleData.name}`)
    } catch (error) {
      console.error(`  ✗ Failed to create role ${roleData.name}:`, error)
    }
  }

  return roles
}

async function seedStaff(payload: any, departments: any[], roles: any[]) {
  // Helper function to find department/role by name
  const findDept = (name: string) => departments.find((d) => d.name === name)?.id
  const findRole = (name: string) => roles.find((r) => r.name === name)?.id

  const staffData = [
    // Engineering Team
    {
      fullName: 'Alex Johnson',
      workEmail: 'alex.johnson@teamtrack.com',
      contactEmail: 'alex.personal@gmail.com',
      personalPhone: '+1-555-0101',
      workPhone: '+1-555-0102',
      jobTitle: 'Senior Software Engineer',
      department: findDept('Engineering'),
      role: findRole('Senior Developer'),
      birthDate: '1990-03-15',
      joinedAt: '2023-01-15T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },
    {
      fullName: 'Sarah Chen',
      workEmail: 'sarah.chen@teamtrack.com',
      contactEmail: 'sarah.personal@gmail.com',
      personalPhone: '+1-555-0103',
      workPhone: '+1-555-0104',
      jobTitle: 'Frontend Developer',
      department: findDept('Engineering'),
      role: findRole('Software Developer'),
      birthDate: '1992-07-22',
      joinedAt: '2023-02-01T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },
    {
      fullName: 'Michael Rodriguez',
      workEmail: 'michael.rodriguez@teamtrack.com',
      contactEmail: 'mike.personal@gmail.com',
      personalPhone: '+1-555-0105',
      workPhone: '+1-555-0106',
      jobTitle: 'Engineering Manager',
      department: findDept('Engineering'),
      role: findRole('Engineering Manager'),
      birthDate: '1988-11-10',
      joinedAt: '2022-08-15T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },

    // Design Team
    {
      fullName: 'Emma Thompson',
      workEmail: 'emma.thompson@teamtrack.com',
      contactEmail: 'emma.personal@gmail.com',
      personalPhone: '+1-555-0107',
      workPhone: '+1-555-0108',
      jobTitle: 'Senior UX Designer',
      department: findDept('Design'),
      role: findRole('Senior Designer'),
      birthDate: '1989-05-18',
      joinedAt: '2023-03-01T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },
    {
      fullName: 'David Kim',
      workEmail: 'david.kim@teamtrack.com',
      contactEmail: 'david.personal@gmail.com',
      personalPhone: '+1-555-0109',
      workPhone: '+1-555-0110',
      jobTitle: 'UI Designer',
      department: findDept('Design'),
      role: findRole('UI Designer'),
      birthDate: '1993-09-25',
      joinedAt: '2023-04-15T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },

    // Product Team
    {
      fullName: 'Lisa Wang',
      workEmail: 'lisa.wang@teamtrack.com',
      contactEmail: 'lisa.personal@gmail.com',
      personalPhone: '+1-555-0111',
      workPhone: '+1-555-0112',
      jobTitle: 'Product Manager',
      department: findDept('Product'),
      role: findRole('Product Manager'),
      birthDate: '1987-12-08',
      joinedAt: '2022-11-01T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },

    // Marketing
    {
      fullName: 'James Wilson',
      workEmail: 'james.wilson@teamtrack.com',
      contactEmail: 'james.personal@gmail.com',
      personalPhone: '+1-555-0113',
      workPhone: '+1-555-0114',
      jobTitle: 'Marketing Specialist',
      department: findDept('Marketing'),
      role: findRole('Marketing Specialist'),
      birthDate: '1991-04-12',
      joinedAt: '2023-05-01T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },

    // HR
    {
      fullName: 'Maria Garcia',
      workEmail: 'maria.garcia@teamtrack.com',
      contactEmail: 'maria.personal@gmail.com',
      personalPhone: '+1-555-0115',
      workPhone: '+1-555-0116',
      jobTitle: 'HR Specialist',
      department: findDept('Human Resources'),
      role: findRole('HR Specialist'),
      birthDate: '1986-08-30',
      joinedAt: '2022-09-15T09:00:00.000Z',
      workEmailPassword: 'TempPass123!',
      isActive: true,
    },
  ]

  const staff = []
  for (const staffMember of staffData) {
    try {
      const created = await payload.create({
        collection: 'staff',
        data: staffMember,
      })
      staff.push(created)
      console.log(`  ✓ Created staff: ${staffMember.fullName}`)
    } catch (error) {
      console.error(`  ✗ Failed to create staff ${staffMember.fullName}:`, error)
    }
  }

  return staff
}

async function seedInventory(payload: Payload, staff: any[]) {
  const inventoryData: {
    itemType: 'laptop' | 'phone' | 'accessory' | 'simCard' | 'other'
    model: string
    serialNumber: string
    status: 'inUse' | 'inStock' | 'needsRepair'
    holder?: string | undefined
    purchaseDate: string
    warrantyExpiry?: string
  }[] = [
    // Laptops
    {
      itemType: 'laptop',
      model: 'MacBook Pro 16" M3',
      serialNumber: 'MBP16-001',
      status: 'inUse' as const,
      holder: staff[0]?.id, // Alex Johnson
      purchaseDate: '2024-01-15',
      warrantyExpiry: '2027-01-15',
    },
    {
      itemType: 'laptop' as const,
      model: 'MacBook Air 13" M2',
      serialNumber: 'MBA13-001',
      status: 'inUse' as const,
      holder: staff[1]?.id, // Sarah Chen
      purchaseDate: '2024-02-01',
      warrantyExpiry: '2027-02-01',
    },
    {
      itemType: 'laptop' as const,
      model: 'Dell XPS 15',
      serialNumber: 'XPS15-001',
      status: 'inUse' as const,
      holder: staff[2]?.id, // Michael Rodriguez
      purchaseDate: '2024-01-20',
      warrantyExpiry: '2027-01-20',
    },

    // Accessories (Monitors, Keyboards, etc.)
    {
      itemType: 'accessory' as const,
      model: 'Dell UltraSharp 27" 4K Monitor',
      serialNumber: 'DEL27-001',
      status: 'inUse' as const,
      holder: staff[0]?.id, // Alex Johnson
      purchaseDate: '2024-01-15',
      warrantyExpiry: '2027-01-15',
    },
    {
      itemType: 'accessory' as const,
      model: 'LG 24" Full HD Monitor',
      serialNumber: 'LG24-001',
      status: 'inUse' as const,
      holder: staff[1]?.id, // Sarah Chen
      purchaseDate: '2024-02-01',
      warrantyExpiry: '2027-02-01',
    },
    {
      itemType: 'accessory' as const,
      model: 'Samsung 32" Curved Monitor',
      serialNumber: 'SAM32-001',
      status: 'inUse' as const,
      holder: staff[3]?.id, // Emma Thompson
      purchaseDate: '2024-03-01',
      warrantyExpiry: '2027-03-01',
    },

    // Keyboards & Mice
    {
      itemType: 'accessory' as const,
      model: 'Apple Magic Keyboard',
      serialNumber: 'AMK-001',
      status: 'inUse' as const,
      holder: staff[0]?.id,
      purchaseDate: '2024-01-15',
    },
    {
      itemType: 'accessory' as const,
      model: 'Logitech MX Master 3 Mouse',
      serialNumber: 'LMX3-001',
      status: 'inUse' as const,
      holder: staff[0]?.id,
      purchaseDate: '2024-01-15',
    },

    // Phones
    {
      itemType: 'phone' as const,
      model: 'iPhone 15 Pro',
      serialNumber: 'IP15P-001',
      status: 'inUse' as const,
      holder: staff[2]?.id, // Michael Rodriguez (Manager)
      purchaseDate: '2024-01-10',
      warrantyExpiry: '2025-01-10',
    },
    {
      itemType: 'phone' as const,
      model: 'Samsung Galaxy S24',
      serialNumber: 'SGS24-001',
      status: 'inUse' as const,
      holder: staff[5]?.id, // Lisa Wang (Product Manager)
      purchaseDate: '2024-02-15',
      warrantyExpiry: '2025-02-15',
    },

    // Available Items
    {
      itemType: 'laptop' as const,
      model: 'MacBook Air 13" M2',
      serialNumber: 'MBA13-002',
      status: 'inStock' as const,
      purchaseDate: '2024-03-15',
      warrantyExpiry: '2027-03-15',
    },
    {
      itemType: 'accessory' as const,
      model: 'Logitech Mechanical Keyboard',
      serialNumber: 'LMK-001',
      status: 'inStock' as const,
      purchaseDate: '2024-02-20',
    },

    // Items needing repair
    {
      itemType: 'laptop' as const,
      model: 'MacBook Pro 14" M1',
      serialNumber: 'MBP14-001',
      status: 'needsRepair' as const,
      purchaseDate: '2023-06-15',
      warrantyExpiry: '2026-06-15',
    },
  ]

  const inventory = []
  for (const item of inventoryData) {
    try {
      const created = await payload.create({
        collection: 'inventory',
        data: item as any,
      })
      inventory.push(created)
      console.log(`  ✓ Created inventory: ${item.itemType} - ${item.model}`)
    } catch (error) {
      console.error(`  ✗ Failed to create inventory item:`, error)
    }
  }

  return inventory
}

async function seedLeaves(payload: Payload, staff: any[]) {
  const leavesData = [
    // Past approved leaves
    {
      user: staff[0]?.id, // Alex Johnson
      type: 'annual' as const,
      startDate: '2024-08-15',
      endDate: '2024-08-25',
      status: 'approved' as const,
      reason: 'Summer vacation with family',
    },
    {
      user: staff[1]?.id, // Sarah Chen
      type: 'sick' as const,
      startDate: '2024-09-05',
      endDate: '2024-09-06',
      status: 'approved' as const,
      reason: 'Medical appointment and recovery',
    },
    {
      user: staff[3]?.id, // Emma Thompson
      type: 'other' as const,
      startDate: '2024-07-20',
      endDate: '2024-07-22',
      status: 'approved' as const,
      reason: 'Wedding attendance',
    },

    // Pending leaves
    {
      user: staff[4]?.id, // David Kim
      type: 'annual' as const,
      startDate: '2024-12-20',
      endDate: '2024-12-30',
      status: 'requested' as const,
      reason: 'Holiday vacation',
    },
    {
      user: staff[6]?.id, // James Wilson
      type: 'other' as const,
      startDate: '2024-11-15',
      endDate: '2024-11-15',
      status: 'requested' as const,
      reason: 'Personal matter',
    },

    // Rejected leave (example)
    {
      user: staff[5]?.id, // Lisa Wang
      type: 'annual' as const,
      startDate: '2024-11-01',
      endDate: '2024-11-05',
      status: 'rejected' as const,
      reason: 'Product launch week',
    },

    // Future approved leaves
    {
      user: staff[7]?.id, // Maria Garcia
      type: 'other' as const,
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      status: 'approved' as const,
      reason: 'Maternity leave',
    },
  ]

  const leaves = []
  for (const leave of leavesData) {
    try {
      const created = await payload.create({
        collection: 'leave-days',
        data: leave,
      })
      leaves.push(created)
      console.log(`  ✓ Created leave: ${leave.type} for staff ${leave.user}`)
    } catch (error) {
      console.error(`  ✗ Failed to create leave:`, error)
    }
  }

  return leaves
}

async function seedPayroll(payload: Payload, staff: any[]) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'] // Up to October

  const payrollData = []

  // Generate payroll for each staff member for the past months
  for (const staffMember of staff) {
    for (const month of months) {
      payrollData.push({
        employee: staffMember.id,
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
          year: currentYear,
        },
        workDays: {
          totalWorkingDays: 22,
          daysWorked: Math.floor(Math.random() * 3) + 20, // 20-22 days
          leaveDays: Math.floor(Math.random() * 3), // 0-2 leave days
        },
        adjustments: {
          bonusAmount:
            month === '06' || month === '12' ? Math.floor(Math.random() * 1000) + 500 : 0, // Bonuses in June/Dec
          deductionAmount: Math.random() > 0.8 ? Math.floor(Math.random() * 200) + 50 : 0, // Occasional deductions
          overtimePay: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 100 : 0, // Occasional overtime
        },
        status: months.indexOf(month) < 8 ? ('approved' as const) : ('generated' as const), // Older months approved, recent ones generated
      })
    }
  }

  const payrolls = []
  for (const payroll of payrollData) {
    try {
      const created = await payload.create({
        collection: 'payroll',
        data: payroll,
      })
      payrolls.push(created)
      console.log(
        `  ✓ Created payroll: ${payroll.period.month}/${payroll.period.year} for employee ${payroll.employee}`,
      )
    } catch (error) {
      console.error(`  ✗ Failed to create payroll:`, error)
    }
  }

  return payrolls
}
