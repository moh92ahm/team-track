# Super Admin Feature

## Overview

Super admins are special users who:

- ✅ Have full access to **everything** in the system
- ✅ Bypass all role-based permissions
- ✅ Are **hidden** from the dashboard user list
- ✅ Don't count toward user statistics
- ✅ Can only be created/managed through the **PayloadCMS admin panel** (`/admin`)

## Creating a Super Admin

### Option 1: During First User Creation

When you first deploy your app and visit `/admin`, you'll create your first user. To make them a super admin:

1. Visit: `https://your-app.vercel.app/admin` (or `http://localhost:3000/admin` locally)
2. Fill in the user creation form
3. In the sidebar, check **"isSuperAdmin"** checkbox
4. Click Create

### Option 2: Convert Existing User

1. Login to the PayloadCMS admin panel at `/admin`
2. Go to Users collection
3. Edit any user
4. In the sidebar, check **"isSuperAdmin"** checkbox
5. Click Save

### Option 3: Create New Super Admin

1. Login to the PayloadCMS admin panel at `/admin` as a super admin
2. Go to Users collection
3. Click "Create New"
4. Fill in required fields:
   - Email
   - Password
   - Full Name
   - _(birthDate and primaryPhone are optional for super admins)_
5. In the sidebar, check **"isSuperAdmin"** checkbox
6. Click Create

## Important Notes

### Where Super Admins Can Be Managed

**✅ Can be managed in:**

- PayloadCMS admin panel (`/admin`)

**❌ Cannot be managed in:**

- Custom dashboard (`/users` page)
- Super admins are completely hidden from the dashboard

### Required Fields

For super admins, the following fields are **optional**:

- Birth Date
- Primary Phone

All other user fields work normally.

### Security

**Only existing super admins can create new super admins!**

The `isSuperAdmin` checkbox is only visible and editable by users who are already super admins. Regular users (even with admin roles) cannot:

- See the isSuperAdmin field
- Toggle super admin status
- Create super admins

This prevents privilege escalation.

## Permissions

Super admins have **full access** to:

### Users

- ✅ View all users (including those in other departments)
- ✅ Create new users
- ✅ Edit any user
- ✅ Delete any user

### Payroll

- ✅ View all payroll records
- ✅ Create payroll entries
- ✅ Edit payroll entries
- ✅ Delete payroll entries
- ✅ Manage payroll settings

### Leaves

- ✅ View all leave requests
- ✅ Create leave requests
- ✅ Approve/reject leave requests
- ✅ Delete leave requests

### Inventory

- ✅ View all inventory items
- ✅ Create inventory items
- ✅ Edit inventory items
- ✅ Assign inventory items
- ✅ Delete inventory items

### Departments & Roles

- ✅ View all departments
- ✅ Create departments
- ✅ Edit departments
- ✅ Delete departments
- ✅ Manage roles

## Dashboard Behavior

### User List (`/users`)

Super admins **do not appear** in the dashboard user list. This keeps them separate from regular team members.

### User Statistics

Super admins are **excluded** from dashboard statistics:

- Total users count
- Active/Inactive counts
- Department distributions

### Why?

Super admins are system administrators, not team members. Hiding them from the dashboard keeps the employee management interface clean and focused on actual employees.

## Access Methods

### Login to Dashboard (`/login`)

Super admins can login through the regular dashboard login page and will have full access to all features.

### Login to Admin Panel (`/admin`)

Super admins can also login directly to the PayloadCMS admin panel for advanced configuration and user management.

## Use Cases

### Primary Use Case

Create one or two super admin accounts for:

- System administrators
- IT staff
- Founders/owners who need unrestricted access

### Regular Admins vs Super Admins

| Feature              | Regular Admin (with role)     | Super Admin                   |
| -------------------- | ----------------------------- | ----------------------------- |
| Access control       | Based on role permissions     | Full access to everything     |
| Visible in dashboard | ✅ Yes                        | ❌ No (hidden)                |
| Counts in statistics | ✅ Yes                        | ❌ No                         |
| Can be edited by HR  | ✅ Yes                        | ⚠️ Only by other super admins |
| Best for             | Department heads, HR managers | System administrators         |

## Example Scenario

1. **Initial Setup:**
   - Deploy app to Vercel
   - Visit `/admin` and create first user
   - Check "isSuperAdmin" to make yourself a super admin
2. **Create Team Structure:**
   - As super admin, create departments and roles
   - Create regular admin user for HR (don't check isSuperAdmin)
   - Give HR admin appropriate permissions via role
3. **Day-to-Day Operations:**
   - HR admin manages employees via dashboard
   - Super admin can intervene if needed
   - Super admin remains hidden from employee list

## Troubleshooting

### Can't see "isSuperAdmin" checkbox

**Reason:** You're not logged in as a super admin.  
**Solution:** Only super admins can create other super admins. If this is your first user, make sure to check the box during initial setup.

### Super admin appears in dashboard

**Reason:** The filtering might not be working.  
**Solution:** Check that `isSuperAdmin` is set to `true` in the PayloadCMS admin panel. The dashboard filters out users where `isSuperAdmin !== true`.

### Need to create first super admin after deployment

**Reason:** Forgot to check the box during first user creation.  
**Solution:**

1. Login to `/admin` with your existing account
2. Go to Users
3. Edit your user
4. Check "isSuperAdmin"
5. Save

Unfortunately, if you're not the first user and no super admin exists, you'll need database access:

```sql
UPDATE users
SET "isSuperAdmin" = true
WHERE email = 'your-email@example.com';
```

## Summary

✅ **Super admins = System administrators**  
✅ **Created via `/admin` panel**  
✅ **Hidden from dashboard**  
✅ **Full access to everything**  
✅ **Only super admins can create other super admins**

For regular employee management, use roles and departments!
