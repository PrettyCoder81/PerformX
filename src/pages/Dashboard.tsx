import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: changeType === 'positive' ? 'success.main' : changeType === 'negative' ? 'error.main' : 'text.secondary',
              fontWeight: 600,
            }}
          >
            {change}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { list: employees } = useSelector((state: RootState) => state.employees);
  const { reviews } = useSelector((state: RootState) => state.performance);

  const avgScore = Math.round(
    employees.reduce((sum: number, e) => sum + e.performanceScore, 0) / employees.length
  );
  const pendingReviews = reviews.filter((r) => r.status === 'draft' || r.status === 'submitted').length;
  const topPerformers = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#6366f1';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here&apos;s an overview of your team&apos;s performance.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Employees"
            value={employees.length.toString()}
            change="+2 this month"
            changeType="positive"
            icon={<PeopleIcon />}
            color="#6366f1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Avg. Performance"
            value={`${avgScore}%`}
            change="+5% from last quarter"
            changeType="positive"
            icon={<TrendingUpIcon />}
            color="#22c55e"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Reviews"
            value={reviews.length.toString()}
            change={`${pendingReviews} pending`}
            changeType="neutral"
            icon={<AssessmentIcon />}
            color="#0ea5e9"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Top Performers"
            value={employees.filter((e) => e.performanceScore >= 90).length.toString()}
            change="Exceeding expectations"
            changeType="positive"
            icon={<TrophyIcon />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Performance Reviews
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Period</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews.slice(0, 5).map((review) => (
                      <TableRow key={review.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                              {review.employeeName.split(' ').map((n: string) => n[0]).join('')}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {review.employeeName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {review.period}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                            <LinearProgress
                              variant="determinate"
                              value={review.overallScore}
                              sx={{
                                flexGrow: 1,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: '#f1f5f9',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getScoreColor(review.overallScore),
                                  borderRadius: 3,
                                },
                              }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {review.overallScore}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={review.status}
                            size="small"
                            color={
                              review.status === 'approved' ? 'success' :
                              review.status === 'submitted' ? 'info' :
                              review.status === 'draft' ? 'default' : 'error'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Top Performers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topPerformers.map((employee, index) => (
                  <Box key={employee.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ width: 20 }}>
                      #{index + 1}
                    </Typography>
                    <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.light' }}>
                      {employee.avatar}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {employee.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.department}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${employee.performanceScore}%`}
                      size="small"
                      color={employee.performanceScore >= 90 ? 'success' : 'primary'}
                      variant="filled"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Department Overview
              </Typography>
              {['Engineering', 'Design', 'Marketing', 'Sales', 'HR'].map((dept) => {
                const deptEmployees = employees.filter((e) => e.department === dept);
                const avgDeptScore = deptEmployees.length > 0
                  ? Math.round(deptEmployees.reduce((s: number, e) => s + e.performanceScore, 0) / deptEmployees.length)
                  : 0;
                return (
                  <Box key={dept} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>{dept}</Typography>
                      <Typography variant="body2" fontWeight={600}>{avgDeptScore}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={avgDeptScore}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: avgDeptScore >= 90 ? '#22c55e' : avgDeptScore >= 80 ? '#6366f1' : '#f59e0b',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
