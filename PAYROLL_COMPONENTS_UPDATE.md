# Payroll Components Update

## Summary

Updated the payroll table component and sidebar navigation to work with the new PayrollSettings-based system.

## Changes Made

### 1. **Payroll Table Component** (`src/components/payroll/table.tsx`)

#### **Columns Updated:**

**Old Columns:**

- Employee
- Period
- Work Days (daysWorked/totalWorkingDays)
- Gross Pay (from calculations.grossPay)
- Net Pay (from calculations.netPay)
- Status

**New Columns:**

- Employee
- Period
- Items (count of payrollItems)
- Total Amount (from totalAmount field)
- Adjustments (bonusAmount/deductionAmount)
- Status

#### **Key Changes:**

1. **Removed Work Days Column**:
   - Old system tracked `workDays.daysWorked` and `workDays.totalWorkingDays`
   - New system doesn't use work days tracking

2. **Removed Gross/Net Pay Columns**:
   - Old system calculated `calculations.grossPay` and `calculations.netPay`
   - New system uses `totalAmount` which is auto-calculated from payroll items + adjustments

3. **Added Items Column**:
   - Shows count of `payrollItems` array
   - Example: "3 items" means 3 different payment types (salary + bonus + allowance)

4. **Added Adjustments Column**:
   - Shows manual adjustments: bonuses (+) and deductions (-)
   - Example: "+₺500 -₺200" means ₺500 bonus and ₺200 deduction
   - Shows "-" if no adjustments

#### **Data Structure Mapping:**

```typescript
// OLD STRUCTURE
{
  employee: User,
  period: { month, year },
  workDays: {
    totalWorkingDays: 22,
    daysWorked: 20,
    leaveDays: 2
  },
  calculations: {
    grossPay: 8000,
    netPay: 7200
  },
  status: "paid"
}

// NEW STRUCTURE
{
  employee: User,
  period: { month, year },
  payrollItems: [
    {
      payrollSetting: PayrollSetting,
      description: "Monthly Salary",
      payrollType: "primary",
      amount: 7000,
      paymentType: "bankTransfer"
    },
    {
      payrollSetting: PayrollSetting,
      description: "Performance Bonus",
      payrollType: "bonus",
      amount: 1000,
      paymentType: "bankTransfer"
    }
  ],
  adjustments: {
    bonusAmount: 500,
    deductionAmount: 200,
    adjustmentNote: "Performance bonus"
  },
  totalAmount: 8300, // Auto-calculated: 7000 + 1000 + 500 - 200
  status: "paid"
}
```

### 2. **Sidebar Navigation** (`src/components/app-sidebar.tsx`)

#### **Added Expandable Payroll Menu:**

```typescript
{
  title: 'Payroll',
  url: '/payroll',
  icon: IconCreditCard,
  items: [
    {
      title: 'Payroll Records',
      url: '/payroll',
    },
    {
      title: 'Payroll Settings',
      url: '/admin/collections/payroll-settings',
    },
  ],
}
```

**Features:**

- Clicking "Payroll" expands to show submenu
- "Payroll Records" → `/payroll` (main payroll page)
- "Payroll Settings" → `/admin/collections/payroll-settings` (Payload admin)

### 3. **NavMain Component** (`src/components/nav-main.tsx`)

#### **Added Support for Nested Menu Items:**

**New Features:**

1. **Collapsible Menu Items**: Items with `items` array become expandable
2. **Chevron Icon**: Rotates when expanded/collapsed
3. **SubMenu Support**: Proper nesting with `SidebarMenuSub` components
4. **TypeScript Types**: Updated to support optional `items` array

**Usage:**

```typescript
// Simple menu item (no subitems)
{
  title: 'Dashboard',
  url: '/',
  icon: IconDashboard,
}

// Expandable menu item (with subitems)
{
  title: 'Payroll',
  url: '/payroll',
  icon: IconCreditCard,
  items: [
    { title: 'Payroll Records', url: '/payroll' },
    { title: 'Payroll Settings', url: '/admin/collections/payroll-settings' },
  ],
}
```

## Visual Changes

### Payroll Table - Before:

