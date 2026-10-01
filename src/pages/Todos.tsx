import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Avatar, Grid, Select, MenuItem, FormControl,
  InputLabel, IconButton, Tooltip,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon,
  Pending as PendingIcon, HourglassEmpty as HourglassIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { addTodo, updateTodoStatus, deleteTodo } from '../store/slices/todosSlice';
import type { Todo, TodoStatus, TodoPriority } from '../store/slices/todosSlice';

const Todos: React.FC = () => {
  const dispatch = useDispatch();
  const { list: todos } = useSelector((state: RootState) => state.todos);
  const user = useSelector((state: RootState) => state.auth.user);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium' as TodoPriority, dueDate: '',
  });

  const handleOpenDialog = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({
        title: todo.title, description: todo.description,
        priority: todo.priority, dueDate: todo.dueDate?.split('T')[0] || '',
      });
    } else {
      setEditingTodo(null);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingTodo) {
      dispatch(updateTodoStatus({ id: editingTodo.id, status: editingTodo.status }));
    } else {
      dispatch(addTodo({
        title: formData.title,
        description: formData.description,
        status: 'pending',
        priority: formData.priority,
        assignedTo: user?.id || '',
        assignedToName: user?.name || '',
        assignedToRole: user?.role || 'user',
        assignedToAvatar: user?.avatar || '',
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      }));
    }
    handleCloseDialog();
  };

  const handleStatusChange = (todoId: string, newStatus: TodoStatus) => {
    dispatch(updateTodoStatus({ id: todoId, status: newStatus }));
  };

  const handleDelete = (todoId: string) => {
    dispatch(deleteTodo(todoId));
  };

  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case 'completed': return <CheckIcon fontSize="small" />;
      case 'in-progress': return <HourglassIcon fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status: TodoStatus): 'success' | 'info' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: TodoPriority): 'error' | 'warning' | 'default' => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  const myTodos = todos.filter((t) => t.assignedTo === user?.id);
  const allTodos = todos;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>To-Do List</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your tasks and view team progress
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Task
        </Button>
      </Box>

      {/* My Tasks */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>My Tasks ({myTodos.length})</Typography>
          {myTodos.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No tasks assigned to you yet
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {myTodos.map((todo) => (
                <Grid size={{ xs: 12, md: 6 }} key={todo.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>{todo.title}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(todo)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDelete(todo.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      {todo.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {todo.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip icon={getStatusIcon(todo.status)} label={todo.status} size="small"
                          color={getStatusColor(todo.status)} variant="outlined" />
                        <Chip label={todo.priority} size="small" color={getPriorityColor(todo.priority)} variant="outlined" />
                      </Box>
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select value={todo.status} label="Status" onChange={(e) => handleStatusChange(todo.id, e.target.value as TodoStatus)}>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                      {todo.dueDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* All Team Tasks */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>All Team Tasks ({allTodos.length})</Typography>
          <Grid container spacing={2}>
            {allTodos.map((todo) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={todo.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                        {todo.assignedToAvatar}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={600}>{todo.assignedToName}</Typography>
                        <Typography variant="caption" color="text.secondary">{todo.assignedToRole}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{todo.title}</Typography>
                    {todo.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        {todo.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip icon={getStatusIcon(todo.status)} label={todo.status} size="small"
                        color={getStatusColor(todo.status)} variant="outlined" />
                      <Chip label={todo.priority} size="small" color={getPriorityColor(todo.priority)} variant="outlined" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTodo ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal" autoFocus required />
          <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal" multiline rows={3} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select value={formData.priority} label="Priority" onChange={(e) => setFormData({ ...formData, priority: e.target.value as TodoPriority })}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Due Date" type="date" value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} margin="normal"
            slotProps={{ inputLabel: { shrink: true } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingTodo ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Todos;
