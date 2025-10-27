# Role-Based Access Control (RBAC) System Documentation

## Overview

This document explains how the RBAC system is implemented in the TeamTrack application for your medical agency.

## System Architecture

### 1. **Collections**

#### **Roles Collection** (`src/collections/Roles/index.ts`)

Defines user roles with specific permissions.

**Fields:**

- `name`: Role name (e.g., "HR Manager", "Department Manager", "Sales Representative")
- `level`: Permission level (admin, manager, employee, restricted)
- `description`: Role description
- `permissions`: Nested permissions object containing:
  - **users**: View, create, edit, delete users
  - **payroll**: Manage payroll records and settings
  - **leaves**: View, create, approve leaves
  - **inventory**: Manage inventory items
  - **departments**: Manage departments
  - **system**: System-level settings and reports

#### **Departments Collection** (`src/collections/Departments/index.ts`)

Defines organizational departments using a **multi-dimensional structure**.

**Fields:**

- `name`: Department name (e.g., "Sales", "English", "HR", "Turkish")
- `category`: Department category - either "functional" or "language"
  - **Functional**: Sales, Field, Marketing, Transfer, HR, Dental, etc.
  - **Language**: English, Turkish, Arabic, Russian, French, German, Spanish, Persian
- `functionalType`: Type of functional department (only for functional category)
- `languageCode`: Language code like 'en', 'tr', 'ar' (only for language category)
- `description`: Department description
- `manager`: User who manages this department (typically for functional departments)
- `isActive`: Whether department is active

**Key Concept**: Departments act as "tags" that can be combined. A user can belong to multiple departments simultaneously.

#### **Users Collection**

Each user has:

- `departments`: **Array** of relationships to Departments (can have multiple)
- `role`: Relationship to Roles

**Examples:**

- Sales Rep: `departments: [Sales, Turkish]`
- Multi-lingual Agent: `departments: [Field, English, Russian]`
- HR Manager: `departments: [Human Resources]`

### 2. **Your Medical Agency Structure**

The new structure uses **two separate dimensions** that can be combined:

#### **Functional Departments** (What they do)

```
Medical Agency - Functional Departments
├── Sales
├── Field
├── Marketing
├── Transfer
├── Human Resources (HR)
└── Dental Clinic
    ├── Dental Clinic - Doctors
    └── Dental Clinic - Assistants
```

#### **Language Departments** (What languages they work in)

```
Language Departments
├── English
├── Turkish
├── Arabic
├── Russian
├── French
├── German
├── Spanish
└── Persian (Farsi)
```

#### **How Users Are Assigned**

Users can belong to **multiple departments** from both dimensions:

**Examples:**

- **Ahmad** (Sales Rep): `Sales` + `Turkish` + `English`
- **Maria** (Field Agent): `Field` + `English`
- **Dr. Ali** (Doctor): `Dental Clinic - Doctors`
- **Sarah** (HR Manager): `Human Resources` (no language needed)
- **Omar** (Multi-lingual Field Agent): `Field` + `English` + `Turkish`

**Benefits:**

- ✅ Flexible assignment of multi-lingual staff
- ✅ Clear separation between function and language
- ✅ Easy to add new languages without restructuring
- ✅ Can report by function OR language OR both

### 3. **Role Levels**

1. **Admin Level (HR)** - Full system access
   - HR Manager role
   - Can access everything in the system
   - Can manage users, payroll, leaves, inventory, departments, and roles

2. **Manager Level** - Department-level access
   - Department Manager role
   - Can view their department's data
   - Can approve leaves for their department
   - Cannot create or edit users

3. **Employee Level** - Limited access
   - Sales Representative, Field Agent, Doctor, Marketing Specialist roles
   - Can only view their own data
   - Can create leave requests
   - Cannot view other users' data

4. **Restricted Level** - View-only access
   - Future use for very limited access

### 4. **Permission Matrix**

| Resource         | HR Manager | Department Manager | Employee |
| ---------------- | ---------- | ------------------ | -------- |
| **Users**        |
| View All         | ✅         | ❌                 | ❌       |
| View Department  | ✅         | ✅                 | ❌       |
| View Own Profile | ✅         | ✅                 | ✅       |
| Create Users     | ✅         | ❌                 | ❌       |
| Edit Users       | ✅         | ❌                 | ❌       |
| Delete Users     | ✅         | ❌                 | ❌       |
| **Payroll**      |
| View All         | ✅         | ❌                 | ❌       |
| View Department  | ✅         | ✅                 | ❌       |
| View Own         | ✅         | ✅                 | ✅       |
| Create/Edit      | ✅         | ❌                 | ❌       |
| Manage Settings  | ✅         | ❌                 | ❌       |
| **Leaves**       |
| View All         | ✅         | ❌                 | ❌       |
| View Department  | ✅         | ✅                 | ❌       |
| View Own         | ✅         | ✅                 | ✅       |
| Create Requests  | ✅         | ✅                 | ✅       |
| Approve Leaves   | ✅         | ✅                 | ❌       |
| **Inventory**    |
| View All         | ✅         | ❌                 | ❌       |
| View Own Items   | ✅         | ✅                 | ✅       |
| Create/Assign    | ✅         | ❌                 | ❌       |
| **Departments**  |
| View             | ✅         | ✅                 | ❌       |
| Create/Edit      | ✅         | ❌                 | ❌       |
| **System**       |
| Manage Roles     | ✅         | ❌                 | ❌       |
| View Reports     | ✅         | ✅                 | ❌       |
| System Settings  | ✅         | ❌                 | ❌       |

