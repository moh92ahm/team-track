# Seed Data Documentation - Marvel Characters Edition 🦸‍♂️

## Overview

The seed file has been completely rewritten to populate your TeamTrack system with **20 Marvel characters** complete with their departments, payroll history, inventory, and leave records.

## What Gets Created

### 1. **Roles & Departments** (via existing seed)

- ✅ 6 Roles: HR Manager, Department Manager, Field Agent, Sales Representative, Doctor, Marketing Specialist
- ✅ 7 Functional Departments: Sales, Field, Marketing, Transfer, HR, Dental Clinic (Doctors & Assistants)
- ✅ 8 Language Departments: English, Turkish, Arabic, Russian, French, German, Spanish, Persian

### 2. **20 Marvel Characters as Users**

Each character is assigned appropriate departments and roles:

| Character        | Job Title                       | Departments                      | Role                 |
| ---------------- | ------------------------------- | -------------------------------- | -------------------- |
| Tony Stark       | Chief Technology Officer        | Field, English                   | Field Agent          |
| Natasha Romanoff | Senior Field Agent              | Field, Russian, English          | Field Agent          |
| Steve Rogers     | Operations Manager              | Field, English                   | Department Manager   |
| Bruce Banner     | Research Scientist              | Marketing, English               | Marketing Specialist |
| Thor Odinson     | Field Operations Lead           | Field, English                   | Field Agent          |
| Peter Parker     | Junior Field Agent              | Field, English                   | Field Agent          |
| Wanda Maximoff   | Special Operations Agent        | Field, Russian, English          | Field Agent          |
| Stephen Strange  | Medical Consultant              | Dental Clinic - Doctors, English | Doctor               |
| Carol Danvers    | Senior Field Agent              | Field, English                   | Field Agent          |
| T'Challa         | International Relations Manager | Sales, English, French           | Sales Representative |
| Clint Barton     | Field Agent                     | Field, English                   | Field Agent          |
| Scott Lang       | Technical Specialist            | Transfer, English                | Sales Representative |
| Hope van Dyne    | Operations Specialist           | Transfer, English                | Sales Representative |
| Sam Wilson       | Field Operations Manager        | Field, English                   | Field Agent          |
| Bucky Barnes     | Security Specialist             | Field, English, Russian          | Field Agent          |
| Nick Fury        | Director of Operations          | Human Resources                  | HR Manager           |
| Shuri            | Technology Innovation Lead      | Marketing, English               | Marketing Specialist |
| Pietro Maximoff  | Rapid Response Agent            | Field, Russian, English          | Field Agent          |
| Kamala Khan      | Junior Marketing Specialist     | Marketing, English, Arabic       | Marketing Specialist |
| Marc Spector     | Night Operations Agent          | Field, English, Arabic           | Field Agent          |

### 3. **Payroll Settings**

For each user:

- **Primary Salary**: Monthly base salary (varies by role)
  - HR Manager: $12,000/month
  - Department Manager: $10,000/month
  - Field Agent: $7,000/month
  - Sales Representative: $6,500/month
  - Doctor: $15,000/month
  - Marketing Specialist: $6,000/month
- **Bonus (30% chance)**: Random performance bonus ($500-$2,500)
- **Bank Account Details**: Auto-generated with SHIELD Credit Union

### 4. **Payroll History (Last 3 Months)**

For each user, creates 3 payroll records:

- **Months**: Previous 2 months + current month
- **Items**: Auto-generated from payroll settings
- **Adjustments**:
  - Random bonuses (20% chance): $100-$600
  - Random deductions (10% chance): $50-$250
- **Status**:
  - Oldest month: Paid (with payment details)
  - Middle month: Approved
  - Current month: Paid

**Total**: 60 payroll records (20 users × 3 months)

### 5. **Inventory (30 Items)**

**Laptops** (15 items - assigned to first 15 users):

- MacBook Pro 16" M3 Pro
- MacBook Pro 14" M3
- MacBook Air 15" M2
- Dell XPS 15
- Lenovo ThinkPad X1 Carbon
- HP EliteBook 840
- ASUS ZenBook Pro

**Phones** (10 items - assigned to first 10 users):

- iPhone 15 Pro Max
- iPhone 15 Pro
- Samsung Galaxy S24 Ultra
- Google Pixel 8 Pro
- OnePlus 12

**SIM Cards** (5 items - assigned to random 5 users):

- Verizon SIM Card
- AT&T SIM Card
- T-Mobile SIM Card
- Vodafone SIM Card
- O2 SIM Card

All inventory items:

- ✅ Have unique serial numbers
- ✅ Are assigned to specific users
- ✅ Have purchase dates in 2024
- ✅ Have warranty expiry dates
- ✅ Include notes about assignment

### 6. **Leave Records**

For each user, creates **1-3 random leave records**:

**Leave Types**:

- Annual leave
- Sick leave
- Unpaid leave
- Other

**Date Range**:

- Past 6 months to next 3 months
- Duration: 1-10 days

**Status Distribution**:

- Past leaves: Mostly approved, some rejected
- Future leaves: Requested or approved

**Total**: 20-60 leave records (varies due to randomization)

## How to Run the Seed

