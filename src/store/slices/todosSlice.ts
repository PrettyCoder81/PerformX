import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserRole } from './authSlice';

export interface MachineRecord {
  id: string;
  subset: string;
  trainer: string; // user who trained
  trainerId: string;
  trainerRole: UserRole;
  machine: string;
  dataset: string;
  date: string; // ISO date string
  duration: number; // in hours
  epoch: number;
  purpose: string;
  result: string;
  createdAt: string;
  updatedAt: string;
}

interface MachineRecordsState {
  list: MachineRecord[];
}

const initialState: MachineRecordsState = {
  list: [
    {
      id: 'r1',
      subset: 'Training Set A',
      trainer: 'John Doe',
      trainerId: 'user1',
      trainerRole: 'user',
      machine: 'GPU Server 01',
      dataset: 'ImageNet-1K',
      date: '2024-12-15',
      duration: 8.5,
      epoch: 100,
      purpose: 'Model fine-tuning for production',
      result: 'Accuracy: 94.2%, Loss: 0.15',
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2024-12-15T18:30:00Z',
    },
    {
      id: 'r2',
      subset: 'Validation Set B',
      trainer: 'Jane Smith',
      trainerId: 'user2',
      trainerRole: 'user',
      machine: 'GPU Server 02',
      dataset: 'CIFAR-100',
      date: '2024-12-16',
      duration: 4.0,
      epoch: 50,
      purpose: 'Hyperparameter tuning',
      result: 'Best config found: lr=0.001',
      createdAt: '2024-12-16T09:00:00Z',
      updatedAt: '2024-12-16T13:00:00Z',
    },
    {
      id: 'r3',
      subset: 'Test Set C',
      trainer: 'Admin User',
      trainerId: 'admin1',
      trainerRole: 'admin',
      machine: 'GPU Server 01',
      dataset: 'Custom Dataset v2',
      date: '2024-12-17',
      duration: 12.0,
      epoch: 200,
      purpose: 'Full model training',
      result: 'Training completed successfully',
      createdAt: '2024-12-17T08:00:00Z',
      updatedAt: '2024-12-17T20:00:00Z',
    },
    {
      id: 'r4',
      subset: 'Training Set D',
      trainer: 'John Doe',
      trainerId: 'user1',
      trainerRole: 'user',
      machine: 'GPU Server 03',
      dataset: 'MNIST',
      date: '2024-12-18',
      duration: 2.5,
      epoch: 20,
      purpose: 'Quick experiment',
      result: 'Baseline established',
      createdAt: '2024-12-18T14:00:00Z',
      updatedAt: '2024-12-18T16:30:00Z',
    },
    {
      id: 'r5',
      subset: 'Training Set E',
      trainer: 'Jane Smith',
      trainerId: 'user2',
      trainerRole: 'user',
      machine: 'GPU Server 02',
      dataset: 'ImageNet-1K',
      date: '2024-12-19',
      duration: 6.0,
      epoch: 75,
      purpose: 'Transfer learning',
      result: 'Feature extraction complete',
      createdAt: '2024-12-19T11:00:00Z',
      updatedAt: '2024-12-19T17:00:00Z',
    },
  ],
};

const machineRecordsSlice = createSlice({
  name: 'machineRecords',
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<Omit<MachineRecord, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      state.list.push({
        ...action.payload,
        id: `r${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      });
    },
    updateRecord: (state, action: PayloadAction<{ id: string; updates: Partial<MachineRecord> }>) => {
      const record = state.list.find((r) => r.id === action.payload.id);
      if (record) {
        Object.assign(record, action.payload.updates, { updatedAt: new Date().toISOString() });
      }
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((r) => r.id !== action.payload);
    },
  },
});

export const { addRecord, updateRecord, deleteRecord } = machineRecordsSlice.actions;
export default machineRecordsSlice.reducer;
