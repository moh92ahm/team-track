# Access Control Model

## Overview

The system has a three-tier access control model:

1. **Super Admin** - System administrators with unrestricted access
2. **HR/Manager** - Dashboard access with management permissions
3. **Basic Employee** - Can only view and edit their own profile

---

## User Roles

### 1. Super Admin

**Created via:** `/admin` panel (PayloadCMS admin)  
**Access:** Everything, everywhere  
**Special:** Hidden from dashboard user list

**Capabilities:**

- ✅ Full access to all features
- ✅ Manage all users, payroll, leaves, inventory
- ✅ Create other super admins
- ✅ Access both `/admin` and dashboard
- ✅ Bypass all permission checks

**Use Case:** System administrators, IT staff, founders

---

### 2. HR Manager

**Created via:** `/admin` panel by super admin  
**Role Level:** `admin`  
**Access:** Dashboard with full management features

**Permissions:**

- ✅ View all users
- ✅ Create/edit/delete users
- ✅ Manage payroll for all employees
- ✅ View and approve all leave requests
- ✅ Manage inventory
- ✅ Create and manage departments
- ✅ Manage roles and permissions
- ✅ View reports and analytics

**Use Case:** HR department, office managers

---

### 3. Department Manager

**Created via:** `/admin` panel by HR or super admin  
**Role Level:** `manager`  
**Access:** Dashboard with department-level access

**Permissions:**

- ✅ View users in their department
- ✅ View payroll for their department
- ✅ View and approve leave requests for their department
- ✅ View inventory assigned to them
- ✅ View departments
- ✅ View reports

**Restrictions:**

- ❌ Cannot create/edit/delete users
- ❌ Cannot manage payroll
- ❌ Cannot manage inventory
- ❌ Cannot manage departments or roles

**Use Case:** Team leads, department heads

---

### 4. Basic Employee

**Created via:** `/admin` panel by HR or super admin  
**Role Level:** `employee`  
**Access:** Dashboard with view-only access to own profile

**Permissions:**

- ✅ View their own profile
- ✅ **Edit their own profile** (limited fields)
- ✅ View their own payroll
- ✅ Create leave requests
- ✅ View their own leave history
- ✅ View inventory assigned to them

**Restrictions:**

- ❌ Cannot view other users
- ❌ Cannot change their role
- ❌ Cannot change their department
- ❌ Cannot change their employment type
- ❌ Cannot change their active status
- ❌ Cannot change their join date
- ❌ Cannot approve leaves
- ❌ Cannot manage inventory

**Use Case:** Regular employees, field agents, sales reps

---

## What Basic Employees Can Edit

### ✅ Allowed to Edit (Own Profile):

- Full Name
- Photo
- Birth Date
- Primary Phone
- Secondary Phone
- Secondary Email
- Nationality
- Identification Number
- Work Permit Expiry
- Address
- Documents

### ❌ Not Allowed to Edit:

- Email (auth credential)
- Password (can change via auth flow)
- Role
- Departments
- Job Title
- Employment Type
- Is Active
- Joined At
- Is Super Admin

---

## Access Control Rules

### User Profile Access

| Action           | Super Admin | HR Manager | Dept Manager       | Basic Employee    |
| ---------------- | ----------- | ---------- | ------------------ | ----------------- |
| View all users   | ✅          | ✅         | 🟡 Department only | ❌                |
| View own profile | ✅          | ✅         | ✅                 | ✅                |
| Edit all users   | ✅          | ✅         | ❌                 | ❌                |
| Edit own profile | ✅          | ✅         | ✅                 | 🟡 Limited fields |
| Create users     | ✅          | ✅         | ❌                 | ❌                |
| Delete users     | ✅          | ✅         | ❌                 | ❌                |
| Change roles     | ✅          | ✅         | ❌                 | ❌                |

### Payroll Access

| Action              | Super Admin | HR Manager | Dept Manager       | Basic Employee |
| ------------------- | ----------- | ---------- | ------------------ | -------------- |
| View all payroll    | ✅          | ✅         | 🟡 Department only | ❌             |
| View own payroll    | ✅          | ✅         | ✅                 | ✅             |
| Create/edit payroll | ✅          | ✅         | ❌                 | ❌             |
| Manage settings     | ✅          | ✅         | ❌                 | ❌             |