```
| Employee       | Period   | Work Days | Gross Pay | Net Pay  | Status   |
|----------------|----------|-----------|-----------|----------|----------|
| Tony Stark     | Oct 2025 | 20/22     | ₺8,000    | ₺7,200   | Paid     |
| Natasha R.     | Oct 2025 | 22/22     | ₺7,500    | ₺6,750   | Approved |
```

### Payroll Table - After:

```
| Employee       | Period   | Items   | Total Amount | Adjustments | Status   |
|----------------|----------|---------|--------------|-------------|----------|
| Tony Stark     | Oct 2025 | 2 items | ₺8,300       | +₺500 -₺200 | Paid     |
| Natasha R.     | Oct 2025 | 1 item  | ₺7,500       | -           | Approved |
```

### Sidebar - Before:

```
📊 Dashboard
👥 Team Members
📦 Inventory
📅 Leaves
💳 Payroll
```

### Sidebar - After:

```
📊 Dashboard
👥 Team Members
📦 Inventory
📅 Leaves
💳 Payroll ▶
    ├── Payroll Records
    └── Payroll Settings
```

## Benefits

### 1. **Better Alignment with Data Model**

- Table columns now match the actual Payroll collection structure
- No more confusion about work days or gross/net calculations

### 2. **Improved Visibility**

- Can see how many payment items each payroll has
- Adjustments are clearly visible at a glance
- Total amount is the final calculated value

### 3. **Easy Access to Settings**

- Payroll Settings are now accessible directly from sidebar
- No need to navigate to `/admin` and search for the collection

### 4. **Flexible Menu System**

- NavMain component now supports nested items
- Can easily add more submenu items in the future
- Consistent UX with expandable/collapsible menus

## Testing

### To Test the Updated Components:

1. **Navigate to Payroll Page**:

   ```
   http://localhost:3000/payroll
   ```

2. **Check Table Columns**:
   - ✅ Employee names display correctly
   - ✅ Period shows as "Month Year" (e.g., "Oct 2025")
   - ✅ Items shows count (e.g., "2 items")
   - ✅ Total Amount shows currency formatted (e.g., "₺8,300")
   - ✅ Adjustments shows bonuses/deductions or "-"
   - ✅ Status shows badge with dropdown

3. **Check Sidebar**:
   - ✅ Payroll has chevron icon
   - ✅ Click Payroll to expand submenu
   - ✅ Submenu shows "Payroll Records" and "Payroll Settings"
   - ✅ Click "Payroll Settings" navigates to Payload admin

4. **Check Data**:
   - ✅ Seed data created 57 payroll records (19 users × 3 months)
   - ✅ Each record has payrollItems from PayrollSettings
   - ✅ Adjustments are visible where applicable
   - ✅ TotalAmount is calculated correctly

## Future Enhancements

### Potential Improvements:

1. **Detailed View**:
   - Click on "Items" to see breakdown of payrollItems
   - Modal or expandable row showing each payment component

2. **Adjustments Tooltip**:
   - Hover over adjustments to see adjustment notes
   - Show reason for bonuses/deductions

3. **Quick Actions**:
   - Add "View Details" button in action column
   - Add "Generate Similar" for next month

4. **Filtering by Items**:
   - Filter by number of payment items
   - Filter by adjustment type (bonus/deduction)

5. **Export**:
   - Export payroll data with item breakdown
   - Generate payslips for employees

## Migration Notes

### If You Have Existing Payroll Data:

The old payroll structure (`workDays`, `calculations.grossPay`, `calculations.netPay`) is no longer used.

If you have old payroll records in the database, you'll need to:

1. Create PayrollSettings for each employee
2. Migrate old payroll records to new structure with `payrollItems`
3. Or clear old records and re-seed with new structure

### Recommended Approach:

Since you just seeded the database with Marvel characters, you should have fresh data with the new structure. If you have old data, consider clearing it and reseeding.

## Summary

✅ Payroll table updated to show Items, Total Amount, and Adjustments
✅ Sidebar now has expandable Payroll menu with Settings link
✅ NavMain component supports nested menu items
✅ Components aligned with new PayrollSettings-based system
✅ Better UX and data visibility

The payroll system is now fully updated to work with the new structure! 🎉
