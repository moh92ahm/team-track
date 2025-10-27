import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
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
      return
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
    await payload.create({
      collection: 'users',
      data: {
        fullName: 'System Administrator',
        email: 'admin@teamtrack.local',
        username: 'superadmin',
        password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2025!Change',
        role: superAdminRole.docs[0].id,
        jobTitle: 'System Administrator',
        departments: [],
        employmentType: 'other',
        isActive: true,
        joinedAt: new Date().toISOString(),
        birthDate: new Date('1990-01-01').toISOString(),
        primaryPhone: '+000000000000',
        // @ts-ignore - isSystemUser field
        isSystemUser: true,
      },
    })

    console.log('✅ Super admin created successfully!')
    console.log('📧 Email: admin@teamtrack.local')
    console.log('🔑 Password:', process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2025!Change')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
  } catch (error) {
    console.error('❌ Error creating super admin:', error)
    // Don't throw - we don't want to fail the entire migration
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  console.log('🗑️  Removing super admin user...')

  try {
    const superAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@teamtrack.local',
        },
      },
      limit: 1,
    })

    if (superAdmin.docs.length > 0) {
      await payload.delete({
        collection: 'users',
        id: superAdmin.docs[0].id,
      })
      console.log('✅ Super admin removed')
    }
  } catch (error) {
    console.error('❌ Error removing super admin:', error)
  }
}
