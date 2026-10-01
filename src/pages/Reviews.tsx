import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Drafts as DraftIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import type { PerformanceReview } from '../store/slices/performanceSlice';
import { updateReviewStatus } from '../store/slices/performanceSlice';

const Reviews: React.FC = () => {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state: RootState) => state.performance);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const filteredReviews = tabValue === 0 ? reviews : reviews.filter((r) => {
    if (tabValue === 1) return r.status === 'approved';
    if (tabValue === 2) return r.status === 'submitted';
    if (tabValue === 3) return r.status === 'draft';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckIcon fontSize="small" />;
      case 'submitted': return <PendingIcon fontSize="small" />;
      case 'draft': return <DraftIcon fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'info' | 'default' | 'error' => {
    switch (status) {
      case 'approved': return 'success';
      case 'submitted': return 'info';
      case 'draft': return 'default';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#6366f1';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const handleViewReview = (review: PerformanceReview) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Performance Reviews
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage employee performance reviews and evaluations.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large">
          New Review
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue: number) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`All (${reviews.length})`} />
          <Tab label={`Approved (${reviews.filter(r => r.status === 'approved').length})`} />
          <Tab label={`Pending (${reviews.filter(r => r.status === 'submitted').length})`} />
          <Tab label={`Draft (${reviews.filter(r => r.status === 'draft').length})`} />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {filteredReviews.map((review) => (
          <Grid size={{ xs: 12, md: 6 }} key={review.id}>
            <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      {review.employeeName.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {review.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reviewed by {review.reviewer}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={getStatusIcon(review.status)}
                    label={review.status}
                    size="small"
                    color={getStatusColor(review.status)}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">Overall Score</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: getScoreColor(review.overallScore) }}>
                      {review.overallScore}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={review.overallScore}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getScoreColor(review.overallScore),
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Period: {review.period}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    Date: {new Date(review.reviewDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    Goals Progress
                  </Typography>
                  {review.goals.slice(0, 3).map((goal) => (
                    <Box key={goal.id} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                        <Typography variant="caption">{goal.title}</Typography>
                        <Typography variant="caption" fontWeight={600}>{goal.progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: goal.progress === 100 ? '#22c55e' : goal.progress > 0 ? '#6366f1' : '#cbd5e1',
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewReview(review)}
                    fullWidth
                  >
                    View Details
                  </Button>
                  {review.status === 'submitted' && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => dispatch(updateReviewStatus({ id: review.id, status: 'approved' }))}
                      fullWidth
                    >
                      Approve
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Review Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedReview && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  {selectedReview.employeeName.split(' ').map((n: string) => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedReview.employeeName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.period} • Reviewed by {selectedReview.reviewer}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Category Scores
                    </Typography>
                    {selectedReview.categories.map((cat) => (
                      <Box key={cat.name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={500}>{cat.name}</Typography>
                          <Typography variant="body2" fontWeight={700}>{cat.score}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={cat.score}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getScoreColor(cat.score),
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {cat.comment}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Goals & Objectives
                    </Typography>
                    {selectedReview.goals.map((goal) => (
                      <Box key={goal.id} sx={{ mb: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={500}>{goal.title}</Typography>
                          <Chip
                            label={goal.status}
                            size="small"
                            color={goal.status === 'completed' ? 'success' : goal.status === 'in-progress' ? 'info' : 'default'}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progress}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: goal.progress === 100 ? '#22c55e' : '#6366f1',
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    ))}

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Overall Feedback
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedReview.feedback}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedReview.status === 'submitted' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    dispatch(updateReviewStatus({ id: selectedReview.id, status: 'approved' }));
                    setDialogOpen(false);
                  }}
                >
                  Approve Review
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Reviews;
