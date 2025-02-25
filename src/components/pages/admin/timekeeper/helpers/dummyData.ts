interface TimekeeperAccount {
  id: number;
  username: string;
  email: string;
  location: string;
  department: string;
  rate_status: string;
  account_type: string;
  generated_password: string;
  attempts: number;
}

export const dummyTimekeeperData: TimekeeperAccount[] = [
  {
    id: 1,
    username: "timekeeper1",
    email: "timekeeper1@example.com",
    location: "Manila, Cebu",
    department: "HR, Finance",
    rate_status: "Monthly, Hourly",
    account_type: "one to many",
    generated_password: "pass123",
    attempts: 0
  },
  {
    id: 2,
    username: "timekeeper2",
    email: "timekeeper2@example.com",
    location: "Makati",
    department: "IT",
    rate_status: "Monthly",
    account_type: "one to one",
    generated_password: "pass123",
    attempts: 0
  },
  {
    id: 3,
    username: "timekeeper3",
    email: "timekeeper3@example.com",
    location: "Quezon City, Pasig",
    department: "Operations, Admin",
    rate_status: "Daily, Freelance/Contract",
    account_type: "one to many",
    generated_password: "pass123",
    attempts: 0
  },
  {
    id: 4,
    username: "timekeeper4",
    email: "timekeeper4@example.com",
    location: "BGC",
    department: "Marketing",
    rate_status: "Commission",
    account_type: "one to one",
    generated_password: "pass123",
    attempts: 0
  },
  {
    id: 5,
    username: "timekeeper5",
    email: "timekeeper5@example.com",
    location: "Ortigas, Mandaluyong",
    department: "Sales, Support",
    rate_status: "Monthly, Commission",
    account_type: "one to many",
    generated_password: "pass123",
    attempts: 0
  }
];

// Sample location and department data for dropdowns
export const dummyLocations = [
  "Manila",
  "Cebu",
  "Makati",
  "Quezon City",
  "Pasig",
  "BGC",
  "Ortigas",
  "Mandaluyong"
];

export const dummyDepartments = [
  "HR",
  "Finance",
  "IT",
  "Operations",
  "Admin",
  "Marketing",
  "Sales",
  "Support"
]; 