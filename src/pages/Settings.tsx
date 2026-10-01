import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Profile Settings
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="First Name" defaultValue="Admin" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Last Name" defaultValue="User" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Email" defaultValue="admin@company.com" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Phone" defaultValue="+1 (555) 000-0000" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Job Title" defaultValue="HR Manager" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth multiline rows={3} label="Bio" defaultValue="Experienced HR professional managing employee performance and development." />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Notification Preferences
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email notifications for new reviews"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email notifications for review approvals"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Email notifications for goal updates"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Weekly performance summary"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Monthly analytics report"
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Security Settings
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth type="password" label="Current Password" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="password" label="New Password" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="password" label="Confirm New Password" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '1.5rem', mx: 'auto', mb: 2 }}>
                AU
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                Admin User
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                HR Manager
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" fullWidth>
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Account Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Role</Typography>
                  <Typography variant="body2" fontWeight={500}>Administrator</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Last Login</Typography>
                  <Typography variant="body2" fontWeight={500}>Today, 9:45 AM</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Member Since</Typography>
                  <Typography variant="body2" fontWeight={500}>January 2023</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" size="large">
          Cancel
        </Button>
        <Button variant="contained" size="large" startIcon={<SaveIcon />}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
