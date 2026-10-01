import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  RadioButtonUnchecked as RadioIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';

const Goals: React.FC = () => {
  const { reviews } = useSelector((state: RootState) => state.performance);

  const allGoals = reviews.flatMap((review) =>
    review.goals.map((goal) => ({
      ...goal,
      employeeName: review.employeeName,
      period: review.period,
    }))
  );

  const completedGoals = allGoals.filter((g) => g.status === 'completed');
  const inProgressGoals = allGoals.filter((g) => g.status === 'in-progress');
  const notStartedGoals = allGoals.filter((g) => g.status === 'not-started');

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Goals & KPIs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track employee goals, objectives, and key performance indicators.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1, color: 'success.main' }}>
                <CheckCircleIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {completedGoals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Goals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1, color: 'primary.main' }}>
                <HourglassIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {inProgressGoals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1, color: 'text.secondary' }}>
                <RadioIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="text.secondary">
                {notStartedGoals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Not Started
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <FlagIcon color="success" />
                <Typography variant="h6" fontWeight={600}>
                  Completed Goals
                </Typography>
              </Box>
              {completedGoals.map((goal) => (
                <Box key={goal.id} sx={{ mb: 2, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{goal.title}</Typography>
                    <Chip label="100%" size="small" color="success" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem', bgcolor: 'success.main' }}>
                      {goal.employeeName.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {goal.employeeName} • {goal.period}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <HourglassIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  In Progress Goals
                </Typography>
              </Box>
              {inProgressGoals.map((goal) => (
                <Box key={goal.id} sx={{ mb: 2, p: 2, bgcolor: '#eef2ff', borderRadius: 2, border: '1px solid #c7d2fe' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{goal.title}</Typography>
                    <Chip label={`${goal.progress}%`} size="small" color="primary" />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#e2e8f0',
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#6366f1',
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem', bgcolor: 'primary.main' }}>
                      {goal.employeeName.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {goal.employeeName} • {goal.period}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Goals;