### 5. **How to Use**

#### **Step 1: Set Up Departments**

Run the seed script to create all departments:

```bash
pnpm run payload seed
```

This will create:

**Functional Departments (7 total):**

- Sales
- Field
- Marketing
- Transfer
- Human Resources
- Dental Clinic - Doctors
- Dental Clinic - Assistants

**Language Departments (8 total):**

- English, Turkish, Arabic, Russian, French, German, Spanish, Persian

**Total: 15 departments** that can be mixed and matched

#### **Step 2: Set Up Roles**

The seed script also creates default roles:

- HR Manager
- Department Manager
- Sales Representative
- Field Agent
- Doctor
- Marketing Specialist

#### **Step 3: Assign Users**

When creating/editing a user:

1. Select their **Functional Department** (e.g., "Sales", "Field", "Marketing")
2. Select their **Language Department(s)** if applicable (e.g., "English", "Turkish")
   - **Note**: You can select multiple languages for multi-lingual staff
3. Select their **Role** (e.g., "Sales Representative")
4. Save the user

**Example Assignment:**

```
User: Ahmad Khan
Departments: Sales, Turkish, English (multi-select)
Role: Sales Representative
Result: Ahmad works in Sales and can handle both Turkish and English clients
```

The user will automatically inherit all permissions from their role.

#### **Step 4: Assign Department Managers**

Department managers are typically assigned to **functional departments**:

1. Go to Departments collection
2. Edit a **functional** department (e.g., "Sales", "Field", "Marketing")
3. Select a user as the `manager`
4. Make sure that user has the "Department Manager" role
5. Make sure the manager also has that department in their `departments` array

**Example:**

```
Department: Sales
Manager: Sarah Johnson
Sarah's Departments: Sales (must include Sales)
Sarah's Role: Department Manager
Result: Sarah can manage all users who have "Sales" in their departments
```

**For Language Coordinators:**
You can also assign managers to language departments:

```
Department: English
Manager: Elena Smith
Elena's Departments: English
Elena's Role: Department Manager
Result: Elena can manage all English-speaking staff across all functions
```

### 6. **Permission Helper Functions**

Use these functions in your code (`src/lib/permissions.ts`):

```typescript
import {
  hasPermission,
  canViewAll,
  isHR,
  getUserDepartmentIds,
  shareDepartment,
} from '@/lib/permissions'

// Check specific permission
if (hasPermission(user, 'users', 'create')) {
  // User can create users
}

// Check if user can view all of a resource
if (canViewAll(user, 'payroll')) {
  // User can view all payroll records
}

// Check if user is HR
if (isHR(user)) {
  // User has admin access
}

// Get user's department IDs (returns array)
const deptIds = getUserDepartmentIds(user)
// Returns: [1, 5, 8] (Sales, Turkish, English)

// Check if two users share any department
if (shareDepartment(currentUser, targetUser)) {
  // They share at least one department
}
```

### 7. **Access Control Functions**

Apply to collections (`src/access/rbac.ts`):

```typescript
import { canReadUsers, canCreateUsers } from '@/access/rbac'

// In collection config
access: {
  read: canReadUsers,
  create: canCreateUsers,
  update: canUpdateUsers,
  delete: canDeleteUsers,
}
```

### 8. **Common Scenarios**

#### **Scenario 1: Employee views their profile**

- **User**: John (Sales Representative)
- **Departments**: `Sales`, `English`
- **Access**: ✅ Can view own profile
- **Restriction**: ❌ Cannot view other users

#### **Scenario 2: Functional Department Manager**

- **User**: Sarah (Department Manager)
- **Departments**: `Sales`
- **Access**: ✅ Can view all users who have `Sales` in their departments
- **Can See**:
  - Ahmad (`Sales`, `Turkish`)
  - John (`Sales`, `English`)
  - Maria (`Sales`, `Spanish`)
- **Action**: ✅ Can approve/reject leave requests for all Sales staff
- **Restriction**: ❌ Cannot view Field or Marketing staff

