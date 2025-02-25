import { Employee } from "@/components/types";

export const dummyEmployeeData: Employee[] = [
  {
    id: 1,
    first_name: "John",
    middle_name: "Robert",
    last_name: "Doe",
    extension: "Jr.",
    gender: "M",
    birthday: "1990-05-15",
    civil_status: "Single",
    nationality: "Resident Foreign Corp",
    place_of_birth: "Manila",
    mother_maiden_name: "Mary Smith",
    email: "john.doe@example.com",
    address: "123 Main St",
    region: "NCR",
    local_address: "456 Local Ave",
    local_address_zip: 1234,
    foreign_address: "789 Foreign Blvd",
    foreign_address_zip: 5678,
    rdo_code: 123,
    contact_num: "+63 912 345 6789",
    contact_person: "Jane Doe",
    relationship: "Sibling",
    contact_person_num: "+63 923 456 7890",
    contact_person_address: "321 Contact St",
    job_profile: {
      id: 1,
      employment_type: "Regular",
      date_hired: "2023-01-15",
      schedule: "9AM-6PM",
      rate_status: "Monthly",
      department: "IT",
      position: "Senior Developer",
      hrs_per_day: 8,
      basic_salary: 75000,
      days_per_mos: 22,
      confidential_level: "High",
      salary_effective_date: "2023-01-15",
      location: "Main Office"
    }
  },
  {
    id: 2,
    first_name: "Maria",
    middle_name: "Santos",
    last_name: "Cruz",
    extension: "",
    gender: "F",
    birthday: "1992-08-23",
    civil_status: "Married",
    nationality: "Citizens of the Philippines",
    place_of_birth: "Cebu",
    mother_maiden_name: "Ana Santos",
    email: "maria.cruz@example.com",
    address: "789 Side St",
    region: "Region VII",
    local_address: "321 Local St",
    local_address_zip: 6000,
    foreign_address: "",
    foreign_address_zip: 0,
    rdo_code: 456,
    contact_num: "+63 934 567 8901",
    contact_person: "Pedro Cruz",
    relationship: "Father",
    contact_person_num: "+63 945 678 9012",
    contact_person_address: "654 Emergency St",
    job_profile: {
      id: 2,
      employment_type: "Regular",
      date_hired: "2022-06-01",
      schedule: "8AM-5PM",
      rate_status: "Monthly",
      department: "Human Resources",
      position: "HR Specialist",
      hrs_per_day: 8,
      basic_salary: 45000,
      days_per_mos: 22,
      confidential_level: "High",
      salary_effective_date: "2022-06-01",
      location: "Main Office"
    }
  },
  {
    id: 3,
    first_name: "James",
    middle_name: "Patrick",
    last_name: "Garcia",
    extension: "III",
    gender: "M",
    birthday: "1988-12-03",
    civil_status: "Single",
    nationality: "Citizens of the Philippines",
    place_of_birth: "Davao",
    mother_maiden_name: "Patricia Garcia",
    email: "james.garcia@example.com",
    address: "567 Main Ave",
    region: "Region XI",
    local_address: "890 Local Rd",
    local_address_zip: 8000,
    foreign_address: "123 Foreign St",
    foreign_address_zip: 9012,
    rdo_code: 789,
    contact_num: "+63 956 789 0123",
    contact_person: "Michael Garcia",
    relationship: "Sibling",
    contact_person_num: "+63 967 890 1234",
    contact_person_address: "987 Emergency Ave",
    job_profile: {
      id: 3,
      employment_type: "Regular",
      date_hired: "2021-03-15",
      schedule: "10AM-7PM",
      rate_status: "Monthly",
      department: "Sales",
      position: "Manager",
      hrs_per_day: 8,
      basic_salary: 85000,
      days_per_mos: 22,
      confidential_level: "Very High",
      salary_effective_date: "2021-03-15",
      location: "Branch Office A"
    }
  },
  {
    id: 4,
    first_name: "Sarah",
    middle_name: "Elizabeth",
    last_name: "Santos",
    extension: "",
    gender: "F",
    birthday: "1995-04-18",
    civil_status: "Single",
    nationality: "Engaged in Business",
    place_of_birth: "Makati",
    mother_maiden_name: "Elizabeth Reyes",
    email: "sarah.santos@example.com",
    address: "234 Park Avenue",
    region: "NCR",
    local_address: "567 Metro St",
    local_address_zip: 1200,
    foreign_address: "",
    foreign_address_zip: 0,
    rdo_code: 234,
    contact_num: "+63 978 901 2345",
    contact_person: "Robert Santos",
    relationship: "Father",
    contact_person_num: "+63 989 012 3456",
    contact_person_address: "234 Emergency Rd",
    job_profile: {
      id: 4,
      employment_type: "Contract",
      date_hired: "2023-09-01",
      schedule: "2PM-11PM",
      rate_status: "Monthly",
      department: "Marketing",
      position: "Marketing Specialist",
      hrs_per_day: 8,
      basic_salary: 40000,
      days_per_mos: 22,
      confidential_level: "Medium",
      salary_effective_date: "2023-09-01",
      location: "Remote"
    }
  },
  {
    id: 5,
    first_name: "Miguel",
    middle_name: "Antonio",
    last_name: "Reyes",
    extension: "II",
    gender: "M",
    birthday: "1993-09-27",
    civil_status: "Married",
    nationality: "Citizens of the Philippines",
    place_of_birth: "Quezon City",
    mother_maiden_name: "Carmen Reyes",
    email: "miguel.reyes@example.com",
    address: "789 Business Ave",
    region: "NCR",
    local_address: "890 City St",
    local_address_zip: 1300,
    foreign_address: "456 Foreign Ave",
    foreign_address_zip: 7890,
    rdo_code: 345,
    contact_num: "+63 990 123 4567",
    contact_person: "Isabella Reyes",
    relationship: "Sibling",
    contact_person_num: "+63 901 234 5678",
    contact_person_address: "789 Emergency Ave",
    job_profile: {
      id: 5,
      employment_type: "Regular",
      date_hired: "2022-01-10",
      schedule: "8AM-5PM",
      rate_status: "Monthly",
      department: "Finance",
      position: "Accountant",
      hrs_per_day: 8,
      basic_salary: 55000,
      days_per_mos: 22,
      confidential_level: "High",
      salary_effective_date: "2022-01-10",
      location: "Main Office"
    }
  }
];

