import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'
import {
  hasPermission,
  canViewAll,
  canViewDepartment,
  canViewOwn,
  isHR,
  getUserDepartmentIds,
} from '@/lib/permissions'

/**
 * Users can read if:
 * - They have viewAll permission (HR)
 * - They have viewDepartment permission and the target is in their department
 * - They are viewing their own profile
 */
export const canReadUsers: Access = ({ req: { user } }) => {
  if (!user) return false

  // HR can view all
  if (canViewAll(user as User, 'users')) {
    return true
  }

  // Department managers can view their department
  if (canViewDepartment(user as User, 'users')) {
    const userDeptIds = getUserDepartmentIds(user as User)
    if (userDeptIds.length > 0) {
      return {
        departments: {
          in: userDeptIds,
        },
      }
    }
  }

  // Everyone can view their own profile
  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Only users with create permission can create users
 */
export const canCreateUsers: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'users', 'create')
}

/**
 * Only users with edit permission can update users
 */
export const canUpdateUsers: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'users', 'edit')
}

/**
 * Only users with delete permission can delete users
 */
export const canDeleteUsers: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'users', 'delete')
}

/**
 * Payroll read access:
 * - HR can view all
 * - Department managers can view their department
 * - Everyone can view their own
 */
export const canReadPayroll: Access = ({ req: { user } }) => {
  if (!user) return false

  // HR can view all
  if (canViewAll(user as User, 'payroll')) {
    return true
  }

  // Department managers can view their department
  if (canViewDepartment(user as User, 'payroll')) {
    const userDeptIds = getUserDepartmentIds(user as User)
    if (userDeptIds.length > 0) {
      return {
        'employee.departments': {
          in: userDeptIds,
        },
      }
    }
  }

  // Everyone can view their own
  if (canViewOwn(user as User, 'payroll')) {
    return {
      employee: {
        equals: user.id,
      },
    }
  }

  return false
}

/**
 * Payroll settings read access - similar to payroll
 */
export const canReadPayrollSettings: Access = ({ req: { user } }) => {
  if (!user) return false

  // HR can view all
  if (isHR(user as User)) {
    return true
  }

  // Everyone can view their own
  return {
    employee: {
      equals: user.id,
    },
  }
}

/**
 * Payroll create/edit access - only HR
 */
export const canManagePayroll: Access = ({ req: { user } }) => {
  if (!user) return false
  return (
    hasPermission(user as User, 'payroll', 'create') ||
    hasPermission(user as User, 'payroll', 'edit')
  )
}

/**
 * Leaves read access:
 * - HR can view all
 * - Department managers can view their department
 * - Everyone can view their own
 */
export const canReadLeaves: Access = ({ req: { user } }) => {
  if (!user) return false

  // HR can view all
  if (canViewAll(user as User, 'leaves')) {
    return true
  }

  // Department managers can view their department
  if (canViewDepartment(user as User, 'leaves')) {
    const userDeptIds = getUserDepartmentIds(user as User)
    if (userDeptIds.length > 0) {
      return {
        'user.departments': {
          in: userDeptIds,
        },
      }
    }
  }

  // Everyone can view their own
  if (canViewOwn(user as User, 'leaves')) {
    return {
      user: {
        equals: user.id,
      },
    }
  }

  return false
}

/**
 * Everyone can create leave requests
 */
export const canCreateLeaves: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'leaves', 'create')
}

/**
 * Only managers and HR can approve leaves
 */
export const canApproveLeaves: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'leaves', 'approve')
}

/**
 * Inventory read access:
 * - HR can view all
 * - Everyone can view their assigned items
 */
export const canReadInventory: Access = ({ req: { user } }) => {
  if (!user) return false

  // HR can view all
  if (canViewAll(user as User, 'inventory')) {
    return true
  }

  // Everyone can view their own assigned items
  if (canViewOwn(user as User, 'inventory')) {
    return {
      holder: {
        equals: user.id,
      },
    }
  }

  return false
}

/**
 * Only users with inventory permissions can manage
 */
export const canManageInventory: Access = ({ req: { user } }) => {
  if (!user) return false
  return (
    hasPermission(user as User, 'inventory', 'create') ||
    hasPermission(user as User, 'inventory', 'edit')
  )
}

/**
 * Departments - read access for those with permission
 */
export const canReadDepartments: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'departments', 'view') || isHR(user as User)
}

/**
 * Only HR can manage departments
 */
export const canManageDepartments: Access = ({ req: { user } }) => {
  if (!user) return false
  return (
    hasPermission(user as User, 'departments', 'create') ||
    hasPermission(user as User, 'departments', 'edit')
  )
}

/**
 * Roles - only HR can manage
 */
export const canManageRoles: Access = ({ req: { user } }) => {
  if (!user) return false
  return hasPermission(user as User, 'system', 'manageRoles') || isHR(user as User)
}