#### **Scenario 3: Language Coordinator**

- **User**: Elena (Department Manager)
- **Departments**: `English`
- **Access**: ✅ Can view all users who have `English` in their departments
- **Can See**:
  - John (`Sales`, `English`)
  - Tom (`Field`, `English`)
  - Lisa (`Marketing`, `English`)
- **Action**: ✅ Can approve leaves for all English-speaking staff
- **Benefit**: Manages language-specific concerns across all departments

#### **Scenario 4: Multi-lingual Field Agent**

- **User**: Omar (Field Agent)
- **Departments**: `Field`, `Arabic`, `English`, `Turkish`
- **Access**: ✅ Can view own profile and payroll
- **Can Create**: ✅ Leave requests
- **Restriction**: ❌ Cannot view other users
- **Benefit**: Can be assigned to clients speaking any of these three languages

#### **Scenario 5: HR manages everything**

- **User**: Ahmed (HR Manager)
- **Departments**: `Human Resources`
- **Access**: ✅ Can view all users across all departments
- **Action**: ✅ Can create, edit, delete users
- **Action**: ✅ Can manage payroll for everyone
- **Action**: ✅ Can approve any leave request
- **Benefit**: Full system access regardless of departments

### 9. **Future Enhancements**

You can extend this system by:

1. **Adding more permissions**:
   - Financial reports access
   - Patient data access (for dental clinic)
   - Transfer coordination permissions

2. **Adding more roles**:
   - "Senior Sales Representative" with some manager permissions
   - "Clinic Manager" for dental clinic
   - "Transfer Coordinator" with specific transfer permissions

3. **Adding role inheritance**:
   - Define parent roles that inherit permissions

4. **Adding time-based permissions**:
   - Temporary elevated access for specific periods

### 10. **Testing the System**

#### **Test 1: HR User**

```
Create User:
- Name: Ahmed Hassan
- Role: HR Manager
- Departments: Human Resources

Expected Results:
✅ Can access all users across all departments
✅ Can create, edit, delete any user
✅ Can manage payroll for everyone
✅ Can approve any leave request
```

#### **Test 2: Functional Department Manager**

```
Create User:
- Name: Sarah Johnson
- Role: Department Manager
- Departments: Sales

Expected Results:
✅ Can view all users with "Sales" in their departments
✅ Can approve leaves for Sales staff
❌ Cannot view Field or Marketing staff
❌ Cannot create or edit users
```

#### **Test 3: Language Coordinator**

```
Create User:
- Name: Elena Rodriguez
- Role: Department Manager
- Departments: English

Expected Results:
✅ Can view all users with "English" in their departments
✅ Can see English speakers from Sales, Field, Marketing, etc.
✅ Can approve leaves for all English-speaking staff
❌ Cannot view non-English speakers
```

#### **Test 4: Multi-lingual Employee**

```
Create User:
- Name: Ahmad Khan
- Role: Sales Representative
- Departments: Sales, Turkish, English

Expected Results:
✅ Can view own profile and payroll
✅ Can create leave requests
❌ Cannot view other users
✅ Visible to: Sales Manager AND Turkish Coordinator AND English Coordinator
```

#### **Test 5: Single-language Employee**

```
Create User:
- Name: Maria Lopez
- Role: Field Agent
- Departments: Field, Spanish

Expected Results:
✅ Can view own profile and payroll
✅ Can create leave requests
❌ Cannot view other users
✅ Visible to: Field Manager AND Spanish Coordinator
```

## Summary

This RBAC system provides:

- ✅ **Multi-dimensional department structure** - Users can belong to both functional (Sales, Field) and language (English, Turkish) departments
- ✅ **Flexible staff assignment** - Multi-lingual staff can have multiple language departments
- ✅ **Clear separation** - Function and language are separate concerns that can be combined
- ✅ **Role-based permissions** - Easy to understand and configure
- ✅ **Multiple management levels** - HR manages all, functional managers manage by department, language coordinators manage by language
- ✅ **Scalable** - Easy to add new languages without restructuring functional departments
- ✅ **Cross-functional visibility** - Language coordinators can see staff across all functional departments
- ✅ **Comprehensive access control** - Managers see all users who share ANY of their departments

### Key Advantages

1. **For Multi-lingual Staff**: Easily assign multiple languages without duplicating departments
2. **For Managers**: Choose to manage by function (all Sales) or by language (all English speakers)
3. **For Reporting**: Report by function, language, or both combined
4. **For Growth**: Add new languages or functions independently
5. **For HR**: Complete visibility and control across all dimensions

The system is designed to scale as your medical agency grows and can be easily adjusted to add new roles, departments, or permissions. The multi-dimensional approach provides maximum flexibility while maintaining clear organizational structure.
