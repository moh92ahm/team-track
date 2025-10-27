import type { Payload } from 'payload'

/**
 * Seeds a super admin user that has full system access
 * This user will NOT appear in the regular users list
 */
export async function seedSuperAdmin(payload: Payload) {
  console.log('👑 Creating super admin user...')

  try {
    // Check if super admin already exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@teamtrack.local',
        },
      },
      limit: 1,
    })

    if (existingAdmin.docs.length > 0) {
      console.log('⚠️  Super admin already exists, skipping...')
      return existingAdmin.docs[0]
    }

    // Get or create Super Admin role
    let superAdminRole = await payload.find({
      collection: 'roles',
      where: {
        name: {
          equals: 'Super Admin',
        },
      },
      limit: 1,
    })

    if (superAdminRole.docs.length === 0) {
      console.log('📝 Creating Super Admin role...')
      const role = await payload.create({
        collection: 'roles',
        data: {
          name: 'Super Admin',
          description: 'System administrator with full access to all features',
          level: 'admin',
          permissions: {
            users: { viewAll: true, create: true, edit: true, delete: true },
            departments: { view: true, create: true, edit: true, delete: true },
            payroll: { viewAll: true, create: true, edit: true, delete: true, manageSettings: true },
            inventory: { viewAll: true, create: true, edit: true, assign: true, delete: true },
            leaves: { viewAll: true, create: true, approve: true, delete: true },
          },
        },
      })
      superAdminRole.docs = [role]
    }

    // Create super admin user
    const superAdmin = await payload.create({
      collection: 'users',
      data: {
        fullName: 'System Administrator',
        email: 'admin@teamtrack.local',
        username: 'superadmin',
        password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2025!Change', // Use env variable for security
        role: superAdminRole.docs[0].id,
        jobTitle: 'System Administrator',
        departments: [], // Not assigned to any department
        employmentType: 'other',
        isActive: true,
        joinedAt: new Date().toISOString(),
        birthDate: new Date('1990-01-01').toISOString(),
        primaryPhone: '+000000000000',
        // Mark this user as system user (we'll use this to filter them out)
        // @ts-ignore - Adding custom field
        isSystemUser: true,
      },
    })

    console.log('✅ Super admin created successfully!')
    console.log('📧 Email: admin@teamtrack.local')
    console.log('🔑 Password:', process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2025!Change')
    console.log('⚠️  IMPORTANT: Change the password after first login!')

    return superAdmin
  } catch (error) {
    console.error('❌ Error creating super admin:', error)
    throw error
  }
}