```bash
# Option 1: Run the seed script directly
pnpm run payload seed

# Option 2: Run from Payload admin panel
# Navigate to /admin and look for seed data option
```

## Seed Execution Order

1. **Roles & Departments** → Creates RBAC structure
2. **Users (Marvel Characters)** → Creates 20 users with multi-department assignments
3. **Payroll Settings** → Sets up ongoing payment configurations
4. **Payroll History** → Generates 3 months of historical payroll
5. **Inventory** → Creates and assigns 30 items
6. **Leave Records** → Generates random leave history

## Example Data

### Example User: Tony Stark

```json
{
  "fullName": "Tony Stark",
  "email": "tony.stark@shield.marvel",
  "jobTitle": "Chief Technology Officer",
  "departments": ["Field", "English"],
  "role": "Field Agent",
  "birthDate": "1970-05-29",
  "employmentType": "citizen",
  "nationality": "American",
  "primaryPhone": "+1-555-STARK",
  "address": "10880 Malibu Point, Malibu, CA 90265"
}
```

**Payroll Settings**:

- Primary Salary: $7,000/month (Bank Transfer)
- Bank: SHIELD Credit Union

**Inventory Assigned**:

- MacBook Pro 16" M3 Pro (Serial: LAPTOP-0001)
- iPhone 15 Pro Max (Serial: PHONE-0001)

**Leave Records**:

- 1-3 random leaves (annual/sick/other)
- Dates: Past 6 months or upcoming 3 months

## Multi-Dimensional Department Examples

### Multi-Lingual Characters:

**Natasha Romanoff**:

- Departments: Field + Russian + English
- Can be seen by: Field Manager AND Russian Coordinator AND English Coordinator

**Bucky Barnes**:

- Departments: Field + English + Russian
- Can be seen by: Field Manager AND English Coordinator AND Russian Coordinator

**Kamala Khan**:

- Departments: Marketing + English + Arabic
- Can be seen by: Marketing Manager AND English Coordinator AND Arabic Coordinator

### Single Department Characters:

**Nick Fury** (HR Manager):

- Departments: Human Resources
- Can see: Everyone in the system (HR admin access)

**Stephen Strange** (Doctor):

- Departments: Dental Clinic - Doctors + English
- Can be seen by: Clinic Manager AND English Coordinator

## Testing Your Seed Data

### 1. Verify Users

```bash
# Login to Payload admin at /admin
# Navigate to Users collection
# You should see 20 Marvel characters
```

### 2. Verify Departments

```bash
# Each user should have 1-3 departments
# Check that multi-lingual users have language departments
```

### 3. Verify Payroll

```bash
# Navigate to Payroll collection
# You should see 60 payroll records
# Check that each user has 3 months of history
```

### 4. Verify Inventory

```bash
# Navigate to Inventory collection
# You should see 30 items
# 15 laptops, 10 phones, 5 SIM cards
# All assigned to users
```

### 5. Verify Leaves

```bash
# Navigate to Leave Days collection
# You should see 20-60 leave records
# Mix of approved, rejected, and requested
```

## Customization

### To Change Salary Ranges:

Edit `seedPayrollSettings()` function in `/src/seed/index.ts`:

```typescript
const salaryRanges: Record<string, number> = {
  'HR Manager': 12000,
  'Department Manager': 10000,
  // ... modify as needed
}
```

### To Add More Inventory Items:

Edit `seedInventory()` function:

```typescript
const laptopModels = [
  'MacBook Pro 16" M3 Pro',
  // ... add more models
]
```

### To Adjust Leave Frequency:

Edit `seedLeaves()` function:

```typescript
const numLeaves = Math.floor(Math.random() * 5) + 1 // Change from 3 to 5
```

## Important Notes

⚠️ **Authentication**: All Marvel characters have their emails as login credentials. You'll need to set passwords manually or via the forgot password flow.

⚠️ **Multi-Department Access**: Department managers can see all users who share ANY of their departments. This is intentional for the multi-dimensional structure.

⚠️ **Payroll Auto-Generation**: When you create new payroll records, they will automatically populate items from PayrollSettings.

⚠️ **Unique Serial Numbers**: All inventory items have unique serial numbers. Don't manually create items with the same serial numbers.

## Troubleshooting

### Issue: "Cannot find departments"

**Solution**: Make sure `roles-departments.ts` seed runs first. It creates all departments.

### Issue: "Duplicate key error on email"

**Solution**: Clear the database before reseeding:

```bash
# Drop and recreate the database, then run seed again
```

### Issue: "Payroll items not generated"

**Solution**: Ensure PayrollSettings are created before Payroll records. The seed runs in correct order.

### Issue: "Type errors in seed file"

**Solution**: Run type generation:

```bash
pnpm run payload generate:types
```

## Summary

Your seed file now creates a complete Marvel Universe-themed agency with:

- ✅ 20 unique characters with realistic data
- ✅ Multi-dimensional department assignments
- ✅ 3 months of payroll history per character
- ✅ 30 inventory items distributed among characters
- ✅ Random leave records for testing approval workflows
- ✅ Proper RBAC with roles and permissions

This gives you a robust testing environment to develop and demonstrate your TeamTrack application! 🚀
