# Public Employee Signup

## Overview

The public signup feature allows new employees to register themselves without requiring HR to manually create their accounts. They fill out a form with their personal and employment information, and the system automatically creates a basic employee account.

## How It Works

### 1. Public Access

- URL: `https://your-app.vercel.app/signup`
- No authentication required
- Clean form without header/sidebar

### 2. Signup Flow

```
Employee receives signup link
       ↓
Visits /signup page
       ↓
Fills out registration form:
  - Personal info (name, email, phone, birthdate)
  - Account credentials (username, password)
  - Employment info (department, employment type, etc.)
       ↓
Submits form
       ↓
System creates user with "Basic Employee" role
       ↓
Redirects to login page
       ↓
Employee logs in and accesses their profile
```

### 3. Auto-Assignment

When a user signs up:

- ✅ Automatically assigned **Basic Employee** role (Sales Representative or Field Agent)
- ✅ Account set to **active**
- ✅ Join date set to **today**
- ✅ Can login immediately after signup

---

## Sharing the Signup Link

### For HR/Managers:

Send new employees this link:

```
https://your-app.vercel.app/signup
```

### Email Template Example:

```
Subject: Welcome to [Company Name] - Complete Your Registration

Hi [Employee Name],

Welcome to the team! Please complete your employee registration by filling out the form at:

https://your-app.vercel.app/signup

What you'll need:
- Your personal information (name, phone, birthdate)
- A username and password for your account
- Your employment details

After registering, you can login at:
https://your-app.vercel.app/login

If you have any questions, please contact HR.

Best regards,
[Company Name] HR Team
```

---

## Form Fields

### Required Fields:

- **Full Name** - Employee's complete name
- **Email** - Must be unique, used for login
- **Username** - Must be unique, used for login (min 3 characters)
- **Password** - Min 6 characters
- **Confirm Password** - Must match password
- **Primary Phone** - Contact number
- **Birth Date** - Date of birth
- **Department(s)** - One or more departments (multi-select)
- **Employment Type** - Citizen, Work Permit, Residence Permit, or Other

### Optional Fields:

- **Nationality** - Country of citizenship
- **Identification Number** - ID card / passport number
- **Address** - Residential address

### Auto-Set Fields:

- **Role** - Automatically set to "Sales Representative" or "Field Agent" (basic employee)
- **Is Active** - Automatically set to `true`
- **Joined At** - Automatically set to current date

---

## What Happens After Signup?

### Immediately:

1. User account is created in the database
2. User receives success message
3. User is redirected to login page

### User Can Then:

- ✅ Login with their username/email and password
- ✅ View their own profile
- ✅ Edit their personal information (limited fields)
- ✅ View their payroll information
- ✅ Request leaves
- ✅ View assigned inventory items

### User Cannot:

- ❌ View other employees
- ❌ Change their role or department
- ❌ Access HR management features
- ❌ Approve leaves
- ❌ Manage inventory

---

## Security & Validation

### Email & Username Uniqueness:

- System checks if email already exists
- System checks if username already exists
- Returns error if duplicate found

### Password Requirements:

- Minimum 6 characters
- Must match confirmation password

### Department Assignment:

- Must select at least one department
- Departments are fetched from the database (only active ones shown)

### Role Assignment:

- Users cannot choose their own role
- Always assigned basic employee role
- Only HR/Super Admin can change roles later

---

## For HR/Managers

### After Employee Signs Up:

1. **Verify the Account:**
   - Login to `/admin` or dashboard
   - Go to Users collection
   - Find the new user by email/name
   - Verify information is correct

2. **Adjust if Needed:**
   - Change role if they should be a manager
   - Adjust departments
   - Add additional information (job title, documents, etc.)
   - Set payroll settings

3. **Optional:**
   - Upload profile photo
   - Add employment documents
   - Set work permit expiry (if applicable)
   - Add job title

---

## Customization

### Change Default Role

Edit `/src/app/api/signup/route.ts`:

```typescript
// Find different role
const basicEmployeeRole = await payload.find({
  collection: 'roles',
  where: {
    name: { equals: 'Your Role Name' }, // ← Change this
  },
  limit: 1,
})
```

### Require Admin Approval

To make accounts inactive by default (requiring HR approval):

Edit `/src/app/api/signup/route.ts`:

```typescript
const newUser = await payload.create({
  collection: 'users',
  data: {
    // ... other fields
    isActive: false, // ← Change from true to false
    // ...
  },
})
```

Then HR must manually activate accounts in `/admin`.

### Add More Fields

Edit `/src/components/user/user-signup-form.tsx` to add more fields to the form.

Then update the schema and API route accordingly.

---

## Troubleshooting

### "No employee role found" error

**Cause:** No basic employee role exists in the database.

**Solution:**

1. Login to `/admin` as super admin
2. Go to Roles collection
3. Create a role with `level: 'employee'`
4. Or run the seed script: `pnpm run seed`

### "Email already exists" error

**Cause:** User trying to signup with an email that's already registered.

**Solution:**

- User should use a different email
- Or HR should check if account already exists and provide login credentials

### "Username already exists" error

**Cause:** Username is taken.

**Solution:**

- User should choose a different username
- Try variations like: `john.smith`, `jsmith`, `john.smith2`, etc.

### Form doesn't submit

**Possible causes:**

1. Missing required fields
2. Password doesn't match confirmation
3. No department selected
4. Invalid email format

**Solution:** Check validation errors shown on the form.

---

## URLs

| Page           | URL               | Authentication |
| -------------- | ----------------- | -------------- |
| Signup Form    | `/signup`         | None (public)  |
| Signup Success | `/signup/success` | None (public)  |
| Login          | `/login`          | None (public)  |
| Dashboard      | `/`               | Required       |
| Profile        | `/users/[id]`     | Required       |

---

## API Endpoint

### POST `/api/signup`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "primaryPhone": "+1234567890",
  "birthDate": "1990-01-15",
  "departments": ["dept-id-1", "dept-id-2"],
  "employmentType": "citizen",
  "nationality": "USA",
  "identificationNumber": "123456789",
  "address": "123 Main St"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "userId": "user-id-123"
}
```

**Error Response (400/500):**

```json
{
  "error": "Email or username already exists"
}
```

---

## Summary

✅ **Public signup form at `/signup`**  
✅ **No authentication required**  
✅ **Auto-assigns basic employee role**  
✅ **Validates email/username uniqueness**  
✅ **Employees can login immediately after signup**  
✅ **Clean UI without dashboard chrome**

Perfect for onboarding new employees quickly!
