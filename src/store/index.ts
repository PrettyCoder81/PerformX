import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import performanceReducer from './slices/performanceSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    performance: performanceReducer,
    ui: uiReducer,
    auth: authReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