export const dummyEmploymentTypes = {
  employmenttypes: [
    { id: 1, employmenttypes: "Regular" },
    { id: 2, employmenttypes: "Probationary" },
    { id: 3, employmenttypes: "Contract" },
    { id: 4, employmenttypes: "Part-time" },
    { id: 5, employmenttypes: "Project-based" }
  ]
};

export const dummyDepartments = {
  departments: [
    { id: 1, departments: "Human Resources" },
    { id: 2, departments: "Finance" },
    { id: 3, departments: "IT" },
    { id: 4, departments: "Operations" },
    { id: 5, departments: "Marketing" },
    { id: 6, departments: "Sales" },
    { id: 7, departments: "Research & Development" }
  ]
};

export const dummyPositions = {
  positions: [
    { id: 1, positions: "Manager" },
    { id: 2, positions: "Supervisor" },
    { id: 3, positions: "Team Lead" },
    { id: 4, positions: "Senior Developer" },
    { id: 5, positions: "Junior Developer" },
    { id: 6, positions: "HR Specialist" },
    { id: 7, positions: "Accountant" },
    { id: 8, positions: "Marketing Specialist" },
    { id: 9, positions: "Sales Representative" }
  ]
};

export const dummySchedules = {
  schedule: [
    { id: 1, schedule_code: "9AM-6PM" },
    { id: 2, schedule_code: "8AM-5PM" },
    { id: 3, schedule_code: "10AM-7PM" },
    { id: 4, schedule_code: "2PM-11PM" },
    { id: 5, schedule_code: "6AM-3PM" },
    { id: 6, schedule_code: "3PM-12AM" },
    { id: 7, schedule_code: "12AM-9AM" }
  ]
};

export const dummyLocations = {
  locations: [
    { id: 1, locations: "Main Office" },
    { id: 2, locations: "Branch Office A" },
    { id: 3, locations: "Branch Office B" },
    { id: 4, locations: "Remote" },
    { id: 5, locations: "Field Office" }
  ]
};