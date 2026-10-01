import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserRole } from './authSlice';

export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignedTo: string; // user id
  assignedToName: string;
  assignedToRole: UserRole;
  assignedToAvatar: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface TodosState {
  list: Todo[];
}

const initialState: TodosState = {
  list: [
    {
      id: 't1',
      title: 'Complete Q4 performance reviews',
      description: 'Review and finalize all employee performance evaluations for Q4',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'admin1',
      assignedToName: 'Admin User',
      assignedToRole: 'admin',
      assignedToAvatar: 'AU',
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-15T14:30:00Z',
      dueDate: '2024-12-31T23:59:59Z',
    },
    {
      id: 't2',
      title: 'Update team goals for 2025',
      description: 'Set new objectives and key results for the upcoming year',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'admin1',
      assignedToName: 'Admin User',
      assignedToRole: 'admin',
      assignedToAvatar: 'AU',
      createdAt: '2024-12-10T09:00:00Z',
      updatedAt: '2024-12-10T09:00:00Z',
      dueDate: '2025-01-15T23:59:59Z',
    },
    {
      id: 't3',
      title: 'Prepare presentation slides',
      description: 'Create slides for the annual performance review meeting',
      status: 'completed',
      priority: 'high',
      assignedTo: 'user1',
      assignedToName: 'John Doe',
      assignedToRole: 'user',
      assignedToAvatar: 'JD',
      createdAt: '2024-11-20T11:00:00Z',
      updatedAt: '2024-12-05T16:45:00Z',
      dueDate: '2024-12-10T23:59:59Z',
    },
    {
      id: 't4',
      title: 'Attend training workshop',
      description: 'Complete the leadership development training program',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'user1',
      assignedToName: 'John Doe',
      assignedToRole: 'user',
      assignedToAvatar: 'JD',
      createdAt: '2024-12-05T08:00:00Z',
      updatedAt: '2024-12-12T10:00:00Z',
      dueDate: '2024-12-20T23:59:59Z',
    },
    {
      id: 't5',
      title: 'Submit weekly report',
      description: 'Compile and submit the weekly performance metrics report',
      status: 'pending',
      priority: 'low',
      assignedTo: 'user2',
      assignedToName: 'Jane Smith',
      assignedToRole: 'user',
      assignedToAvatar: 'JS',
      createdAt: '2024-12-14T13:00:00Z',
      updatedAt: '2024-12-14T13:00:00Z',
      dueDate: '2024-12-16T23:59:59Z',
    },
  ],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      state.list.push({
        ...action.payload,
        id: `t${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTodoStatus: (state, action: PayloadAction<{ id: string; status: TodoStatus }>) => {
      const todo = state.list.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.status = action.payload.status;
        todo.updatedAt = new Date().toISOString();
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; updates: Partial<Todo> }>) => {
      const todo = state.list.find((t) => t.id === action.payload.id);
      if (todo) {
        Object.assign(todo, action.payload.updates, { updatedAt: new Date().toISOString() });
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTodo, updateTodoStatus, updateTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
