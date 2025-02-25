interface PayrollRecord {
  id: number;
  date: string;
  employee: {
    id: string;
    firstname: string;
    lastname: string;
    old_employee_id: string | null;
    employeeid: string;
    employeeid2: number;
    email: string;
  };
  timein: string;
  timeout: string;
  is_active: boolean;
  company: number;
  reason: string;
}

export const dummyPayrollData: PayrollRecord[] = [
  {
    id: 1,
    date: "2024-03-15",
    employee: {
      id: "EMP-001",
      firstname: "John",
      lastname: "Doe",
      old_employee_id: null,
      employeeid: "EMP-001",
      employeeid2: 1,
      email: "john.doe@example.com"
    },
    timein: "08:00",
    timeout: "17:00",
    is_active: true,
    company: 1,
    reason: "Regular shift"
  },
  {
    id: 2,
    date: "2024-03-15",
    employee: {
      id: "EMP-002",
      firstname: "Maria",
      lastname: "Cruz",
      old_employee_id: null,
      employeeid: "EMP-002",
      employeeid2: 2,
      email: "maria.cruz@example.com"
    },
    timein: "08:30",
    timeout: "17:30",
    is_active: true,
    company: 1,
    reason: "Late arrival - Traffic"
  },
  {
    id: 3,
    date: "2024-03-15",
    employee: {
      id: "EMP-003",
      firstname: "James",
      lastname: "Garcia",
      old_employee_id: null,
      employeeid: "EMP-003",
      employeeid2: 3,
      email: "james.garcia@example.com"
    },
    timein: "09:00",
    timeout: "18:00",
    is_active: true,
    company: 1,
    reason: "Overtime work"
  },
  {
    id: 4,
    date: "2024-03-15",
    employee: {
      id: "EMP-004",
      firstname: "Sarah",
      lastname: "Santos",
      old_employee_id: null,
      employeeid: "EMP-004",
      employeeid2: 4,
      email: "sarah.santos@example.com"
    },
    timein: "08:15",
    timeout: "17:15",
    is_active: true,
    company: 1,
    reason: "Regular shift"
  },
  {
    id: 5,
    date: "2024-03-15",
    employee: {
      id: "EMP-005",
      firstname: "Miguel",
      lastname: "Reyes",
      old_employee_id: null,
      employeeid: "EMP-005",
      employeeid2: 5,
      email: "miguel.reyes@example.com"
    },
    timein: "08:45",
    timeout: "17:45",
    is_active: true,
    company: 1,
    reason: "Late arrival - Personal emergency"
  }
];

// Sample data for dropdowns and filters
export const payPeriods = [
  "March 1-15, 2024",
  "March 16-31, 2024",
  "February 1-15, 2024",
  "February 16-29, 2024",
  "January 1-15, 2024",
  "January 16-31, 2024"
];

export const payrollStatuses = [
  "Paid",
  "Pending",
  "Processing",
  "On Hold",
  "Cancelled"
];

export const allowanceTypes = [
  "Transportation",
  "Housing",
  "Meal",
  "Communication",
  "Medical",
  "Performance Bonus",
  "13th Month"
];

export const deductionTypes = [
  "SSS",
  "PhilHealth",
  "Pag-IBIG",
  "Tax",
  "Insurance",
  "Loans",
  "Cash Advance"
];

export const paymentMethods = [
  "Bank Transfer",
  "Cash",
  "Check",
  "E-wallet",
  "ATM"
]; 