### Leave Management

| Action               | Super Admin | HR Manager | Dept Manager       | Basic Employee |
| -------------------- | ----------- | ---------- | ------------------ | -------------- |
| View all leaves      | ✅          | ✅         | 🟡 Department only | ❌             |
| View own leaves      | ✅          | ✅         | ✅                 | ✅             |
| Create leave request | ✅          | ✅         | ✅                 | ✅             |
| Approve leaves       | ✅          | ✅         | 🟡 Department only | ❌             |
| Delete leaves        | ✅          | ✅         | ❌                 | ❌             |

### Inventory Access

| Action              | Super Admin | HR Manager | Dept Manager | Basic Employee |
| ------------------- | ----------- | ---------- | ------------ | -------------- |
| View all inventory  | ✅          | ✅         | ❌           | ❌             |
| View assigned items | ✅          | ✅         | ✅           | ✅             |
| Create/edit items   | ✅          | ✅         | ❌           | ❌             |
| Assign items        | ✅          | ✅         | ❌           | ❌             |
| Delete items        | ✅          | ✅         | ❌           | ❌             |

---

## Implementation Details

### Collection-Level Access

Defined in `/src/access/rbac.ts`:

- `canReadUsers` - Who can view user records
- `canCreateUsers` - Who can create users
- `canUpdateUsers` - Who can edit users
- `canDeleteUsers` - Who can delete users
- Similar functions for payroll, leaves, inventory

### Field-Level Access

Defined in `/src/collections/Users/index.ts`:

- `isSuperAdmin` - Only super admins can set
- `role` - Only HR/Managers can change
- `departments` - Only HR/Managers can change
- `employmentType` - Only HR/Managers can change
- `isActive` - Only HR/Managers can change
- `joinedAt` - Only HR/Managers can change

### Dashboard Filtering

- **Users List** (`/users`): Super admins are hidden
- **User Stats**: Super admins are excluded from counts
- **Department Views**: Managers see only their department

---

## Permission Flow

### When a Basic Employee Edits Their Profile:

1. User logs in → Dashboard authentication checks role
2. User navigates to profile → `canReadUsers` allows (own profile)
3. User clicks edit → `canUpdateUsers` allows (own profile)
4. User tries to edit fields:
   - ✅ Full Name → Allowed (no field-level restriction)
   - ✅ Phone → Allowed (no field-level restriction)
   - ❌ Role → Blocked (field-level access control)
   - ❌ Department → Blocked (field-level access control)
5. User saves → Changes applied only to allowed fields

### When HR Manager Edits Any User:

1. HR logs in → Dashboard authentication checks role
2. HR navigates to users list → `canReadUsers` allows (viewAll permission)
3. HR selects user → Profile loads
4. HR clicks edit → `canUpdateUsers` allows (edit permission)
5. HR edits any field → All fields allowed (has edit permission)
6. HR saves → All changes applied

---

## Best Practices

### Creating Users

1. Login to `/admin` as super admin or HR
2. Go to Users collection
3. Create user with appropriate role:
   - **HR Manager** for HR staff
   - **Department Manager** for team leads
   - **Sales Representative / Field Agent** for employees

### Managing Permissions

- Don't make everyone an admin!
- Use **HR Manager** role for actual HR staff only
- Use **Department Manager** for team leads who need to approve leaves
- Most employees should have **Basic Employee** role
- Keep super admins to 1-2 system administrators

### Security

- Regular employees cannot escalate their own privileges
- Only HR can change roles and departments
- Only super admins can create other super admins
- Field-level access prevents unauthorized changes

---

## Summary

**Three-tier model:**

1. **Super Admin** → Full system access (via `/admin`)
2. **HR/Manager** → Dashboard management access
3. **Basic Employee** → Own profile access only

**Basic employees:**

- ✅ Can edit their own profile (limited fields)
- ❌ Cannot change role, department, employment status
- ❌ Cannot view or edit other users

**HR/Managers:**

- ✅ Full dashboard access
- ✅ Can manage all users and resources
- ❌ Cannot access `/admin` settings (unless super admin)

This model ensures proper separation of concerns and data protection!
