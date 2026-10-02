import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Avatar, Grid, Select, MenuItem, FormControl,
  InputLabel, IconButton, Tooltip, Paper, Badge, InputAdornment, ToggleButtonGroup,
  ToggleButton, Divider, LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckIcon,
  Pending as PendingIcon, HourglassEmpty as HourglassIcon, Search as SearchIcon,
  ViewModule as KanbanIcon, ViewList as ListIcon, FilterList as FilterIcon,
  CalendarToday as CalendarIcon, PriorityHigh as PriorityIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { addTodo, updateTodoStatus, deleteTodo, updateTodo } from '../store/slices/todosSlice';
import type { Todo, TodoStatus, TodoPriority } from '../store/slices/todosSlice';

type ViewMode = 'kanban' | 'list';

const Todos: React.FC = () => {
  const dispatch = useDispatch();
  const { list: todos } = useSelector((state: RootState) => state.todos);
  const user = useSelector((state: RootState) => state.auth.user);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TodoPriority | 'all'>('all');
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
      dispatch(updateTodo({
        id: editingTodo.id,
        updates: {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        },
      }));
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

  const getPriorityBgColor = (priority: TodoPriority): string => {
    switch (priority) {
      case 'high': return '#fef2f2';
      case 'medium': return '#fffbeb';
      default: return '#f0fdf4';
    }
  };

  const isOverdue = (dueDate?: string): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || todo.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const myTodos = filteredTodos.filter((t) => t.assignedTo === user?.id);
  const pendingTodos = filteredTodos.filter((t) => t.status === 'pending');
  const inProgressTodos = filteredTodos.filter((t) => t.status === 'in-progress');
  const completedTodos = filteredTodos.filter((t) => t.status === 'completed');

  const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;

  const renderTodoCard = (todo: Todo, showAssignee = false) => (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        borderLeft: `4px solid ${
          todo.priority === 'high' ? '#ef4444' :
          todo.priority === 'medium' ? '#f59e0b' : '#22c55e'
        }`,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
            {todo.title}
          </Typography>
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
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', lineHeight: 1.4 }}>
            {todo.description}
          </Typography>
        )}

        {showAssignee && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
              {todo.assignedToAvatar}
            </Avatar>
            <Typography variant="caption" fontWeight={500}>
              {todo.assignedToName}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={getStatusIcon(todo.status)}
            label={todo.status.replace('-', ' ')}
            size="small"
            color={getStatusColor(todo.status)}
            variant="outlined"
          />
          <Chip
            label={todo.priority}
            size="small"
            sx={{
              bgcolor: getPriorityBgColor(todo.priority),
              borderColor: getPriorityColor(todo.priority) === 'error' ? '#ef4444' :
                          getPriorityColor(todo.priority) === 'warning' ? '#f59e0b' : '#22c55e',
              color: getPriorityColor(todo.priority) === 'error' ? '#dc2626' :
                     getPriorityColor(todo.priority) === 'warning' ? '#d97706' : '#16a34a',
            }}
            variant="outlined"
          />
        </Box>

        {todo.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 14, color: isOverdue(todo.dueDate) ? 'error.main' : 'text.secondary' }} />
            <Typography
              variant="caption"
              sx={{
                color: isOverdue(todo.dueDate) && todo.status !== 'completed' ? 'error.main' : 'text.secondary',
                fontWeight: isOverdue(todo.dueDate) && todo.status !== 'completed' ? 600 : 400,
              }}
            >
              {isOverdue(todo.dueDate) && todo.status !== 'completed' ? 'Overdue: ' : 'Due: '}
              {new Date(todo.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
        )}

        {todo.assignedTo === user?.id && (
          <Box sx={{ mt: 1.5 }}>
            <FormControl fullWidth size="small">
              <Select
                value={todo.status}
                onChange={(e) => handleStatusChange(todo.id, e.target.value as TodoStatus)}
                size="small"
                sx={{ fontSize: '0.75rem' }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => (
    <Grid container spacing={2}>
      {/* Pending Column */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
            minHeight: 400,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PendingIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Pending
              </Typography>
            </Box>
            <Badge badgeContent={pendingTodos.length} color="default" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pendingTodos.map((todo) => (
              <React.Fragment key={todo.id}>
                {renderTodoCard(todo, true)}
              </React.Fragment>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* In Progress Column */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
            minHeight: 400,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HourglassIcon sx={{ color: 'info.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>
                In Progress
              </Typography>
            </Box>
            <Badge badgeContent={inProgressTodos.length} color="info" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {inProgressTodos.map((todo) => (
              <React.Fragment key={todo.id}>
                {renderTodoCard(todo, true)}
              </React.Fragment>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Completed Column */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
            minHeight: 400,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: 'success.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Completed
              </Typography>
            </Box>
            <Badge badgeContent={completedTodos.length} color="success" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {completedTodos.map((todo) => (
              <React.Fragment key={todo.id}>
                {renderTodoCard(todo, true)}
              </React.Fragment>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderListView = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          All Tasks ({filteredTodos.length})
        </Typography>
        <Grid container spacing={2}>
          {filteredTodos.map((todo) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={todo.id}>
              {renderTodoCard(todo, true)}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize and track your team's tasks efficiently
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Add Task
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.dark' }}>
                  <PendingIcon />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {pendingTodos.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: 'info.light', borderRadius: 1, color: 'info.dark' }}>
                  <HourglassIcon />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {inProgressTodos.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 1, color: 'success.dark' }}>
                  <CheckIcon />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {completedTodos.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {completionRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completion Rate
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and View Toggle */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 250 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value as TodoStatus | 'all')}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filterPriority}
                label="Priority"
                onChange={(e) => setFilterPriority(e.target.value as TodoPriority | 'all')}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="kanban">
                <Tooltip title="Kanban View">
                  <KanbanIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list">
                <Tooltip title="List View">
                  <ListIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      {/* My Tasks Section */}
      {viewMode === 'list' && myTodos.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              My Tasks ({myTodos.length})
            </Typography>
            <Grid container spacing={2}>
              {myTodos.map((todo) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={todo.id}>
                  {renderTodoCard(todo)}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Main View */}
      {viewMode === 'kanban' ? renderKanbanView() : renderListView()}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTodo ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            autoFocus
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TodoPriority })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTodo ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Todos;
