import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Avatar, Grid, Select, MenuItem, FormControl,
  InputLabel, IconButton, Tooltip, Paper, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon,
  CalendarMonth as CalendarIcon, Computer as MachineIcon, Person as TrainerIcon,
  AccessTime as DurationIcon, Storage as DatasetIcon, TrendingUp as EpochIcon,
  Flag as PurposeIcon, CheckCircle as ResultIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { addRecord, updateRecord, deleteRecord } from '../store/slices/todosSlice';
import type { MachineRecord } from '../store/slices/todosSlice';

type ViewMode = 'day' | 'week' | 'month';
type TabValue = 'records' | 'analysis';

const MachineRentingReport: React.FC = () => {
  const dispatch = useDispatch();
  const { list: records } = useSelector((state: RootState) => state.machineRecords);
  const user = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<TabValue>('records');
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MachineRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MachineRecord | null>(null);
  const [formData, setFormData] = useState({
    subset: '',
    trainer: '',
    machine: '',
    dataset: '',
    date: '',
    duration: 0,
    epoch: 0,
    purpose: '',
    result: '',
  });

  // Check permissions
  const isAdmin = user?.role === 'admin';
  const canEditRecord = (record: MachineRecord) => {
    return isAdmin || record.trainerId === user?.id;
  };

  // Filter records based on view mode and selected date
  const filteredRecords = useMemo(() => {
    const selected = new Date(selectedDate);
    
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      
      switch (viewMode) {
        case 'day':
          return recordDate.toDateString() === selected.toDateString();
        case 'week': {
          const weekStart = new Date(selected);
          weekStart.setDate(selected.getDate() - selected.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return recordDate >= weekStart && recordDate <= weekEnd;
        }
        case 'month':
          return recordDate.getMonth() === selected.getMonth() &&
                 recordDate.getFullYear() === selected.getFullYear();
        default:
          return true;
      }
    });
  }, [records, viewMode, selectedDate]);

  const handleOpenDialog = (record?: MachineRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        subset: record.subset,
        trainer: record.trainer,
        machine: record.machine,
        dataset: record.dataset,
        date: record.date,
        duration: record.duration,
        epoch: record.epoch,
        purpose: record.purpose,
        result: record.result,
      });
    } else {
      setEditingRecord(null);
      setFormData({
        subset: '',
        trainer: user?.name || '',
        machine: '',
        dataset: '',
        date: new Date().toISOString().split('T')[0],
        duration: 0,
        epoch: 0,
        purpose: '',
        result: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = () => {
    if (!formData.subset.trim() || !formData.machine.trim()) return;

    if (editingRecord) {
      dispatch(updateRecord({
        id: editingRecord.id,
        updates: formData,
      }));
    } else {
      dispatch(addRecord({
        ...formData,
        trainerId: user?.id || '',
        trainerRole: user?.role || 'user',
      }));
    }
    handleCloseDialog();
  };

  const handleDelete = (recordId: string) => {
    dispatch(deleteRecord(recordId));
  };

  const handleViewDetails = (record: MachineRecord) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  const renderRecordCard = (record: MachineRecord) => (
    <Card
      key={record.id}
      variant="outlined"
      sx={{
        height: '100%',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
            {record.subset}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => handleViewDetails(record)}>
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {canEditRecord(record) && (
              <>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => handleOpenDialog(record)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => handleDelete(record.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrainerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {record.trainer}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MachineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {record.machine}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(record.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DurationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {record.duration} hours
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderRecordsTab = () => (
    <Box>
      {/* Filters and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>View</InputLabel>
              <Select
                value={viewMode}
                label="View"
                onChange={(e) => setViewMode(e.target.value as ViewMode)}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Record
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CalendarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No records found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your date filter or add a new record
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredRecords.map((record) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={record.id}>
              {renderRecordCard(record)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderAnalysisTab = () => {
    // Group by trainer
    const byTrainer = filteredRecords.reduce((acc, record) => {
      if (!acc[record.trainer]) {
        acc[record.trainer] = [];
      }
      acc[record.trainer].push(record);
      return acc;
    }, {} as Record<string, MachineRecord[]>);

    // Group by date
    const byDate = filteredRecords.reduce((acc, record) => {
      const dateKey = new Date(record.date).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      return acc;
    }, {} as Record<string, MachineRecord[]>);

    // Calculate stats
    const totalDuration = filteredRecords.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = filteredRecords.length > 0 ? totalDuration / filteredRecords.length : 0;
    const totalEpochs = filteredRecords.reduce((sum, r) => sum + r.epoch, 0);

    return (
      <Box>
        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {filteredRecords.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {totalDuration.toFixed(1)}h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Duration
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {avgDuration.toFixed(1)}h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Duration
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {totalEpochs}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Epochs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Analysis by Trainer */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Analysis by Trainer
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Trainer</TableCell>
                    <TableCell align="right">Records</TableCell>
                    <TableCell align="right">Total Duration</TableCell>
                    <TableCell align="right">Avg Duration</TableCell>
                    <TableCell align="right">Total Epochs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(byTrainer).map(([trainer, trainerRecords]) => {
                    const totalDur = trainerRecords.reduce((sum, r) => sum + r.duration, 0);
                    const avgDur = totalDur / trainerRecords.length;
                    const totalEp = trainerRecords.reduce((sum, r) => sum + r.epoch, 0);
                    
                    return (
                      <TableRow key={trainer}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                              {trainer.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {trainer}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{trainerRecords.length}</TableCell>
                        <TableCell align="right">{totalDur.toFixed(1)}h</TableCell>
                        <TableCell align="right">{avgDur.toFixed(1)}h</TableCell>
                        <TableCell align="right">{totalEp}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Analysis by Date */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Analysis by Date
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Records</TableCell>
                    <TableCell align="right">Total Duration</TableCell>
                    <TableCell align="right">Avg Duration</TableCell>
                    <TableCell align="right">Total Epochs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(byDate)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([date, dateRecords]) => {
                      const totalDur = dateRecords.reduce((sum, r) => sum + r.duration, 0);
                      const avgDur = totalDur / dateRecords.length;
                      const totalEp = dateRecords.reduce((sum, r) => sum + r.epoch, 0);
                      
                      return (
                        <TableRow key={date}>
                          <TableCell>{date}</TableCell>
                          <TableCell align="right">{dateRecords.length}</TableCell>
                          <TableCell align="right">{totalDur.toFixed(1)}h</TableCell>
                          <TableCell align="right">{avgDur.toFixed(1)}h</TableCell>
                          <TableCell align="right">{totalEp}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Machine Renting Report
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and analyze machine usage and training records
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Records" value="records" />
          <Tab label="Analysis" value="analysis" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {activeTab === 'records' ? renderRecordsTab() : renderAnalysisTab()}
        </Box>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRecord ? 'Edit Record' : 'Add New Record'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Subset"
                value={formData.subset}
                onChange={(e) => setFormData({ ...formData, subset: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Trainer"
                value={formData.trainer}
                onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                disabled={!isAdmin}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Machine"
                value={formData.machine}
                onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Dataset"
                value={formData.dataset}
                onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Epoch"
                type="number"
                value={formData.epoch}
                onChange={(e) => setFormData({ ...formData, epoch: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Result"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DatasetIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Subset</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.subset}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Date</Typography>
                </Box>
                <Typography variant="body2">{new Date(selectedRecord.date).toLocaleDateString()}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrainerIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Trainer</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.trainer}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MachineIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Machine</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.machine}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DatasetIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Dataset</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.dataset || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DurationIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Duration</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.duration} hours</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EpochIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Epoch</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.epoch}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PurposeIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Purpose</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.purpose || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ResultIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>Result</Typography>
                </Box>
                <Typography variant="body2">{selectedRecord.result || 'N/A'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MachineRentingReport;
