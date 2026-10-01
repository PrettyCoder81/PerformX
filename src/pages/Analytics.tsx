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
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';

const Analytics: React.FC = () => {
  const { list: employees } = useSelector((state: RootState) => state.employees);
  const { reviews } = useSelector((state: RootState) => state.performance);

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
  const deptData = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept);
    const avgScore = deptEmployees.length > 0
      ? Math.round(deptEmployees.reduce((s: number, e) => s + e.performanceScore, 0) / deptEmployees.length)
      : 0;
    return { department: dept, avgScore, count: deptEmployees.length };
  }).filter(d => d.count > 0);

  const scoreDistribution = [
    { range: '90-100%', count: employees.filter((e) => e.performanceScore >= 90).length, color: '#22c55e' },
    { range: '80-89%', count: employees.filter((e) => e.performanceScore >= 80 && e.performanceScore < 90).length, color: '#6366f1' },
    { range: '70-79%', count: employees.filter((e) => e.performanceScore >= 70 && e.performanceScore < 80).length, color: '#f59e0b' },
    { range: 'Below 70%', count: employees.filter((e) => e.performanceScore < 70).length, color: '#ef4444' },
  ];

  const maxCount = Math.max(...scoreDistribution.map((d) => d.count), 1);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Performance insights and trends across your organization.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#dcfce7', borderRadius: 1, color: '#22c55e' }}>
                  <TrendingUpIcon />
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Performance Trend
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} color="success.main">
                +12%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average performance improvement this quarter
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#e0e7ff', borderRadius: 1, color: '#6366f1' }}>
                  <BarChartIcon />
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Review Completion
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {Math.round((reviews.filter((r) => r.status === 'approved').length / reviews.length) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviews approved out of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#fef3c7', borderRadius: 1, color: '#f59e0b' }}>
                  <TrendingDownIcon />
                </Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Needs Attention
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {employees.filter((e) => e.performanceScore < 80).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employees below 80% performance threshold
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Department Performance
              </Typography>
              <Box sx={{ mt: 3 }}>
                {deptData.map((dept) => (
                  <Box key={dept.department} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>{dept.department}</Typography>
                        <Chip label={`${dept.count} employees`} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="body2" fontWeight={700} sx={{
                        color: dept.avgScore >= 90 ? '#22c55e' : dept.avgScore >= 80 ? '#6366f1' : '#f59e0b'
                      }}>
                        {dept.avgScore}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dept.avgScore}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: dept.avgScore >= 90 ? '#22c55e' : dept.avgScore >= 80 ? '#6366f1' : '#f59e0b',
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Score Distribution
              </Typography>
              <Box sx={{ mt: 3 }}>
                {scoreDistribution.map((dist) => (
                  <Box key={dist.range} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>{dist.range}</Typography>
                      <Typography variant="body2" fontWeight={600}>{dist.count} employees</Typography>
                    </Box>
                    <Box sx={{ position: 'relative', height: 32, bgcolor: '#f1f5f9', borderRadius: 1 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${(dist.count / maxCount) * 100}%`,
                          bgcolor: dist.color,
                          borderRadius: 1,
                          transition: 'width 0.5s ease',
                          minWidth: dist.count > 0 ? '24px' : 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          pr: 1,
                        }}
                      >
                        {dist.count > 0 && (
                          <Typography variant="caption" fontWeight={700} color="white">
                            {dist.count}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
