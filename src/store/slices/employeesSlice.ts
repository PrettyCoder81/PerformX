import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'terminated';
  performanceScore: number;
  phone: string;
}

interface EmployeesState {
  list: Employee[];
  selectedId: string | null;
  searchQuery: string;
  departmentFilter: string;
  statusFilter: string;
}

const initialState: EmployeesState = {
  list: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'SJ',
      department: 'Engineering',
      position: 'Senior Developer',
      joinDate: '2021-03-15',
      status: 'active',
      performanceScore: 92,
      phone: '+1 (555) 123-4567',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'MC',
      department: 'Design',
      position: 'UI/UX Designer',
      joinDate: '2022-01-10',
      status: 'active',
      performanceScore: 88,
      phone: '+1 (555) 234-5678',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: 'ER',
      department: 'Marketing',
      position: 'Marketing Manager',
      joinDate: '2020-06-22',
      status: 'active',
      performanceScore: 95,
      phone: '+1 (555) 345-6789',
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'DK',
      department: 'Engineering',
      position: 'Backend Developer',
      joinDate: '2022-08-05',
      status: 'on-leave',
      performanceScore: 78,
      phone: '+1 (555) 456-7890',
    },
    {
      id: '5',
      name: 'Jessica Williams',
      email: 'jessica.williams@company.com',
      avatar: 'JW',
      department: 'HR',
      position: 'HR Specialist',
      joinDate: '2021-11-18',
      status: 'active',
      performanceScore: 85,
      phone: '+1 (555) 567-8901',
    },
    {
      id: '6',
      name: 'Robert Taylor',
      email: 'robert.taylor@company.com',
      avatar: 'RT',
      department: 'Sales',
      position: 'Sales Director',
      joinDate: '2019-04-01',
      status: 'active',
      performanceScore: 91,
      phone: '+1 (555) 678-9012',
    },
    {
      id: '7',
      name: 'Amanda Foster',
      email: 'amanda.foster@company.com',
      avatar: 'AF',
      department: 'Engineering',
      position: 'Frontend Developer',
      joinDate: '2023-02-14',
      status: 'active',
      performanceScore: 82,
      phone: '+1 (555) 789-0123',
    },
    {
      id: '8',
      name: 'James Anderson',
      email: 'james.anderson@company.com',
      avatar: 'JA',
      department: 'Finance',
      position: 'Financial Analyst',
      joinDate: '2020-09-30',
      status: 'active',
      performanceScore: 87,
      phone: '+1 (555) 890-1234',
    },
  ],
  selectedId: null,
  searchQuery: '',
  departmentFilter: 'all',
  statusFilter: 'all',
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.departmentFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    updateEmployeePerformance: (state, action: PayloadAction<{ id: string; score: number }>) => {
      const employee = state.list.find((e) => e.id === action.payload.id);
      if (employee) {
        employee.performanceScore = action.payload.score;
      }
    },
  },
});

export const {
  setSelectedEmployee,
  setSearchQuery,
  setDepartmentFilter,
  setStatusFilter,
  updateEmployeePerformance,
} = employeesSlice.actions;

export default employeesSlice.reducer;
